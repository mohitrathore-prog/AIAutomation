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

  getAuthHeaders() {
    const token = window.App?.authToken || localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : { 'x-demo-auth': 'true' };
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
      const res = await fetch('/api/admin/dashboard-stats', {
        headers: this.getAuthHeaders()
      });
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
        logContainer.innerHTML = data.auditLogs.map(l => {
          const user = l.user_email || l.user || 'System';
          const action = l.action;
          const target = l.entity_type ? `${l.entity_type} (${l.entity_id || ''})` : (l.target || 'System');
          const details = l.new_values || l.details || '';
          const time = new Date(l.created_at || l.timestamp).toLocaleTimeString();
          return `
            <div style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 12px;">
              <div>
                <strong>${user}</strong>: <span style="color: #2563eb;">${action}</span> on <em>${target}</em>
                <div style="color: #64748b; font-size: 11px;">${typeof details === 'object' ? JSON.stringify(details) : details}</div>
              </div>
              <div style="color: #94a3b8; font-size: 10px;">${time}</div>
            </div>
          `;
        }).join('');
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
      const res = await fetch('/api/use-cases', { headers: this.getAuthHeaders() });
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
              <th>Level</th>
              <th>AI Score</th>
              <th>Cost Range</th>
            </tr>
          </thead>
          <tbody>
            ${items.slice(0, 35).map(u => `
              <tr>
                <td><code>${u.id}</code></td>
                <td><strong>${u.name}</strong></td>
                <td><span class="badge badge-tactical">${u.department}</span></td>
                <td>${u.recommendedSolutionType || u.recommended_solution_type}</td>
                <td>Level ${u.solutionLevel || u.solution_level || 4}</td>
                <td><span class="badge ${u.aiNecessityScore > 50 ? 'badge-ai' : 'badge-automation'}">${u.aiNecessityScore || 25}/100</span></td>
                <td>${u.estimatedCostRange || u.estimated_cost_range || '$25k - $50k'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load use cases: ${e.message}</div>`;
    }
  },

  async loadTechnologies() {
    const listContainer = document.getElementById('admin-tech-list');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/technologies', { headers: this.getAuthHeaders() });
      const items = await res.json();

      listContainer.innerHTML = `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 13px; font-weight: 600; color: #334155;">Showing ${items.length} Evaluated Enterprise Platforms</span>
          <button class="btn-cta-primary" style="font-size: 12px; padding: 6px 12px;" onclick="AdminPortal.showCreateModal('technology')">+ Add Technology</button>
        </div>
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Product</th>
              <th>Category</th>
              <th>Solution Level</th>
              <th>Pricing Policy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(t => `
              <tr>
                <td><strong>${t.vendor}</strong></td>
                <td>${t.product}</td>
                <td>${t.category}</td>
                <td>Level ${t.solution_level || t.solutionLevel || 3}</td>
                <td>${t.typical_annual_cost || t.typicalAnnualCost || '<span style="color: #64748b;">Vendor quotation required</span>'}</td>
                <td><span class="badge ${t.lifecycle_status === 'Current' || t.lifecycleStatus === 'Current' ? 'badge-automation' : 'badge-explore'}">${t.lifecycle_status || t.lifecycleStatus || 'Current'}</span></td>
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
      const res = await fetch('/api/questions', { headers: this.getAuthHeaders() });
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
              <th>Order</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(q => `
              <tr>
                <td><code>${q.id}</code></td>
                <td>${q.department}</td>
                <td>${q.domain}</td>
                <td>${q.question}</td>
                <td><span class="badge badge-tactical">${q.type || q.input_type || 'select'}</span></td>
                <td>#${q.displayOrder || q.display_order || 1}</td>
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
      const res = await fetch('/api/admin/audit-logs', { headers: this.getAuthHeaders() });
      const items = await res.json();

      listContainer.innerHTML = `
        <table class="comp-table" style="font-size: 12px;">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(l => {
              const time = new Date(l.created_at || l.timestamp).toLocaleString();
              const user = l.user_email || l.user || 'System';
              const entity = l.entity_type ? `${l.entity_type} (${l.entity_id || ''})` : (l.target || 'Platform');
              const details = l.new_values || l.details || '';
              return `
                <tr>
                  <td><code>${time}</code></td>
                  <td><strong>${user}</strong></td>
                  <td><span class="badge badge-strategic">${l.action}</span></td>
                  <td>${entity}</td>
                  <td style="color: #475569;">${typeof details === 'object' ? JSON.stringify(details) : details}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    } catch (e) {
      listContainer.innerHTML = `<div style="color: red; padding: 20px;">Failed to load audit trail: ${e.message}</div>`;
    }
  },

  showCreateModal(type) {
    alert(`Admin CRUD: Form modal for creating new ${type}. In production, opens full schema editor with JSON validation.`);
  }
};
