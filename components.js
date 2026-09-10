/**
 * Enterprise AI Solution Generator - UI Components (components.js)
 * Handles SVG rendering for gauges, interactive architectures, process flows, and Gantt charts.
 */

// 1. Render Score Dials / Gauges
function renderScoreGauge(svgId, score, maxScore, color) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  
  const pct = score / maxScore;
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct * circumference);
  
  svg.innerHTML = `
    <circle class="gauge-track" cx="70" cy="70" r="${radius}"></circle>
    <circle class="gauge-fill" cx="70" cy="70" r="${radius}" 
      stroke="${color}" 
      stroke-dasharray="${circumference}" 
      stroke-dashoffset="${circumference}"
      style="stroke-dashoffset: ${strokeDashoffset}">
    </circle>
    <text class="gauge-text" x="70" y="70">${score}${maxScore === 10 ? '' : '%'}</text>
  `;
}

// 2. Interactive SVG Target Architecture Diagram
let activeNodesConfig = {}; // Stores customized node details

function renderTargetArchitecture(bp) {
  const container = document.getElementById("arch-diagram-canvas");
  if (!container) return;

  const systems = bp.currentStateAssessment.existingSystems;
  const cloud = bp.techStack.cloudPlatforms[0] || "AWS";
  const llm = bp.techStack.llmProviders[0] || "GPT-4o";
  const vectorDb = bp.techStack.vectorDatabases[0] || "Pinecone";

  // Define nodes in the layout grid
  const nodes = [
    // Source Layer (col 1, x=50)
    { id: "users", label: "Users / Clients", x: 50, y: 80, w: 140, h: 50, color: "var(--primary)", tech: "Web App / API Client", desc: "Enterprise employees or customers triggering workflows.", sec: "TLS-1.3" },
    { id: "data_source", label: systems[0] || "SAP ERP", x: 50, y: 190, w: 140, h: 50, color: "var(--primary)", tech: systems[0] || "SAP ERP", desc: "Primary transactional data storage and system of record.", sec: "AES-256" },
    { id: "docs", label: "Document Vault", x: 50, y: 300, w: 140, h: 50, color: "var(--primary)", tech: "Shared Drive / SharePoint", desc: "Storage for unstructured PDFs, invoices, contracts, or policies.", sec: "AES-256" },

    // Ingestion Layer (col 2, x=260)
    { id: "ingestion", label: "Ingestion API Gateway", x: 260, y: 190, w: 160, h: 60, color: "var(--secondary)", tech: "REST API / Webhooks", desc: "Secure gateway absorbing transactional webhooks or document files.", sec: "Token-Masked" },

    // Processing Layer (col 3, x=480)
    { id: "processing", label: "Orchestration SRE", x: 480, y: 190, w: 160, h: 60, color: "var(--accent)", tech: "LangChain Agents / Python", desc: "AI agent orchestrator coordinating logic, chunking, and tools.", sec: "TLS-1.3" },

    // AI & Storage Layer (col 4, x=700)
    { id: "llm_engine", label: llm, x: 700, y: 110, w: 150, h: 50, color: "var(--success)", tech: llm, desc: "Core foundation language model answering queries or drafting files.", sec: "Token-Masked" },
    { id: "vector_db", label: vectorDb, x: 700, y: 270, w: 150, h: 50, color: "var(--success)", tech: vectorDb, desc: "Vector indexing database storing document semantic chunks.", sec: "AES-256" },

    // Monitoring & Vault Layer (Top/Bottom floating)
    { id: "cloud_infra", label: `${cloud} Cloud Portal`, x: 480, y: 30, w: 160, h: 40, color: "var(--warning)", tech: cloud, desc: "Enterprise cloud hosting environment.", sec: "TLS-1.3" },
    { id: "security_vault", label: "Security & Monitoring", x: 480, y: 340, w: 160, h: 40, color: "var(--danger)", tech: bp.techStack.monitoringTools[0] || "Datadog", desc: "Access auditing, token masking, and anomaly detection dashboards.", sec: "Token-Masked" }
  ];

  // Merge dynamic node changes if exist
  nodes.forEach(n => {
    if (activeNodesConfig[n.id]) {
      n.label = activeNodesConfig[n.id].tech;
      n.tech = activeNodesConfig[n.id].tech;
      n.desc = activeNodesConfig[n.id].desc;
      n.sec = activeNodesConfig[n.id].sec;
    } else {
      // populate default config
      activeNodesConfig[n.id] = { tech: n.tech, desc: n.desc, sec: n.sec, label: n.label };
    }
  });

  // Render nodes and links inside SVG
  let svgContent = `
    <svg class="svg-diagram" viewBox="0 0 900 420" width="100%" height="100%">
      <!-- Definitions for markers (arrows) -->
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--text-muted)"/>
        </marker>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#4f46e5" stop-opacity="0.8"/>
        </linearGradient>
      </defs>

      <!-- Draw connections (links) -->
      <!-- Users -> Ingestion -->
      <path class="diag-link" d="M 190 105 Q 220 105 230 150 T 260 210" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />
      <!-- Data Source -> Ingestion -->
      <path class="diag-link" d="M 190 215 L 260 215" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />
      <!-- Docs -> Ingestion -->
      <path class="diag-link" d="M 190 325 Q 220 325 230 280 T 260 220" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />

      <!-- Ingestion -> Processing -->
      <path class="diag-link" d="M 420 220 L 480 220" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />

      <!-- Processing -> LLM Engine -->
      <path class="diag-link" d="M 640 210 Q 670 210 680 160 T 700 135" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />
      <!-- Processing -> Vector DB -->
      <path class="diag-link" d="M 640 230 Q 670 230 680 280 T 700 295" fill="none" stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#arrow)" />

      <!-- LLM Engine <-> Vector DB (context feed) -->
      <path class="diag-link" d="M 775 160 L 775 270" fill="none" stroke="var(--text-muted)" stroke-dasharray="3" stroke-width="1.2" marker-end="url(#arrow)" marker-start="url(#arrow)" />

      <!-- Processing <-> Cloud (control host) -->
      <path class="diag-link" d="M 560 190 L 560 70" fill="none" stroke="var(--text-muted)" stroke-dasharray="4" stroke-width="1" />
      <!-- Processing <-> Security Audit -->
      <path class="diag-link" d="M 560 250 L 560 340" fill="none" stroke="var(--text-muted)" stroke-dasharray="4" stroke-width="1" />

      <!-- Render Node Cards -->
      ${nodes.map(n => `
        <g class="diag-node" onclick="editArchNode('${n.id}', '${n.label}')">
          <!-- Glassmorphism Card style -->
          <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" ry="8" 
            fill="var(--bg-sidebar)" 
            stroke="${n.color}" 
            stroke-width="1.5" 
            style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4)); cursor: pointer;">
          </rect>
          <!-- Small security indicator dot -->
          <circle cx="${n.x + n.w - 12}" cy="${n.y + 12}" r="4" fill="${n.sec === 'Direct API Connect' || n.sec === 'None' ? 'var(--warning)' : 'var(--success)'}"></circle>
          <!-- Label Text -->
          <text x="${n.x + 12}" y="${n.y + 24}" fill="var(--text-primary)" font-size="11" font-weight="600" font-family="var(--font-heading)">
            ${n.label.length > 20 ? n.label.substring(0, 18) + '...' : n.label}
          </text>
          <!-- Small tech caption -->
          <text x="${n.x + 12}" y="${n.y + n.h - 10}" fill="var(--text-secondary)" font-size="9" font-family="var(--font-body)">
            ${n.tech.length > 24 ? n.tech.substring(0, 22) + '...' : n.tech}
          </text>
        </g>
      `).join('')}
    </svg>
  `;
  container.innerHTML = svgContent;
}

