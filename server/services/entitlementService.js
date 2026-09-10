/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Entitlements, Monetisation, and Credit Accounting Service
 * Strictly enforces SaaS limits (Assessments per month, user caps, formats, credits).
 */

const { get, query, run, transaction, recordAudit } = require('../db');

class EntitlementService {
  /**
   * Retrieves organisation's current plan and usage stats
   */
  getOrganisationEntitlements(organisationId) {
    const org = get(`
      SELECT o.id, o.name, o.plan_tier, p.*,
             cb.balance as credit_balance, cb.lifetime_granted, cb.lifetime_consumed,
             s.status as subscription_status, s.current_period_end
      FROM organisations o
      JOIN plans p ON o.plan_tier = p.tier
      LEFT JOIN credit_balances cb ON o.id = cb.organisation_id
      LEFT JOIN subscriptions s ON o.id = s.organisation_id
      WHERE o.id = ?
    `, [organisationId]);

    if (!org) {
      throw new Error(`Organisation not found: ${organisationId}`);
    }

    // Count assessments created in the current calendar month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const usageRow = get(`
      SELECT COUNT(*) as monthly_assessments_count
      FROM assessments
      WHERE organisation_id = ? AND created_at >= ?
    `, [organisationId, startOfMonth]);

    // Count active team users
    const userRow = get(`
      SELECT COUNT(*) as active_users_count
      FROM users
      WHERE organisation_id = ? AND is_active = 1
    `, [organisationId]);

    const allowedFormats = JSON.parse(org.export_formats || '["PDF"]');
    const features = JSON.parse(org.features_json || '{}');

    return {
      organisationId: org.id,
      organisationName: org.name,
      planTier: org.plan_tier,
      planName: org.name,
      monthlyPriceUsd: org.monthly_price_usd,
      subscriptionStatus: org.subscription_status || 'ACTIVE',
      periodEnd: org.current_period_end,
      creditBalance: org.credit_balance || 0,
      limits: {
        maxAssessmentsPerMonth: org.max_assessments_per_month,
        currentMonthAssessments: usageRow.monthly_assessments_count || 0,
        remainingAssessmentsThisMonth: Math.max(0, org.max_assessments_per_month - (usageRow.monthly_assessments_count || 0)),
        maxUsers: org.max_users,
        currentUsers: userRow.active_users_count || 1,
        maxDocumentsPerAssessment: org.max_documents_per_assessment,
        allowedExportFormats: allowedFormats,
        customScoringWeightsAllowed: !!org.custom_scoring_weights,
        whiteLabelAllowed: !!org.white_label,
        prioritySupport: !!org.priority_support
      },
      features
    };
  }

  /**
   * Validates if organisation can create a new assessment this month
   */
  canCreateAssessment(organisationId) {
    const entitlements = this.getOrganisationEntitlements(organisationId);
    if (entitlements.limits.remainingAssessmentsThisMonth <= 0) {
      return {
        allowed: false,
        reason: `Monthly assessment quota of ${entitlements.limits.maxAssessmentsPerMonth} reached for ${entitlements.planName}. Upgrade to a higher tier for more assessments.`
      };
    }
    return { allowed: true };
  }

  /**
   * Validates if requested export format is permitted under organisation plan
   */
  canExportFormat(organisationId, format) {
    const entitlements = this.getOrganisationEntitlements(organisationId);
    const upper = format.toUpperCase();
    const allowed = entitlements.limits.allowedExportFormats.includes(upper);
    if (!allowed) {
      return {
        allowed: false,
        reason: `Format '${upper}' is not included in ${entitlements.planName} plan. Upgrade to Transform or Accelerate to unlock DOCX, HTML, and Excel models.`
      };
    }
    return { allowed: true };
  }

  /**
   * Deducts credits atomically for high-compute operations (e.g. deep research, heavy docs)
   */
  consumeCredits(organisationId, userId, amount, transactionType, referenceType = null, referenceId = null, description = '') {
    if (amount <= 0) return true;

    const executeTx = transaction(() => {
      const balanceRow = get('SELECT balance FROM credit_balances WHERE organisation_id = ?', [organisationId]);
      if (!balanceRow || balanceRow.balance < amount) {
        throw new Error(`Insufficient credits. Required: ${amount}, Available: ${balanceRow ? balanceRow.balance : 0}`);
      }

      const newBalance = balanceRow.balance - amount;
      const txId = `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      run(`
        UPDATE credit_balances
        SET balance = ?, lifetime_consumed = lifetime_consumed + ?, updated_at = datetime('now')
        WHERE organisation_id = ?
      `, [newBalance, amount, organisationId]);

      run(`
        INSERT INTO credit_transactions (
          id, organisation_id, user_id, amount, transaction_type, reference_type, reference_id, balance_after, description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, [txId, organisationId, userId, -amount, transactionType, referenceType, referenceId, newBalance, description]);

      return { success: true, newBalance, txId };
    });

    return executeTx();
  }

  /**
   * Adds credits to organisation balance
   */
  grantCredits(organisationId, userId, amount, transactionType = 'GRANT', description = 'Monthly Plan Credit Grant') {
    const executeTx = transaction(() => {
      const balanceRow = get('SELECT balance FROM credit_balances WHERE organisation_id = ?', [organisationId]);
      const currentBalance = balanceRow ? balanceRow.balance : 0;
      const newBalance = currentBalance + amount;
      const txId = `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      run(`
        INSERT INTO credit_balances (organisation_id, balance, lifetime_granted, lifetime_consumed, updated_at)
        VALUES (?, ?, ?, 0, datetime('now'))
        ON CONFLICT(organisation_id) DO UPDATE SET
          balance = balance + excluded.balance,
          lifetime_granted = lifetime_granted + excluded.balance,
          updated_at = datetime('now')
      `, [organisationId, amount, amount]);

      run(`
        INSERT INTO credit_transactions (
          id, organisation_id, user_id, amount, transaction_type, balance_after, description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `, [txId, organisationId, userId, amount, transactionType, newBalance, description]);

      return { success: true, newBalance, txId };
    });

    return executeTx();
  }

  /**
   * Upgrades or downgrades plan tier
   */
  changePlan(organisationId, newTier, billingProvider = 'MOCK') {
    const plan = get('SELECT * FROM plans WHERE tier = ?', [newTier]);
    if (!plan) throw new Error(`Invalid plan tier: ${newTier}`);

    const executeTx = transaction(() => {
      run('UPDATE organisations SET plan_tier = ?, updated_at = datetime(\'now\') WHERE id = ?', [newTier, organisationId]);
      run(`
        UPDATE subscriptions
        SET plan_tier = ?, billing_provider = ?, updated_at = datetime('now')
        WHERE organisation_id = ?
      `, [newTier, billingProvider, organisationId]);

      // Grant complementary credits on upgrade
      const bonusCredits = newTier === 'ACCELERATE' ? 500 : newTier === 'TRANSFORM' ? 250 : newTier === 'ASSESS' ? 100 : 0;
      if (bonusCredits > 0) {
        this.grantCredits(organisationId, null, bonusCredits, 'PURCHASE', `Plan upgrade to ${newTier} bonus credits`);
      }

      recordAudit({
        organisationId,
        action: 'CHANGE_PLAN',
        entityType: 'Subscription',
        newValues: { newTier, monthlyPrice: plan.monthly_price_usd }
      });
    });

    executeTx();
    return this.getOrganisationEntitlements(organisationId);
  }
}

module.exports = new EntitlementService();
