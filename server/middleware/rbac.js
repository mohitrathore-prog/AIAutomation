/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Role-Based Access Control (RBAC) & Tenant Isolation Middleware
 * Strictly validates server-side permissions and isolates multi-tenant data.
 */

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.roleId === 'SUPER_ADMIN' || allowedRoles.includes(req.user.roleId)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.roleId}`,
      code: 'INSUFFICIENT_ROLE'
    });
  };
}

function requirePermission(permissionId) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.roleId === 'SUPER_ADMIN') {
      return next();
    }

    if (req.user.permissions && req.user.permissions.includes(permissionId)) {
      return next();
    }

    return res.status(403).json({
      error: `Access denied. Missing required permission: '${permissionId}'`,
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  };
}

/**
 * Enforces that non-super-admin users can only query and mutate data belonging to their own tenant organisation
 */
function requireTenantIsolation(paramKey = 'orgId') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.roleId === 'SUPER_ADMIN') {
      return next();
    }

    const requestedOrgId = req.params[paramKey] || req.query[paramKey] || req.body[paramKey] || req.body.organisationId;

    if (requestedOrgId && requestedOrgId !== req.user.organisationId) {
      return res.status(403).json({
        error: 'Cross-tenant access violation. You cannot access or modify resources belonging to another organisation.',
        code: 'TENANT_VIOLATION'
      });
    }

    next();
  };
}

module.exports = {
  requireRole,
  requirePermission,
  requireTenantIsolation
};
