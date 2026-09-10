/**
 * AI Economic Justification Engine
 * Compares Option A (Simpler Solution) vs Option B (AI Solution)
 * Even if AI is technically applicable, do not automatically recommend it.
 * Evaluates incremental costs vs incremental benefits.
 * 
 * If incremental net benefit is insufficient:
 * Returns: "AI technically applicable but economically unjustified."
 * Recommends Option A.
 */

class EconomicJustificationEngine {
  /**
   * Compares Option A (Simpler) vs Option B (AI)
   * @param {Object} optionA Simpler solution economics
   * @param {Object} optionB AI solution economics
   * @returns {Object} Incremental economic analysis and final recommendation
   */
  compare(optionA = {}, optionB = {}) {
    // Defaults for Option A (Simpler, e.g. Workflow / API / Rule engine)
    const costA = {
      oneTimeImplementation: optionA.oneTimeCost || 30000,
      annualLicense: optionA.annualLicense || 4000,
      annualInfraAndTokens: optionA.annualInfra || 1000,
      annualMaintenance: optionA.annualMaintenance || 3000,
      annualSecurityReview: optionA.annualSecurity || 2000,
      expectedAnnualBenefit: optionA.expectedAnnualBenefit || 150000
    };

    // Defaults for Option B (AI / GenAI Solution)
    const costB = {
      oneTimeImplementation: optionB.oneTimeCost || 75000,
      annualLicense: optionB.annualLicense || 18000,
      annualInfraAndTokens: optionB.annualTokens || 12000,
      annualMaintenance: optionB.annualMaintenance || 15000,
      annualSecurityReview: optionB.annualSecurity || 8000,
      expectedAnnualBenefit: optionB.expectedAnnualBenefit || 190000
    };

    const totalAnnualCostA = costA.annualLicense + costA.annualInfraAndTokens + costA.annualMaintenance + costA.annualSecurityReview;
    const netAnnualBenefitA = costA.expectedAnnualBenefit - totalAnnualCostA;

    const totalAnnualCostB = costB.annualLicense + costB.annualInfraAndTokens + costB.annualMaintenance + costB.annualSecurityReview;
    const netAnnualBenefitB = costB.expectedAnnualBenefit - totalAnnualCostB;

    const incrementalOneTimeCost = costB.oneTimeImplementation - costA.oneTimeImplementation;
    const incrementalAnnualCost = totalAnnualCostB - totalAnnualCostA;
    const incrementalAnnualBenefit = costB.expectedAnnualBenefit - costA.expectedAnnualBenefit;
    const incrementalNetBenefit = netAnnualBenefitB - netAnnualBenefitA;

    // Calculate incremental payback period in months
    const incrementalPaybackMonths = incrementalNetBenefit > 0
      ? (incrementalOneTimeCost / incrementalNetBenefit) * 12
      : 999;

    // Minimum hurdle rate: Incremental AI option must achieve payback within 18 months
    // and deliver at least 15% net incremental benefit over the simpler option.
    const hasSufficientIncrementalValue = incrementalNetBenefit > 15000 && incrementalPaybackMonths <= 18;

    let decision = "";
    let recommendedOption = "";
    let explanation = "";

    if (hasSufficientIncrementalValue) {
      decision = "AI Economically Justified";
      recommendedOption = "Option B (AI / AI-Assisted Solution)";
      explanation = `The AI solution delivers $${Math.round(incrementalNetBenefit).toLocaleString()} in incremental net annual business benefit after accounting for ongoing model tokens, licensing, and security maintenance, achieving incremental capital payback in ${incrementalPaybackMonths.toFixed(1)} months.`;
    } else {
      decision = "AI technically applicable but economically unjustified.";
      recommendedOption = "Option A (Simpler Workflow / Integration Solution)";
      explanation = `While AI could technically be deployed, it requires an additional $${Math.round(incrementalOneTimeCost).toLocaleString()} in upfront implementation and $${Math.round(incrementalAnnualCost).toLocaleString()}/year in recurring software, token, and monitoring expenses, while only generating $${Math.round(incrementalAnnualBenefit).toLocaleString()}/year in gross incremental benefit. The simpler solution achieves ${((netAnnualBenefitA / costA.oneTimeImplementation) * 100).toFixed(0)}% ROI at significantly lower operational risk.`;
    }

    return {
      decision,
      recommendedOption,
      explanation,
      isAiRecommended: hasSufficientIncrementalValue,
      optionA: {
        title: optionA.title || "Simpler Solution (Workflow / Rules / Existing Software)",
        oneTimeCost: costA.oneTimeImplementation,
        annualRecurringCost: totalAnnualCostA,
        expectedAnnualBenefit: costA.expectedAnnualBenefit,
        netAnnualBenefit: netAnnualBenefitA
      },
      optionB: {
        title: optionB.title || "AI Solution (LLM / Specialized ML Model)",
        oneTimeCost: costB.oneTimeImplementation,
        annualRecurringCost: totalAnnualCostB,
        expectedAnnualBenefit: costB.expectedAnnualBenefit,
        netAnnualBenefit: netAnnualBenefitB
      },
      incrementalAnalysis: {
        incrementalOneTimeCost,
        incrementalAnnualCost,
        incrementalAnnualBenefit,
        incrementalNetBenefit,
        incrementalPaybackMonths: Math.min(incrementalPaybackMonths, 120)
      }
    };
  }
}

module.exports = new EconomicJustificationEngine();
