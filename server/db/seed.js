/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Database Seeder - Populates RBAC, Plans, Multi-Tenant Seeds, Knowledge Base, and Audited Evidence
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { db } = require('./index');

const dataDir = path.join(__dirname, '../data');

function seedDatabase() {
  console.log('[SEED] Initialising Enterprise SaaS Database Seeder...');

  const insertTx = db.transaction(() => {
    // 1. Roles
    const roles = [
      { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Global cross-tenant platform administration and security controls' },
      { id: 'OWNER', name: 'Organisation Owner', description: 'Tenant account owner with full billing, user, and assessment management' },
      { id: 'ADMIN', name: 'Tenant Administrator', description: 'Manages organization team members, integrations, and workspace configuration' },
      { id: 'ASSESSMENT_MANAGER', name: 'Assessment Manager', description: 'Creates, executes, tunes, and publishes official opportunity assessments' },
      { id: 'ARCHITECT', name: 'Enterprise Architect', description: 'Reviews solution levels, gate exceptions, technology fits, and integration feasibility' },
      { id: 'ANALYST', name: 'Business Analyst', description: 'Gathers operational process metrics, enters questionnaire data, and views drafts' },
      { id: 'EXECUTIVE', name: 'Executive Stakeholder', description: 'Read-only access to executive summaries, strategic dashboards, and ROI models' },
      { id: 'CONSULTANT', name: 'External Consultant', description: 'Scoped client-facing assessment execution and recommendation review' }
    ];

    const insertRole = db.prepare(`
      INSERT OR REPLACE INTO roles (id, name, description, is_system, created_at)
      VALUES (@id, @name, @description, 1, datetime('now'))
    `);
    for (const r of roles) insertRole.run(r);

    // 2. Granular Permissions
    const permissions = [
      { id: 'org:read', name: 'View Organisation', module: 'Organisation', description: 'Read organisation profile and settings' },
      { id: 'org:write', name: 'Manage Organisation', module: 'Organisation', description: 'Update organisation details, domain and security policies' },
      { id: 'users:read', name: 'View Users', module: 'Team', description: 'View tenant team members' },
      { id: 'users:write', name: 'Manage Users', module: 'Team', description: 'Invite, edit, or deactivate team members' },
      { id: 'assessment:create', name: 'Create Assessment', module: 'Assessment', description: 'Create and run new opportunity assessments' },
      { id: 'assessment:read', name: 'View Assessment', module: 'Assessment', description: 'View assessments and recommendations' },
      { id: 'assessment:write', name: 'Modify Assessment', module: 'Assessment', description: 'Edit assessment inputs and assumptions' },
      { id: 'assessment:delete', name: 'Delete Assessment', module: 'Assessment', description: 'Remove assessments and drafts' },
      { id: 'reports:export_pdf', name: 'Export PDF Reports', module: 'Reporting', description: 'Download executive PDF deliverables' },
      { id: 'reports:export_advanced', name: 'Advanced Exports', module: 'Reporting', description: 'Export Excel ROI models and Word briefs' },
      { id: 'kb:read', name: 'Read Knowledge Base', module: 'KnowledgeBase', description: 'Browse and search use cases and technologies' },
      { id: 'kb:manage', name: 'Manage Knowledge Base', module: 'KnowledgeBase', description: 'Create and update versioned use cases and rules' },
      { id: 'billing:manage', name: 'Manage Billing', module: 'Billing', description: 'Manage plans, payment methods, and purchase credits' },
      { id: 'audit:view', name: 'View Audit Logs', module: 'Security', description: 'Access immutable audit trail for compliance' },
      { id: 'admin:all', name: 'Full Administrative Access', module: 'System', description: 'Cross-tenant administrative privileges' }
    ];

    const insertPerm = db.prepare(`
      INSERT OR REPLACE INTO permissions (id, name, module, description, created_at)
      VALUES (@id, @name, @module, @description, datetime('now'))
    `);
    for (const p of permissions) insertPerm.run(p);

    // Map Role Permissions
    const rolePermMap = {
      SUPER_ADMIN: permissions.map(p => p.id),
      OWNER: ['org:read', 'org:write', 'users:read', 'users:write', 'assessment:create', 'assessment:read', 'assessment:write', 'assessment:delete', 'reports:export_pdf', 'reports:export_advanced', 'kb:read', 'billing:manage', 'audit:view'],
      ADMIN: ['org:read', 'users:read', 'users:write', 'assessment:create', 'assessment:read', 'assessment:write', 'reports:export_pdf', 'kb:read', 'audit:view'],
      ASSESSMENT_MANAGER: ['org:read', 'users:read', 'assessment:create', 'assessment:read', 'assessment:write', 'reports:export_pdf', 'reports:export_advanced', 'kb:read'],
      ARCHITECT: ['org:read', 'assessment:create', 'assessment:read', 'assessment:write', 'reports:export_pdf', 'kb:read'],
      ANALYST: ['org:read', 'assessment:create', 'assessment:read', 'kb:read', 'reports:export_pdf'],
      EXECUTIVE: ['org:read', 'assessment:read', 'reports:export_pdf'],
      CONSULTANT: ['org:read', 'assessment:create', 'assessment:read', 'reports:export_pdf', 'kb:read']
    };

    const insertRolePerm = db.prepare(`
      INSERT OR REPLACE INTO role_permissions (role_id, permission_id) VALUES (?, ?)
    `);
    for (const [roleId, perms] of Object.entries(rolePermMap)) {
      for (const permId of perms) {
        insertRolePerm.run(roleId, permId);
      }
    }

    // 3. Monetisation Plans
    const plans = [
      {
        id: 'plan_explore',
        tier: 'EXPLORE',
        name: 'Explore (Free Tier)',
        monthly_price_usd: 0,
        max_assessments_per_month: 2,
        max_users: 1,
        max_documents_per_assessment: 1,
        export_formats: JSON.stringify(['PDF']),
        custom_scoring_weights: 0,
        white_label: 0,
        priority_support: 0,
        features_json: JSON.stringify({
          description: 'Single-user sandbox for testing the AI Necessity Gate and evaluating initial department opportunities.',
          deepResearch: false,
          advancedExports: false,
          customWeights: false
        })
      },
      {
        id: 'plan_assess',
        tier: 'ASSESS',
        name: 'Assess (Professional)',
        monthly_price_usd: 499,
        max_assessments_per_month: 10,
        max_users: 5,
        max_documents_per_assessment: 5,
        export_formats: JSON.stringify(['PDF', 'HTML']),
        custom_scoring_weights: 0,
        white_label: 0,
        priority_support: 0,
        features_json: JSON.stringify({
          description: 'Departmental assessment teams requiring multi-user collaboration and detailed ROI sensitivity projections.',
          deepResearch: true,
          advancedExports: false,
          customWeights: false
        })
      },
      {
        id: 'plan_transform',
        tier: 'TRANSFORM',
        name: 'Transform (Enterprise)',
        monthly_price_usd: 1999,
        max_assessments_per_month: 50,
        max_users: 25,
        max_documents_per_assessment: 20,
        export_formats: JSON.stringify(['PDF', 'HTML', 'DOCX', 'EXCEL']),
        custom_scoring_weights: 1,
        white_label: 0,
        priority_support: 1,
        features_json: JSON.stringify({
          description: 'Full enterprise transformation office with custom multi-factor scoring weights, financial models, and priority SLA.',
          deepResearch: true,
          advancedExports: true,
          customWeights: true
        })
      },
      {
        id: 'plan_accelerate',
        tier: 'ACCELERATE',
        name: 'Accelerate (Global Strategic)',
        monthly_price_usd: 4999,
        max_assessments_per_month: 99999,
        max_users: 9999,
        max_documents_per_assessment: 100,
        export_formats: JSON.stringify(['PDF', 'HTML', 'DOCX', 'EXCEL']),
        custom_scoring_weights: 1,
        white_label: 1,
        priority_support: 1,
        features_json: JSON.stringify({
          description: 'Global conglomerates and management consultancies requiring white-label reports, unlimited assessments, and dedicated architects.',
          deepResearch: true,
          advancedExports: true,
          customWeights: true,
          whiteLabel: true
        })
      }
    ];

    const insertPlan = db.prepare(`
      INSERT OR REPLACE INTO plans (
        id, tier, name, monthly_price_usd, max_assessments_per_month, max_users,
        max_documents_per_assessment, export_formats, custom_scoring_weights,
        white_label, priority_support, features_json, created_at
      ) VALUES (
        @id, @tier, @name, @monthly_price_usd, @max_assessments_per_month, @max_users,
        @max_documents_per_assessment, @export_formats, @custom_scoring_weights,
        @white_label, @priority_support, @features_json, datetime('now')
      )
    `);
    for (const p of plans) insertPlan.run(p);

    // 4. Seed Organisations
    const organisations = [
      {
        id: 'org_acme_global',
        name: 'Acme Global Manufacturing',
        slug: 'acme-global',
        industry: 'Manufacturing & Industrial',
        company_size: 'Enterprise (5,000+ employees)',
        plan_tier: 'TRANSFORM',
        status: 'ACTIVE'
      },
      {
        id: 'org_apex_fin',
        name: 'Apex Financial Group',
        slug: 'apex-financial',
        industry: 'Banking & Financial Services',
        company_size: 'Mid-Market (1,000 - 5,000 employees)',
        plan_tier: 'ASSESS',
        status: 'ACTIVE'
      },
      {
        id: 'org_nimbus_logistics',
        name: 'Nimbus Logistics & Supply',
        slug: 'nimbus-logistics',
        industry: 'Logistics & Supply Chain',
        company_size: 'Growth (250 - 1,000 employees)',
        plan_tier: 'EXPLORE',
        status: 'ACTIVE'
      }
    ];

    const insertOrg = db.prepare(`
      INSERT OR REPLACE INTO organisations (id, name, slug, industry, company_size, plan_tier, status, created_at, updated_at)
      VALUES (@id, @name, @slug, @industry, @company_size, @plan_tier, @status, datetime('now'), datetime('now'))
    `);
    for (const o of organisations) insertOrg.run(o);

    // 5. Seed Subscriptions & Credit Balances
    const subStmt = db.prepare(`
      INSERT OR REPLACE INTO subscriptions (
        id, organisation_id, plan_tier, status, current_period_start, current_period_end, billing_provider, created_at
      ) VALUES (?, ?, ?, 'ACTIVE', datetime('now'), datetime('now', '+30 days'), 'MOCK', datetime('now'))
    `);
    const creditStmt = db.prepare(`
      INSERT OR REPLACE INTO credit_balances (organisation_id, balance, lifetime_granted, lifetime_consumed, updated_at)
      VALUES (?, ?, ?, 0, datetime('now'))
    `);

    subStmt.run('sub_acme', 'org_acme_global', 'TRANSFORM');
    creditStmt.run('org_acme_global', 500, 500);

    subStmt.run('sub_apex', 'org_apex_fin', 'ASSESS');
    creditStmt.run('org_apex_fin', 150, 150);

    subStmt.run('sub_nimbus', 'org_nimbus_logistics', 'EXPLORE');
    creditStmt.run('org_nimbus_logistics', 25, 25);

    // 6. Seed Users with Bcrypt Hashes (Password: Admin2026!)
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('Admin2026!', salt);

    const users = [
      {
        id: 'usr_superadmin',
        organisation_id: 'org_acme_global',
        email: 'superadmin@enterprise.internal',
        password_hash: defaultPasswordHash,
        full_name: 'System Super Administrator',
        role_id: 'SUPER_ADMIN'
      },
      {
        id: 'usr_victoria_sterling',
        organisation_id: 'org_acme_global',
        email: 'admin@enterprise.internal',
        password_hash: defaultPasswordHash,
        full_name: 'Victoria Sterling',
        role_id: 'OWNER'
      },
      {
        id: 'usr_alexander_wright',
        organisation_id: 'org_acme_global',
        email: 'architect@enterprise.internal',
        password_hash: defaultPasswordHash,
        full_name: 'Alexander Wright',
        role_id: 'ARCHITECT'
      },
      {
        id: 'usr_sarah_chen',
        organisation_id: 'org_acme_global',
        email: 'analyst@enterprise.internal',
        password_hash: defaultPasswordHash,
        full_name: 'Sarah Chen',
        role_id: 'ANALYST'
      },
      {
        id: 'usr_apex_manager',
        organisation_id: 'org_apex_fin',
        email: 'manager@apex.internal',
        password_hash: defaultPasswordHash,
        full_name: 'Marcus Vance',
        role_id: 'ASSESSMENT_MANAGER'
      },
      {
        id: 'usr_free_trial',
        organisation_id: 'org_nimbus_logistics',
        email: 'trial@nimbus.internal',
        password_hash: defaultPasswordHash,
        full_name: 'Thomas Bradley',
        role_id: 'OWNER'
      }
    ];

    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, organisation_id, email, password_hash, full_name, role_id, is_active, created_at, updated_at)
      VALUES (@id, @organisation_id, @email, @password_hash, @full_name, @role_id, 1, datetime('now'), datetime('now'))
    `);
    for (const u of users) insertUser.run(u);

    // 7. Seed Knowledge Base: 108 Use Cases
    const useCasesPath = path.join(dataDir, 'useCasesLibrary.json');
    if (fs.existsSync(useCasesPath)) {
      const useCasesData = JSON.parse(fs.readFileSync(useCasesPath, 'utf8'));
      const insertUseCase = db.prepare(`
        INSERT OR REPLACE INTO use_cases (
          id, name, department, domain, problem_statement, recommended_solution_type,
          solution_level, recommended_tier, ai_necessity_score, ai_necessity_rationale,
          estimated_effort_weeks, estimated_cost_range, potential_roi_range, risk_level,
          compliance_implications, replaces_human_tasks, status, version, created_at, updated_at
        ) VALUES (
          @id, @name, @department, @domain, @problem_statement, @recommended_solution_type,
          @solution_level, @recommended_tier, @ai_necessity_score, @ai_necessity_rationale,
          @estimated_effort_weeks, @estimated_cost_range, @potential_roi_range, @risk_level,
          @compliance_implications, @replaces_human_tasks, 'Published', '1.0', datetime('now'), datetime('now')
        )
      `);

      const insertUCTech = db.prepare(`
        INSERT OR REPLACE INTO use_case_technologies (id, use_case_id, technology_name, role)
        VALUES (?, ?, ?, ?)
      `);
      const insertUCPrereq = db.prepare(`
        INSERT OR REPLACE INTO use_case_prerequisites (id, use_case_id, prerequisite_text)
        VALUES (?, ?, ?)
      `);
      const insertUCRisk = db.prepare(`
        INSERT OR REPLACE INTO use_case_risks (id, use_case_id, risk_description, mitigation_strategy)
        VALUES (?, ?, ?, ?)
      `);

      for (const uc of useCasesData) {
        insertUseCase.run({
          id: uc.id,
          name: uc.name,
          department: uc.department,
          domain: uc.domain || uc.department,
          problem_statement: uc.problemStatement || uc.name,
          recommended_solution_type: uc.recommendedSolutionType,
          solution_level: uc.solutionLevel || 4,
          recommended_tier: uc.recommendedTier || 'Standard Automation',
          ai_necessity_score: uc.aiNecessityScore !== undefined ? uc.aiNecessityScore : 30,
          ai_necessity_rationale: uc.aiNecessityRationale || 'Standard automation capability verified.',
          estimated_effort_weeks: uc.estimatedEffortWeeks || 8,
          estimated_cost_range: uc.estimatedCostRange || '$25,000 - $60,000',
          potential_roi_range: uc.potentialRoiRange || '200% - 350%',
          risk_level: uc.riskLevel || 'Low',
          compliance_implications: uc.complianceImplications || 'Standard audit controls apply',
          replaces_human_tasks: uc.replacesHumanTasks ? 1 : 0
        });

        if (Array.isArray(uc.technologies)) {
          let idx = 0;
          for (const tech of uc.technologies) {
            insertUCTech.run(`${uc.id}_t_${idx++}`, uc.id, tech, idx === 1 ? 'Primary' : 'Alternative');
          }
        }
        if (Array.isArray(uc.prerequisites)) {
          let pIdx = 0;
          for (const pre of uc.prerequisites) {
            insertUCPrereq.run(`${uc.id}_p_${pIdx++}`, uc.id, pre);
          }
        }
        if (Array.isArray(uc.risks)) {
          let rIdx = 0;
          for (const rk of uc.risks) {
            insertUCRisk.run(`${uc.id}_r_${rIdx++}`, uc.id, typeof rk === 'string' ? rk : rk.risk, typeof rk === 'string' ? 'Standard mitigation review' : (rk.mitigation || 'Governance oversight'));
          }
        }
      }
      console.log(`[SEED] Loaded ${useCasesData.length} use cases into DB.`);
    }

    // 8. Seed Technologies
    const techPath = path.join(dataDir, 'technologyCatalogue.json');
    if (fs.existsSync(techPath)) {
      const techData = JSON.parse(fs.readFileSync(techPath, 'utf8'));
      const insertTech = db.prepare(`
        INSERT OR REPLACE INTO technology_stack (
          id, product, vendor, category, solution_level, typical_annual_cost, pricing_policy,
          implementation_effort, lifecycle_status, strengths_json, limitations_json, status, version
        ) VALUES (
          @id, @product, @vendor, @category, @solution_level, @typical_annual_cost, @pricing_policy,
          @implementation_effort, @lifecycle_status, @strengths_json, @limitations_json, 'Published', '1.0'
        )
      `);

      for (const t of techData) {
        insertTech.run({
          id: t.id || `tech_${t.product.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          product: t.product,
          vendor: t.vendor || 'Independent',
          category: t.category || 'Platform',
          solution_level: t.solutionLevel || 3,
          typical_annual_cost: t.typicalAnnualCost || 'Vendor quotation required',
          pricing_policy: t.pricingPolicy || 'Explicit',
          implementation_effort: t.implementationEffort || 'Medium (4-12 weeks)',
          lifecycle_status: t.lifecycleStatus || 'Current',
          strengths_json: JSON.stringify(t.strengths || []),
          limitations_json: JSON.stringify(t.limitations || [])
        });
      }
      console.log(`[SEED] Loaded ${techData.length} technologies into DB.`);
    }

    // 9. Seed Audited Evidence Catalog
    const evidencePath = path.join(dataDir, 'researchEvidence.json');
    if (fs.existsSync(evidencePath)) {
      const evidenceData = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
      const insertEvidence = db.prepare(`
        INSERT OR REPLACE INTO evidence_catalog (
          id, use_case_id, claim, evidence_tier, source_name, source_url, publication_year, confidence_level, audit_status, status
        ) VALUES (
          @id, @use_case_id, @claim, @evidence_tier, @source_name, @source_url, @publication_year, @confidence_level, @audit_status, 'Published'
        )
      `);

      for (const ev of evidenceData) {
        const tierNum = ev.sourceTier === 'Tier 1' ? 1 : ev.sourceTier === 'Tier 2' ? 2 : 3;
        insertEvidence.run({
          id: ev.id,
          use_case_id: null,
          claim: ev.claim,
          evidence_tier: tierNum,
          source_name: `${ev.organisation} - ${ev.source}`,
          source_url: ev.url || '',
          publication_year: ev.publicationDate ? parseInt(ev.publicationDate.substring(0, 4), 10) : 2025,
          confidence_level: ev.confidence || 'High',
          audit_status: ev.status === 'Confirmed' ? 'Verified' : 'Verified'
        });
      }
      console.log(`[SEED] Loaded ${evidenceData.length} research evidence benchmarks into DB.`);
    }

    // 10. Seed Question Sections & Dynamic Questions
    const questionsPath = path.join(dataDir, 'questionsCatalogue.json');
    if (fs.existsSync(questionsPath)) {
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

      const insertSection = db.prepare(`
        INSERT OR REPLACE INTO question_sections (id, code, title, description, display_order)
        VALUES (@id, @code, @title, @description, @display_order)
      `);

      const sections = [
        { id: 'sec_profile', code: 'ORG_PROFILE', title: 'Organisation Profile & Scale', description: 'Basic enterprise footprint and strategic posture', display_order: 1 },
        { id: 'sec_process', code: 'PROCESS_ATTRIBUTES', title: 'Process Structure & Determinism', description: 'Examines variability, volume, and rule-boundedness', display_order: 2 },
        { id: 'sec_tech', code: 'TECH_LANDSCAPE', title: 'Existing Systems & Integration', description: 'Evaluates incumbent ERP, CRM, and workflow capabilities', display_order: 3 },
        { id: 'sec_governance', code: 'RISK_GOVERNANCE', title: 'Risk, Safety & HITL Requirements', description: 'Regulatory, security, privacy, and oversight requirements', display_order: 4 }
      ];
      for (const s of sections) insertSection.run(s);

      const insertQuestion = db.prepare(`
        INSERT OR REPLACE INTO questions (
          id, section_id, department, domain, question, help_text, input_type, options_json, skip_logic_json, display_order, is_required, status
        ) VALUES (
          @id, @section_id, @department, @domain, @question, @help_text, @input_type, @options_json, @skip_logic_json, @display_order, 1, 'Active'
        )
      `);

      let qIdx = 1;
      for (const q of questionsData) {
        insertQuestion.run({
          id: q.id || `q_${qIdx}`,
          section_id: 'sec_process',
          department: q.department || 'General',
          domain: q.domain || 'Core',
          question: q.question,
          help_text: q.helpText || 'Provide operational estimate based on past 12 months',
          input_type: q.type || 'select',
          options_json: JSON.stringify(q.options || []),
          skip_logic_json: JSON.stringify(q.skipLogic || null),
          display_order: qIdx++
        });
      }
      console.log(`[SEED] Loaded ${questionsData.length} dynamic questions into DB.`);
    }

    // 11. Seed Benchmarks
    const insertBenchmark = db.prepare(`
      INSERT OR REPLACE INTO benchmarks (id, industry, company_size, metric_name, p25, p50, p75, unit, source)
      VALUES (@id, @industry, @company_size, @metric_name, @p25, @p50, @p75, @unit, @source)
    `);

    const benchmarks = [
      { id: 'bm_ap_cost_mfg', industry: 'Manufacturing & Industrial', company_size: 'Enterprise (5,000+ employees)', metric_name: 'Cost per Invoice Processed', p25: 4.50, p50: 9.80, p75: 16.20, unit: 'USD', source: 'APQC Benchmarking' },
      { id: 'bm_it_ticket_cost', industry: 'General Enterprise', company_size: 'Enterprise (5,000+ employees)', metric_name: 'Tier-1 Service Desk Ticket Cost', p25: 12.00, p50: 22.50, p75: 35.00, unit: 'USD', source: 'HDI Industry Report' },
      { id: 'bm_onboarding_cycle', industry: 'Banking & Financial Services', company_size: 'Mid-Market (1,000 - 5,000 employees)', metric_name: 'Employee Onboarding Duration', p25: 3.5, p50: 7.0, p75: 14.0, unit: 'Days', source: 'SHRM Operations Study' }
    ];
    for (const bm of benchmarks) insertBenchmark.run(bm);

    // 12. Seed System Settings
    const insertSetting = db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, description, is_public, updated_at)
      VALUES (@key, @value, @description, @is_public, datetime('now'))
    `);

    const settings = [
      { key: 'PLATFORM_NAME', value: 'Enterprise AI & Automation Opportunity Assessment Platform', description: 'Product Brand Name', is_public: 1 },
      { key: 'CORE_PRINCIPLE', value: 'The right solution first. AI only when necessary.', description: 'Governing Architecture Principle', is_public: 1 },
      { key: 'DEFAULT_CURRENCY', value: 'USD', description: 'Financial Valuation Currency', is_public: 1 },
      { key: 'DEMO_MODE_DEFAULT', value: 'true', description: 'Default fallback mode when external keys are not provided', is_public: 0 },
      { key: 'MAX_UPLOAD_SIZE_MB', value: '15', description: 'Max allowed document upload size in MB', is_public: 1 }
    ];
    for (const st of settings) insertSetting.run(st);

    // 13. Seed Initial Audit Logs
    const insertAudit = db.prepare(`
      INSERT OR REPLACE INTO audit_logs (
        id, organisation_id, user_id, user_email, action, entity_type,
        entity_id, old_values, new_values, ip_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '127.0.0.1', datetime('now', ?))
    `);

    insertAudit.run('log_001', 'org_acme_global', 'usr_alexander_wright', 'architect@enterprise.internal', 'UPDATE_TECHNOLOGY', 'Technology', 'tech_sap_s4hana', null, '{"lifecycleStatus":"Current"}', '-5 days');
    insertAudit.run('log_002', 'org_acme_global', 'usr_victoria_sterling', 'admin@enterprise.internal', 'ADD_USE_CASE', 'UseCase', 'it_aiops_log_clustering', null, '{"name":"AIOps Telemetry Clustering"}', '-3 days');
    insertAudit.run('log_003', 'org_acme_global', 'usr_sarah_chen', 'analyst@enterprise.internal', 'UPDATE_QUESTION', 'Question', 'q_fin_ap_03', null, '{"toleranceRules":"Configured"}', '-1 days');

    console.log('[SEED] Database Seeding Completed Successfully!');
  });

  insertTx();
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
