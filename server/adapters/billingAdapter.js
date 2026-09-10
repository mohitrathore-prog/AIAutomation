/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Pluggable Billing Adapter (Mock Provider & Stripe Webhook Architecture)
 */

const crypto = require('crypto');
const { get, query, run, recordAudit } = require('../db');
const entitlementService = require('../services/entitlementService');

class BillingAdapter {
  constructor() {
    this.provider = process.env.BILLING_PROVIDER || 'MOCK'; // 'MOCK' or 'STRIPE'
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY || null;
  }

  /**
   * Generates a checkout session for plan upgrade or credit package
   */
  async createCheckoutSession({ organisationId, userId, planTier = null, creditPackage = null, successUrl, cancelUrl }) {
    const org = get('SELECT * FROM organisations WHERE id = ?', [organisationId]);
    if (!org) throw new Error('Organisation not found');

    const sessionId = `cs_${this.provider.toLowerCase()}_${crypto.randomBytes(12).toString('hex')}`;

    if (this.provider === 'STRIPE' && this.stripeSecretKey) {
      // In production Stripe integration, construct Stripe checkout session
      // Mock session structure for clean enterprise decoupling
      return {
        sessionId,
        url: `https://checkout.stripe.com/pay/${sessionId}`,
        provider: 'STRIPE',
        mode: planTier ? 'subscription' : 'payment'
      };
    }

    // Mock Provider Simulation
    return {
      sessionId,
      url: `${successUrl}?session_id=${sessionId}&mock_success=true`,
      provider: 'MOCK',
      amountUsd: planTier === 'TRANSFORM' ? 1999 : planTier === 'ASSESS' ? 499 : creditPackage ? creditPackage.priceUsd : 0,
      item: planTier ? `Subscription: ${planTier}` : `Credit Pack: ${creditPackage.credits} Credits`
    };
  }

  /**
   * Simulates or processes invoice generation
   */
  createInvoice(organisationId, amountUsd, lineItems, description = 'Platform Subscription') {
    const invoiceId = `inv_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const pdfUrl = `/api/billing/invoices/${invoiceId}.pdf`;

    run(`
      INSERT INTO invoices (id, organisation_id, amount_usd, currency, status, invoice_pdf_url, line_items_json, created_at)
      VALUES (?, ?, ?, 'USD', 'PAID', ?, ?, datetime('now'))
    `, [invoiceId, organisationId, amountUsd, pdfUrl, JSON.stringify(lineItems)]);

    recordAudit({
      organisationId,
      action: 'INVOICE_GENERATED',
      entityType: 'Invoice',
      entityId: invoiceId,
      newValues: { amountUsd, description }
    });

    return {
      invoiceId,
      amountUsd,
      status: 'PAID',
      pdfUrl,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Retrieves tenant invoice history
   */
  listInvoices(organisationId) {
    return query(`
      SELECT * FROM invoices WHERE organisation_id = ? ORDER BY created_at DESC
    `, [organisationId]).map(inv => ({
      ...inv,
      lineItems: JSON.parse(inv.line_items_json || '[]')
    }));
  }

  /**
   * Stripe Webhook Handler stub for production
   */
  async handleWebhook(eventPayload, signature) {
    // In production, verify event signature with stripe.webhooks.constructEvent
    const event = typeof eventPayload === 'string' ? JSON.parse(eventPayload) : eventPayload;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orgId = session.client_reference_id;
        if (orgId && session.metadata && session.metadata.planTier) {
          entitlementService.changePlan(orgId, session.metadata.planTier, 'STRIPE');
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        // Record payment
        break;
      }
      default:
        break;
    }

    return { received: true };
  }
}

module.exports = new BillingAdapter();
