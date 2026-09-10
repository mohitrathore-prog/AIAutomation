/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Server Bootstrap & API Orchestration Layer
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static Assets
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', assessmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    platform: "Enterprise AI & Automation Opportunity Assessment Platform",
    tagline: "The right solution first. AI only when necessary.",
    version: "2.1.0",
    demoMode: process.env.DEMO_MODE !== "false",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback for direct browser reloads
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: "Endpoint not found" });
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log("==================================================================");
    console.log(`  Enterprise AI & Automation Assessment Platform running`);
    console.log(`  Local URL: http://localhost:${PORT}`);
    console.log(`  Core Principle: "The right solution first. AI only when necessary."`);
    console.log(`  Mode: ${process.env.NODE_ENV || 'development'} | Demo Mode: ${process.env.DEMO_MODE !== 'false'}`);
    console.log("==================================================================");
  });
}

module.exports = app;
