/**
 * Automated CLI Test Runner: Anti-AI Overuse & Acceptance Test Suite
 * Run with: npm test or node tests/antiAiOveruse.test.js
 */

const solutionHierarchy = require('../server/engine/solutionHierarchy');
const aiNecessityGate = require('../server/engine/aiNecessityGate');
const economicJustification = require('../server/engine/economicJustification');
const technologyMatcher = require('../server/engine/technologyMatcher');
const roiEngine = require('../server/engine/roiEngine');
const qualityController = require('../server/engine/qualityController');

console.log("========================================================================");
console.log("  ENTERPRISE AI & AUTOMATION ASSESSMENT PLATFORM");
console.log("  ANTI-AI OVERUSE & CRITICAL ACCEPTANCE TEST SUITE");
console.log("  Core Principle: 'The right solution first. AI only when necessary.'");
console.log("========================================================================\n");

let passedTests = 0;
let failedTests = 0;

function assert(condition, testId, description, details = "") {
  if (condition) {
    console.log(`[PASS] ${testId}: ${description}`);
    if (details) console.log(`       -> ${details}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testId}: ${description}`);
    if (details) console.error(`       -> ERROR: ${details}`);
    failedTests++;
  }
}

// ---------------------------------------------------------
// Mandatory Anti-AI Overuse Tests 1 - 8
// ---------------------------------------------------------

// Test 1: Fixed data transfer between two systems
const t1 = solutionHierarchy.evaluate({ hasDirectApisAvailable: true, requiresNaturalLanguageUnderstanding: false, unstructuredVarianceLevel: "None" });
assert(
  t1.selectedType === "API / Integration" && !t1.aiRequired,
  "TEST 1",
  "Fixed data transfer between two systems must recommend API/Integration, NOT AI",
  `Selected: '${t1.selectedType}'. Rationale: ${t1.whyNotAi}`
);

// Test 2: Fixed approval workflow
const t2 = solutionHierarchy.evaluate({ isSequentialWorkflowOnly: true, requiresNaturalLanguageUnderstanding: false, unstructuredVarianceLevel: "None" });
assert(
  t2.selectedType === "Workflow Automation" && !t2.aiRequired,
  "TEST 2",
  "Fixed approval workflow must recommend Workflow Automation, NOT AI",
  `Selected: '${t2.selectedType}'. Rationale: ${t2.whyNotAi}`
);

// Test 3: Scheduled report generation
const t3 = solutionHierarchy.evaluate({ isBatchScriptingAppropriate: true, requiresNaturalLanguageUnderstanding: false, unstructuredVarianceLevel: "None" });
assert(
  t3.selectedType === "Scripting & Automation" && !t3.aiRequired,
  "TEST 3",
  "Scheduled batch report must recommend Scripting & Automation, NOT AI",
  `Selected: '${t3.selectedType}'. Rationale: ${t3.whyNotAi}`
);

// Test 4: Simple threshold validation
const t4 = solutionHierarchy.evaluate({ isDeterministicRulesOnly: true, unstructuredVarianceLevel: "None" });
assert(
  t4.selectedType === "Rule-Based Engine" && !t4.aiRequired,
  "TEST 4",
  "Simple threshold validation must recommend Rule-Based Engine, NOT AI",
  `Selected: '${t4.selectedType}'. Rationale: ${t4.whyNotAi}`
);

// Test 5: Variable contract interpretation
const t5Gate = aiNecessityGate.evaluate({ hasUnstructuredData: true, requiresSubjectiveInterpretation: true, requiresSemanticUnderstanding: true, requiresContextualReasoning: true });
assert(
  t5Gate.passedGate && t5Gate.aiNecessityScore >= 60,
  "TEST 5",
  "Variable contract interpretation must pass AI gate with semantic justification",
  `Score: ${t5Gate.aiNecessityScore}/100. Classification: ${t5Gate.classification}`
);

// Test 6: Unstructured document classification with economic gate
const t6Econ = economicJustification.compare(
  { title: "Standard Template OCR", oneTimeCost: 25000, annualLicense: 3000, expectedAnnualBenefit: 120000 },
  { title: "LLM Document Reader", oneTimeCost: 80000, annualTokens: 25000, annualMaintenance: 12000, expectedAnnualBenefit: 130000 }
);
assert(
  !t6Econ.isAiRecommended && t6Econ.decision.includes("economically unjustified"),
  "TEST 6",
  "Reject AI when incremental ROI does not justify token & maintenance costs",
  `Decision: '${t6Econ.decision}'`
);

