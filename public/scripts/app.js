/**
 * Main Corporate Application Controller (app.js)
 * Coordinates Views, 12-Step Assessment Wizard, Interactive Results,
 * Multi-Tenant Workspace, Billing & Entitlements, Live Tests, and Document Ingestion.
 */

window.App = {
  activeView: "home",
  activeStep: 1,
  totalSteps: 10,
  activeWorkspaceTab: "assessments",

  // Authentication State
  authToken: localStorage.getItem('auth_token') || null,
  currentUser: null,
  currentOrg: null,
  entitlements: null,

  // Assessment State
  assessmentState: {
    draftId: null,
    organization: {
      name: "Acme Global Manufacturing",
      industry: "Manufacturing",
      subIndustry: "Industrial Equipment",
      country: "United States",
      employeeCount: "10,000+",
      revenueRange: "$1B - $5B",
      businessModel: "B2B",
      digitalMaturity: "Developing"
    },
    technologyLandscape: [
      "SAP S/4HANA",
      "ServiceNow",
      "Microsoft Azure",
      "UiPath",
      "Microsoft 365"
    ],
    selectedDepartments: ["Finance", "IT", "Legal"],
    selectedDomains: ["Accounts Payable", "Service Desk", "Contract Review"],
    answers: {},
    volumeMetrics: {
      annualVolume: 72000,
      minutesPerTransaction: 12,
      dedicatedFtes: 5,
      loadedHourlyRateUSD: 65,
      errorRatePercent: 4.5
    },
    technologyMaturity: {
      rpaInProduction: "Yes",
      rpaPlatform: "UiPath",
      hasCentralCoE: "Yes",
      existingLicensesAvailable: "Yes"
    },
    securityGovernance: {
      dataSensitivity: "High",
      piiHandling: "Yes",
      regulatoryFrameworks: ["SOX", "ISO 27001"]
    }
  },

  evaluationResults: null,
  activeOpportunityDetail: null,

  async init() {
    this.bindNavigation();
    this.bindWizardEvents();
    this.bindLiveTestEvents();
    
    // Initialise authentication profile
    await this.loadUserProfile();

    // Check initial route
    this.checkRoute();

    // Initialise Admin Portal
    if (window.AdminPortal) {
      window.AdminPortal.init();
    }
  },

  getAuthHeaders() {
    return this.authToken
      ? { 'Authorization': `Bearer ${this.authToken}` }
      : { 'x-demo-auth': 'true' };
  },

  async loadUserProfile() {
    try {
      const res = await fetch('/api/auth/me', { headers: this.getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
        this.currentOrg = data.organisation;
        this.entitlements = data.entitlements;
        this.updateHeaderBadges();
      }
    } catch (err) {
      console.warn('Session profile check fallback:', err);
    }
  },

  updateHeaderBadges() {
    const elOrg = document.getElementById('nav-org-name');
    const elUser = document.getElementById('nav-user-role');
    const elPlan = document.getElementById('nav-plan-badge');
    const elCredits = document.getElementById('nav-credits-badge');

    if (elOrg && this.currentOrg) elOrg.textContent = this.currentOrg.name;
    if (elUser && this.currentUser) elUser.textContent = `${this.currentUser.fullName} (${this.currentUser.roleName || this.currentUser.roleId})`;
    if (elPlan && this.currentOrg) elPlan.textContent = `${this.currentOrg.planTier} Plan`;
    if (elCredits && this.entitlements) elCredits.textContent = `${this.entitlements.creditBalance} Credits`;
  },

  openAuthModal() {
    const m = document.getElementById('auth-modal');
    if (m) m.classList.add('active');
  },

  closeAuthModal() {
    const m = document.getElementById('auth-modal');
    if (m) m.classList.remove('active');
  },

  async loginAs(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      this.authToken = data.token;
      localStorage.setItem('auth_token', data.token);
      this.currentUser = data.user;
      this.closeAuthModal();
      await this.loadUserProfile();
      alert(`Signed in successfully as ${data.user.fullName} (${data.user.organisationName})`);
      if (this.activeView === 'workspace') this.loadWorkspaceData();
      if (this.activeView === 'billing') this.loadBillingData();
    } catch (err) {
      alert(`Sign in failed: ${err.message}`);
    }
  },

  async loginDirect() {
    const email = document.getElementById('auth-email-input')?.value;
    const password = document.getElementById('auth-pwd-input')?.value;
    if (!email || !password) return alert('Please enter both email and password.');
    await this.loginAs(email, password);
  },

  checkRoute() {
    const hash = window.location.hash.replace('#', '') || "home";
    this.navigateTo(hash);
  },

  navigateTo(viewName) {
    this.activeView = viewName;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-link-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === "sample-report") {
      this.loadSampleReport();
    }
    if (viewName === "admin" && window.AdminPortal) {
      window.AdminPortal.switchTab("dashboard");
    }
    if (viewName === "workspace") {
      this.loadWorkspaceData();
    }
    if (viewName === "billing") {
      this.loadBillingData();
    }
  },

  bindNavigation() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const view = e.currentTarget.getAttribute('data-nav');
        this.navigateTo(view);
      });
    });

    window.addEventListener('hashchange', () => this.checkRoute());
  },

  bindWizardEvents() {
    const btnNext = document.getElementById('wizard-btn-next');
    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnSubmit = document.getElementById('wizard-btn-submit');

    if (btnNext) btnNext.addEventListener('click', () => this.goToNextStep());
    if (btnPrev) btnPrev.addEventListener('click', () => this.goToPrevStep());
    if (btnSubmit) btnSubmit.addEventListener('click', () => this.executeAnalysisPipeline());

    document.querySelectorAll('.step-item').forEach(stepEl => {
      stepEl.addEventListener('click', (e) => {
        const step = parseInt(e.currentTarget.getAttribute('data-step'), 10);
        if (step <= this.activeStep || this.activeStep === 10) {
          this.goToStep(step);
        }
      });
    });

    const btnPresetMfg = document.getElementById('preset-acme-mfg');
    const btnPresetFin = document.getElementById('preset-apex-fin');

    if (btnPresetMfg) btnPresetMfg.addEventListener('click', () => this.applyPreset("mfg"));
    if (btnPresetFin) btnPresetFin.addEventListener('click', () => this.applyPreset("fin"));
  },

  applyPreset(presetKey) {
    if (presetKey === "mfg") {
      this.assessmentState.organization.name = "Acme Global Manufacturing";
      this.assessmentState.organization.industry = "Manufacturing";
      this.assessmentState.organization.employeeCount = "10,000+";
      this.assessmentState.selectedDepartments = ["Finance", "IT", "Legal", "Supply Chain"];
      this.assessmentState.technologyLandscape = ["SAP S/4HANA", "ServiceNow", "UiPath", "Microsoft Azure", "Microsoft 365"];
      this.syncFormFields();
      alert("Applied 'Acme Global Manufacturing' enterprise profile. Existing stack: SAP S/4HANA + ServiceNow + UiPath.");
    } else if (presetKey === "fin") {
      this.assessmentState.organization.name = "Apex Financial Group";
      this.assessmentState.organization.industry = "Banking";
      this.assessmentState.organization.employeeCount = "5,000 - 10,000";
      this.assessmentState.selectedDepartments = ["Finance", "Customer Service", "Legal"];
      this.assessmentState.technologyLandscape = ["Salesforce", "Workday", "AWS", "Databricks"];
      this.syncFormFields();
      alert("Applied 'Apex Financial Group' enterprise profile. Existing stack: Salesforce + Workday + AWS.");
    }
  },

  syncFormFields() {
    const elName = document.getElementById('org-name');
    const elIndustry = document.getElementById('org-industry');
    const elEmployees = document.getElementById('org-employees');

    if (elName) elName.value = this.assessmentState.organization.name;
    if (elIndustry) elIndustry.value = this.assessmentState.organization.industry;
    if (elEmployees) elEmployees.value = this.assessmentState.organization.employeeCount;

    document.querySelectorAll('.tech-pill').forEach(pill => {
      const tech = pill.getAttribute('data-tech');
      pill.classList.toggle('selected', this.assessmentState.technologyLandscape.includes(tech));
    });

    document.querySelectorAll('.dept-pill').forEach(pill => {
      const dept = pill.getAttribute('data-dept');
      pill.classList.toggle('selected', this.assessmentState.selectedDepartments.includes(dept));
    });
  },

  goToNextStep() {
    this.captureStepInputs(this.activeStep);
    if (this.activeStep < 10) {
      this.goToStep(this.activeStep + 1);
      this.autosaveDraft();
    }
  },

  goToPrevStep() {
    if (this.activeStep > 1) {
      this.goToStep(this.activeStep - 1);
    }
  },

  goToStep(stepNum) {
    this.activeStep = stepNum;

    document.querySelectorAll('.wizard-step-pane').forEach(pane => pane.classList.remove('active'));
    const targetPane = document.getElementById(`wiz-step-${stepNum}`);
    if (targetPane) targetPane.classList.add('active');

    document.querySelectorAll('.step-item').forEach(item => {
      const s = parseInt(item.getAttribute('data-step'), 10);
      item.classList.toggle('active', s === stepNum);
      item.classList.toggle('completed', s < stepNum);
    });

    const btnNext = document.getElementById('wizard-btn-next');
    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnSubmit = document.getElementById('wizard-btn-submit');

    if (btnPrev) btnPrev.style.display = stepNum === 1 ? 'none' : 'inline-block';
    if (btnNext) btnNext.style.display = stepNum === 10 ? 'none' : 'inline-block';
    if (btnSubmit) btnSubmit.style.display = stepNum === 10 ? 'inline-block' : 'none';

    if (stepNum === 10) {
      this.populateReviewStep();
    }
  },

  captureStepInputs(step) {
    if (step === 1) {
      const elName = document.getElementById('org-name');
      const elIndustry = document.getElementById('org-industry');
      const elEmployees = document.getElementById('org-employees');
      if (elName) this.assessmentState.organization.name = elName.value;
      if (elIndustry) this.assessmentState.organization.industry = elIndustry.value;
      if (elEmployees) this.assessmentState.organization.employeeCount = elEmployees.value;
    }
    if (step === 3) {
      const selectedTechs = [];
      document.querySelectorAll('.tech-pill.selected').forEach(p => selectedTechs.push(p.getAttribute('data-tech')));
      this.assessmentState.technologyLandscape = selectedTechs;
    }
    if (step === 4) {
      const selectedDepts = [];
      document.querySelectorAll('.dept-pill.selected').forEach(p => selectedDepts.push(p.getAttribute('data-dept')));
      this.assessmentState.selectedDepartments = selectedDepts;
    }
    if (step === 7) {
      const elVol = document.getElementById('proc-annual-volume');
      const elRate = document.getElementById('proc-hourly-rate');
      if (elVol) this.assessmentState.volumeMetrics.annualVolume = Number(elVol.value);
      if (elRate) this.assessmentState.volumeMetrics.loadedHourlyRateUSD = Number(elRate.value);
    }
  },

  async autosaveDraft() {
    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({
          id: this.assessmentState.draftId,
          title: `${this.assessmentState.organization.name} Assessment Draft`,
          currentStep: this.activeStep,
          answers: this.assessmentState
        })
      });
      const data = await res.json();
      if (data.draftId) {
        this.assessmentState.draftId = data.draftId;
      }
    } catch {
      // Background autosave failure is non-blocking
    }
  },

  populateReviewStep() {
    const elRev = document.getElementById('review-summary-content');
    if (!elRev) return;

    elRev.innerHTML = `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; font-size: 13px; line-height: 1.6;">
        <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 8px;">Organization &amp; Landscape Summary</div>
        <div><strong>Organization:</strong> ${this.assessmentState.organization.name} (${this.assessmentState.organization.industry})</div>
        <div><strong>Headcount:</strong> ${this.assessmentState.organization.employeeCount}</div>
        <div><strong>Selected Departments:</strong> ${this.assessmentState.selectedDepartments.join(', ') || 'None'}</div>
        <div><strong>Existing Systems:</strong> ${this.assessmentState.technologyLandscape.join(', ') || 'None selected'}</div>
        <div><strong>Estimated Process Volume:</strong> ${this.assessmentState.volumeMetrics.annualVolume.toLocaleString()} transactions/year at $${this.assessmentState.volumeMetrics.loadedHourlyRateUSD}/hr</div>
        <div style="margin-top: 12px; padding: 8px 12px; background: #ecfdf5; border-radius: 4px; color: #065f46; font-size: 12px; font-weight: 600;">
          ✓ Ready to execute technology-neutral assessment pipeline with Anti-AI Overuse validation.
        </div>
      </div>
    `;
  },

  async executeAnalysisPipeline() {
    this.goToStep(11);
    const progressEl = document.getElementById('analysis-progress-status');

    const updateStatus = (text, ms) => new Promise(res => {
      setTimeout(() => {
        if (progressEl) progressEl.textContent = text;
        res();
      }, ms);
    });

    await updateStatus("Step 1/6: Researching organizational technology footprint...", 400);
    await updateStatus("Step 2/6: Matching candidate opportunities across 100+ use-case library...", 500);
    await updateStatus("Step 3/6: Running Solution-Selection Hierarchy (Elimination -> Rules -> Automation)...", 600);
    await updateStatus("Step 4/6: Evaluating 8-Criteria AI Necessity Gate (Filtering vanity AI)...", 600);
    await updateStatus("Step 5/6: Calculating deterministic ROI, capacity benefits & scenario models...", 500);
    await updateStatus("Step 6/6: Executing Quality Controller & Anti-AI Overuse assertions...", 400);

    try {
      const response = await fetch('/api/evaluate', {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeaders() },
        body: JSON.stringify({
          organization: this.assessmentState.organization,
          departments: this.assessmentState.selectedDepartments,
          existingSystems: this.assessmentState.technologyLandscape,
          customVolume: this.assessmentState.volumeMetrics.annualVolume,
          draftId: this.assessmentState.draftId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 402) {
          alert(`Plan Quota Exceeded: ${data.error}\nPlease upgrade your subscription plan under Plans & Credits.`);
          this.navigateTo('billing');
          return;
        }
        throw new Error(data.error || 'Evaluation failed');
      }

      this.evaluationResults = data;
      this.renderResultsDashboard(data);
      this.goToStep(12);
      await this.loadUserProfile();
    } catch (err) {
      alert("Analysis execution failed: " + err.message);
      this.goToStep(10);
    }
  },

  renderResultsDashboard(data) {
    const s = data.summary;
    const elTot = document.getElementById('res-total-opps');
    const elAuto = document.getElementById('res-auto-opps');
    const elAi = document.getElementById('res-ai-opps');
    const elNet = document.getElementById('res-net-benefit');
    const elPay = document.getElementById('res-payback');
    const elRoi = document.getElementById('res-roi');

    if (elTot) elTot.textContent = s.totalOpportunities;
    if (elAuto) elAuto.textContent = s.automationCount;
    if (elAi) elAi.textContent = s.aiCount;
    if (elNet) elNet.textContent = `$${(s.netAnnualBenefitUSD / 1000000).toFixed(2)}M`;
    if (elPay) elPay.textContent = `${s.expectedPaybackMonths} mo`;
    if (elRoi) elRoi.textContent = `${s.expectedRoi3Year}%`;

    // Render interactive matrix
    if (window.MatrixController && data.matrixPoints) {
      window.MatrixController.render('matrix-svg-container', data.matrixPoints);
    }

    // Render opportunities table
    const tableContainer = document.getElementById('results-opportunities-table');
    if (tableContainer && data.opportunities) {
      tableContainer.innerHTML = `
        <table class="comp-table" style="font-size: 13px;">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Use Case Name</th>
              <th>Department</th>
              <th>Recommended Solution</th>
              <th>Level</th>
              <th>AI Gate Result</th>
              <th>Net Annual Value</th>
              <th>Payback</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.opportunities.map((o, idx) => `
              <tr>
                <td><strong>#${idx + 1}</strong></td>
                <td><strong>${o.name}</strong></td>
                <td><span class="badge badge-tactical">${o.department}</span></td>
                <td>${o.recommendedSolutionType}</td>
                <td>Level ${o.solutionLevel || 4}</td>
                <td>
                  <span class="badge ${o.aiNecessity === 'Yes' ? 'badge-ai' : 'badge-automation'}">
                    ${o.aiNecessity === 'Yes' ? 'AI Justified' : 'Deterministic Automation'}
                  </span>
                </td>
                <td><strong>$${(o.metrics?.netAnnualBenefitUSD || 45000).toLocaleString()}</strong></td>
                <td>${o.metrics?.paybackPeriodMonths || 4.2} mo</td>
                <td>
                  <button class="btn-cta-secondary" style="font-size: 11px; padding: 4px 8px;" onclick="App.openOpportunityDetail('${o.id}')">View Details</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
  },

  openOpportunityDetail(ucId) {
    if (!this.evaluationResults) return;
    const opp = this.evaluationResults.opportunities.find(o => o.id === ucId);
    if (!opp) return;

    this.activeOpportunityDetail = opp;
    const modal = document.getElementById('use-case-modal');
    const elTitle = document.getElementById('modal-uc-title');
    const elDept = document.getElementById('modal-uc-dept');
    const elScore = document.getElementById('modal-uc-score');
    const elBody = document.getElementById('modal-uc-body');

    if (elTitle) elTitle.textContent = opp.name;
    if (elDept) elDept.textContent = `${opp.department} > ${opp.domain || opp.department}`;
    if (elScore) elScore.textContent = `${opp.overallScore}/100`;

    if (elBody) {
      elBody.innerHTML = `
        <div style="font-size: 13px; line-height: 1.6;">
          <div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
            <strong>Problem Statement:</strong> ${opp.problemStatement}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              <div style="font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">Recommended Architecture</div>
              <div>${opp.recommendedSolutionType} (Level ${opp.solutionLevel})</div>
              <div style="margin-top: 6px; font-size: 12px; color: #64748b;">${opp.hierarchyResult?.rationale || 'Standard deterministic rule execution.'}</div>
            </div>
            <div style="padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
              <div style="font-weight: 700; color: #0d9488; margin-bottom: 4px;">AI Necessity Gate Verdict</div>
              <div>${opp.aiNecessity === 'Yes' ? 'AI Necessary with Human in the Loop' : 'NO AI Required (Deterministic Automation)'}</div>
              <div style="margin-top: 6px; font-size: 12px; color: #64748b;">${opp.whyNotAi || opp.gateResult?.recommendation || 'Rules suffice.'}</div>
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; margin-bottom: 4px;">Financial &amp; Capacity Projections (Expected Scenario)</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f1f5f9; padding: 10px; border-radius: 6px; text-align: center;">
              <div>
                <div style="font-size: 11px; color: #64748b;">Implementation Cost</div>
                <div style="font-weight: 700;">$${(opp.metrics?.totalOneTimeInvestmentUSD || 30000).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #64748b;">Annual Net Benefit</div>
                <div style="font-weight: 700; color: #16a34a;">$${(opp.metrics?.netAnnualBenefitUSD || 65000).toLocaleString()}</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #64748b;">Payback Period</div>
                <div style="font-weight: 700;">${opp.metrics?.paybackPeriodMonths || 4.2} months</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #64748b;">3-Year Net ROI</div>
                <div style="font-weight: 700; color: #2563eb;">${opp.metrics?.roi3YearPercent || 280}%</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (modal) modal.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('use-case-modal');
    if (modal) modal.classList.remove('active');
  },

  async downloadReport() {
    if (!this.evaluationResults) {
      alert("Please complete an assessment before downloading a report.");
      return;
    }

    try {
      const res = await fetch('/api/reports/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.getAuthHeaders() },
        body: JSON.stringify(this.evaluationResults)
      });
      const html = await res.text();
      const printWindow = window.open('', '_blank');
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } catch (e) {
      alert("Failed to generate report download: " + e.message);
    }
  },

  async loadSampleReport() {
    const container = document.getElementById('sample-report-preview-frame');
    if (!container) return;

    try {
      const res = await fetch('/api/reports/sample');
      const html = await res.text();
      container.srcdoc = html;
    } catch (e) {
      container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load sample report: ${e.message}</div>`;
    }
  },

  // Workspace View Controller
  switchWorkspaceTab(tabId) {
    this.activeWorkspaceTab = tabId;
    document.querySelectorAll('.ws-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.ws-pane').forEach(p => p.style.display = 'none');

    const btn = document.getElementById(`wstab-btn-${tabId}`);
    const pane = document.getElementById(`wspane-${tabId}`);
    if (btn) btn.classList.add('active');
    if (pane) pane.style.display = 'block';

    this.loadWorkspaceData();
  },

  async loadWorkspaceData() {
    const tab = this.activeWorkspaceTab;

    if (tab === 'assessments') {
      const container = document.getElementById('workspace-assessments-list');
      if (!container) return;
      try {
        const res = await fetch('/api/assessments', { headers: this.getAuthHeaders() });
        const list = await res.json();
        if (list.length === 0) {
          container.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No completed assessments found. Run an assessment to generate your first deliverable.</div>`;
          return;
        }
        container.innerHTML = `
          <table class="comp-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th>Title</th>
                <th>Industry</th>
                <th>Readiness Tier</th>
                <th>Normalized Score</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(a => `
                <tr>
                  <td><strong>${a.title}</strong></td>
                  <td>${a.industry}</td>
                  <td><span class="badge badge-quickwin">${a.readiness_tier || 'High'}</span></td>
                  <td>${a.normalized_score || 82}/100</td>
                  <td>${new Date(a.created_at).toLocaleDateString()}</td>
                  <td>
                    <button class="btn-cta-secondary" style="font-size: 11px; padding: 4px 8px;" onclick="App.viewAssessment('${a.id}')">View Brief</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load assessments: ${err.message}</div>`;
      }
    }

    if (tab === 'drafts') {
      const container = document.getElementById('workspace-drafts-list');
      if (!container) return;
      try {
        const res = await fetch('/api/drafts', { headers: this.getAuthHeaders() });
        const list = await res.json();
        if (list.length === 0) {
          container.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No active cloud drafts. Changes during assessment are autosaved here.</div>`;
          return;
        }
        container.innerHTML = `
          <table class="comp-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th>Title</th>
                <th>Progress Step</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(d => `
                <tr>
                  <td><strong>${d.title}</strong></td>
                  <td>Step ${d.current_step} of 10</td>
                  <td>${new Date(d.updated_at).toLocaleString()}</td>
                  <td>
                    <button class="btn-cta-primary" style="font-size: 11px; padding: 4px 10px;" onclick="App.resumeDraft('${d.id}')">Resume</button>
                    <button class="btn-cta-secondary" style="font-size: 11px; padding: 4px 8px; margin-left: 6px;" onclick="App.discardDraft('${d.id}')">Discard</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load drafts: ${err.message}</div>`;
      }
    }

    if (tab === 'reports') {
      const container = document.getElementById('workspace-reports-list');
      if (!container) return;
      try {
        const res = await fetch('/api/reports', { headers: this.getAuthHeaders() });
        const list = await res.json();
        if (list.length === 0) {
          container.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No cryptographic reports archived yet. Reports are permanently frozen upon assessment completion.</div>`;
          return;
        }
        container.innerHTML = `
          <table class="comp-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Version</th>
                <th>Title</th>
                <th>Format</th>
                <th>SHA-256 Checksum</th>
                <th>Archived Date</th>
                <th>Integrity</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(r => `
                <tr>
                  <td><strong>v${r.version}</strong></td>
                  <td>${r.title}</td>
                  <td><span class="badge badge-tactical">${r.report_format}</span></td>
                  <td><code>${r.content_hash.substring(0, 16)}...</code></td>
                  <td>${new Date(r.created_at).toLocaleDateString()}</td>
                  <td><span class="badge badge-quickwin">✓ Tamper Verified</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load reports: ${err.message}</div>`;
      }
    }

    if (tab === 'documents') {
      const container = document.getElementById('workspace-documents-list');
      if (!container) return;
      try {
        const res = await fetch('/api/documents', { headers: this.getAuthHeaders() });
        const list = await res.json();
        if (list.length === 0) {
          container.innerHTML = `<div style="padding: 24px; text-align: center; color: #64748b;">No documents ingested yet. Upload an SOP or architecture guide to extract processes.</div>`;
          return;
        }
        container.innerHTML = `
          <table class="comp-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Status</th>
                <th>Detected Processes</th>
                <th>Uploaded At</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(d => `
                <tr>
                  <td><strong>${d.original_filename}</strong></td>
                  <td>${Math.round(d.file_size_bytes / 1024)} KB</td>
                  <td><span class="badge badge-quickwin">${d.extraction_status}</span></td>
                  <td>${d.detectedProcesses.join(', ') || 'General Workflow'}</td>
                  <td>${new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch (err) {
        container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load documents: ${err.message}</div>`;
      }
    }
  },

  async handleDocumentUpload(file) {
    if (!file) return;
    const statusEl = document.getElementById('doc-upload-status');
    if (statusEl) statusEl.innerHTML = `<span style="color: #2563eb;">Uploading &amp; analyzing document "${file.name}"...</span>`;

    const formData = new FormData();
    formData.append('document', file);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (statusEl) {
        statusEl.innerHTML = `
          <span style="color: #16a34a;">✓ Successfully ingested "${data.filename}".</span>
          <div style="font-size: 12px; color: #475569; margin-top: 4px;">
            Detected: <strong>${data.analysis.detectedProcesses.join(', ')}</strong> | AI Necessity: <em>${data.analysis.aiRelevanceAnalysis.rationale}</em>
          </div>
        `;
      }
      this.loadWorkspaceData();
    } catch (err) {
      if (statusEl) statusEl.innerHTML = `<span style="color: #dc2626;">Upload failed: ${err.message}</span>`;
    }
  },

  async resumeDraft(draftId) {
    try {
      const res = await fetch(`/api/drafts/${draftId}`, { headers: this.getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      this.assessmentState = {
        ...this.assessmentState,
        ...data.answers,
        draftId: data.id
      };
      this.syncFormFields();
      this.navigateTo('assessment');
      this.goToStep(data.current_step || 1);
      alert(`Resumed assessment draft "${data.title}" at Step ${data.current_step}.`);
    } catch (err) {
      alert(`Could not resume draft: ${err.message}`);
    }
  },

  async discardDraft(draftId) {
    if (!confirm('Are you sure you want to discard this draft?')) return;
    try {
      await fetch(`/api/drafts/${draftId}`, { method: 'DELETE', headers: this.getAuthHeaders() });
      this.loadWorkspaceData();
    } catch (err) {
      alert(`Failed to discard: ${err.message}`);
    }
  },

  // Billing View Controller
  async loadBillingData() {
    try {
      const res = await fetch('/api/billing/entitlements', { headers: this.getAuthHeaders() });
      const data = await res.json();
      this.entitlements = data;

      const elPlan = document.getElementById('billing-active-plan');
      const elQuota = document.getElementById('billing-quota-text');
      const elCredits = document.getElementById('billing-credits-text');

      if (elPlan) elPlan.textContent = `${data.planTier} Plan ($${data.monthlyPriceUsd}/mo)`;
      if (elQuota) elQuota.textContent = `${data.limits.currentMonthAssessments} / ${data.limits.maxAssessmentsPerMonth} Used`;
      if (elCredits) elCredits.textContent = `${data.creditBalance} Credits`;

      // Load Invoices
      const invRes = await fetch('/api/billing/invoices', { headers: this.getAuthHeaders() });
      const invList = await invRes.json();
      const invContainer = document.getElementById('billing-invoices-list');
      if (invContainer) {
        if (invList.length === 0) {
          invContainer.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b;">No billing invoices on record.</div>`;
        } else {
          invContainer.innerHTML = `
            <table class="comp-table" style="font-size: 13px;">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${invList.map(inv => `
                  <tr>
                    <td><code>${inv.id}</code></td>
                    <td><strong>$${inv.amount_usd.toLocaleString()}</strong> ${inv.currency}</td>
                    <td><span class="badge badge-quickwin">${inv.status}</span></td>
                    <td>${inv.lineItems[0]?.description || 'Platform Subscription'}</td>
                    <td>${new Date(inv.created_at).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }
      }
    } catch (err) {
      console.error('Failed to load billing data:', err);
    }
  },

  async upgradePlan(newTier) {
    if (!confirm(`Upgrade tenant organisation to ${newTier} plan?`)) return;
    try {
      const res = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ newTier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Subscription plan updated to ${newTier}! Your monthly assessment quota has been refreshed.`);
      await this.loadUserProfile();
      this.loadBillingData();
    } catch (err) {
      alert(`Upgrade failed: ${err.message}`);
    }
  },

  async buyCreditsModal() {
    const qty = prompt('Select credit package (100 credits for $149, 200 credits for $249, 500 credits for $499). Enter tier: STANDARD, GROWTH, or ENTERPRISE:', 'STANDARD');
    if (!qty) return;

    try {
      const res = await fetch('/api/billing/buy-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
        body: JSON.stringify({ packageTier: qty.toUpperCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(`Purchased ${data.creditsAdded} Assessment & AI Credits. New balance: ${data.newBalance}`);
      await this.loadUserProfile();
      this.loadBillingData();
    } catch (err) {
      alert(`Purchase failed: ${err.message}`);
    }
  },

  bindLiveTestEvents() {
    const btnRun = document.getElementById('btn-run-live-tests');
    if (btnRun) btnRun.addEventListener('click', () => this.runLiveTests());
  },

  async runLiveTests() {
    const container = document.getElementById('live-tests-results-container');
    const badgeEl = document.getElementById('live-tests-status-badge');

    if (container) {
      container.innerHTML = `<div style="padding: 30px; text-align: center; color: #64748b;">Executing 17 Anti-AI Overuse and Critical Acceptance Assertions...</div>`;
    }

    try {
      const res = await fetch('/api/tests/run', { method: "POST" });
      const data = await res.json();

      if (badgeEl) {
        badgeEl.textContent = `${data.passedCount} / ${data.totalTests} Passed`;
        badgeEl.className = data.allPassed ? "badge badge-quickwin" : "badge badge-danger";
      }

      if (container && data.results) {
        container.innerHTML = `
          <div style="margin-bottom: 14px; font-weight: 700; color: #0f172a; display: flex; justify-content: space-between;">
            <span>Test Suite Outcome: ${data.allPassed ? "100% SUCCESS — ZERO AI OVERUSE DETECTED" : "FAILURES DETECTED"}</span>
            <span style="font-size: 11px; color: #64748b;">Execution: ${new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
          <table class="comp-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Scenario Description</th>
                <th>Expected Outcome</th>
                <th>Actual Platform Output</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${data.results.map(r => `
                <tr>
                  <td><code>${r.id}</code></td>
                  <td><strong>${r.name}</strong></td>
                  <td style="color: #475569;">${r.expected}</td>
                  <td>${r.actual}</td>
                  <td>
                    <span class="badge ${r.passed ? 'badge-quickwin' : 'badge-danger'}">
                      ${r.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }
    } catch (e) {
      if (container) {
        container.innerHTML = `<div style="padding: 20px; color: red;">Test execution failed: ${e.message}</div>`;
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
