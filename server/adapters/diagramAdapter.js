/**
 * Structured Diagram Generator Adapter
 * Generates crisp, corporate-grade SVG process workflow and architecture diagrams
 * with clear swimlanes, security perimeters, human-in-the-loop gates, and system nodes.
 */

class DiagramAdapter {
  /**
   * Generates Current-State Process Workflow Diagram SVG
   * @param {Object} useCase Use case metadata
   * @returns {string} SVG markup string
   */
  generateCurrentStateSvg(useCase = {}) {
    const title = useCase.name || "Process Workflow";
    const dept = useCase.department || "Enterprise";
    
    return `
<svg viewBox="0 0 880 240" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; font-family: 'Segoe UI', Inter, sans-serif;">
  <defs>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" flood-color="#0f172a"/>
    </filter>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#e11d48"/>
    </marker>
  </defs>

  <!-- Background Canvas -->
  <rect width="880" height="240" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  
  <!-- Header Banner -->
  <rect x="0" y="0" width="880" height="38" rx="8" fill="#f1f5f9"/>
  <text x="16" y="24" fill="#334155" font-size="12" font-weight="700" letter-spacing="0.5">CURRENT-STATE BOTTLENECK WORKFLOW (MANUAL &amp; ASYNCHRONOUS)</text>
  <rect x="740" y="8" width="124" height="22" rx="4" fill="#fee2e2" stroke="#fecaca"/>
  <text x="748" y="23" fill="#991b1b" font-size="11" font-weight="600">Manual / High Lag</text>

  <!-- Step 1: Trigger -->
  <g transform="translate(30, 65)">
    <rect width="160" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="28" cy="28" r="14" fill="#e0f2fe"/>
    <text x="28" y="32" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">1</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Manual Intake</text>
    <text x="14" y="65" fill="#475569" font-size="11" width="130">
      <tspan x="14" dy="0">Inbound email / physical</tspan>
      <tspan x="14" dy="16">paper documents received</tspan>
      <tspan x="14" dy="16">without validation</tspan>
    </text>
    <rect x="14" y="110" width="132" height="18" rx="3" fill="#fef2f2"/>
    <text x="80" y="123" fill="#b91c1c" font-size="10" font-weight="600" text-anchor="middle">Avg Wait: 4 - 24 hrs</text>
  </g>

  <!-- Connector 1 -> 2 -->
  <path d="M 190 132 L 240 132" stroke="#e11d48" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-red)"/>

  <!-- Step 2: Manual Re-keying -->
  <g transform="translate(250, 65)">
    <rect width="160" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="28" cy="28" r="14" fill="#fee2e2"/>
    <text x="28" y="32" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">2</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Manual Data Entry</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">Clerk reads document</tspan>
      <tspan x="14" dy="16">and manually re-keys into</tspan>
      <tspan x="14" dy="16">ERP / CRM screen</tspan>
    </text>
    <rect x="14" y="110" width="132" height="18" rx="3" fill="#fef2f2"/>
    <text x="80" y="123" fill="#b91c1c" font-size="10" font-weight="600" text-anchor="middle">Typo Error Risk: 4.8%</text>
  </g>

  <!-- Connector 2 -> 3 -->
  <path d="M 410 132 L 460 132" stroke="#e11d48" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-red)"/>

  <!-- Step 3: Spreadsheets & Email Handoff -->
  <g transform="translate(470, 65)">
    <rect width="160" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="28" cy="28" r="14" fill="#fef3c7"/>
    <text x="28" y="32" fill="#d97706" font-size="12" font-weight="bold" text-anchor="middle">3</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Manual Verification</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">Cross-referencing Excel</tspan>
      <tspan x="14" dy="16">and emailing managers</tspan>
      <tspan x="14" dy="16">for manual sign-off</tspan>
    </text>
    <rect x="14" y="110" width="132" height="18" rx="3" fill="#fef2f2"/>
    <text x="80" y="123" fill="#b91c1c" font-size="10" font-weight="600" text-anchor="middle">Approval Lag: 3 - 5 Days</text>
  </g>

  <!-- Connector 3 -> 4 -->
  <path d="M 630 132 L 680 132" stroke="#e11d48" stroke-width="2" stroke-dasharray="4,3" marker-end="url(#arrow-red)"/>

  <!-- Step 4: Delayed Completion -->
  <g transform="translate(690, 65)">
    <rect width="160" height="135" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow)"/>
    <circle cx="28" cy="28" r="14" fill="#f1f5f9"/>
    <text x="28" y="32" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">4</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Delayed Posting</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">Manual posting to ledger</tspan>
      <tspan x="14" dy="16">or customer update;</tspan>
      <tspan x="14" dy="16">audit trail fragmented</tspan>
    </text>
    <rect x="14" y="110" width="132" height="18" rx="3" fill="#fef2f2"/>
    <text x="80" y="123" fill="#b91c1c" font-size="10" font-weight="600" text-anchor="middle">Cycle: 7 - 14 Days</text>
  </g>
</svg>
`;
  }

