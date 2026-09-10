/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Secure Admin Portal API Routes
 * Backed by Persistent Database, RBAC, and Immutable Audit Trail.
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole, requirePermission } = require('../middleware/rbac');
const { query, get, run, recordAudit } = require('../db');

// All admin routes require authenticated session with Administrative / Architect role
router.use(requireAuth);
router.use(requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN', 'ARCHITECT'));

// 1. Admin Dashboard Stats
router.get('/dashboard-stats', (req, res) => {
  try {
    const useCasesCount = get('SELECT COUNT(*) as count FROM use_cases').count;
    const technologiesCount = get('SELECT COUNT(*) as count FROM technology_stack').count;
    const questionsCount = get('SELECT COUNT(*) as count FROM questions').count;
    const evidenceSourcesCount = get('SELECT COUNT(*) as count FROM evidence_catalog').count;
    const activeAssessmentsCount = get('SELECT COUNT(*) as count FROM assessments WHERE organisation_id = ?', [req.organisationId]).count;

    // Fetch tenant-scoped audit logs
    const auditLogs = req.user.roleId === 'SUPER_ADMIN'
      ? query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20')
      : query('SELECT * FROM audit_logs WHERE organisation_id = ? ORDER BY created_at DESC LIMIT 20', [req.organisationId]);

    res.json({
      useCasesCount,
      technologiesCount,
      questionsCount,
      evidenceSourcesCount,
      activeAssessmentsCount,
      systemHealth: "Optimal",
      demoModeActive: process.env.DEMO_MODE !== 'false',
      auditLogs
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Use Case Management (Knowledge Base)
router.post('/use-cases', requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), (req, res) => {
  try {
    const uc = req.body;
    const id = uc.id || `uc_${Date.now()}`;

    run(`
      INSERT INTO use_cases (
        id, name, department, domain, problem_statement, recommended_solution_type,
        solution_level, recommended_tier, ai_necessity_score, ai_necessity_rationale,
        estimated_effort_weeks, estimated_cost_range, potential_roi_range, risk_level,
        compliance_implications, replaces_human_tasks, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published', '1.0', datetime('now'), datetime('now'))
    `, [
      id,
      uc.name,
      uc.department,
      uc.domain || uc.department,
      uc.problemStatement || uc.problem_statement || '',
      uc.recommendedSolutionType || uc.recommended_solution_type || 'Workflow Automation',
      uc.solutionLevel || uc.solution_level || 4,
      uc.recommendedTier || uc.recommended_tier || 'Standard Automation',
      uc.aiNecessityScore !== undefined ? uc.aiNecessityScore : 25,
      uc.aiNecessityRationale || 'Standard automation capability verified.',
      uc.estimatedEffortWeeks || 8,
      uc.estimatedCostRange || '$25,000 - $50,000',
      uc.potentialRoiRange || '200% - 300%',
      uc.riskLevel || 'Low',
      uc.complianceImplications || 'Standard audit controls apply',
      uc.replacesHumanTasks ? 1 : 0
    ]);

    recordAudit({
      organisationId: req.organisationId,
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_USE_CASE',
      entityType: 'UseCase',
      entityId: id,
      newValues: { name: uc.name, department: uc.department }
    });

    res.status(201).json({ success: true, useCase: { id, ...uc } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/use-cases/:id', requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), (req, res) => {
  try {
    const existing = get('SELECT * FROM use_cases WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ error: "Use case not found" });

    const uc = req.body;
    run(`
      UPDATE use_cases
      SET name = COALESCE(?, name),
          department = COALESCE(?, department),
          domain = COALESCE(?, domain),
          problem_statement = COALESCE(?, problem_statement),
          recommended_solution_type = COALESCE(?, recommended_solution_type),
          solution_level = COALESCE(?, solution_level),
          recommended_tier = COALESCE(?, recommended_tier),
          ai_necessity_score = COALESCE(?, ai_necessity_score),
          ai_necessity_rationale = COALESCE(?, ai_necessity_rationale),
          estimated_effort_weeks = COALESCE(?, estimated_effort_weeks),
          estimated_cost_range = COALESCE(?, estimated_cost_range),
          potential_roi_range = COALESCE(?, potential_roi_range),
          risk_level = COALESCE(?, risk_level),
          compliance_implications = COALESCE(?, compliance_implications),
          updated_at = datetime('now')
      WHERE id = ?
    `, [
      uc.name,
      uc.department,
      uc.domain,
      uc.problemStatement || uc.problem_statement,
      uc.recommendedSolutionType || uc.recommended_solution_type,
      uc.solutionLevel || uc.solution_level,
      uc.recommendedTier || uc.recommended_tier,
      uc.aiNecessityScore !== undefined ? uc.aiNecessityScore : null,
      uc.aiNecessityRationale,
      uc.estimatedEffortWeeks,
      uc.estimatedCostRange,
      uc.potentialRoiRange,
      uc.riskLevel,
      uc.complianceImplications,
      req.params.id
    ]);

    recordAudit({
      organisationId: req.organisationId,
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'UPDATE_USE_CASE',
      entityType: 'UseCase',
      entityId: req.params.id,
      oldValues: { name: existing.name },
      newValues: { name: uc.name || existing.name }
    });

    res.json({ success: true, message: 'Use case updated successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Question Management
router.post('/questions', requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), (req, res) => {
  try {
    const q = req.body;
    const id = q.id || `q_${Date.now()}`;

    run(`
      INSERT INTO questions (
        id, section_id, department, domain, question, help_text, input_type,
        options_json, skip_logic_json, display_order, is_required, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', datetime('now'), datetime('now'))
    `, [
      id,
      q.sectionId || 'sec_process',
      q.department || 'General',
      q.domain || 'General',
      q.question,
      q.helpText || '',
      q.type || q.inputType || 'select',
      JSON.stringify(q.options || []),
      JSON.stringify(q.skipLogic || null),
      q.displayOrder || 1,
      q.isRequired !== undefined ? (q.isRequired ? 1 : 0) : 1
    ]);

    recordAudit({
      organisationId: req.organisationId,
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_QUESTION',
      entityType: 'Question',
      entityId: id,
      newValues: { question: q.question, department: q.department }
    });

    res.status(201).json({ success: true, question: { id, ...q } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Technology Catalogue Management
router.post('/technologies', requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), (req, res) => {
  try {
    const t = req.body;
    const id = t.id || `tech_${Date.now()}`;

    run(`
      INSERT INTO technology_stack (
        id, product, vendor, category, solution_level, typical_annual_cost, pricing_policy,
        implementation_effort, lifecycle_status, strengths_json, limitations_json, status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Published', '1.0', datetime('now'), datetime('now'))
    `, [
      id,
      t.product,
      t.vendor || 'Independent',
      t.category || 'Platform',
      t.solutionLevel || 3,
      t.typicalAnnualCost || 'Vendor quotation required',
      t.pricingPolicy || 'Explicit',
      t.implementationEffort || 'Medium (4-8 weeks)',
      t.lifecycleStatus || 'Current',
      JSON.stringify(t.strengths || []),
      JSON.stringify(t.limitations || [])
    ]);

    recordAudit({
      organisationId: req.organisationId,
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_TECHNOLOGY',
      entityType: 'Technology',
      entityId: id,
      newValues: { product: t.product, vendor: t.vendor }
    });

    res.status(201).json({ success: true, technology: { id, ...t } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. Research Evidence Benchmark Management
router.post('/evidence', requireRole('SUPER_ADMIN', 'OWNER', 'ADMIN'), (req, res) => {
  try {
    const ev = req.body;
    const id = ev.id || `ev_${Date.now()}`;

    run(`
      INSERT INTO evidence_catalog (
        id, claim, evidence_tier, source_name, source_url, publication_year,
        confidence_level, audit_status, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Published', datetime('now'), datetime('now'))
    `, [
      id,
      ev.claim,
      ev.evidenceTier || 2,
      ev.sourceName,
      ev.sourceUrl || '',
      ev.publicationYear || new Date().getFullYear(),
      ev.confidenceLevel || 'High',
      ev.auditStatus || 'Verified'
    ]);

    recordAudit({
      organisationId: req.organisationId,
      userId: req.user.id,
      userEmail: req.user.email,
      action: 'CREATE_EVIDENCE',
      entityType: 'Evidence',
      entityId: id,
      newValues: { claim: ev.claim, source: ev.sourceName }
    });

    res.status(201).json({ success: true, evidence: { id, ...ev } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 6. Audit Trail Retrieval (Strictly scoped by organisation)
router.get('/audit-logs', (req, res) => {
  try {
    const logs = req.user.roleId === 'SUPER_ADMIN'
      ? query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100')
      : query('SELECT * FROM audit_logs WHERE organisation_id = ? ORDER BY created_at DESC LIMIT 100', [req.organisationId]);
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
