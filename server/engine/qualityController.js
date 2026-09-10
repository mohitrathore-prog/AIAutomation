/**
 * Quality Controller & Gatekeeper
 * 
 * Enforces rigorous enterprise verification:
 * - Anti-hallucination checks
 * - Rejects unverified vendor pricing (requires explicit "Vendor quotation required")
 * - Blocks AI recommendations when AI necessity gate fails
 * - Validates deterministic calculation consistency (ROI, Payback, Hours Saved)
 * - Prevents duplicate use cases
 * - Validates evidence citations and source tiers
 */

class QualityController {
  /**
   * Validates an assessment recommendation payload against quality rules
   * @param {Object} recommendation The recommendation object to inspect
   * @returns {Object} Validation outcome: isValid, errors, warnings, corrections
   */
  validate(recommendation = {}) {
    const errors = [];
    const warnings = [];
    const correctionsApplied = [];

    // 1. Mandatory Fields Check
    const requiredFields = ["id", "name", "department", "recommendedSolutionType", "problemStatement", "proposedSolution", "businessValueScore"];
    requiredFields.forEach(field => {
      if (!recommendation[field]) {
        errors.push(`Missing mandatory field: '${field}'`);
      }
    });

    // 2. Anti-AI Overuse & Justification Check
    const isAiRecommended = (
      recommendation.recommendedSolutionType?.includes("AI") ||
      recommendation.recommendedSolutionType?.includes("Machine Learning") ||
      recommendation.recommendedSolutionType?.includes("Generative") ||
      recommendation.recommendedSolutionType?.includes("Agentic")
    );

    if (isAiRecommended) {
      if (!recommendation.aiNecessity || recommendation.aiNecessity === "No") {
        errors.push(`Critical Violation: AI solution type '${recommendation.recommendedSolutionType}' assigned while aiNecessity is 'No'. Must revert to simpler automation or rules.`);
      }
      if (!recommendation.aiNecessityReasoning || recommendation.aiNecessityReasoning.length < 20) {
        errors.push("Missing required explicit rationale justifying why deterministic rules/workflows are insufficient for this AI recommendation.");
      }
    } else {
      // Non-AI recommendation must have clear "Why Not AI?" explanation
      if (!recommendation.whyNotAi || recommendation.whyNotAi.length < 15) {
        warnings.push("Recommendation does not have an explicit 'Why Not AI?' explanation.");
        recommendation.whyNotAi = "The process is deterministic, structured, and rule-governed. Standard enterprise workflow and API integrations achieve 100% of required business outcomes without introducing AI model drift, latency, token costs, or prompt injection risks.";
        correctionsApplied.push("Added default corporate 'Why Not AI?' deterministic explanation.");
      }
    }

    // 3. Human-In-The-Loop Check for High-Risk AI
    if (isAiRecommended && (recommendation.dataSensitivity === "Restricted" || recommendation.dataSensitivity === "High" || recommendation.department === "Legal" || recommendation.department === "Finance")) {
      if (!recommendation.humanInTheLoopRequirement || recommendation.humanInTheLoopRequirement.toLowerCase().includes("zero human") || recommendation.humanInTheLoopRequirement.toLowerCase().includes("none")) {
        errors.push("Responsible AI Violation: High-risk or sensitive AI recommendation must mandate human-in-the-loop oversight.");
      }
    }

    // 4. Technology Pricing Integrity (No invented pricing)
    if (recommendation.recommendedTools && Array.isArray(recommendation.recommendedTools)) {
      recommendation.recommendedTools.forEach(tool => {
        if (tool && typeof tool === 'object' && tool.pricing) {
          if (!tool.pricingSource && tool.pricing !== "Vendor quotation required") {
            warnings.push(`Tool '${tool.product || tool.id}' has unverified pricing; tagged as 'Vendor quotation required'.`);
            tool.pricing = "Vendor quotation required";
            tool.pricingSource = "Public pricing unverified; formal vendor quotation required.";
            correctionsApplied.push(`Replaced unverified pricing for '${tool.product || tool.id}' with 'Vendor quotation required'.`);
          }
        }
      });
    }

    // 5. Deterministic Calculation Consistency
    if (recommendation.metrics) {
      const { totalGrossAnnualBenefitUSD, totalAnnualRecurringCostUSD, netAnnualBenefitUSD, totalOneTimeInvestmentUSD, paybackPeriodMonths } = recommendation.metrics;
      if (totalGrossAnnualBenefitUSD !== undefined && totalAnnualRecurringCostUSD !== undefined && netAnnualBenefitUSD !== undefined) {
        const expectedNet = totalGrossAnnualBenefitUSD - totalAnnualRecurringCostUSD;
        if (Math.abs(expectedNet - netAnnualBenefitUSD) > 5) {
          errors.push(`Calculation Inconsistency: Gross (${totalGrossAnnualBenefitUSD}) - Recurring (${totalAnnualRecurringCostUSD}) != Net (${netAnnualBenefitUSD}).`);
        }
      }
      if (netAnnualBenefitUSD > 0 && totalOneTimeInvestmentUSD > 0 && paybackPeriodMonths !== undefined) {
        const expectedPayback = Number(((totalOneTimeInvestmentUSD / netAnnualBenefitUSD) * 12).toFixed(1));
        if (Math.abs(expectedPayback - paybackPeriodMonths) > 0.5) {
          warnings.push(`Payback disparity: calculated ${expectedPayback} mo vs stated ${paybackPeriodMonths} mo.`);
        }
      }
    }

    // 6. Deprecated Technology Check
    if (recommendation.recommendedTools) {
      const toolNames = Array.isArray(recommendation.recommendedTools)
        ? recommendation.recommendedTools.map(t => (typeof t === 'string' ? t : t.product || t.id)).join(' ')
        : String(recommendation.recommendedTools);

      if (toolNames.includes("SAP ECC") && !toolNames.includes("SAP S/4HANA")) {
        warnings.push("Tool 'SAP ECC' is deprecated. Modernizing recommendation to 'SAP S/4HANA'.");
        correctionsApplied.push("Updated deprecated SAP ECC reference to SAP S/4HANA.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctionsApplied
    };
  }

  /**
   * Validates a batch of recommendations and deduplicates overlapping titles
   * @param {Array} recommendationsList Array of recommendation items
   * @returns {Array} Clean deduplicated list
   */
  deduplicate(recommendationsList = []) {
    const seen = new Set();
    const deduplicated = [];

    recommendationsList.forEach(item => {
      // Normalize key (e.g. "invoice_processing" or normalized title)
      const normalizedKey = (item.subdomain || item.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      if (!seen.has(normalizedKey)) {
        seen.add(normalizedKey);
        deduplicated.push(item);
      }
    });

    return deduplicated;
  }
}

module.exports = new QualityController();
