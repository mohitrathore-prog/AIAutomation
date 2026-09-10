/**
 * Main Corporate Application Controller (app.js)
 * Coordinates Views, 12-Step Assessment Wizard, Interactive Results,
 * Detailed Use-Case Deep Dives, Live Tests Runner, and Report Generation.
 */

window.App = {
  activeView: "home",
  activeStep: 1,
  totalSteps: 10, // Steps 1-10 are user input; Step 11 is analysis; Step 12 is results

  // Assessment State
  assessmentState: {
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

  // Results State
  evaluationResults: null,
  activeOpportunityDetail: null,

  async init() {
    this.bindNavigation();
    this.bindWizardEvents();
    this.bindLiveTestEvents();
    this.checkRoute();

    // Initialize Admin Portal
    if (window.AdminPortal) {
      window.AdminPortal.init();
    }
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

    // Custom view hooks
    if (viewName === "sample-report") {
      this.loadSampleReport();
    }
    if (viewName === "admin" && window.AdminPortal) {
      window.AdminPortal.switchTab("dashboard");
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
    // Next / Prev Wizard Buttons
    const btnNext = document.getElementById('wizard-btn-next');
    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnSubmit = document.getElementById('wizard-btn-submit');

    if (btnNext) {
      btnNext.addEventListener('click', () => this.goToNextStep());
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', () => this.goToPrevStep());
    }
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.executeAnalysisPipeline());
    }

    // Wizard Step sidebar click
    document.querySelectorAll('.step-item').forEach(stepEl => {
      stepEl.addEventListener('click', (e) => {
        const step = parseInt(e.currentTarget.getAttribute('data-step'), 10);
        if (step <= this.activeStep || this.activeStep === 10) {
          this.goToStep(step);
        }
      });
    });

    // Preset selector buttons for Demo Mode
    const btnPresetMfg = document.getElementById('preset-acme-mfg');
    const btnPresetFin = document.getElementById('preset-apex-fin');

    if (btnPresetMfg) {
      btnPresetMfg.addEventListener('click', () => this.applyPreset("mfg"));
    }
    if (btnPresetFin) {
      btnPresetFin.addEventListener('click', () => this.applyPreset("fin"));
    }
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

    // Sync tech landscape pills
    document.querySelectorAll('.tech-pill').forEach(pill => {
      const tech = pill.getAttribute('data-tech');
      const isSelected = this.assessmentState.technologyLandscape.includes(tech);
      pill.classList.toggle('selected', isSelected);
    });

    // Sync department pills
    document.querySelectorAll('.dept-pill').forEach(pill => {
      const dept = pill.getAttribute('data-dept');
      const isSelected = this.assessmentState.selectedDepartments.includes(dept);
      pill.classList.toggle('selected', isSelected);
    });
  },

  goToNextStep() {
    this.captureStepInputs(this.activeStep);
    if (this.activeStep < 10) {
      this.goToStep(this.activeStep + 1);
    }
  },

  goToPrevStep() {
    if (this.activeStep > 1) {
      this.goToStep(this.activeStep - 1);
    }
  },

  goToStep(stepNum) {
    this.activeStep = stepNum;

    // Toggle step panes
    document.querySelectorAll('.wizard-step-pane').forEach(pane => {
      pane.classList.remove('active');
    });
    const targetPane = document.getElementById(`wiz-step-${stepNum}`);
    if (targetPane) targetPane.classList.add('active');

    // Update sidebar progress
    document.querySelectorAll('.step-item').forEach(item => {
      const s = parseInt(item.getAttribute('data-step'), 10);
      item.classList.toggle('active', s === stepNum);
      item.classList.toggle('completed', s < stepNum);
    });

    // Update navigation buttons
    const btnNext = document.getElementById('wizard-btn-next');
    const btnPrev = document.getElementById('wizard-btn-prev');
    const btnSubmit = document.getElementById('wizard-btn-submit');

    if (btnPrev) btnPrev.style.display = stepNum === 1 ? 'none' : 'inline-block';
    if (btnNext) btnNext.style.display = stepNum === 10 ? 'none' : 'inline-block';
    if (btnSubmit) btnSubmit.style.display = stepNum === 10 ? 'inline-block' : 'none';

    // Hook: If entering review step (10), populate summary
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
    // 1. Show Analysis Animation / Loading Pane (Step 11)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: this.assessmentState.organization,
          departments: this.assessmentState.selectedDepartments,
          existingSystems: this.assessmentState.technologyLandscape,
          customVolume: this.assessmentState.volumeMetrics.annualVolume
        })
      });

      const data = await response.json();
      this.evaluationResults = data;

      // Render Results Dashboard
      this.renderResultsDashboard(data);

      // Navigate to Results View
      this.navigateTo("results");
    } catch (err) {
      console.error("Evaluation error:", err);
      alert("Failed to complete evaluation: " + err.message);
    }
  },

  renderResultsDashboard(data) {
    const summary = data.summary;

    // Update KPI cards
    const elTot = document.getElementById('dash-kpi-total');
    const elNet = document.getElementById('dash-kpi-savings');
    const elPay = document.getElementById('dash-kpi-payback');
    const elRoi = document.getElementById('dash-kpi-roi');
    const elAuto = document.getElementById('dash-kpi-automation');
    const elAi = document.getElementById('dash-kpi-ai');

    if (elTot) elTot.textContent = summary.totalOpportunities;
    if (elNet) elNet.textContent = `$${(summary.netAnnualBenefitUSD / 1000).toFixed(0)}k`;
    if (elPay) elPay.textContent = `${summary.expectedPaybackMonths} mo`;
    if (elRoi) elRoi.textContent = `${summary.expectedRoi3Year}%`;
    if (elAuto) elAuto.textContent = `${summary.automationCount} cases (${Math.round((summary.automationCount / summary.totalOpportunities) * 100)}%)`;
    if (elAi) elAi.textContent = `${summary.aiCount + summary.hybridCount} cases (${Math.round(((summary.aiCount + summary.hybridCount) / summary.totalOpportunities) * 100)}%)`;

    // Render 2x2 Matrix
    if (window.OpportunityMatrix) {
      window.OpportunityMatrix.render('matrix-svg-container', data.matrixPoints, (id) => {
        this.openOpportunityDetail(id);
      });
    }

    // Render Portfolio Table
    const tableBody = document.getElementById('portfolio-table-body');
    if (tableBody && data.opportunities) {
      tableBody.innerHTML = data.opportunities.map(o => `
        <tr style="cursor: pointer;" onclick="App.openOpportunityDetail('${o.id}')">
          <td><code>${o.id}</code></td>
          <td><strong>${o.name}</strong></td>
          <td>${o.department}</td>
          <td><span class="badge ${o.aiNecessity === 'Yes' ? 'badge-ai' : 'badge-automation'}">${o.recommendedSolutionType}</span></td>
          <td><strong>${o.overallScore}/100</strong></td>
          <td><span class="badge ${o.priority === 'Quick Win' ? 'badge-quickwin' : 'badge-strategic'}">${o.priority}</span></td>
          <td>$${Math.round(o.metrics?.netAnnualBenefitUSD || o.expectedAnnualSavingsUSD).toLocaleString()}</td>
          <td>
            <button class="btn-cta-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="event.stopPropagation(); App.openOpportunityDetail('${o.id}')">Inspect</button>
          </td>
        </tr>
      `).join('');
    }

    // Render Roadmap
    const roadmapContainer = document.getElementById('roadmap-phases-container');
    if (roadmapContainer && data.roadmap) {
      roadmapContainer.innerHTML = Object.keys(data.roadmap).map(k => {
        const phase = data.roadmap[k];
        return `
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 10px;">
              <span style="font-weight: 700; color: #0f172a; font-size: 14px;">${phase.title}</span>
              <span class="badge badge-strategic">${phase.horizon}</span>
            </div>
            <div style="font-size: 12.5px; color: #475569; margin-bottom: 10px;">${phase.focus}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${phase.opportunities.map(o => `
                <span class="badge ${o.aiNecessity === 'Yes' ? 'badge-ai' : 'badge-automation'}" style="cursor: pointer;" onclick="App.openOpportunityDetail('${o.id}')">
                  ${o.name} (${o.overallScore}/100)
                </span>
              `).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  },

  openOpportunityDetail(useCaseId) {
    if (!this.evaluationResults) return;
    const uc = this.evaluationResults.opportunities.find(o => o.id === useCaseId);
    if (!uc) return;

    this.activeOpportunityDetail = uc;

    // Populate Modal
    const elTitle = document.getElementById('modal-uc-title');
    const elDept = document.getElementById('modal-uc-dept');
    const elScore = document.getElementById('modal-uc-score');
    const elBody = document.getElementById('modal-uc-body');

    if (elTitle) elTitle.textContent = uc.name;
    if (elDept) elDept.textContent = `${uc.department} > ${uc.subdomain || uc.domain} | ${uc.recommendedSolutionType}`;
    if (elScore) elScore.textContent = `${uc.overallScore}/100`;

    if (elBody) {
      elBody.innerHTML = `
        <!-- Section: Prominent Solution & AI Decision -->
        <div style="margin-bottom: 18px;">
          ${uc.aiNecessity === 'No' ? `
            <div class="alert-box alert-why-not-ai">
              <strong>AI Required: NO.</strong><br>
              <strong>Why Not AI?</strong> ${uc.whyNotAi}
            </div>
          ` : `
            <div class="alert-box alert-ai-justified">
              <strong>AI Required: YES.</strong><br>
              <strong>Why AI is Justified:</strong> ${uc.aiNecessityReasoning}
            </div>
          `}

          ${uc.humanInTheLoopRequirement ? `
            <div class="alert-box alert-hitl">
              🛡 Human-In-The-Loop Checkpoint: ${uc.humanInTheLoopRequirement}
            </div>
          ` : ''}
        </div>

        <!-- Section: Problem & Solution -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 13px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Current-State Problem</div>
            <p style="margin: 0; color: #334155;">${uc.problemStatement}</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px;">Proposed Target Architecture</div>
            <p style="margin: 0; color: #334155;">${uc.whyThisSolution}</p>
          </div>
        </div>

        <!-- Section: Workflows (Current vs Future) -->
        <div style="margin-bottom: 24px;">
          <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 10px;">Process Workflow Diagrams</div>
          <div style="margin-bottom: 12px;">${uc.diagrams?.currentStateSvg || ''}</div>
          <div>${uc.diagrams?.futureStateSvg || ''}</div>
        </div>

        <!-- Section: Conceptual Visual Mockup -->
        <div style="margin-bottom: 24px;">
          <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 10px;">Illustrative Conceptual Solution Preview</div>
          <div>${uc.conceptualMockupHtml || ''}</div>
        </div>

        <!-- Section: Financials & ROI Breakdown -->
        <div style="margin-bottom: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px;">
          <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-bottom: 10px;">Deterministic Business Case &amp; ROI</div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-bottom: 12px;">
            <div style="background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">1-TIME INVESTMENT</div>
              <div style="font-size: 16px; font-weight: 800; color: #0f172a;">$${Math.round(uc.metrics?.totalOneTimeInvestmentUSD || uc.oneTimeCostEstimateUSD).toLocaleString()}</div>
            </div>
            <div style="background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">NET ANNUAL BENEFIT</div>
              <div style="font-size: 16px; font-weight: 800; color: #059669;">$${Math.round(uc.metrics?.netAnnualBenefitUSD || uc.expectedAnnualSavingsUSD).toLocaleString()}</div>
            </div>
            <div style="background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">PAYBACK PERIOD</div>
              <div style="font-size: 16px; font-weight: 800; color: #2563eb;">${uc.metrics?.paybackPeriodMonths || uc.paybackPeriodMonths} Months</div>
            </div>
            <div style="background: #ffffff; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">3-YEAR NET ROI</div>
              <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${uc.metrics?.roi3YearPercent || uc.roi3YearPercent}%</div>
            </div>
          </div>
          <div style="font-size: 11px; color: #64748b; font-style: italic;">
            ${uc.roiDisclaimer || "Indicative business-case estimate based on user-provided information and stated assumptions."}
          </div>
        </div>

        <!-- Section: Technology & Citations -->
        <div style="font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          <div><strong>Recommended Primary Tool:</strong> ${uc.matchedTechnology?.product || 'Standard Enterprise Tool'} (${uc.matchedTechnology?.vendor || 'Enterprise Vendor'})</div>
          <div><strong>Existing Stack Fit:</strong> ${uc.technologyRationale || uc.existingTechnologyFit}</div>
          <div style="margin-top: 6px;"><strong>Verified Sources:</strong> ${Array.isArray(uc.sources) ? uc.sources.join(', ') : uc.sources}</div>
        </div>
      `;
    }

    const modal = document.getElementById('use-case-modal');
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.evaluationResults)
      });
      const html = await res.text();

      // Open printable window
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

  bindLiveTestEvents() {
    const btnRun = document.getElementById('btn-run-live-tests');
    if (btnRun) {
      btnRun.addEventListener('click', () => this.runLiveTests());
    }
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
