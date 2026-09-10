/**
 * AI Necessity Gate Engine
 * Evaluates the 8 non-negotiable criteria before any AI recommendation can be permitted.
 * 
 * Criteria (Normalized to 100%):
 * A. Unstructured Information (15%)
 * B. Interpretation (15%)
 * C. Prediction (15%)
 * D. Semantic Understanding (15%)
 * E. Contextual Reasoning (15%)
 * F. Natural-Language Interaction (15%)
 * G. Dynamic Decision-Making (10%)
 * H. Multi-Step Autonomous Execution (10%)
 * 
 * Thresholds:
 * 0 - 20: AI Not Required
 * 21 - 40: AI Potentially Applicable (Requires Strict Economic Justification)
 * 41 - 60: AI May Provide Meaningful Benefit
 * 61 - 80: AI Recommended where Implementation Economics Support It
 * 81 - 100: AI / Agentic Approach Strongly Justified
 */

class AiNecessityGateEngine {
  constructor() {
    this.criteriaKeys = [
      { id: "A", name: "Unstructured Information", weight: 15 },
      { id: "B", name: "Interpretation", weight: 15 },
      { id: "C", name: "Prediction", weight: 15 },
      { id: "D", name: "Semantic Understanding", weight: 15 },
      { id: "E", name: "Contextual Reasoning", weight: 15 },
      { id: "F", name: "Natural-Language Interaction", weight: 15 },
      { id: "G", name: "Dynamic Decision-Making", weight: 10 },
      { id: "H", name: "Multi-Step Autonomous Execution", weight: 10 }
    ];
  }

  /**
   * Evaluates criteria against the process requirements
   * @param {Object} inputFlags Boolean criteria flags
   * @returns {Object} Evaluation report with score, pass/fail status, and explanation
   */
  evaluate(inputFlags = {}) {
    const checks = {
      A: Boolean(inputFlags.hasUnstructuredData || inputFlags.hasVariableLayouts || inputFlags.hasImagesOrAudio),
      B: Boolean(inputFlags.requiresSubjectiveInterpretation || inputFlags.isNonDeterministic),
      C: Boolean(inputFlags.requiresPredictiveModeling || inputFlags.requiresForecasting),
      D: Boolean(inputFlags.requiresSemanticUnderstanding || inputFlags.hasSynonymVariability),
      E: Boolean(inputFlags.requiresContextualReasoning || inputFlags.hasAmbiguousRules),
      F: Boolean(inputFlags.requiresConversationalInteraction || inputFlags.requiresNaturalLanguageGeneration),
      G: Boolean(inputFlags.requiresDynamicActionSelection),
      H: Boolean(inputFlags.requiresMultiStepAgenticPlanning)
    };

    let matchedScore = 0;
    const satisfiedCriteria = [];
    const missingCriteria = [];

    this.criteriaKeys.forEach(criterion => {
      if (checks[criterion.id]) {
        matchedScore += criterion.weight;
        satisfiedCriteria.push(criterion.name);
      } else {
        missingCriteria.push(criterion.name);
      }
    });

    let classification = "AI Not Required";
    let passedGate = false;
    let recommendation = "Reject AI";
    let rationale = "";

    if (matchedScore <= 20) {
      classification = "AI Not Required";
      passedGate = false;
      recommendation = "Reject AI - Standard Automation / Workflow / API Required";
      rationale = "The business process is deterministic, structured, and rule-governed. None of the core AI criteria (unstructured data, probabilistic interpretation, semantic reasoning) are present. Recommending AI would increase cost, latency, and compliance risk without providing incremental business value.";
    } else if (matchedScore <= 40) {
      classification = "AI Potentially Applicable but Requires Strict Economic Justification";
      passedGate = false;
      recommendation = "Evaluate Simpler Option First";
      rationale = "Minor unstructured components exist, but simpler deterministic preprocessing or standardized form templates could eliminate the need for AI. AI should only be introduced if incremental benefits exceed additional model operating costs.";
    } else if (matchedScore <= 60) {
      classification = "AI May Provide Meaningful Benefit";
      passedGate = true;
      recommendation = "AI-Assisted Hybrid Solution";
      rationale = "The process contains genuine unstructured or semantic interpretation requirements. A hybrid solution (AI handles extraction/interpretation; deterministic workflow handles business logic) is technically justified.";
    } else if (matchedScore <= 80) {
      classification = "AI Recommended where Implementation Economics Support It";
      passedGate = true;
      recommendation = "AI Solution Justified";
      rationale = "High degree of semantic variability, natural language understanding, or predictive requirements cannot be reliably codified through deterministic rules. AI is required to achieve the business outcome.";
    } else {
      classification = "AI / Agentic Approach Strongly Justified";
      passedGate = true;
      recommendation = "Advanced AI / Agentic Solution";
      rationale = "The problem exhibits complex multi-step reasoning, contextual language interaction, dynamic decisioning, and non-deterministic inputs. An advanced AI or supervised agentic approach is strongly justified.";
    }

    return {
      passedGate,
      aiNecessityScore: matchedScore,
      classification,
      recommendation,
      rationale,
      satisfiedCriteria,
      missingCriteria,
      detailedChecks: checks
    };
  }
}

module.exports = new AiNecessityGateEngine();
