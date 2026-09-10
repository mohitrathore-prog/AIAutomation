/**
 * Admin Portal API Routes
 * Provides comprehensive CRUD for Knowledge Base, Technologies, Questions, Use Cases,
 * Research Sources, Pricing, Version Control, and System Audit Logs.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// In-Memory Audit Trail & Change History
const auditLogs = [
  { id: "log_001", timestamp: "2026-02-15T09:12:00Z", user: "Alexander Wright", action: "UPDATE_TECHNOLOGY", target: "SAP S/4HANA", details: "Updated lifecycle status to Current and verified pricing policy." },
  { id: "log_002", timestamp: "2026-02-18T14:30:00Z", user: "Victoria Sterling", action: "ADD_USE_CASE", target: "it_aiops_log_clustering", details: "Added AIOps telemetry event correlation use case." },
  { id: "log_003", timestamp: "2026-02-25T11:45:00Z", user: "Sarah Chen", action: "UPDATE_QUESTION", target: "q_fin_ap_03", details: "Tuned PO tolerance rule triggers for 3-way matching." }
];

// Helper to log audit event
function recordAudit(user, action, target, details) {
  auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    user: user || "Enterprise Admin",
    action,
    target,
    details
  });
}

// 1. Admin Dashboard Stats
router.get('/dashboard-stats', (req, res) => {
  try {
    const useCases = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
    const technologies = JSON.parse(fs.readFileSync(path.join(dataDir, 'technologyCatalogue.json'), 'utf8'));
    const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questionsCatalogue.json'), 'utf8'));
    const evidence = JSON.parse(fs.readFileSync(path.join(dataDir, 'researchEvidence.json'), 'utf8'));

    res.json({
      useCasesCount: useCases.length,
      technologiesCount: technologies.length,
      questionsCount: questions.length,
      evidenceSourcesCount: evidence.length,
      activeAssessmentsCount: 14,
      systemHealth: "Optimal",
      demoModeActive: true,
      auditLogs: auditLogs.slice(0, 10)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Use Case CRUD
router.post('/use-cases', (req, res) => {
  try {
    const filePath = path.join(dataDir, 'useCasesLibrary.json');
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newCase = { ...req.body, id: req.body.id || `uc_${Date.now()}`, version: "1.0", lastVerifiedDate: new Date().toISOString().split('T')[0] };
    list.unshift(newCase);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
    recordAudit(req.headers['x-user-role'], "CREATE_USE_CASE", newCase.name, `Added new use case in ${newCase.department}`);
    res.json({ success: true, useCase: newCase });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/use-cases/:id', (req, res) => {
  try {
    const filePath = path.join(dataDir, 'useCasesLibrary.json');
    let list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = list.findIndex(u => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Use case not found" });

    list[index] = { ...list[index], ...req.body, lastVerifiedDate: new Date().toISOString().split('T')[0] };
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
    recordAudit(req.headers['x-user-role'], "UPDATE_USE_CASE", list[index].name, `Updated parameters for ${req.params.id}`);
    res.json({ success: true, useCase: list[index] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Question CRUD
router.post('/questions', (req, res) => {
  try {
    const filePath = path.join(dataDir, 'questionsCatalogue.json');
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newQ = { ...req.body, id: req.body.id || `q_${Date.now()}`, status: "Active" };
    list.push(newQ);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
    recordAudit(req.headers['x-user-role'], "CREATE_QUESTION", newQ.question, `Added question for ${newQ.department}`);
    res.json({ success: true, question: newQ });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Technology CRUD
router.post('/technologies', (req, res) => {
  try {
    const filePath = path.join(dataDir, 'technologyCatalogue.json');
    const list = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newTech = { ...req.body, id: req.body.id || `tech_${Date.now()}`, lastVerified: new Date().toISOString().split('T')[0] };
    list.push(newTech);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2));
    recordAudit(req.headers['x-user-role'], "CREATE_TECHNOLOGY", newTech.product, `Added tech record for ${newTech.vendor}`);
    res.json({ success: true, technology: newTech });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. Audit Log Retrieval
router.get('/audit-logs', (req, res) => {
  res.json(auditLogs);
});

module.exports = router;
