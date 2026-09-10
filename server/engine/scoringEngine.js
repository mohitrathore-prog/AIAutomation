/**
 * Multi-Dimensional Opportunity Scoring Engine
 * 
 * Weighted Scoring Model:
 * 1. Business Value — 25%
 * 2. Cost Effectiveness — 20%
 * 3. Technical Feasibility — 15%
 * 4. Existing Technology Fit — 15%
 * 5. Implementation Readiness — 10%
 * 6. Risk — 10% (Inverted: lower risk yields higher points)
 * 7. AI Necessity — 5% (Deliberately small; does NOT reward AI merely for being AI)
 * 
 * Priority Tiers:
 * - Quick Win: High value + High readiness + Low/moderate complexity
 * - Strategic: High value + Significant implementation requirement
 * - Tactical: Moderate value + Manageable implementation
 * - Explore: Potential value but insufficient readiness or evidence
 * - Do Not Prioritise: Low value, excessive complexity, or unjustified risk
 */

class ScoringEngine {
  constructor() {
    this.weights = {
      businessValue: 0.25,
      costEffectiveness: 0.20,
      technicalFeasibility: 0.15,
      existingTechFit: 0.15,
      readiness: 0.10,
      riskInverted: 0.10,
      aiNecessity: 0.05
    };
  }

  /**
   * Calculates weighted opportunity score and priority classification
   * @param {Object} rawScores Individual dimension scores (0-100)
   * @returns {Object} Composite score, breakdown, ratio, and priority
   */
  score(rawScores = {}) {
    const bv = Math.min(100, Math.max(0, Number(rawScores.businessValue || 80)));
    const ce = Math.min(100, Math.max(0, Number(rawScores.costEffectiveness || 80)));
    const tf = Math.min(100, Math.max(0, Number(rawScores.technicalFeasibility || 85)));
    const ef = Math.min(100, Math.max(0, Number(rawScores.existingTechFit || 85)));
    const rd = Math.min(100, Math.max(0, Number(rawScores.readiness || 80)));
    const rk = Math.min(100, Math.max(0, Number(rawScores.risk || 15))); // higher risk = worse
    const an = Math.min(100, Math.max(0, Number(rawScores.aiNecessity || 10)));

    // Invert risk so that low risk (e.g. 15) provides high points (85)
    const riskInverted = 100 - rk;

    const weightedScore = (
      bv * this.weights.businessValue +
      ce * this.weights.costEffectiveness +
      tf * this.weights.technicalFeasibility +
      ef * this.weights.existingTechFit +
      rd * this.weights.readiness +
      riskInverted * this.weights.riskInverted +
      an * this.weights.aiNecessity
    );

    const overallScore = Math.round(weightedScore);

    // Complexity score estimate (0-100) derived from risk, feasibility, and readiness
    const complexityScore = Math.round(100 - ((tf * 0.5) + (rd * 0.3) + (riskInverted * 0.2)));
    const complexityLevel = complexityScore < 35 ? "Low" : complexityScore < 65 ? "Moderate" : "High";

    // Value / Complexity Ratio
    const valueComplexityRatio = complexityScore > 0 ? Number((bv / complexityScore).toFixed(2)) : 9.9;

    // Determine Priority Classification
    let priority = "Tactical";
    if (bv >= 80 && rd >= 75 && complexityScore <= 45) {
      priority = "Quick Win";
    } else if (bv >= 75 && (complexityScore > 45 || rd < 75)) {
      priority = "Strategic";
    } else if (bv >= 55 && bv < 75) {
      priority = "Tactical";
    } else if (bv >= 40 && rd < 60) {
      priority = "Explore";
    } else {
      priority = "Do Not Prioritise";
    }

    // Determine AI Necessity Tier:
    // 0–20: AI not required
    // 21–40: AI potentially applicable but requires economic justification
    // 41–60: AI may provide meaningful benefit
    // 61–80: AI recommended where implementation economics support it
    // 81–100: AI/agentic approach strongly justified
    let aiNecessityTier = "";
    if (an <= 20) {
      aiNecessityTier = "AI Not Required";
    } else if (an <= 40) {
      aiNecessityTier = "Requires Economic Justification";
    } else if (an <= 60) {
      aiNecessityTier = "Meaningful Benefit";
    } else if (an <= 80) {
      aiNecessityTier = "AI Recommended where Supported";
    } else {
      aiNecessityTier = "AI / Agentic Strongly Justified";
    }

    return {
      overallScore,
      priority,
      complexityLevel,
      complexityScore,
      valueComplexityRatio,
      aiNecessityTier,
      dimensionScores: {
        businessValue: bv,
        costEffectiveness: ce,
        technicalFeasibility: tf,
        existingTechFit: ef,
        implementationReadiness: rd,
        risk: rk,
        riskInverted,
        aiNecessity: an
      },
      weightedContribution: {
        businessValue: Number((bv * this.weights.businessValue).toFixed(1)),
        costEffectiveness: Number((ce * this.weights.costEffectiveness).toFixed(1)),
        technicalFeasibility: Number((tf * this.weights.technicalFeasibility).toFixed(1)),
        existingTechFit: Number((ef * this.weights.existingTechFit).toFixed(1)),
        readiness: Number((rd * this.weights.readiness).toFixed(1)),
        riskInverted: Number((riskInverted * this.weights.riskInverted).toFixed(1)),
        aiNecessity: Number((an * this.weights.aiNecessity).toFixed(1))
      }
    };
  }
}

module.exports = new ScoringEngine();
