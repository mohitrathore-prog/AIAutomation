/**
 * Assessment API Routes
 * Handles questionnaire navigation, live research, recommendation pipeline, and reports.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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
const authAdapter = require('../adapters/authAdapter');

// Load Data
const dataDir = path.join(__dirname, '../data');
const industries = JSON.parse(fs.readFileSync(path.join(dataDir, 'industryTaxonomy.json'), 'utf8'));
const technologies = JSON.parse(fs.readFileSync(path.join(dataDir, 'technologyCatalogue.json'), 'utf8'));
const questions = JSON.parse(fs.readFileSync(path.join(dataDir, 'questionsCatalogue.json'), 'utf8'));
const useCases = JSON.parse(fs.readFileSync(path.join(dataDir, 'useCasesLibrary.json'), 'utf8'));
const researchEvidence = JSON.parse(fs.readFileSync(path.join(dataDir, 'researchEvidence.json'), 'utf8'));

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

// 2. Technology Catalogue
router.get('/technologies', (req, res) => {
  res.json(technologies);
});

// 3. Dynamic Questions
router.get('/questions', (req, res) => {
  const { department, domain } = req.query;
  let filtered = questions;
  if (department) {
    filtered = filtered.filter(q => q.department.toLowerCase() === department.toLowerCase());
  }
  if (domain) {
    filtered = filtered.filter(q => q.domain.toLowerCase().includes(domain.toLowerCase()));
  }
  res.json(filtered);
});

// 4. Use Cases Library Search
router.get('/use-cases', (req, res) => {
  const { department, solutionType, search } = req.query;
  let filtered = useCases;
  if (department) {
    filtered = filtered.filter(u => u.department.toLowerCase() === department.toLowerCase());
  }
  if (solutionType) {
    filtered = filtered.filter(u => u.recommendedSolutionType.toLowerCase().includes(solutionType.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.problemStatement.toLowerCase().includes(s));
  }
  res.json(filtered);
});

// 5. Research Adapter Endpoint
router.post('/research', async (req, res) => {
  const { companyName, industry } = req.body;
  const research = await researchAdapter.researchCompany(companyName, industry);
  res.json(research);
});

// 6. Comprehensive Recommendation Pipeline
router.post('/evaluate', async (req, res) => {
  try {
    const {
      organization = {},
      departments = ["Finance", "IT"],
      domains = ["Accounts Payable", "Service Desk"],
      existingSystems = ["SAP S/4HANA", "ServiceNow", "Microsoft 365"],
      answers = {},
      customVolume = null
    } = req.body;

    // Filter candidate use cases for selected departments/domains
    const candidateCases = useCases.filter(uc => 
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
        requiresNaturalLanguageUnderstanding: uc.recommendedSolutionType.includes("Generative") || uc.subdomain.includes("Contract"),
        requiresAutonomousMultiStepReasoning: uc.recommendedSolutionType.includes("Agentic"),
        unstructuredVarianceLevel: uc.aiNecessity === "Yes" ? "High" : "None"
      };
      const hierarchyResult = solutionHierarchy.evaluate(hierarchyContext);

      // 2. AI Necessity Gate
      const gateContext = {
        hasUnstructuredData: uc.aiNecessity === "Yes" && !uc.recommendedSolutionType.includes("Machine Learning"),
        hasVariableLayouts: uc.name.toLowerCase().includes("invoice") || uc.name.toLowerCase().includes("document"),
        requiresSubjectiveInterpretation: uc.department === "Legal" || uc.subdomain.includes("Policy"),
        requiresPredictiveModeling: uc.recommendedSolutionType.includes("Machine Learning"),
        requiresSemanticUnderstanding: uc.department === "Legal" || uc.subdomain.includes("Search") || uc.subdomain.includes("Response"),
        requiresContextualReasoning: uc.department === "Legal" || uc.subdomain.includes("Review"),
        requiresConversationalInteraction: uc.subdomain.includes("Assistant") || uc.subdomain.includes("Chatbot") || uc.subdomain.includes("Concierge"),
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
        
        // Hierarchy & Gate overrides
        hierarchyResult,
        gateResult,
        economicResult,
        
        // Re-affirm why not AI if rejected
        whyNotAi: uc.aiNecessity === "No" ? uc.whyNotAi : null,
        
        // Technology Match
        matchedTechnology: techResult.recommendedTool,
        alternativeMatchedTechnologies: techResult.alternativeTools,
        isReusingExistingTechnology: techResult.isReusingExistingTech,
        technologyRationale: techResult.rationale,
        
        // ROI Metrics
        metrics: roiResult.metrics,
        scenarios: roiResult.scenarios,
        statedAssumptions: roiResult.statedAssumptions,
        roiDisclaimer: roiResult.disclaimer,

        // Rendered Visual Assets
        diagrams: {
          currentStateSvg,
          futureStateSvg
        },
        conceptualMockupHtml
      };

      // Quality Gate validation
      const validation = qualityController.validate(fullOpportunity);
      if (validation.isValid) {
        evaluatedOpportunities.push(fullOpportunity);
      }
    }

    // Sort opportunities by overall score descending
    evaluatedOpportunities.sort((a, b) => b.overallScore - a.overallScore);

    // Calculate Portfolio Summary Metrics
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

    // Build 2x2 Opportunity Matrix Points
    // X-Axis: Complexity (inverted so left is high complexity, right is low complexity / high readiness)
    // Y-Axis: Business Value (0 - 100)
    const matrixPoints = evaluatedOpportunities.map(o => ({
      id: o.id,
      name: o.name,
      department: o.department,
      solutionType: o.recommendedSolutionType,
      priority: o.priority,
      x: 100 - (o.scoreBreakdown?.complexityScore || 35), // Readiness / Ease of implementation
      y: o.businessValueScore,
      score: o.overallScore,
      netBenefitUSD: o.metrics?.netAnnualBenefitUSD || o.expectedAnnualSavingsUSD,
      aiNecessity: o.aiNecessity
    }));

    // Build Transformation Roadmap
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

    const responsePayload = {
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

// 7. Executive Report Preview & PDF Generator
router.post('/reports/generate', (req, res) => {
  try {
    const reportData = req.body;
    const html = pdfAdapter.generateExecutiveReportHtml(reportData);
    res.send(html);
  } catch (e) {
    res.status(500).send("Failed to generate report");
  }
});

// 8. Sample Report (Pre-configured demonstration showing Automation over AI where appropriate)
router.get('/reports/sample', (req, res) => {
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

module.exports = router;
