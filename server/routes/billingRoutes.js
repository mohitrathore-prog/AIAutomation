/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Monetisation & Billing Endpoints
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const entitlementService = require('../services/entitlementService');
const billingAdapter = require('../adapters/billingAdapter');
const { query } = require('../db');

// 1. Get available platform plans (Public)
router.get('/plans', (req, res) => {
  try {
    const plans = query('SELECT * FROM plans ORDER BY monthly_price_usd ASC').map(p => ({
      ...p,
      exportFormats: JSON.parse(p.export_formats || '["PDF"]'),
      features: JSON.parse(p.features_json || '{}')
    }));
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get current tenant entitlements & usage
router.get('/entitlements', requireAuth, (req, res) => {
  try {
    const entitlements = entitlementService.getOrganisationEntitlements(req.organisationId);
    res.json(entitlements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Initiate checkout session for plan upgrade
router.post('/checkout', requireAuth, requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), async (req, res) => {
  try {
    const { planTier, returnUrl } = req.body;
    const session = await billingAdapter.createCheckoutSession({
      organisationId: req.organisationId,
      userId: req.user.id,
      planTier,
      successUrl: returnUrl || 'http://localhost:3050/#billing',
      cancelUrl: returnUrl || 'http://localhost:3050/#billing'
    });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Upgrade / Change Subscription Plan
router.post('/upgrade', requireAuth, requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), async (req, res) => {
  try {
    const { newTier } = req.body;
    const updated = entitlementService.changePlan(req.organisationId, newTier);

    // Generate mock invoice
    billingAdapter.createInvoice(
      req.organisationId,
      updated.monthlyPriceUsd,
      [{ description: `Subscription Plan Upgrade to ${newTier}`, amount: updated.monthlyPriceUsd }],
      `Upgraded to ${newTier}`
    );

    res.json({ success: true, entitlements: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Purchase Credit Pack
router.post('/buy-credits', requireAuth, requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), async (req, res) => {
  try {
    const { packageTier = 'STANDARD' } = req.body;
    const credits = packageTier === 'ENTERPRISE' ? 500 : packageTier === 'GROWTH' ? 200 : 100;
    const price = packageTier === 'ENTERPRISE' ? 499 : packageTier === 'GROWTH' ? 249 : 149;

    const result = entitlementService.grantCredits(
      req.organisationId,
      req.user.id,
      credits,
      'PURCHASE',
      `Purchased ${credits} Assessment & AI Credits`
    );

    billingAdapter.createInvoice(
      req.organisationId,
      price,
      [{ description: `${credits} AI Opportunity Assessment Credits`, amount: price }],
      'Credit Top-Up'
    );

    res.json({ success: true, creditsAdded: credits, newBalance: result.newBalance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Get Invoice History
router.get('/invoices', requireAuth, (req, res) => {
  try {
    const invoices = billingAdapter.listInvoices(req.organisationId);
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const result = await billingAdapter.handleWebhook(req.body, sig);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
