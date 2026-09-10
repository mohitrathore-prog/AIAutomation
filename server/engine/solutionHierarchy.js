/**
 * Solution-Selection Hierarchy Engine
 * Implements the fundamental 14-level decision framework:
 * 
 * BUSINESS PROBLEM
 *       ↓
 * Can the process be eliminated?
 *       ↓
 * Can the process be simplified?
 *       ↓
 * Can existing application functionality solve it?
 *       ↓
 * Can configuration solve it?
 *       ↓
 * Can rules solve it?
 *       ↓
 * Can workflow solve it?
 *       ↓
 * Can an existing API/integration solve it?
 *       ↓
 * Can scripting solve it?
 *       ↓
 * Can RPA solve it?
 *       ↓
 * Is machine learning required?
 *       ↓
 * Is generative AI genuinely required?
 *       ↓
 * Is AI-enabled automation genuinely required?
 *       ↓
 * Is agentic AI genuinely required?
 *       ↓
 * Only then recommend the applicable technology
 */

class SolutionHierarchyEngine {
  constructor() {
    this.hierarchy = [
      { level: 1, type: "Process Elimination", description: "Eliminate unnecessary steps, legacy approvals, or redundant tasks entirely." },
      { level: 2, type: "Process Simplification", description: "Standardize inputs, remove bottlenecks, and streamline handoffs." },
      { level: 3, type: "Existing System Capability", description: "Activate native features already built into existing ERP, CRM, HCM, or ITSM platforms." },
      { level: 4, type: "Configuration", description: "Configure existing platform settings, user parameters, and field defaults without custom code." },
      { level: 5, type: "Rule-Based Engine", description: "Apply deterministic Boolean rules, thresholds, lookup tables, and conditional routing." },
      { level: 6, type: "Workflow Automation", description: "Automate state transitions, approvals, and notifications through structured workflow engines." },
      { level: 7, type: "API / Integration", description: "Connect systems directly via REST, SOAP, or event webhooks with zero human re-keying." },
      { level: 8, type: "Scripting & Automation", description: "Scheduled batch scripts, database jobs, and serverless functions (Python, PowerShell, Bash, SQL)." },
      { level: 9, type: "RPA", description: "UI automation for air-gapped legacy applications, terminal mainframes, or web portals lacking modern APIs." },
      { level: 10, type: "Machine Learning", description: "Statistical predictive modeling, time-series forecasting, regression, classification, or clustering." },
      { level: 11, type: "Generative AI", description: "Natural language generation, semantic document summarization, conversational RAG, or code synthesis." },
      { level: 12, type: "AI-Assisted Automation", description: "Hybrid pipeline: AI/ML handles unstructured extraction/classification; deterministic workflow executes business logic." },
      { level: 13, type: "Agentic AI", description: "Autonomous multi-step reasoning agents dynamically selecting tools and resolving exceptions under strict human supervision." }
    ];
  }

