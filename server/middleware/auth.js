/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Authentication Middleware (JWT & Tenant Context Extraction)
 */

const authService = require('../services/authService');
const { get, query } = require('../db');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In dev / demo mode, allow default demo tenant session if DEMO_MODE is true or explicitly requested
    if (process.env.NODE_ENV !== 'production' && (process.env.DEMO_MODE !== 'false' || req.headers['x-demo-auth'] === 'true' || req.query.demo === 'true')) {
      const demoUser = get(`
        SELECT u.*, o.name as organisation_name, o.plan_tier, r.name as role_name
        FROM users u
        JOIN organisations o ON u.organisation_id = o.id
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = 'admin@enterprise.internal'
      `);
      if (demoUser) {
        const permissions = query(`
          SELECT p.id FROM permissions p
          JOIN role_permissions rp ON p.id = rp.permission_id
          WHERE rp.role_id = ?
        `, [demoUser.role_id]).map(p => p.id);

        req.user = {
          id: demoUser.id,
          email: demoUser.email,
          fullName: demoUser.full_name,
          roleId: demoUser.role_id,
          roleName: demoUser.role_name,
          organisationId: demoUser.organisation_id,
          organisationName: demoUser.organisation_name,
          planTier: demoUser.plan_tier,
          permissions
        };
        req.organisationId = demoUser.organisation_id;
        return next();
      }
    }

    return res.status(401).json({
      error: 'Authentication required. Please provide a valid Bearer token in the Authorization header.',
      code: 'AUTH_REQUIRED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = authService.verifyToken(token);
    const user = get(`
      SELECT u.id, u.email, u.full_name, u.role_id, u.organisation_id, u.is_active,
             o.name as organisation_name, o.plan_tier, r.name as role_name
      FROM users u
      JOIN organisations o ON u.organisation_id = o.id
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [decoded.userId]);

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'User account is inactive or no longer exists.',
        code: 'USER_INACTIVE'
      });
    }

    const permissions = query(`
      SELECT p.id FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [user.role_id]).map(p => p.id);

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      roleId: user.role_id,
      roleName: user.role_name,
      organisationId: user.organisation_id,
      organisationName: user.organisation_name,
      planTier: user.plan_tier,
      permissions
    };
    req.organisationId = user.organisation_id;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session token has expired. Please refresh your token or log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({
      error: 'Invalid authentication token.',
      code: 'INVALID_TOKEN'
    });
  }
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token);
    const user = get(`
      SELECT u.id, u.email, u.full_name, u.role_id, u.organisation_id, u.is_active,
             o.name as organisation_name, o.plan_tier, r.name as role_name
      FROM users u
      JOIN organisations o ON u.organisation_id = o.id
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [decoded.userId]);

    if (user && user.is_active) {
      const permissions = query(`
        SELECT p.id FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?
      `, [user.role_id]).map(p => p.id);

      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        roleId: user.role_id,
        roleName: user.role_name,
        organisationId: user.organisation_id,
        organisationName: user.organisation_name,
        planTier: user.plan_tier,
        permissions
      };
      req.organisationId = user.organisation_id;
    }
  } catch {
    // Ignore invalid optional tokens
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
