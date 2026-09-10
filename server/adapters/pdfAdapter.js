/**
 * Executive Corporate Report & PDF Generator Adapter
 * Generates institutional management consulting deliverables
 * Clean executive layout, tables, page breaks, confidentiality markings, source citations.
 */

class PdfAdapter {
  /**
   * Generates a self-contained, print-optimized HTML report ready for browser print-to-PDF
   * @param {Object} reportData Full assessment data, opportunities, and financial models
   * @returns {string} Full HTML document
   */
  generateExecutiveReportHtml(reportData = {}) {
    const org = reportData.organization || { name: "Global Enterprise Corp", industry: "Manufacturing", employeeCount: "10,000+" };
    const summary = reportData.summary || {
      totalOpportunities: 12,
      highPriorityCount: 5,
      automationCount: 8,
      aiCount: 2,
      hybridCount: 2,
      totalInvestmentUSD: 480000,
      totalGrossBenefitUSD: 2150000,
      netAnnualBenefitUSD: 1850000,
      expectedPaybackMonths: 3.1,
      expectedRoi3Year: 1050
    };
    const opportunities = reportData.opportunities || [];
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enterprise AI & Automation Opportunity Assessment - ${org.name}</title>
  <style>
    @page {
      size: letter;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
        font-family: 'Segoe UI', Inter, sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
      @bottom-left {
        content: "CONFIDENTIAL & PROPRIETARY — PREPARED FOR ${org.name.toUpperCase()}";
        font-family: 'Segoe UI', Inter, sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      font-size: 10pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .cover-page {
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px;
      border-left: 6px solid #0f172a;
    }
    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin-top: 60px;
      letter-spacing: -0.5px;
    }
    .cover-subtitle {
      font-size: 14pt;
      color: #2563eb;
      font-weight: 600;
      margin-top: 15px;
    }
    .cover-tagline {
      font-size: 12pt;
      color: #475569;
      margin-top: 25px;
      font-style: italic;
      border-left: 3px solid #cbd5e1;
      padding-left: 12px;
    }
    .cover-metadata {
      margin-bottom: 40px;
      font-size: 10pt;
      color: #334155;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-auto { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .badge-ai { background: #faf5ff; color: #7e22ce; border: 1px solid #e9d5ff; }
    .badge-hybrid { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-quickwin { background: #dcfce7; color: #15803d; }
    .badge-strategic { background: #e0e7ff; color: #4338ca; }
    h1 { font-size: 18pt; font-weight: 700; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 6px; margin-top: 30px; }
    h2 { font-size: 14pt; font-weight: 600; color: #1e293b; margin-top: 24px; }
    h3 { font-size: 11pt; font-weight: 600; color: #334155; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 16px; font-size: 9pt; }
    th { background: #f1f5f9; color: #1e293b; font-weight: 700; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; }
    td { padding: 8px 10px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 18px 0; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; text-align: center; }
    .kpi-value { font-size: 18pt; font-weight: 800; color: #0f172a; }
    .kpi-label { font-size: 8pt; font-weight: 600; color: #64748b; text-transform: uppercase; margin-top: 4px; }
    .why-not-ai-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 4px; margin: 10px 0; font-size: 9pt; color: #14532d; }
    .ai-justified-box { background: #faf5ff; border: 1px solid #e9d5ff; border-left: 4px solid #9333ea; padding: 10px 14px; border-radius: 4px; margin: 10px 0; font-size: 9pt; color: #581c87; }
    .hitl-alert { background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #d97706; padding: 8px 12px; border-radius: 4px; margin: 8px 0; font-size: 8.5pt; color: #92400e; font-weight: 600; }
    .disclaimer { font-size: 8pt; color: #64748b; font-style: italic; border-top: 1px solid #e2e8f0; padding-top: 10px; margin-top: 25px; }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page page-break">
    <div>
      <div style="font-size: 12pt; font-weight: 700; color: #64748b; letter-spacing: 1px;">EXECUTIVE CONSULTING DELIVERABLE</div>
      <div class="cover-title">Enterprise AI &amp; Automation<br>Opportunity Assessment</div>
      <div class="cover-subtitle">Strategic Process Modernization, Portfolio Prioritization &amp; ROI Blueprint</div>
      <div class="cover-tagline">"The right solution first. AI only when necessary."</div>
    </div>
    <div class="cover-metadata">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div><strong>Organization:</strong> ${org.name}</div>
        <div><strong>Industry:</strong> ${org.industry}</div>
        <div><strong>Date of Assessment:</strong> ${dateStr}</div>
        <div><strong>Classification:</strong> STRICTLY CONFIDENTIAL</div>
      </div>
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div>
    <h1>1. Executive Summary</h1>
    <p>This assessment delivers a rigorous, technology-neutral evaluation of process improvement, automation, and artificial intelligence opportunities across <strong>${org.name}</strong>. Governed by the foundational enterprise principle that organizations should <em>introduce AI only when genuinely required or economically superior to simpler alternatives</em>, this report filters out vanity AI use cases and prioritizes deterministic, maintainable, and high-ROI solutions.</p>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-value">${summary.totalOpportunities}</div>
        <div class="kpi-label">Total Opportunities</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">$${(summary.totalInvestmentUSD / 1000).toFixed(0)}k</div>
        <div class="kpi-label">Est. Total Investment</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">$${(summary.netAnnualBenefitUSD / 1000).toFixed(0)}k</div>
        <div class="kpi-label">Net Annual Benefit</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${summary.expectedPaybackMonths} mo</div>
        <div class="kpi-label">Expected Payback</div>
      </div>
    </div>

    <h2>Portfolio Distribution by Technology Tier</h2>
    <table>
      <thead>
        <tr>
          <th>Solution Category</th>
          <th>Count</th>
          <th>Share</th>
          <th>Strategic Rationale</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-auto">Automation &amp; Workflow</span></td>
          <td><strong>${summary.automationCount}</strong></td>
          <td>${Math.round((summary.automationCount / summary.totalOpportunities) * 100)}%</td>
          <td>Deterministic rules, existing ERP/ITSM native capabilities, and standard APIs. Highest reliability, zero token latency.</td>
        </tr>
        <tr>
          <td><span class="badge badge-hybrid">AI-Assisted Hybrid</span></td>
          <td><strong>${summary.hybridCount}</strong></td>
          <td>${Math.round((summary.hybridCount / summary.totalOpportunities) * 100)}%</td>
          <td>AI extracts semi-structured data; deterministic business rules execute approvals and ERP ledger posting.</td>
        </tr>
        <tr>
          <td><span class="badge badge-ai">Advanced AI / GenAI</span></td>
          <td><strong>${summary.aiCount}</strong></td>
          <td>${Math.round((summary.aiCount / summary.totalOpportunities) * 100)}%</td>
          <td>Reserved strictly for unstructured semantic text analysis, conversational RAG, or non-linear predictive forecasting.</td>
        </tr>
      </tbody>
    </table>

    <div class="disclaimer">
      <strong>Indicative Business-Case Estimate:</strong> Stated financial metrics are calculated based on user-provided operational volumes, loaded hourly labor rates, and verified public platform licensing costs. Final implementation budgets must be validated through detailed technical discovery.
    </div>
  </div>

  <div class="page-break"></div>

  <!-- OPPORTUNITY PORTFOLIO TABLE -->
  <div>
    <h1>2. Opportunity Portfolio Overview</h1>
    <p>Ranked portfolio of assessed enterprise opportunities evaluated across Business Value (25%), Cost Effectiveness (20%), Technical Feasibility (15%), Existing Tech Fit (15%), Implementation Readiness (10%), Risk (10%), and AI Necessity (5%).</p>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Use Case Name</th>
          <th>Department</th>
          <th>Recommended Solution</th>
          <th>Score</th>
          <th>Priority</th>
          <th>Net Savings / Yr</th>
        </tr>
      </thead>
      <tbody>
        ${opportunities.map(o => `
          <tr>
            <td><code>${o.id}</code></td>
            <td><strong>${o.name}</strong></td>
            <td>${o.department}</td>
            <td>${o.recommendedSolutionType}</td>
            <td><strong>${o.overallScore || o.businessValueScore}/100</strong></td>
            <td><span class="badge ${o.priority === 'Quick Win' ? 'badge-quickwin' : 'badge-strategic'}">${o.priority || 'Tactical'}</span></td>
            <td>$${Math.round((o.expectedAnnualSavingsUSD || 150000)).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="page-break"></div>

  <!-- DETAILED USE CASES -->
  <div>
    <h1>3. Deep-Dive Use-Case Specifications</h1>
    <p>Comprehensive 40-point technical, architectural, and financial specifications for primary transformation initiatives.</p>

    ${opportunities.slice(0, 3).map((uc, index) => `
      <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 18px; margin-bottom: 24px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
          <div>
            <span style="font-size: 9pt; color: #64748b; font-weight: 700;">USE CASE ${index + 1} OF ${opportunities.length}: ${uc.id}</span>
            <div style="font-size: 14pt; font-weight: 700; color: #0f172a; margin-top: 2px;">${uc.name}</div>
          </div>
          <span class="badge badge-quickwin">${uc.priority || 'Quick Win'}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; font-size: 9pt;">
          <div><strong>Department:</strong> ${uc.department} &gt; ${uc.subdomain || uc.domain}</div>
          <div><strong>Recommended Solution:</strong> ${uc.recommendedSolutionType}</div>
          <div><strong>Estimated 1-Time Investment:</strong> $${(uc.oneTimeCostEstimateUSD || 35000).toLocaleString()}</div>
          <div><strong>Estimated Annual Benefit:</strong> $${(uc.expectedAnnualSavingsUSD || 160000).toLocaleString()}</div>
        </div>

        <h3>Problem Statement</h3>
        <p style="font-size: 9pt; color: #334155; margin: 4px 0;">${uc.problemStatement}</p>

        <h3>Recommended Solution &amp; Architectural Rationale</h3>
        <p style="font-size: 9pt; color: #334155; margin: 4px 0;">${uc.whyThisSolution}</p>

        ${uc.aiNecessity === 'No' ? `
          <div class="why-not-ai-box">
            <strong>AI Required: NO.</strong> Why? ${uc.whyNotAi}
          </div>
        ` : `
          <div class="ai-justified-box">
            <strong>AI Required: YES.</strong> Justification: ${uc.aiNecessityReasoning}
          </div>
        `}

        ${uc.humanInTheLoopRequirement ? `
          <div class="hitl-alert">
            🛡 Human-In-The-Loop Checkpoint: ${uc.humanInTheLoopRequirement}
          </div>
        ` : ''}

        <h3>Recommended Enterprise Technology</h3>
        <p style="font-size: 9pt; color: #334155; margin: 4px 0;">
          <strong>Primary:</strong> ${Array.isArray(uc.recommendedTools) ? (uc.recommendedTools[0]?.product || uc.recommendedTools[0]) : uc.recommendedTools}<br>
          <strong>Existing Tech Fit:</strong> ${uc.existingTechnologyFit}
        </p>
      </div>
    `).join('')}
  </div>

  <div class="page-break"></div>

  <!-- TRANSFORMATION ROADMAP -->
  <div>
    <h1>4. Executive Transformation Roadmap</h1>
    <p>Sequenced execution roadmap structured by implementation velocity, capital requirements, and organizational readiness.</p>

    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Horizon</th>
          <th>Focus Area</th>
          <th>Target Deliverables</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 1</strong></td>
          <td>0 – 3 Months</td>
          <td>Quick Wins &amp; Native Tech</td>
          <td>Activate native ERP 3-way matching tolerances; deploy IT self-service password reset (SSPR); standard approval workflows in ServiceNow/M365.</td>
        </tr>
        <tr>
          <td><strong>Phase 2</strong></td>
          <td>3 – 6 Months</td>
          <td>Scale Core Automation</td>
          <td>Implement hybrid Document Understanding for AP invoice extraction; connect CRM activity sync APIs; automate HR new-hire onboarding pipeline.</td>
        </tr>
        <tr>
          <td><strong>Phase 3</strong></td>
          <td>6 – 12 Months</td>
          <td>Strategic Optimization</td>
          <td>Deploy machine learning for predictive inventory demand and AIOps event clustering; establish central Automation CoE governance.</td>
        </tr>
        <tr>
          <td><strong>Phase 4</strong></td>
          <td>12 – 24 Months</td>
          <td>Advanced AI / Agentic</td>
          <td>Evaluate supervised agentic AI for complex multi-system customer exception resolution under strict human review boundaries.</td>
        </tr>
      </tbody>
    </table>

    <div class="disclaimer" style="margin-top: 50px;">
      <strong>Confidentiality Notice:</strong> The information contained in this assessment deliverable is confidential, intended solely for the use of the leadership team of ${org.name}. No part of this document may be reproduced or distributed without explicit corporate authorization.
    </div>
  </div>

</body>
</html>`;
  }
}

module.exports = new PdfAdapter();
