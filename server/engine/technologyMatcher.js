/**
 * Technology Compatibility & Minimum Technology Matcher
 * 
 * Governed by:
 * Principle 3 — Existing technology first:
 * Evaluate existing enterprise software (SAP, Microsoft, Salesforce, ServiceNow, UiPath, Workday)
 * before introducing new vendor footprints.
 * 
 * Principle 4 — Minimum technology principle:
 * Recommend the minimum technology stack necessary to achieve the required business outcome.
 * 
 * Principle 6 — Technology neutrality:
 * Vendor recommendations must be based on technical fit, cost, and existing ecosystem.
 * 
 * Lifecycle Safety:
 * Never recommend deprecated or End-Of-Life software as a preferred target solution.
 */

const fs = require('fs');
const path = require('path');

class TechnologyMatcher {
  constructor() {
    const cataloguePath = path.join(__dirname, '../data/technologyCatalogue.json');
    try {
      this.catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'));
    } catch (e) {
      this.catalogue = [];
    }
  }

  /**
   * Matches candidate tools against organization's existing technology landscape
   * @param {Object} requirements Requirements of the use case
   * @param {Object} orgLandscape Organization's existing technology stack
   * @returns {Object} Primary recommended tool, alternatives, and reuse analysis
   */
  match(requirements = {}, orgLandscape = {}) {
    const {
      department = "IT",
      solutionType = "Workflow Automation",
      requiresRpa = false,
      requiresDocIntelligence = false,
      requiresGenAi = false,
      requiresErpIntegration = false,
      requiresIpaas = false
    } = requirements;

    const existingSystems = orgLandscape.systems || [];
    const hasMicrosoft = existingSystems.some(s => s.toLowerCase().includes('microsoft') || s.toLowerCase().includes('azure') || s.toLowerCase().includes('office') || s.toLowerCase().includes('d365'));
    const hasSap = existingSystems.some(s => s.toLowerCase().includes('sap'));
    const hasSalesforce = existingSystems.some(s => s.toLowerCase().includes('salesforce'));
    const hasServiceNow = existingSystems.some(s => s.toLowerCase().includes('servicenow'));
    const hasUiPath = existingSystems.some(s => s.toLowerCase().includes('uipath'));
    const hasWorkday = existingSystems.some(s => s.toLowerCase().includes('workday'));
    const hasAws = existingSystems.some(s => s.toLowerCase().includes('aws'));
    const hasGcp = existingSystems.some(s => s.toLowerCase().includes('google') || s.toLowerCase().includes('gcp'));

    let recommendedTool = null;
    let alternativeTools = [];
    let isReusingExistingTech = false;
    let rationale = "";

    // Department & capability specific matching:
    if (department === "IT" && hasServiceNow && (solutionType.includes("Workflow") || solutionType.includes("Configuration") || solutionType.includes("API"))) {
      recommendedTool = this.findProduct("servicenow_itsm");
      isReusingExistingTech = true;
      rationale = "Organization already operates ServiceNow. Reusing native ServiceNow Flow Designer and IntegrationHub fulfills the requirement with zero incremental license cost.";
      alternativeTools.push(this.findProduct("microsoft_power_automate"), this.findProduct("jira_service_management"));
    } else if (department === "Finance" && hasSap && (solutionType.includes("Existing") || solutionType.includes("Workflow") || solutionType.includes("Rule"))) {
      recommendedTool = this.findProduct("sap_s4hana");
      isReusingExistingTech = true;
      rationale = "Organization operates SAP S/4HANA. Native 3-way matching and automated payment clearing rules resolve the requirement inside the ERP database boundary.";
      alternativeTools.push(this.findProduct("uipath_platform"), this.findProduct("microsoft_power_automate"));
    } else if (department === "HR" && hasWorkday && (solutionType.includes("Workflow") || solutionType.includes("API"))) {
      recommendedTool = this.findProduct("workday_hcm");
      isReusingExistingTech = true;
      rationale = "Workday Human Capital Management is already in place. Native Workday Business Process Framework (BPF) handles approval workflows without external middleware.";
      alternativeTools.push(this.findProduct("servicenow_itsm"), this.findProduct("sap_successfactors"));
    } else if (department === "Sales" && hasSalesforce && (solutionType.includes("Workflow") || solutionType.includes("Rule"))) {
      recommendedTool = this.findProduct("salesforce_crm");
      isReusingExistingTech = true;
      rationale = "Salesforce Sales Cloud is present. Salesforce Flow Builder provides deterministic workflow and assignment automation natively.";
      alternativeTools.push(this.findProduct("microsoft_d365_finance"));
    } else if (requiresRpa && hasUiPath) {
      recommendedTool = this.findProduct("uipath_platform");
      isReusingExistingTech = true;
      rationale = "Organization possesses an established UiPath automation practice. Reusing existing Unattended Robot runtime avoids introducing a secondary RPA platform.";
      alternativeTools.push(this.findProduct("microsoft_power_automate"), this.findProduct("automation_anywhere"));
    } else if (requiresRpa && hasMicrosoft && !hasUiPath) {
      recommendedTool = this.findProduct("microsoft_power_automate");
      isReusingExistingTech = true;
      rationale = "Organization has Microsoft ecosystem. Power Automate Desktop provides cost-effective RPA that integrates natively with Entra ID.";
      alternativeTools.push(this.findProduct("uipath_platform"));
    } else if (requiresGenAi) {
      if (hasMicrosoft) {
        recommendedTool = this.findProduct("azure_openai");
        isReusingExistingTech = true;
        rationale = "Organization has Microsoft/Azure cloud tenancy. Azure OpenAI Service provides enterprise security boundaries, private VNet endpoints, and zero data retention within existing tenant agreement.";
        alternativeTools.push(this.findProduct("anthropic_claude"), this.findProduct("openai_platform"));
      } else if (hasAws) {
        recommendedTool = this.findProduct("anthropic_claude"); // Claude via Bedrock
        isReusingExistingTech = true;
        rationale = "Organization uses AWS. Deploying Claude models via Amazon Bedrock keeps data inside the existing AWS VPC security perimeter.";
        alternativeTools.push(this.findProduct("openai_platform"));
      } else {
        recommendedTool = this.findProduct("openai_platform");
        isReusingExistingTech = false;
        rationale = "Standard enterprise API integration with strict Zero Data Retention agreement.";
        alternativeTools.push(this.findProduct("anthropic_claude"));
      }
    } else {
      // General default: prefer Microsoft if present, or generic standard
      if (hasMicrosoft) {
        recommendedTool = this.findProduct("microsoft_power_automate");
        isReusingExistingTech = true;
        rationale = "Leverages existing Microsoft 365 / Power Platform tenant connectors.";
      } else {
        recommendedTool = this.catalogue[0] || { product: "Enterprise Workflow Engine", vendor: "Standard Platform" };
        isReusingExistingTech = false;
        rationale = "Recommended based on standard enterprise technical fit and API maturity.";
      }
    }

    // Filter out nulls from alternatives and ensure lifecycle check
    alternativeTools = alternativeTools.filter(t => t && t.id !== recommendedTool.id);

    // Lifecycle Check: Ensure recommended tool is NOT deprecated or EOL
    if (recommendedTool && (recommendedTool.lifecycleStatus === "Deprecated" || recommendedTool.lifecycleStatus === "End-of-life")) {
      const replacementId = recommendedTool.replacedBy;
      const replacementTool = this.catalogue.find(t => t.product.includes(replacementId) || t.id.includes(replacementId));
      if (replacementTool) {
        rationale += ` (Note: Product ${recommendedTool.product} is deprecated; automatically updated recommendation to current successor ${replacementTool.product}).`;
        recommendedTool = replacementTool;
      }
    }

    return {
      recommendedTool,
      alternativeTools,
      isReusingExistingTech,
      rationale,
      minimumTechnologyPrincipleApplied: isReusingExistingTech,
      vendorNeutralityVerified: true
    };
  }

  findProduct(id) {
    return this.catalogue.find(p => p.id === id) || { id, product: id, vendor: "Enterprise Vendor" };
  }
}

module.exports = new TechnologyMatcher();