// Click on Architecture Node to Configure Properties
window.editArchNode = function(nodeId, nodeLabel) {
  const modal = document.getElementById("node-config-modal");
  const idField = document.getElementById("node-id-field");
  const nameField = document.getElementById("node-name-field");
  const techSelect = document.getElementById("node-technology-select");
  const descField = document.getElementById("node-desc-field");
  const secSelect = document.getElementById("node-security-select");
  
  const config = activeNodesConfig[nodeId];
  if (!config) return;

  idField.value = nodeId;
  nameField.value = nodeLabel;
  descField.value = config.desc;
  secSelect.value = config.sec;

  // Custom vendor drop list options depending on node category
  let options = [];
  if (nodeId === "llm_engine") {
    options = ["GPT-4o (OpenAI)", "Claude 3.5 Sonnet (Anthropic)", "Llama 3.1 70B (Meta)", "Gemini 1.5 Pro (Google)", "Mixtral 8x22B (Mistral)"];
  } else if (nodeId === "vector_db") {
    options = ["Pinecone", "pgvector (PostgreSQL)", "Milvus", "Qdrant", "Chroma DB"];
  } else if (nodeId === "data_source") {
    options = ["SAP ERP", "Oracle ERP", "Workday HRMS", "ServiceNow ITIL", "Salesforce CRM", "Microsoft SQL Server"];
  } else if (nodeId === "cloud_infra") {
    options = ["Microsoft Azure", "Amazon Web Services (AWS)", "Google Cloud Platform (GCP)"];
  } else if (nodeId === "security_vault") {
    options = ["Datadog Observability", "Prometheus & Grafana", "Dynatrace Suite", "Splunk Cloud", "Azure Monitor"];
  } else {
    options = [config.tech];
  }

  techSelect.innerHTML = options.map(opt => `<option value="${opt}" ${opt === config.tech ? 'selected' : ''}>${opt}</option>`).join('');

  // Open modal
  modal.classList.add("active");
};

