/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Authentication API Endpoints
 */

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { requireAuth } = require('../middleware/auth');
const entitlementService = require('../services/entitlementService');

// 1. Register new tenant organisation and owner
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, organisationName, industry, companySize } = req.body;
    const result = await authService.register({
      email,
      password,
      fullName,
      organisationName,
      industry,
      companySize
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const ua = req.headers['user-agent'];
    const result = await authService.login(email, password, ip, ua);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// 3. Refresh Access Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const ua = req.headers['user-agent'];
    const result = await authService.refresh(refreshToken, ip, ua);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// 4. Logout / Revoke Session
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken, req.user.id);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Current Session Profile & Entitlements
router.get('/me', requireAuth, async (req, res) => {
  try {
    const entitlements = entitlementService.getOrganisationEntitlements(req.organisationId);
    res.json({
      user: req.user,
      organisation: {
        id: req.organisationId,
        name: req.user.organisationName,
        planTier: req.user.planTier
      },
      entitlements
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
