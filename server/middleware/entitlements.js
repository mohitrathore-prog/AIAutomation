/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Entitlement & Quota Enforcement Middleware
 */

const entitlementService = require('../services/entitlementService');

function enforceAssessmentQuota(req, res, next) {
  if (!req.organisationId) {
    return res.status(401).json({ error: 'Organisation context required' });
  }

  // Super admins bypass quotas
  if (req.user && req.user.roleId === 'SUPER_ADMIN') {
    return next();
  }

  const check = entitlementService.canCreateAssessment(req.organisationId);
  if (!check.allowed) {
    return res.status(402).json({
      error: check.reason,
      code: 'QUOTA_EXCEEDED',
      upgradeRequired: true
    });
  }

  next();
}

function enforceExportEntitlement(formatParam = 'format') {
  return (req, res, next) => {
    if (!req.organisationId) {
      return res.status(401).json({ error: 'Organisation context required' });
    }

    if (req.user && req.user.roleId === 'SUPER_ADMIN') {
      return next();
    }

    const format = req.params[formatParam] || req.query[formatParam] || req.body[formatParam] || 'PDF';
    const check = entitlementService.canExportFormat(req.organisationId, format);
    if (!check.allowed) {
      return res.status(402).json({
        error: check.reason,
        code: 'FEATURE_UNAVAILABLE',
        upgradeRequired: true
      });
    }

    next();
  };
}

function enforceCredits(cost, operationType) {
  return (req, res, next) => {
    if (!req.organisationId) {
      return res.status(401).json({ error: 'Organisation context required' });
    }

    // Super admin bypasses credits
    if (req.user && req.user.roleId === 'SUPER_ADMIN') {
      return next();
    }

    try {
      entitlementService.consumeCredits(
        req.organisationId,
        req.user ? req.user.id : null,
        cost,
        operationType,
        'API_CALL',
        req.path,
        `Operation: ${operationType}`
      );
      next();
    } catch (err) {
      return res.status(402).json({
        error: err.message,
        code: 'INSUFFICIENT_CREDITS',
        requiredCredits: cost
      });
    }
  };
}

module.exports = {
  enforceAssessmentQuota,
  enforceExportEntitlement,
  enforceCredits
};