  /**
   * Generates Future-State Process Workflow Diagram SVG
   * Highlights automated steps, human-in-the-loop review gate, and system integrations
   * @param {Object} useCase Use case metadata
   * @returns {string} SVG markup string
   */
  generateFutureStateSvg(useCase = {}) {
    const isAi = useCase.aiNecessity === "Yes";
    const tool = useCase.recommendedTools?.[0] || "Enterprise Platform";
    const toolName = typeof tool === 'object' ? tool.product : tool;

    return `
<svg viewBox="0 0 880 260" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; font-family: 'Segoe UI', Inter, sans-serif;">
  <defs>
    <filter id="shadow-future" x="-4%" y="-4%" width="108%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.08" flood-color="#0f172a"/>
    </filter>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb"/>
    </marker>
  </defs>

  <!-- Background Canvas -->
  <rect width="880" height="260" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  
  <!-- Header Banner -->
  <rect x="0" y="0" width="880" height="38" rx="8" fill="#f1f5f9"/>
  <text x="16" y="24" fill="#0f172a" font-size="12" font-weight="700" letter-spacing="0.5">TARGET-STATE AUTOMATED &amp; GOVERNED WORKFLOW</text>
  <rect x="710" y="8" width="154" height="22" rx="4" fill="#d1fae5" stroke="#a7f3d0"/>
  <text x="787" y="23" fill="#065f46" font-size="11" font-weight="600" text-anchor="middle">Straight-Through / Governed</text>

  <!-- Step 1: Ingestion & Webhook -->
  <g transform="translate(25, 65)">
    <rect width="180" height="155" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow-future)"/>
    <circle cx="28" cy="28" r="14" fill="#e0f2fe"/>
    <text x="28" y="32" fill="#0284c7" font-size="12" font-weight="bold" text-anchor="middle">1</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Digital Ingestion</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">API webhook or scheduled</tspan>
      <tspan x="14" dy="16">connector ingests batch</tspan>
      <tspan x="14" dy="16">directly from source</tspan>
    </text>
    <rect x="14" y="125" width="152" height="20" rx="3" fill="#ecfdf5"/>
    <text x="90" y="139" fill="#047857" font-size="10" font-weight="600" text-anchor="middle">Instant &lt; 2 seconds</text>
  </g>

  <!-- Connector 1 -> 2 -->
  <path d="M 205 142 L 235 142" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>

  <!-- Step 2: Processing Engine (AI or Rules) -->
  <g transform="translate(245, 65)">
    <rect width="190" height="155" rx="6" fill="#ffffff" stroke="${isAi ? '#a855f7' : '#059669'}" stroke-width="2" filter="url(#shadow-future)"/>
    <circle cx="28" cy="28" r="14" fill="${isAi ? '#f3e8ff' : '#d1fae5'}"/>
    <text x="28" y="32" fill="${isAi ? '#9333ea' : '#059669'}" font-size="12" font-weight="bold" text-anchor="middle">2</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">${isAi ? 'Targeted AI / ML' : 'Deterministic Rules'}</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">${isAi ? 'Specialized ML models' : 'Business rules engine'}</tspan>
      <tspan x="14" dy="16">${isAi ? 'extract unstructured fields' : 'validates exact thresholds'}</tspan>
      <tspan x="14" dy="16">${isAi ? 'with confidence scoring' : 'and matches data keys'}</tspan>
    </text>
    <rect x="14" y="125" width="162" height="20" rx="3" fill="${isAi ? '#faf5ff' : '#ecfdf5'}"/>
    <text x="95" y="139" fill="${isAi ? '#7e22ce' : '#047857'}" font-size="10" font-weight="600" text-anchor="middle">${toolName}</text>
  </g>

  <!-- Connector 2 -> 3 (Split: High Confidence vs Exception) -->
  <path d="M 435 125 L 485 105" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>
  <path d="M 435 155 L 485 180" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow-blue)"/>

  <!-- Step 3A: Straight Through (Top) -->
  <g transform="translate(495, 55)">
    <rect width="175" height="85" rx="6" fill="#ffffff" stroke="#10b981" stroke-width="1.5" filter="url(#shadow-future)"/>
    <circle cx="24" cy="22" r="10" fill="#d1fae5"/>
    <text x="24" y="26" fill="#059669" font-size="10" font-weight="bold" text-anchor="middle">3A</text>
    <text x="42" y="26" fill="#0f172a" font-size="12" font-weight="600">Straight-Through (80%)</text>
    <text x="14" y="50" fill="#475569" font-size="10">
      <tspan x="14" dy="0">High confidence match passes</tspan>
      <tspan x="14" dy="14">directly to ERP/Core API</tspan>
    </text>
  </g>

  <!-- Step 3B: Human in the Loop (Bottom) -->
  <g transform="translate(495, 145)">
    <rect width="175" height="85" rx="6" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5" filter="url(#shadow-future)"/>
    <circle cx="24" cy="22" r="10" fill="#fef3c7"/>
    <text x="24" y="26" fill="#d97706" font-size="10" font-weight="bold" text-anchor="middle">3B</text>
    <text x="42" y="26" fill="#0f172a" font-size="12" font-weight="600">Human-In-The-Loop</text>
    <text x="14" y="50" fill="#475569" font-size="10">
      <tspan x="14" dy="0">Exception / low-confidence</tspan>
      <tspan x="14" dy="14">routed to human reviewer</tspan>
    </text>
  </g>

  <!-- Connector to Step 4 -->
  <path d="M 670 97 L 695 125" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>
  <path d="M 670 187 L 695 155" stroke="#059669" stroke-width="2" marker-end="url(#arrow-green)"/>

  <!-- Step 4: System of Record -->
  <g transform="translate(705, 65)">
    <rect width="150" height="155" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" filter="url(#shadow-future)"/>
    <circle cx="28" cy="28" r="14" fill="#f1f5f9"/>
    <text x="28" y="32" fill="#334155" font-size="12" font-weight="bold" text-anchor="middle">4</text>
    <text x="50" y="32" fill="#0f172a" font-size="13" font-weight="600">Core Posting</text>
    <text x="14" y="65" fill="#475569" font-size="11">
      <tspan x="14" dy="0">Validated transaction</tspan>
      <tspan x="14" dy="16">committed to ERP /</tspan>
      <tspan x="14" dy="16">database with audit log</tspan>
    </text>
    <rect x="14" y="125" width="122" height="20" rx="3" fill="#ecfdf5"/>
    <text x="75" y="139" fill="#047857" font-size="10" font-weight="600" text-anchor="middle">100% Audit Logged</text>
  </g>
</svg>
`;
  }
}

module.exports = new DiagramAdapter();