// Node Config Save Listener
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-node-config-btn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const id = document.getElementById("node-id-field").value;
    const tech = document.getElementById("node-technology-select").value;
    const desc = document.getElementById("node-desc-field").value;
    const sec = document.getElementById("node-security-select").value;

    if (activeNodesConfig[id]) {
      activeNodesConfig[id].tech = tech;
      activeNodesConfig[id].desc = desc;
      activeNodesConfig[id].sec = sec;
      activeNodesConfig[id].label = tech; // update label to match vendor
      
      // Update app tech stack display in active blueprint
      const bp = AppState.activeBlueprint;
      if (bp) {
        if (id === "llm_engine") bp.techStack.llmProviders[0] = tech;
        if (id === "vector_db") bp.techStack.vectorDatabases[0] = tech;
        if (id === "cloud_infra") bp.techStack.cloudPlatforms[0] = tech;
        if (id === "security_vault") bp.techStack.monitoringTools[0] = tech;
        
        // Re-render
        openBlueprint(bp);
        logAuditEvent("Updated Component Architecture Node", `${id.toUpperCase()}: ${tech}`, "Success");
      }
    }
    
    closeModal("node-config-modal");
  });
});

// 3. Process Workflows comparison
function renderProcessComparison(bp) {
  const asIsContainer = document.getElementById("bp-asis-steps");
  const toBeContainer = document.getElementById("bp-tobe-steps");
  if (!asIsContainer || !toBeContainer) return;

  // Use dynamically generated process workflows from the blueprint if available, fallback to defaults
  const asIsList = (bp.processWorkflows && bp.processWorkflows.asIs && bp.processWorkflows.asIs.length > 0)
    ? bp.processWorkflows.asIs
    : [
        "Receive notification or file document manually via email attachment.",
        "Download attachment, locate specific folder, and transcribe entries into spreadsheet.",
        "Verify parameters (rates, user profile, credentials) page-by-page manually.",
        "Open ERP system or log terminal, input details, and request manager approval via email."
      ];

  const toBeList = (bp.processWorkflows && bp.processWorkflows.toBe && bp.processWorkflows.toBe.length > 0)
    ? bp.processWorkflows.toBe
    : [
        "Automated ingestion pipeline receives target data file or metric alert instantly via webhook.",
        "Intelligent extraction parses file elements, indexing entities inside securely sandbox.",
        "Agentic RAG queries guidelines, matches parameters against historical records dynamically.",
        "Security checks auto-validate compliance. Formulates transaction ready logs in ERP.",
        "Auditing console notifies administrator for final click confirmation."
      ];

  asIsContainer.innerHTML = asIsList.map((step, idx) => `
    <div class="process-step-item">
      <div class="step-item-num">${idx + 1}</div>
      <div style="font-size: 0.88rem; line-height: 1.4; color: var(--text-secondary);">${step}</div>
    </div>
  `).join('');

  toBeContainer.innerHTML = toBeList.map((step, idx) => `
    <div class="process-step-item">
      <div class="step-item-num">${idx + 1}</div>
      <div style="font-size: 0.88rem; line-height: 1.4; color: var(--text-secondary);">${step}</div>
    </div>
  `).join('');
}

