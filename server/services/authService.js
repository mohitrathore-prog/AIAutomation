/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Production Authentication & Identity Management Service
 * Implements bcrypt hashing, JWT token rotation, fail-closed policy, and session revocation.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { get, run, query, transaction, recordAudit } = require('../db');

// Fail-closed policy for production secrets
const DEFAULT_INSECURE_SECRET = "corporate-assessment-secure-token-2026";
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret === DEFAULT_INSECURE_SECRET || secret.length < 32) {
      throw new Error('[FATAL SECURITY EXCEPTION] Production environment requires a strong, non-default JWT_SECRET (minimum 32 characters). Terminating process.');
    }
  }
  return secret || DEFAULT_INSECURE_SECRET;
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_EXPIRES_DAYS = 7;

class AuthService {
  /**
   * Register a new organisation and tenant owner
   */
  async register({ email, password, fullName, organisationName, industry = 'General Enterprise', companySize = 'Mid-Market (1,000 - 5,000 employees)' }) {
    if (!email || !password || !fullName || !organisationName) {
      throw new Error('Email, password, full name, and organisation name are required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const existingUser = get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existingUser) {
      throw new Error('A user with this email address already exists');
    }

    const orgId = `org_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const slug = organisationName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 40) + `-${crypto.randomBytes(2).toString('hex')}`;
    const userId = `usr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Atomic transaction for organisation creation
    const registerTx = transaction(() => {
      // 1. Create Organisation
      run(`
        INSERT INTO organisations (id, name, slug, industry, company_size, plan_tier, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'EXPLORE', 'ACTIVE', datetime('now'), datetime('now'))
      `, [orgId, organisationName, slug, industry, companySize]);

      // 2. Create Default Subscription & Credits
      run(`
        INSERT INTO subscriptions (id, organisation_id, plan_tier, status, current_period_start, current_period_end, billing_provider, created_at)
        VALUES (?, ?, 'EXPLORE', 'ACTIVE', datetime('now'), datetime('now', '+30 days'), 'MOCK', datetime('now'))
      `, [`sub_${orgId}`, orgId]);

      run(`
        INSERT INTO credit_balances (organisation_id, balance, lifetime_granted, lifetime_consumed, updated_at)
        VALUES (?, 100, 100, 0, datetime('now'))
      `, [orgId]);

      // 3. Create Tenant Owner User
      run(`
        INSERT INTO users (id, organisation_id, email, password_hash, full_name, role_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 'OWNER', 1, datetime('now'), datetime('now'))
      `, [userId, orgId, email.toLowerCase().trim(), passwordHash, fullName]);

      recordAudit({
        organisationId: orgId,
        userId,
        userEmail: email.toLowerCase().trim(),
        action: 'REGISTER_TENANT',
        entityType: 'Organisation',
        entityId: orgId,
        newValues: { organisationName, slug, planTier: 'EXPLORE' }
      });
    });

    registerTx();

    return this.login(email, password);
  }

  /**
   * Authenticate user, return JWT and refresh token
   */
  async login(email, password, ipAddress = null, userAgent = null) {
    const user = get(`
      SELECT u.*, o.name as organisation_name, o.plan_tier, r.name as role_name
      FROM users u
      JOIN organisations o ON u.organisation_id = o.id
      JOIN roles r ON u.role_id = r.id
      WHERE LOWER(u.email) = ?
    `, [email.toLowerCase().trim()]);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
      throw new Error('This user account has been deactivated. Please contact your organization administrator.');
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Fetch user permissions
    const permissions = query(`
      SELECT p.id FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [user.role_id]).map(p => p.id);

    // Generate JWT Access Token
    const payload = {
      userId: user.id,
      organisationId: user.organisation_id,
      email: user.email,
      roleId: user.role_id,
      permissions
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Generate and store Refresh Token
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const sessionId = `ses_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000).toISOString();

    run(`
      INSERT INTO user_sessions (id, user_id, refresh_token_hash, user_agent, ip_address, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `, [sessionId, user.id, refreshTokenHash, userAgent, ipAddress, expiresAt]);

    // Update last login
    run('UPDATE users SET last_login_at = datetime(\'now\') WHERE id = ?', [user.id]);

    recordAudit({
      organisationId: user.organisation_id,
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      ipAddress,
      userAgent
    });

    return {
      token,
      refreshToken: rawRefreshToken,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        roleId: user.role_id,
        roleName: user.role_name,
        organisationId: user.organisation_id,
        organisationName: user.organisation_name,
        planTier: user.plan_tier,
        permissions
      }
    };
  }

  /**
   * Verify and rotate refresh token
   */
  async refresh(rawRefreshToken, ipAddress = null, userAgent = null) {
    if (!rawRefreshToken) throw new Error('Refresh token is required');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const session = get(`
      SELECT s.*, u.id as user_id, u.organisation_id, u.email, u.role_id, u.is_active,
             o.name as organisation_name, o.plan_tier, r.name as role_name
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      JOIN organisations o ON u.organisation_id = o.id
      JOIN roles r ON u.role_id = r.id
      WHERE s.refresh_token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > datetime('now')
    `, [refreshTokenHash]);

    if (!session || !session.is_active) {
      throw new Error('Invalid or expired refresh token');
    }

    // Revoke old session (Rotation)
    run('UPDATE user_sessions SET revoked_at = datetime(\'now\') WHERE id = ?', [session.id]);

    // Issue new refresh token
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHash = crypto.createHash('sha256').update(newRawRefreshToken).digest('hex');
    const newSessionId = `ses_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 3600 * 1000).toISOString();

    run(`
      INSERT INTO user_sessions (id, user_id, refresh_token_hash, user_agent, ip_address, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `, [newSessionId, session.user_id, newHash, userAgent, ipAddress, expiresAt]);

    // Fetch permissions
    const permissions = query(`
      SELECT p.id FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [session.role_id]).map(p => p.id);

    const token = jwt.sign({
      userId: session.user_id,
      organisationId: session.organisation_id,
      email: session.email,
      roleId: session.role_id,
      permissions
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      token,
      refreshToken: newRawRefreshToken,
      user: {
        id: session.user_id,
        email: session.email,
        roleId: session.role_id,
        roleName: session.role_name,
        organisationId: session.organisation_id,
        organisationName: session.organisation_name,
        planTier: session.plan_tier,
        permissions
      }
    };
  }

  /**
   * Revoke session on logout
   */
  async logout(rawRefreshToken, userId = null) {
    if (rawRefreshToken) {
      const hash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
      run('UPDATE user_sessions SET revoked_at = datetime(\'now\') WHERE refresh_token_hash = ?', [hash]);
    } else if (userId) {
      run('UPDATE user_sessions SET revoked_at = datetime(\'now\') WHERE user_id = ? AND revoked_at IS NULL', [userId]);
    }
    return { success: true };
  }

  /**
   * Verify token payload
   */
  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = new AuthService();