  /**
   * Evaluates problem characteristics and returns the simplest viable solution level
   * @param {Object} context Problem characteristics
   * @returns {Object} Selected hierarchy level, rationale, and rejected alternatives
   */
  evaluate(context = {}) {
    const {
      isProcessRedundant = false,
      canBeStandardized = false,
      hasExistingSoftwareFeature = false,
      isConfigurableOnly = false,
      isDeterministicRulesOnly = false,
      isSequentialWorkflowOnly = false,
      hasDirectApisAvailable = false,
      isBatchScriptingAppropriate = false,
      isLegacyNoApi = false,
      requiresStatisticalPrediction = false,
      requiresNaturalLanguageUnderstanding = false,
      requiresSemiStructuredExtraction = false,
      requiresAutonomousMultiStepReasoning = false,
      unstructuredVarianceLevel = "None" // None, Low, Medium, High
    } = context;

    const alternativesConsidered = [];

    // Level 1: Elimination
    if (isProcessRedundant) {
      return {
        level: 1,
        selectedType: "Process Elimination",
        rationale: "The business process is redundant, duplicative, or adds no demonstrable business value. Eliminating the process achieves 100% cost reduction with zero technology investment.",
        aiRequired: false,
        whyNotAi: "Redundant processes must be eliminated, not automated with AI. Automating waste with AI merely creates expensive automated waste.",
        alternativesConsidered: ["Workflow Automation", "Generative AI"],
        whyAlternativesRejected: "Automating an unnecessary process creates technical debt and ongoing operational costs."
      };
    }

    // Level 2: Simplification
    if (canBeStandardized && isDeterministicRulesOnly && unstructuredVarianceLevel === "None") {
      alternativesConsidered.push({ type: "Generative AI", reason: "Standardizing form fields eliminates input ambiguity; AI is unnecessary." });
    }

    // Level 3 & 4: Existing System Capability / Configuration
    if (hasExistingSoftwareFeature || isConfigurableOnly) {
      return {
        level: hasExistingSoftwareFeature ? 3 : 4,
        selectedType: hasExistingSoftwareFeature ? "Existing System Capability" : "Configuration",
        rationale: "The existing core enterprise system already includes native functionality to address this requirement. Configuring native capabilities avoids procuring overlapping software.",
        aiRequired: false,
        whyNotAi: "Existing software capabilities already satisfy the requirement natively. Introducing an external AI layer increases integration complexity, security review overhead, and license costs.",
        alternativesConsidered: ["Third-Party AI Tool", "Custom RPA Bot", "Generative AI"],
        whyAlternativesRejected: "Existing software functionality is already licensed and supported by vendor maintenance agreements."
      };
    }

    // Level 5: Rule-Based Engine
    if (isDeterministicRulesOnly && unstructuredVarianceLevel === "None") {
      return {
        level: 5,
        selectedType: "Rule-Based Engine",
        rationale: "The decision logic is 100% deterministic (exact thresholds, Boolean criteria, and mathematical comparisons). Standard rule engines guarantee 100% consistency with zero inference latency.",
        aiRequired: false,
        whyNotAi: "Rules are deterministic, predictable, and fully auditable. AI models are probabilistic and risk hallucinations or unexpected behavior on mathematical and compliance thresholds.",
        alternativesConsidered: ["Machine Learning Model", "Generative AI Classifier"],
        whyAlternativesRejected: "Deterministic rules provide 100% accuracy at zero runtime token cost; probabilistic AI introduces unnecessary error risk."
      };
    }

    // Level 6: Workflow Automation
    if (isSequentialWorkflowOnly && !requiresNaturalLanguageUnderstanding && unstructuredVarianceLevel === "None") {
      return {
        level: 6,
        selectedType: "Workflow Automation",
        rationale: "The requirement consists of sequential approval stages, task handoffs, and notification triggers across known stakeholders. Standard enterprise workflow engines manage this natively.",
        aiRequired: false,
        whyNotAi: "Standard approval chains and task sequencing require deterministic state management, not probabilistic language models.",
        alternativesConsidered: ["Autonomous AI Agent", "Generative AI Assistant"],
        whyAlternativesRejected: "Standard workflow engines provide reliable SLA countdowns, audit trails, and deterministic routing at lower cost."
      };
    }

    // Level 7: API / Integration
    if (hasDirectApisAvailable && !requiresStatisticalPrediction && !requiresNaturalLanguageUnderstanding) {
      return {
        level: 7,
        selectedType: "API / Integration",
        rationale: "Both source and destination systems expose documented REST/SOAP/GraphQL APIs. Direct API integration transfers structured data instantaneously with complete data integrity.",
        aiRequired: false,
        whyNotAi: "Data mapping between structured database schemas is a deterministic technical integration problem. AI should not be placed between two deterministic APIs.",
        alternativesConsidered: ["RPA Screen Scraping", "Generative AI Data Parser"],
        whyAlternativesRejected: "Direct API integration has 10x higher throughput, lower latency, and does not break when user interfaces change."
      };
    }

    // Level 8: Scripting & Automation
    if (isBatchScriptingAppropriate && !requiresNaturalLanguageUnderstanding) {
      return {
        level: 8,
        selectedType: "Scripting & Automation",
        rationale: "Scheduled batch jobs, file system archiving, and database synchronization are best addressed by lightweight, maintainable serverless scripts (Python, PowerShell, SQL).",
        aiRequired: false,
        whyNotAi: "Deterministic batch scripts run reliably on standard infrastructure for pennies per month with zero AI model maintenance.",
        alternativesConsidered: ["Enterprise AI Platform", "Commercial RPA Suite"],
        whyAlternativesRejected: "Serverless scripts require zero commercial platform licensing and have minimal operational overhead."
      };
    }

    // Level 9: RPA
    if (isLegacyNoApi && !requiresNaturalLanguageUnderstanding && unstructuredVarianceLevel === "None") {
      return {
        level: 9,
        selectedType: "RPA",
        rationale: "Target legacy application (e.g. terminal emulator or green-screen mainframe) lacks modern APIs. RPA provides deterministic surface UI automation to bridge the gap.",
        aiRequired: false,
        whyNotAi: "Input data is structured and fields are fixed. Surface keystrokes and selectors handle the automation without machine learning.",
        alternativesConsidered: ["Generative AI Agent", "Full Core System Replacement"],
        whyAlternativesRejected: "Core system replacement is cost-prohibitive in the near term; generative AI cannot reliably interact with legacy 3270 terminal sessions."
      };
    }

    // Level 10: Machine Learning
    if (requiresStatisticalPrediction && !requiresNaturalLanguageUnderstanding) {
      return {
        level: 10,
        selectedType: "Machine Learning",
        rationale: "Problem involves multi-variate statistical forecasting, regression, anomaly detection, or numerical propensity scoring from high-dimensional tabular data.",
        aiRequired: true,
        aiNecessityReasoning: "Traditional deterministic rules cannot capture complex non-linear patterns across hundreds of continuous numerical variables. Supervised/unsupervised ML is mathematically required.",
        alternativesConsidered: ["Static Business Threshold Rules", "Generative AI LLM"],
        whyAlternativesRejected: "Static rules fail to adapt to complex seasonal trends. Generative LLMs are inefficient and inaccurate for numerical regression and tabular time-series math."
      };
    }

    // Level 12: AI-Assisted Automation (Hybrid)
    if (requiresSemiStructuredExtraction && (unstructuredVarianceLevel === "Medium" || unstructuredVarianceLevel === "High")) {
      return {
        level: 12,
        selectedType: "AI-Assisted Automation",
        rationale: "Hybrid solution: Document Intelligence / Vision AI extracts variable semi-structured data into structured JSON, then deterministic enterprise workflow executes business logic.",
        aiRequired: true,
        aiNecessityReasoning: "Visual and layout variance across thousands of external suppliers/customers prevents brittle regex coordinate templates; machine learning document models are genuinely required for extraction.",
        alternativesConsidered: ["Pure Generative AI", "Legacy Coordinate OCR", "Manual Re-keying"],
        whyAlternativesRejected: "Pure GenAI LLM token costs are excessive for high-volume PDFs ($0.08/page) and risk hallucinating decimal totals. Pre-trained Document AI provides bounded table extraction with confidence scores."
      };
    }

    // Level 11: Generative AI
    if (requiresNaturalLanguageUnderstanding && !requiresAutonomousMultiStepReasoning) {
      return {
        level: 11,
        selectedType: "Generative AI",
        rationale: "Process requires semantic natural language comprehension, contextual summarization, text synthesis, or conversational information retrieval across unstructured documents.",
        aiRequired: true,
        aiNecessityReasoning: "Variable natural language phrasing, contextual nuance, and semantic interpretation cannot be codified with deterministic keywords or regex.",
        alternativesConsidered: ["Keyword Search / ElasticSearch", "Static Decision Tree Chatbot", "Manual Professional Labor"],
        whyAlternativesRejected: "Keyword search fails on synonyms and context; decision trees break on conversational nuance; manual labor is cost-prohibitive for large text volumes."
      };
    }

    // Level 13: Agentic AI
    if (requiresAutonomousMultiStepReasoning) {
      return {
        level: 13,
        selectedType: "Agentic AI",
        rationale: "Problem requires dynamic multi-step decision-making, contextual task planning, and autonomous coordination across multiple disparate enterprise systems under strict human-in-the-loop guardrails.",
        aiRequired: true,
        aiNecessityReasoning: "The execution pathway cannot be pre-programmed in advance; the system must observe intermediate state, plan dynamic tool invocations, and evaluate contextual outcomes.",
        alternativesConsidered: ["Rigid Pre-Programmed Workflows", "Standalone Generative AI Copilot", "Human Operations Team"],
        whyAlternativesRejected: "Rigid workflows cannot handle dynamic multi-system exceptions. Standalone copilots require human re-execution of each step."
      };
    }

    // Default Fallback: Process Improvement
    return {
      level: 2,
      selectedType: "Process Improvement",
      rationale: "Standardize inputs and streamline operational handoffs before applying technology.",
      aiRequired: false,
      whyNotAi: "Technology should never be applied to unstandardized, chaotic processes. Process discipline precedes automation.",
      alternativesConsidered: ["AI Automation"],
      whyAlternativesRejected: "Automating an undisciplined process magnifies operational errors."
    };
  }
}

module.exports = new SolutionHierarchyEngine();