// 4. Render Gantt Implementation Roadmap
function renderRoadmapGantt(bp) {
  const container = document.getElementById("bp-gantt-canvas");
  if (!container) return;

  const totalWeeks = bp.roadmap.totalWeeks || 22;
  const phases = bp.roadmap.phases;

  let svgContent = `
    <svg class="svg-diagram" viewBox="0 0 800 240" width="100%" height="100%">
      <!-- Draw timeline weeks ticks -->
      <line x1="120" y1="30" x2="780" y2="30" stroke="var(--border-color)" stroke-width="1"></line>
      
      <text x="120" y="20" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk 1</text>
      <text x="285" y="20" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk ${Math.round(totalWeeks * 0.25)}</text>
      <text x="450" y="20" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk ${Math.round(totalWeeks * 0.5)}</text>
      <text x="615" y="20" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk ${Math.round(totalWeeks * 0.75)}</text>
      <text x="780" y="20" fill="var(--text-muted)" font-size="10" text-anchor="middle">Wk ${totalWeeks}</text>

      <!-- Draw vertical guide lines -->
      <line x1="120" y1="30" x2="120" y2="220" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="2"></line>
      <line x1="285" y1="30" x2="285" y2="220" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="2"></line>
      <line x1="450" y1="30" x2="450" y2="220" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="2"></line>
      <line x1="615" y1="30" x2="615" y2="220" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="2"></line>
      <line x1="780" y1="30" x2="780" y2="220" stroke="var(--border-color)" stroke-width="0.5" stroke-dasharray="2"></line>

      <!-- Phase Row 1 -->
      <text x="10" y="65" fill="var(--text-primary)" font-size="11" font-weight="600">Discovery</text>
      <rect x="120" y="50" width="130" height="24" rx="4" fill="var(--primary)" opacity="0.85"></rect>
      <text x="185" y="66" fill="white" font-size="10" font-weight="bold" text-anchor="middle">${phases[0].duration}</text>

      <!-- Phase Row 2 -->
      <text x="10" y="115" fill="var(--text-primary)" font-size="11" font-weight="600">Sandbox Pilot</text>
      <rect x="250" y="100" width="160" height="24" rx="4" fill="var(--secondary)" opacity="0.85"></rect>
      <text x="330" y="116" fill="white" font-size="10" font-weight="bold" text-anchor="middle">${phases[1].duration}</text>

      <!-- Phase Row 3 -->
      <text x="10" y="165" fill="var(--text-primary)" font-size="11" font-weight="600">Production</text>
      <rect x="410" y="150" width="240" height="24" rx="4" fill="var(--accent)" opacity="0.85"></rect>
      <text x="530" y="166" fill="white" font-size="10" font-weight="bold" text-anchor="middle">${phases[2].duration}</text>

      <!-- Phase Row 4 -->
      <text x="10" y="215" fill="var(--text-primary)" font-size="11" font-weight="600">Scaling</text>
      <rect x="650" y="200" width="130" height="24" rx="4" fill="var(--success)" opacity="0.85"></rect>
      <text x="715" y="216" fill="white" font-size="10" font-weight="bold" text-anchor="middle">${phases[3].duration}</text>
    </svg>
  `;
  container.innerHTML = svgContent;
}
