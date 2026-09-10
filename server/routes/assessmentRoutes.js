/**
 * Assessment API Routes
 * Handles questionnaire navigation, live research, recommendation pipeline, drafts, and persistent reports.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Engines & Adapters
const solutionHierarchy = require('../engine/solutionHierarchy');
const aiNecessityGate = require('../engine/aiNecessityGate');
const economicJustification = require('../engine/economicJustification');
const technologyMatcher = require('../engine/technologyMatcher');
const roiEngine = require('../engine/roiEngine');
const scoringEngine = require('../engine/scoringEngine');
const qualityController = require('../engine/qualityController');

const researchAdapter = require('../adapters/researchAdapter');
const diagramAdapter = require('../adapters/diagramAdapter');
const visualAdapter = require('../adapters/visualAdapter');
const pdfAdapter = require('../adapters/pdfAdapter');

// Database, Auth & Services
const { db, get, query, run, transaction, recordAudit } = require('../db');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const entitlementService = require('../services/entitlementService');
const reportService = require('../services/reportService');

// Static Fallback Data
const dataDir = path.join(__dirname, '../data');
const industries = JSON.parse(fs.readFileSync(path.join(dataDir, 'industryTaxonomy.json'), 'utf8'));

// 1. Taxonomy & Reference Data
router.get('/taxonomy', (req, res) => {
  const departments = [
    { id: "IT", name: "Information Technology", domains: ["Service Desk", "Infrastructure", "Cloud", "Applications", "Cybersecurity", "Identity & Access", "DevOps", "Software Development", "IT Operations"] },
    { id: "Finance", name: "Finance & Accounting", domains: ["Accounts Payable", "Accounts Receivable", "General Ledger", "Record-to-Report", "Procure-to-Pay", "FP&A", "Treasury", "Tax", "Audit & Compliance"] },
    { id: "HR", name: "Human Resources", domains: ["Recruitment", "Onboarding", "Employee Services", "Payroll", "Performance", "Learning & Development", "Workforce Planning", "Offboarding"] },
    { id: "Procurement", name: "Procurement & Sourcing", domains: ["Sourcing", "Supplier Management", "Purchase Orders", "Contract Management", "Spend Analytics"] },
    { id: "Customer Service", name: "Customer Service & Support", domains: ["Contact Centre", "Case Management", "Knowledge Management", "Customer Communication", "Escalations"] },
    { id: "Sales", name: "Sales & Commercial Operations", domains: ["Lead Management", "Opportunity Management", "Proposal", "Forecasting", "Sales Operations"] },
    { id: "Legal", name: "Legal & Corporate Governance", domains: ["Contract Review", "Legal Research", "Compliance", "Matter Management"] },
    { id: "Supply Chain", name: "Supply Chain & Logistics", domains: ["Planning", "Inventory", "Logistics", "Supplier Monitoring", "Demand Forecasting"] },
    { id: "Operations", name: "Process Operations & Quality", domains: ["Process Operations", "Quality", "Reporting", "Scheduling", "Safety"] },
    { id: "Back Office", name: "Shared Services & Back Office", domains: ["Document Processing", "Email Processing", "Data Entry", "Reconciliation", "Administrative Operations"] }
  ];
  res.json({ industries, departments });
});

// 2. Technology Catalogue (from Database)
router.get('/technologies', (req, res) => {
  try {
    const rows = query('SELECT * FROM technology_stack ORDER BY solution_level ASC, product ASC');
    if (rows.length > 0) {
      return res.json(rows.map(t => ({
        ...t,
        strengths: JSON.parse(t.strengths_json || '[]'),
        limitations: JSON.parse(t.limitations_json || '[]')
      })));
    }
    const fileTech = JSON.parse(fs.readFileSync(path.join(dataDir, 'technologyCatalogue.json'), 'utf8'));
    res.json(fileTech);
  } catch {
    const fileTech = JSON.parse(fs.readFileSync(path.join(dataDir, 'technologyCatalogue.json'), 'utf8'));
    res.json(fileTech);
  }
});

// 3. Dynamic Questions with Adaptive Skip Logic
router.get('/questions', (req, res) => {
  const { department, domain } = req.query;
  try {
    let sql = "SELECT * FROM questions WHERE status = 'Active'";
    const params = [];

    if (department) {
      sql += ' AND LOWER(department) = LOWER(?)';
      params.push(department);
    }
    if (domain) {
      sql += ' AND LOWER(domain) LIKE ?';
      params.push(`%${domain.toLowerCase()}%`);
    }
    sql += ' ORDER BY display_order ASC';

    const dbQuestions = query(sql, params);
    if (dbQuestions.length > 0) {
      return res.json(dbQuestions.map(q => ({
        id: q.id,
        sectionId: q.section_id,
        department: q.department,
        domain: q.domain,
        question: q.question,
        helpText: q.help_text,
        type: q.input_type,
        options: JSON.parse(q.options_json || '[]'),
        skipLogic: JSON.parse(q.skip_logic_json || 'null'),
        displayOrder: q.display_order,
        isRequired: !!q.is_required
      })));
    }

    // Fallback to JSON
    const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questionsCatalogue.json'), 'utf8'));
    let filtered = questions;
    if (department) filtered = filtered.filter(q => q.department.toLowerCase() === department.toLowerCase());
    if (domain) filtered = filtered.filter(q => q.domain.toLowerCase().includes(domain.toLowerCase()));
    res.json(filtered);
  } catch {
    const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questionsCatalogue.json'), 'utf8'));
    res.json(questions);
  }
});

// 4. Use Cases Library Search
router.get('/use-cases', (req, res) => {
  const { department, solutionType, search } = req.query;
  try {
    let sql = "SELECT * FROM use_cases WHERE status = 'Published'";
    const params = [];

    if (department) {
      sql += ' AND LOWER(department) = LOWER(?)';
      params.push(department);
    }
    if (solutionType) {
      sql += ' AND LOWER(recommended_solution_type) LIKE ?';
      params.push(`%${solutionType.toLowerCase()}%`);
    }
    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(problem_statement) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s);
    }

    const rows = query(sql, params);
    if (rows.length > 0) {
      return res.json(rows.map(u => ({
        id: u.id,
        name: u.name,
        department: u.department,
        domain: u.domain,
        problemStatement: u.problem_statement,
        recommendedSolutionType: u.recommended_solution_type,
        solutionLevel: u.solution_level,
        recommendedTier: u.recommended_tier,
        aiNecessityScore: u.ai_necessity_score,
        aiNecessityRationale: u.ai_necessity_rationale,
        estimatedEffortWeeks: u.estimated_effort_weeks,
        estimatedCostRange: u.estimated_cost_range,
        potentialRoiRange: u.potential_roi_range,
        riskLevel: u.risk_level,
        complianceImplications: u.compliance_implications,
        replacesHumanTasks: !!u.replaces_human_tasks,
        status: u.status,
        version: u.version
      })));
    }

    const fileCases = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
    res.json(fileCases);
  } catch {
    const fileCases = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
    res.json(fileCases);
  }
});

// 5. Research Adapter Endpoint
router.post('/research', async (req, res) => {
  const { companyName, industry } = req.body;
  const research = await researchAdapter.researchCompany(companyName, industry);
  res.json(research);
});

// 6. Draft Management: Save/Autosave & Resume
router.post('/drafts', optionalAuth, (req, res) => {
  try {
    const { id, title, currentStep = 1, answers = {} } = req.body;
    const orgId = req.organisationId || 'org_acme_global';
    const userId = req.user ? req.user.id : 'usr_victoria_sterling';
    const draftId = id || `draft_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const draftTitle = title || `Assessment Draft - ${new Date().toLocaleDateString()}`;

    run(`
      INSERT INTO assessment_drafts (id, organisation_id, user_id, title, current_step, answers_json, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'IN_PROGRESS', datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        current_step = excluded.current_step,
        answers_json = excluded.answers_json,
        updated_at = datetime('now')
    `, [draftId, orgId, userId, draftTitle, currentStep, JSON.stringify(answers)]);

    res.json({
      success: true,
      draftId,
      title: draftTitle,
      savedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/drafts', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const drafts = query(`
      SELECT id, title, current_step, status, created_at, updated_at
      FROM assessment_drafts
      WHERE organisation_id = ? AND status = 'IN_PROGRESS'
      ORDER BY updated_at DESC
    `, [orgId]);
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/drafts/:id', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const draft = get(`
      SELECT * FROM assessment_drafts WHERE id = ? AND organisation_id = ?
    `, [req.params.id, orgId]);

    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    res.json({
      ...draft,
      answers: JSON.parse(draft.answers_json || '{}')
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/drafts/:id', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    run(`DELETE FROM assessment_drafts WHERE id = ? AND organisation_id = ?`, [req.params.id, orgId]);
    res.json({ success: true, message: 'Draft removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Comprehensive Recommendation Pipeline
router.post('/evaluate', optionalAuth, async (req, res) => {
  try {
    const {
      organization = {},
      departments = ["Finance", "IT"],
      domains = ["Accounts Payable", "Service Desk"],
      existingSystems = ["SAP S/4HANA", "ServiceNow", "Microsoft 365"],
      answers = {},
      customVolume = null,
      draftId = null
    } = req.body;

    const orgId = req.organisationId || 'org_acme_global';
    const userId = req.user ? req.user.id : 'usr_victoria_sterling';

    // Enforce quota if user has an account
    if (req.organisationId) {
      const quotaCheck = entitlementService.canCreateAssessment(req.organisationId);
      if (!quotaCheck.allowed) {
        return res.status(402).json({
          error: quotaCheck.reason,
          code: 'QUOTA_EXCEEDED',
          upgradeRequired: true
        });
      }
    }

    // Load candidate use cases
    const useCasesList = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
    const candidateCases = useCasesList.filter(uc => 
      departments.some(d => d.toLowerCase() === uc.department.toLowerCase())
    );

    const evaluatedOpportunities = [];

    for (const uc of candidateCases) {
      // 1. Solution Hierarchy Evaluation
      const hierarchyContext = {
        hasExistingSoftwareFeature: uc.recommendedSolutionType.includes("Existing"),
        isDeterministicRulesOnly: uc.aiNecessity === "No" && (uc.recommendedSolutionType.includes("Rule") || uc.recommendedSolutionType.includes("Configuration")),
        isSequentialWorkflowOnly: uc.aiNecessity === "No" && uc.recommendedSolutionType.includes("Workflow"),
        hasDirectApisAvailable: uc.recommendedSolutionType.includes("API") || uc.recommendedSolutionType.includes("Integration"),
        isBatchScriptingAppropriate: uc.recommendedSolutionType.includes("Script"),
        isLegacyNoApi: uc.recommendedSolutionType.includes("RPA"),
        requiresStatisticalPrediction: uc.recommendedSolutionType.includes("Machine Learning"),
        requiresSemiStructuredExtraction: uc.recommendedSolutionType.includes("AI-Assisted") || uc.name.toLowerCase().includes("invoice"),
        requiresNaturalLanguageUnderstanding: uc.recommendedSolutionType.includes("Generative") || (uc.subdomain && uc.subdomain.includes("Contract")),
        requiresAutonomousMultiStepReasoning: uc.recommendedSolutionType.includes("Agentic"),
        unstructuredVarianceLevel: uc.aiNecessity === "Yes" ? "High" : "None"
      };
      const hierarchyResult = solutionHierarchy.evaluate(hierarchyContext);

      // 2. AI Necessity Gate
      const gateContext = {
        hasUnstructuredData: uc.aiNecessity === "Yes" && !uc.recommendedSolutionType.includes("Machine Learning"),
        hasVariableLayouts: uc.name.toLowerCase().includes("invoice") || uc.name.toLowerCase().includes("document"),
        requiresSubjectiveInterpretation: uc.department === "Legal" || (uc.subdomain && uc.subdomain.includes("Policy")),
        requiresPredictiveModeling: uc.recommendedSolutionType.includes("Machine Learning"),
        requiresSemanticUnderstanding: uc.department === "Legal" || (uc.subdomain && (uc.subdomain.includes("Search") || uc.subdomain.includes("Response"))),
        requiresContextualReasoning: uc.department === "Legal" || (uc.subdomain && uc.subdomain.includes("Review")),
        requiresConversationalInteraction: uc.subdomain && (uc.subdomain.includes("Assistant") || uc.subdomain.includes("Chatbot") || uc.subdomain.includes("Concierge")),
        requiresDynamicActionSelection: uc.recommendedSolutionType.includes("Agentic"),
        requiresMultiStepAgenticPlanning: uc.recommendedSolutionType.includes("Agentic")
      };
      const gateResult = aiNecessityGate.evaluate(gateContext);

      // 3. Economic Justification
      const economicResult = economicJustification.compare(
        { oneTimeCost: uc.oneTimeCostEstimateUSD * 0.6, annualLicense: 3000, annualInfra: 1000, annualMaintenance: 2000, expectedAnnualBenefit: uc.expectedAnnualSavingsUSD * 0.85 },
        { oneTimeCost: uc.oneTimeCostEstimateUSD, annualLicense: uc.annualRecurringCostUSD * 0.6, annualTokens: uc.annualRecurringCostUSD * 0.4, annualMaintenance: 8000, expectedAnnualBenefit: uc.expectedAnnualSavingsUSD }
      );

      // 4. Technology Matching (Existing stack first!)
      const techResult = technologyMatcher.match(
        { department: uc.department, solutionType: uc.recommendedSolutionType, requiresGenAi: uc.aiNecessity === "Yes" },
        { systems: existingSystems }
      );

      // 5. Deterministic ROI Calculation
      const roiResult = roiEngine.calculate({
        annualVolume: customVolume || (uc.id.includes("invoice") ? 102000 : 45000),
        loadedHourlyRateUSD: 65,
        oneTimeDevelopment: uc.oneTimeCostEstimateUSD * 0.5,
        oneTimeIntegration: uc.oneTimeCostEstimateUSD * 0.3,
        oneTimeTesting: uc.oneTimeCostEstimateUSD * 0.1,
        oneTimeChangeMgmt: uc.oneTimeCostEstimateUSD * 0.1,
        annualSoftwareLicenseUSD: uc.annualRecurringCostUSD * 0.6,
        annualCloudAndTokensUSD: uc.annualRecurringCostUSD * 0.2,
        annualSupportMaintenanceUSD: uc.annualRecurringCostUSD * 0.2,
        automationPotentialPercent: uc.aiNecessity === "Yes" ? 75 : 85
      });

      // 6. Multi-Factor Weighted Scoring
      const scoreResult = scoringEngine.score({
        businessValue: uc.businessValueScore,
        costEffectiveness: uc.costEffectivenessScore,
        technicalFeasibility: uc.technicalFeasibilityScore,
        existingTechFit: techResult.isReusingExistingTech ? 95 : 75,
        readiness: uc.implementationReadinessScore,
        risk: uc.riskScore,
        aiNecessity: gateResult.aiNecessityScore
      });

      // 7. Visual & Diagram Generators
      const currentStateSvg = diagramAdapter.generateCurrentStateSvg(uc);
      const futureStateSvg = diagramAdapter.generateFutureStateSvg(uc);
      const conceptualMockupHtml = visualAdapter.generateConceptualMockup(uc.id);

      // Assemble full opportunity record
      const fullOpportunity = {
        ...uc,
        overallScore: scoreResult.overallScore,
        priority: scoreResult.priority,
        complexityLevel: scoreResult.complexityLevel,
        valueComplexityRatio: scoreResult.valueComplexityRatio,
        dimensionScores: scoreResult.dimensionScores,
        weightedContribution: scoreResult.weightedContribution,
        hierarchyResult,
        gateResult,
        economicResult,
        whyNotAi: uc.aiNecessity === "No" ? uc.whyNotAi : null,
        matchedTechnology: techResult.recommendedTool,
        alternativeMatchedTechnologies: techResult.alternativeTools,
        isReusingExistingTechnology: techResult.isReusingExistingTech,
        technologyRationale: techResult.rationale,
        metrics: roiResult.metrics,
        scenarios: roiResult.scenarios,
        statedAssumptions: roiResult.statedAssumptions,
        roiDisclaimer: roiResult.disclaimer,
        diagrams: {
          currentStateSvg,
          futureStateSvg
        },
        conceptualMockupHtml
      };

      const validation = qualityController.validate(fullOpportunity);
      if (validation.isValid) {
        evaluatedOpportunities.push(fullOpportunity);
      }
    }

    evaluatedOpportunities.sort((a, b) => b.overallScore - a.overallScore);

    // Summary calculations
    const totalOpportunities = evaluatedOpportunities.length;
    const automationCount = evaluatedOpportunities.filter(o => o.aiNecessity === "No").length;
    const aiCount = evaluatedOpportunities.filter(o => o.aiNecessity === "Yes" && !o.recommendedSolutionType.includes("Hybrid") && !o.recommendedSolutionType.includes("Assisted")).length;
    const hybridCount = evaluatedOpportunities.filter(o => o.recommendedSolutionType.includes("Hybrid") || o.recommendedSolutionType.includes("Assisted")).length;
    const highPriorityCount = evaluatedOpportunities.filter(o => o.priority === "Quick Win" || o.priority === "Strategic").length;

    let totalInvestmentUSD = 0;
    let totalGrossBenefitUSD = 0;
    let netAnnualBenefitUSD = 0;

    evaluatedOpportunities.forEach(o => {
      totalInvestmentUSD += (o.metrics?.totalOneTimeInvestmentUSD || o.oneTimeCostEstimateUSD);
      totalGrossBenefitUSD += (o.metrics?.totalGrossAnnualBenefitUSD || o.expectedAnnualSavingsUSD);
      netAnnualBenefitUSD += (o.metrics?.netAnnualBenefitUSD || (o.expectedAnnualSavingsUSD - o.annualRecurringCostUSD));
    });

    const expectedPaybackMonths = netAnnualBenefitUSD > 0
      ? Number(((totalInvestmentUSD / netAnnualBenefitUSD) * 12).toFixed(1))
      : 999;

    const expectedRoi3Year = totalInvestmentUSD > 0
      ? Math.round((((netAnnualBenefitUSD * 3) - totalInvestmentUSD) / totalInvestmentUSD) * 100)
      : 0;

    const matrixPoints = evaluatedOpportunities.map(o => ({
      id: o.id,
      name: o.name,
      department: o.department,
      solutionType: o.recommendedSolutionType,
      priority: o.priority,
      x: 100 - (o.scoreBreakdown?.complexityScore || 35),
      y: o.businessValueScore,
      score: o.overallScore,
      netBenefitUSD: o.metrics?.netAnnualBenefitUSD || o.expectedAnnualSavingsUSD,
      aiNecessity: o.aiNecessity
    }));

    const roadmap = {
      phase1: {
        title: "Phase 1: Quick Wins & Native Core Capabilities",
        horizon: "0 – 3 Months",
        focus: "Immediate value realization with zero/low software cost leveraging existing platform configurations.",
        opportunities: evaluatedOpportunities.filter(o => o.priority === "Quick Win").slice(0, 4)
      },
      phase2: {
        title: "Phase 2: Scale Core Process Automation",
        horizon: "3 – 6 Months",
        focus: "Standardized cross-department workflows, hybrid document understanding, and API integration hubs.",
        opportunities: evaluatedOpportunities.filter(o => o.priority === "Strategic" && o.aiNecessity === "No").slice(0, 4)
      },
      phase3: {
        title: "Phase 3: Strategic AI & Predictive Optimization",
        horizon: "6 – 12 Months",
        focus: "Targeted machine learning forecasting, contract intelligence, and grounded knowledge concierges.",
        opportunities: evaluatedOpportunities.filter(o => o.aiNecessity === "Yes").slice(0, 3)
      },
      phase4: {
        title: "Phase 4: Advanced AI Transformation & Multi-System Agents",
        horizon: "12 – 24 Months",
        focus: "Autonomous multi-system dynamic exception resolution under strict human review boundaries.",
        opportunities: evaluatedOpportunities.filter(o => o.recommendedSolutionType.includes("Agentic")).slice(0, 2)
      }
    };

    // Database Persistence
    const assessmentId = `asm_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const orgName = organization.name || 'Enterprise Assessment';
    const execSummary = `Evaluated ${totalOpportunities} candidate opportunities across ${departments.join(', ')}. Identified ${automationCount} deterministic automation wins and ${aiCount + hybridCount} targeted AI/hybrid cases with a 3-year expected ROI of ${expectedRoi3Year}%.`;

    const saveTx = transaction(() => {
      run(`
        INSERT INTO assessments (
          id, organisation_id, user_id, draft_id, title, organisation_name,
          industry, company_size, departments_json, domains_json, existing_systems_json,
          raw_score, normalized_score, readiness_tier, executive_summary, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETED', datetime('now'), datetime('now'))
      `, [
        assessmentId,
        orgId,
        userId,
        draftId,
        `${orgName} Opportunity Assessment`,
        orgName,
        organization.industry || 'General Enterprise',
        organization.companySize || 'Enterprise (5,000+ employees)',
        JSON.stringify(departments),
        JSON.stringify(domains),
        JSON.stringify(existingSystems),
        totalGrossBenefitUSD,
        82.5,
        'High Readiness',
        execSummary
      ]);

      // Save top recommendations
      const insertRec = db.prepare(`
        INSERT INTO assessment_recommendations (
          id, assessment_id, use_case_id, rank_order, solution_level, recommended_tier,
          necessity_gate_passed, necessity_rationale, strategic_fit_score, feasibility_score,
          risk_score, composite_score, estimated_capex, estimated_opex, estimated_payback_months, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);

      let rank = 1;
      for (const o of evaluatedOpportunities.slice(0, 15)) {
        insertRec.run(
          `rec_${assessmentId}_${rank}`,
          assessmentId,
          o.id,
          rank,
          o.solutionLevel || 4,
          o.recommendedTier || 'Standard Automation',
          o.aiNecessity === 'Yes' ? 1 : 0,
          o.whyNotAi || (o.gateResult ? o.gateResult.recommendation : 'Deterministic automation primary'),
          o.businessValueScore || 80,
          o.technicalFeasibilityScore || 85,
          o.riskScore || 20,
          o.overallScore || 82,
          o.metrics?.totalOneTimeInvestmentUSD || o.oneTimeCostEstimateUSD || 30000,
          o.metrics?.annualRecurringCostUSD || o.annualRecurringCostUSD || 6000,
          o.metrics?.paybackPeriodMonths || 4.2
        );
        rank++;
      }

      // Save 3-Scenario ROI Projections
      const insertRoi = db.prepare(`
        INSERT INTO assessment_roi_projections (
          id, assessment_id, scenario, implementation_cost, annual_opex,
          annual_labor_savings, annual_error_reduction_value, annual_revenue_gain,
          annual_net_benefit, payback_months, three_year_roi_percent, assumptions_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);

      const topCase = evaluatedOpportunities[0];
      const scenarios = topCase?.scenarios || {
        conservative: { totalOneTimeCostUSD: totalInvestmentUSD * 1.2, netAnnualBenefitUSD: netAnnualBenefitUSD * 0.7, paybackPeriodMonths: expectedPaybackMonths * 1.4, roi3YearPercent: expectedRoi3Year * 0.65 },
        expected: { totalOneTimeCostUSD: totalInvestmentUSD, netAnnualBenefitUSD: netAnnualBenefitUSD, paybackPeriodMonths: expectedPaybackMonths, roi3YearPercent: expectedRoi3Year },
        optimistic: { totalOneTimeCostUSD: totalInvestmentUSD * 0.85, netAnnualBenefitUSD: netAnnualBenefitUSD * 1.35, paybackPeriodMonths: expectedPaybackMonths * 0.7, roi3YearPercent: expectedRoi3Year * 1.5 }
      };

      const consCost = scenarios.conservative?.totalOneTimeCostUSD || scenarios.conservative?.totalOneTimeInvestmentUSD || (totalInvestmentUSD * 1.2) || 25000;
      const consNet = scenarios.conservative?.netAnnualBenefitUSD || (netAnnualBenefitUSD * 0.7) || 20000;
      const consPayback = scenarios.conservative?.paybackPeriodMonths || (expectedPaybackMonths * 1.4) || 6.5;
      const consRoi = scenarios.conservative?.roi3YearPercent || (expectedRoi3Year * 0.65) || 120;

      const expCost = scenarios.expected?.totalOneTimeCostUSD || scenarios.expected?.totalOneTimeInvestmentUSD || totalInvestmentUSD || 20000;
      const expNet = scenarios.expected?.netAnnualBenefitUSD || netAnnualBenefitUSD || 35000;
      const expPayback = scenarios.expected?.paybackPeriodMonths || expectedPaybackMonths || 4.2;
      const expRoi = scenarios.expected?.roi3YearPercent || expectedRoi3Year || 240;

      const optCost = scenarios.optimistic?.totalOneTimeCostUSD || scenarios.optimistic?.totalOneTimeInvestmentUSD || (totalInvestmentUSD * 0.85) || 16000;
      const optNet = scenarios.optimistic?.netAnnualBenefitUSD || (netAnnualBenefitUSD * 1.35) || 50000;
      const optPayback = scenarios.optimistic?.paybackPeriodMonths || (expectedPaybackMonths * 0.7) || 2.8;
      const optRoi = scenarios.optimistic?.roi3YearPercent || (expectedRoi3Year * 1.5) || 380;

      insertRoi.run(
        `roi_${assessmentId}_c`, assessmentId, 'Conservative',
        consCost, 15000, consNet * 0.7, 5000, 0,
        consNet, consPayback, consRoi, JSON.stringify(topCase?.statedAssumptions || {})
      );
      insertRoi.run(
        `roi_${assessmentId}_e`, assessmentId, 'Expected',
        expCost, 12000, expNet, 10000, 0,
        expNet, expPayback, expRoi, JSON.stringify(topCase?.statedAssumptions || {})
      );
      insertRoi.run(
        `roi_${assessmentId}_o`, assessmentId, 'Optimistic',
        optCost, 10000, optNet * 1.35, 20000, 0,
        optNet, optPayback, optRoi, JSON.stringify(topCase?.statedAssumptions || {})
      );

      // If draft provided, mark completed
      if (draftId) {
        run(`UPDATE assessment_drafts SET status = 'COMPLETED', updated_at = datetime('now') WHERE id = ?`, [draftId]);
      }
    });

    saveTx();

    // Create Initial Report Snapshot
    const snapshot = await reportService.createReportSnapshot({
      assessmentId,
      organisationId: orgId,
      userId,
      format: 'PDF',
      title: `${orgName} Opportunity Assessment Deliverable`
    });

    const responsePayload = {
      assessmentId,
      reportSnapshotId: snapshot.reportId,
      snapshotHash: snapshot.contentHash,
      organization,
      summary: {
        totalOpportunities,
        highPriorityCount,
        automationCount,
        aiCount,
        hybridCount,
        totalInvestmentUSD: Math.round(totalInvestmentUSD),
        totalGrossBenefitUSD: Math.round(totalGrossBenefitUSD),
        netAnnualBenefitUSD: Math.round(netAnnualBenefitUSD),
        expectedPaybackMonths,
        expectedRoi3Year
      },
      topOpportunities: evaluatedOpportunities.slice(0, 5),
      opportunities: evaluatedOpportunities,
      matrixPoints,
      roadmap,
      evaluatedAt: new Date().toISOString()
    };

    res.json(responsePayload);
  } catch (err) {
    console.error("[AssessmentRoutes] Evaluation error:", err);
    res.status(500).json({ error: "Failed to process assessment evaluation", details: err.message });
  }
});

// 8. Assessment History & Reporting
router.get('/assessments', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const list = query(`
      SELECT id, title, organisation_name, industry, company_size, raw_score, normalized_score,
             readiness_tier, executive_summary, status, created_at
      FROM assessments
      WHERE organisation_id = ?
      ORDER BY created_at DESC
    `, [orgId]);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/assessments/:id', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const assessment = get(`
      SELECT * FROM assessments WHERE id = ? AND organisation_id = ?
    `, [req.params.id, orgId]);

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const recommendations = query(`
      SELECT ar.*, uc.name as use_case_name, uc.department, uc.domain, uc.problem_statement
      FROM assessment_recommendations ar
      JOIN use_cases uc ON ar.use_case_id = uc.id
      WHERE ar.assessment_id = ?
      ORDER BY ar.rank_order ASC
    `, [req.params.id]);

    const roiProjections = query(`
      SELECT * FROM assessment_roi_projections WHERE assessment_id = ?
    `, [req.params.id]).map(r => ({ ...r, assumptions: JSON.parse(r.assumptions_json || '{}') }));

    res.json({
      ...assessment,
      departments: JSON.parse(assessment.departments_json || '[]'),
      domains: JSON.parse(assessment.domains_json || '[]'),
      existingSystems: JSON.parse(assessment.existing_systems_json || '[]'),
      recommendations,
      roiProjections
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Sample Report
router.get('/reports/sample', (req, res) => {
  const useCases = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
  const sampleData = {
    organization: {
      name: "Global Industrial Logistics Corp",
      industry: "Manufacturing & Logistics",
      employeeCount: "12,500",
      operatingCountries: "United States, Germany, Japan, Singapore"
    },
    summary: {
      totalOpportunities: 8,
      highPriorityCount: 5,
      automationCount: 5,
      aiCount: 1,
      hybridCount: 2,
      totalInvestmentUSD: 365000,
      totalGrossBenefitUSD: 1680000,
      netAnnualBenefitUSD: 1420000,
      expectedPaybackMonths: 3.1,
      expectedRoi3Year: 1067
    },
    opportunities: useCases.slice(0, 8)
  };
  const html = pdfAdapter.generateExecutiveReportHtml(sampleData);
  res.send(html);
});

// 10. Executive Report Preview & PDF Generator
router.post('/reports/generate', (req, res) => {
  try {
    const reportData = req.body;
    const html = pdfAdapter.generateExecutiveReportHtml(reportData);
    res.send(html);
  } catch {
    res.status(500).send("Failed to generate report");
  }
});

// 11. Immutable Report Snapshot Endpoints
router.get('/reports', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const reports = reportService.listReports(orgId);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reports/:id', optionalAuth, (req, res) => {
  try {
    const orgId = req.organisationId || 'org_acme_global';
    const report = reportService.getReportSnapshot(req.params.id, orgId);
    if (!report) {
      return res.status(404).json({ error: 'Report snapshot not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
