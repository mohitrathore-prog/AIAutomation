/**
 * Admin Portal Frontend Controller
 * Manages Knowledge Base, Technologies, Questions, Use Cases, and System Audit Logs
 */

window.AdminPortal = {
  activeTab: "dashboard",

  async init() {
    this.bindEvents();
    await this.loadDashboardStats();
  },

  bindEvents() {
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  },

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.admin-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.admin-tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === `admin-pane-${tabId}`);
    });

    if (tabId === "dashboard") this.loadDashboardStats();
    if (tabId === "use-cases") this.loadUseCases();
    if (tabId === "technologies") this.loadTechnologies();
    if (tabId === "questions") this.loadQuestions();
    if (tabId === "audit") this.loadAuditLogs();
  },

  async loadDashboardStats() {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      const data = await res.json();
      
      const elUc = document.getElementById('stat-use-cases');
      const elTech = document.getElementById('stat-technologies');
      const elQ = document.getElementById('stat-questions');
      const elSrc = document.getElementById('stat-sources');

      if (elUc) elUc.textContent = data.useCasesCount || 0;
      if (elTech) elTech.textContent = data.technologiesCount || 0;
      if (elQ) elQ.textContent = data.questionsCount || 0;
      if (elSrc) elSrc.textContent = data.evidenceSourcesCount || 0;

      // Render recent logs
      const logContainer = document.getElementById('admin-recent-logs');
      if (logContainer && data.auditLogs) {
        logContainer.innerHTML = data.auditLogs.map(l => `
          <div style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 12px;">
            <div>
              <strong>${l.user}</strong>: <span style="color: #2563eb;">${l.action}</span> on <em>${l.target}</em>
              <div style="color: #64748b; font-size: 11px;">${l.details}</div>
            </div>
            <div style="color: #94a3b8; font-size: 10px;">${new Date(l.timestamp).toLocaleTimeString()}</div>
          </div>
        `).join('');
      }
    } catch (e) {
      console.error("Admin stats failed:", e);
    }
  },

  async loadUseCases() {
    const listContainer = document.getElementById('admin-use-cases-list');
    if (!listContainer) return;
    listContainer.innerHTML = `<div style="padding: 20px; text-align: center;">Loading use cases...</div>`;

    try {
      const res = await fetch('/api/use-cases');
      const items = await res.json();

      listContainer.innerHTML = `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 600; color: #334155;">Showing ${items.length} Active Use Cases</span>
          <button class="btn-cta-primary" style="font-size: 12px; padding: 6px 12px;" onclick="AdminPortal.showCreateModal('use-case')">+ Add Enterprise Use Case</button>
        </div>
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Solution Type</th>
              <th>AI Req?</th>
              <th>Est. Savings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${items.slice(0, 25).map(u => `
              <tr>
                <td><code>${u.id}</code></td>
                <td><strong>${u.name}</strong></td>
                <td>${u.department}</td>
                <td>${u.recommendedSolutionType}</td>
                <td><span class="badge ${u.aiNecessity === 'Yes' ? 'badge-ai' : 'badge-automation'}">${u.aiNecessity}</span></td>
                <td>$${Math.round(u.expectedAnnualSavingsUSD).toLocaleString()}</td>
                <td>
                  <button style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;" onclick="AdminPortal.editUseCase('${u.id}')">Edit</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${items.length > 25 ? `<div style="text-align: center; padding: 10px; color: #64748b; font-size: 11px;">Showing first 25 of ${items.length} records. Search or filter in production.</div>` : ''}
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load use cases: ${e.message}</div>`;
    }
  },

  async loadTechnologies() {
    const listContainer = document.getElementById('admin-technologies-list');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/technologies');
      const items = await res.json();

      listContainer.innerHTML = `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 600; color: #334155;">Showing ${items.length} Enterprise Systems</span>
          <button class="btn-cta-primary" style="font-size: 12px; padding: 6px 12px;" onclick="AdminPortal.showCreateModal('technology')">+ Add System Record</button>
        </div>
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Product</th>
              <th>Category</th>
              <th>Lifecycle</th>
              <th>Pricing Mode</th>
              <th>Last Verified</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(t => `
              <tr>
                <td><strong>${t.vendor}</strong></td>
                <td>${t.product}</td>
                <td>${t.category}</td>
                <td><span class="badge ${t.lifecycleStatus === 'Current' ? 'badge-automation' : 'badge-explore'}">${t.lifecycleStatus}</span></td>
                <td>${t.pricing.includes('$') ? t.pricing.substring(0, 20) + '...' : '<span style="color: #64748b;">Quotation Required</span>'}</td>
                <td>${t.lastVerified || '2026-02-15'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load technologies: ${e.message}</div>`;
    }
  },

  async loadQuestions() {
    const listContainer = document.getElementById('admin-questions-list');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/questions');
      const items = await res.json();

      listContainer.innerHTML = `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 600; color: #334155;">Showing ${items.length} Dynamic Questionnaire Triggers</span>
          <button class="btn-cta-primary" style="font-size: 12px; padding: 6px 12px;" onclick="AdminPortal.showCreateModal('question')">+ Add Question</button>
        </div>
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Domain</th>
              <th>Question Text</th>
              <th>Type</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(q => `
              <tr>
                <td><code>${q.id}</code></td>
                <td>${q.department}</td>
                <td>${q.domain}</td>
                <td>${q.question}</td>
                <td><span class="badge badge-tactical">${q.answerType}</span></td>
                <td>${q.scoringWeight}/10</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load questions: ${e.message}</div>`;
    }
  },

  async loadAuditLogs() {
    const listContainer = document.getElementById('admin-audit-full-list');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/admin/audit-logs');
      const items = await res.json();

      listContainer.innerHTML = `
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(l => `
              <tr>
                <td><code>${new Date(l.timestamp).toLocaleString()}</code></td>
                <td><strong>${l.user}</strong></td>
                <td><span class="badge badge-strategic">${l.action}</span></td>
                <td>${l.target}</td>
                <td style="color: #475569;">${l.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load audit trail: ${e.message}</div>`;
    }
  },

  showCreateModal(type) {
    alert(`Admin CRUD: Form modal for creating new ${type}. In production, opens full schema editor with JSON validation.`);
  },

  editUseCase(id) {
    alert(`Admin CRUD: Editing use case ${id}. Parameters: Problem, Hierarchy level, AI necessity gates, and ROI drivers.`);
  }
};
