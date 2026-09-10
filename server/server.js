/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Production Server Bootstrap & API Gateway
 * Core Principle: "The right solution first. AI only when necessary."
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Fail-Closed Validation for Production
const DEFAULT_INSECURE_SECRET = "corporate-assessment-secure-token-2026";
if (process.env.NODE_ENV === 'production') {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === DEFAULT_INSECURE_SECRET || secret.length < 32) {
    console.error('==================================================================');
    console.error(' [FATAL SECURITY ERROR] NODE_ENV is set to production, but');
    console.error(' JWT_SECRET is unset, matches the insecure default, or is under 32 chars.');
    console.error(' Refusing to start in an insecure state. Halting.');
    console.error('==================================================================');
    process.exit(1);
  }
}

// Initialise Database
require('./db');

const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const documentRoutes = require('./routes/documentRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
const PORT = process.env.PORT || 3050;

// 1. Security Headers & CORS
app.use(helmet({
  contentSecurityPolicy: false, // Permit inline SVGs, diagrams, and corporate styles
  crossOriginEmbedderPolicy: false
}));
app.use(cors());

// 2. Global Rate Limiter (200 requests per 15 mins per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: "Too many requests from this IP. Please try again in 15 minutes.", code: "RATE_LIMITED" },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', globalLimiter);

// 3. Request Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 4. Static Assets
app.use(express.static(path.join(__dirname, '../public')));

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);
app.use('/api', assessmentRoutes);

// 6. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    platform: "Enterprise AI & Automation Opportunity Assessment Platform",
    tagline: "The right solution first. AI only when necessary.",
    version: "3.0.0-production",
    database: "SQLite (WAL Mode)",
    demoMode: process.env.DEMO_MODE !== "false",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 7. Fallback for Single Page Application
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: "API endpoint not found", path: req.path });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED SERVER ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("==================================================================");
    console.log(`  Enterprise AI & Automation Assessment Platform [SaaS Production]`);
    console.log(`  Local URL: http://localhost:${PORT}`);
    console.log(`  Core Principle: "The right solution first. AI only when necessary."`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'} | Demo Mode: ${process.env.DEMO_MODE !== 'false'}`);
    console.log("==================================================================");
  });
}

module.exports = app;