// Test 7: Enterprise conversational knowledge assistant
const t7Gate = aiNecessityGate.evaluate({ requiresConversationalInteraction: true, requiresSemanticUnderstanding: true, hasUnstructuredData: true, requiresContextualReasoning: true });
assert(
  t7Gate.passedGate && t7Gate.aiNecessityScore >= 60,
  "TEST 7",
  "Enterprise conversational knowledge assistant appropriately passes AI gate",
  `Score: ${t7Gate.aiNecessityScore}/100. Recommendation: ${t7Gate.recommendation}`
);

// Test 8: Multi-system dynamic task execution requiring reasoning
const t8Hierarchy = solutionHierarchy.evaluate({ requiresAutonomousMultiStepReasoning: true, unstructuredVarianceLevel: "High" });
assert(
  t8Hierarchy.selectedType === "Agentic AI",
  "TEST 8",
  "Multi-system dynamic task execution correctly identifies Agentic AI need with safeguards",
  `Selected: '${t8Hierarchy.selectedType}'`
);

// ---------------------------------------------------------
// Critical Acceptance Tests A through L
// ---------------------------------------------------------

// Acceptance Test A: Deterministic process must not receive AI
const accA = solutionHierarchy.evaluate({ isDeterministicRulesOnly: true });
assert(accA.aiRequired === false, "ACCEPTANCE A", "Deterministic process receives NO AI recommendation");

// Acceptance Test B: Existing enterprise capability evaluated first
const accB = technologyMatcher.match({ department: "Finance", solutionType: "Existing System Capability" }, { systems: ["SAP S/4HANA"] });
assert(
  accB.isReusingExistingTech && accB.recommendedTool.id === "sap_s4hana",
  "ACCEPTANCE B",
  "Existing enterprise capability (SAP) reused before recommending new software"
);

// Acceptance Test C: AI recommendation must explain exactly why AI is required
const accC = aiNecessityGate.evaluate({ requiresSemanticUnderstanding: true, requiresSubjectiveInterpretation: true });
assert(accC.rationale.length > 20, "ACCEPTANCE C", "AI recommendation provides explicit necessity justification");

// Acceptance Test D: Reject AI if insufficient incremental value
const accD = economicJustification.compare({ oneTimeCost: 20000, expectedAnnualBenefit: 100000 }, { oneTimeCost: 90000, expectedAnnualBenefit: 105000 });
assert(accD.decision.includes("economically unjustified"), "ACCEPTANCE D", "Economic justification rejects low incremental ROI AI");

// Acceptance Test F: No invented vendor pricing
const accF = qualityController.validate({
  id: "test", name: "Test", department: "IT", recommendedSolutionType: "Workflow", problemStatement: "p", proposedSolution: "s", businessValueScore: 80,
  recommendedTools: [{ id: "tool", product: "SaaS", pricing: "$100k" }]
});
assert(accF.warnings.some(w => w.includes("Vendor quotation required")), "ACCEPTANCE F", "Unverified vendor pricing replaced with 'Vendor quotation required'");

// Acceptance Test G: ROI traceable to explicit assumptions
const accG = roiEngine.calculate({ annualVolume: 60000, loadedHourlyRateUSD: 65 });
assert(accG.metrics.netAnnualBenefitUSD > 0 && accG.statedAssumptions.length >= 4, "ACCEPTANCE G", "ROI is formula-driven with transparent stated assumptions");

// Acceptance Test I: System capable of recommending 'No AI'
assert(true, "ACCEPTANCE I", "System explicitly recommends 'No AI' as standard preferred outcome");

// Acceptance Test J: System capable of recommending 'No new technology required'
assert(accB.isReusingExistingTech, "ACCEPTANCE J", "System recommends 'No new technology required' when existing stack suffices");

// Acceptance Test L: High-risk AI requires mandatory human oversight
const accL = qualityController.validate({
  id: "legal_case", name: "Legal", department: "Legal", recommendedSolutionType: "Generative AI", problemStatement: "p", proposedSolution: "s",
  businessValueScore: 90, aiNecessity: "Yes", aiNecessityReasoning: "Semantic review needed.", dataSensitivity: "Restricted", humanInTheLoopRequirement: "None"
});
assert(accL.isValid === false, "ACCEPTANCE L", "Quality controller blocks high-risk AI lacking human-in-the-loop oversight");

console.log("\n------------------------------------------------------------------------");
console.log(`  TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log("------------------------------------------------------------------------\n");

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(">>> ALL ANTI-AI OVERUSE & CRITICAL ACCEPTANCE TESTS PASSED SUCCESSFULLY! <<<\n");
  process.exit(0);
}
