-- ====================================================================
-- Enterprise AI & Automation Opportunity Assessment Platform
-- Production Database Schema (SQLite / PostgreSQL Compatible)
-- Core Principle: "The right solution first. AI only when necessary."
-- ====================================================================

PRAGMA foreign_keys = ON;

-- 1. Organisations (Tenant Root)
CREATE TABLE IF NOT EXISTS organisations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry TEXT,
  company_size TEXT,
  plan_tier TEXT DEFAULT 'EXPLORE',
  status TEXT DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. System and Custom Roles
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Granular Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Role Permissions Junction
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 5. Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role_id TEXT NOT NULL REFERENCES roles(id),
  is_active INTEGER DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Sessions & Revocation
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  organisation_id TEXT,
  user_id TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Monetisation Plans
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  tier TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  monthly_price_usd REAL NOT NULL,
  max_assessments_per_month INTEGER NOT NULL,
  max_users INTEGER NOT NULL,
  max_documents_per_assessment INTEGER NOT NULL,
  export_formats TEXT NOT NULL, -- JSON array e.g. ["PDF", "HTML"]
  custom_scoring_weights INTEGER DEFAULT 0,
  white_label INTEGER DEFAULT 0,
  priority_support INTEGER DEFAULT 0,
  features_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  organisation_id TEXT UNIQUE NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  plan_tier TEXT NOT NULL REFERENCES plans(tier),
  status TEXT DEFAULT 'ACTIVE',
  current_period_start DATETIME,
  current_period_end DATETIME,
  cancel_at_period_end INTEGER DEFAULT 0,
  billing_provider TEXT DEFAULT 'MOCK',
  external_subscription_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Credit Balances
CREATE TABLE IF NOT EXISTS credit_balances (
  organisation_id TEXT PRIMARY KEY REFERENCES organisations(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 100,
  lifetime_granted INTEGER DEFAULT 100,
  lifetime_consumed INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Credit Transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id TEXT,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Versioned Use Cases Library
CREATE TABLE IF NOT EXISTS use_cases (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  domain TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  recommended_solution_type TEXT NOT NULL,
  solution_level INTEGER NOT NULL,
  recommended_tier TEXT NOT NULL,
  ai_necessity_score INTEGER NOT NULL,
  ai_necessity_rationale TEXT,
  estimated_effort_weeks INTEGER,
  estimated_cost_range TEXT,
  potential_roi_range TEXT,
  risk_level TEXT,
  compliance_implications TEXT,
  replaces_human_tasks INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Published',
  version TEXT DEFAULT '1.0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. Use Case Technologies
CREATE TABLE IF NOT EXISTS use_case_technologies (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  technology_name TEXT NOT NULL,
  role TEXT DEFAULT 'Primary'
);

-- 14. Use Case Prerequisites
CREATE TABLE IF NOT EXISTS use_case_prerequisites (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  prerequisite_text TEXT NOT NULL
);

-- 15. Use Case Risks & Mitigations
CREATE TABLE IF NOT EXISTS use_case_risks (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  risk_description TEXT NOT NULL,
  mitigation_strategy TEXT NOT NULL
);

-- 16. Use Case Metrics
CREATE TABLE IF NOT EXISTS use_case_metrics (
  id TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  baseline_estimate TEXT,
  target_improvement TEXT
);

-- 17. Standardised Technology Stack Catalogue
CREATE TABLE IF NOT EXISTS technology_stack (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  vendor TEXT NOT NULL,
  category TEXT NOT NULL,
  solution_level INTEGER NOT NULL,
  typical_annual_cost TEXT NOT NULL,
  pricing_policy TEXT NOT NULL DEFAULT 'Explicit',
  implementation_effort TEXT,
  lifecycle_status TEXT DEFAULT 'Current',
  strengths_json TEXT,
  limitations_json TEXT,
  status TEXT DEFAULT 'Published',
  version TEXT DEFAULT '1.0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. Audited Evidence Catalog
CREATE TABLE IF NOT EXISTS evidence_catalog (
  id TEXT PRIMARY KEY,
  use_case_id TEXT,
  claim TEXT NOT NULL,
  evidence_tier INTEGER NOT NULL, -- Tier 1 (Gov/Peer-reviewed), Tier 2 (Analyst), Tier 3 (Vendor)
  source_name TEXT NOT NULL,
  source_url TEXT,
  publication_year INTEGER,
  confidence_level TEXT NOT NULL,
  audit_status TEXT NOT NULL DEFAULT 'Verified',
  status TEXT DEFAULT 'Published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 19. Question Sections
CREATE TABLE IF NOT EXISTS question_sections (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL
);

-- 20. Questions
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  section_id TEXT REFERENCES question_sections(id),
  department TEXT NOT NULL,
  domain TEXT NOT NULL,
  question TEXT NOT NULL,
  help_text TEXT,
  input_type TEXT NOT NULL,
  options_json TEXT NOT NULL,
  skip_logic_json TEXT,
  display_order INTEGER DEFAULT 1,
  is_required INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. Question Rules (Adaptive branching logic)
CREATE TABLE IF NOT EXISTS question_rules (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  trigger_question_id TEXT NOT NULL,
  trigger_operator TEXT NOT NULL,
  trigger_value TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 22. Assessment Drafts (Save/Resume & Autosave)
CREATE TABLE IF NOT EXISTS assessment_drafts (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  answers_json TEXT NOT NULL,
  status TEXT DEFAULT 'IN_PROGRESS',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. Assessments (Finalized Assessments)
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  draft_id TEXT,
  title TEXT NOT NULL,
  organisation_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  departments_json TEXT NOT NULL,
  domains_json TEXT NOT NULL,
  existing_systems_json TEXT NOT NULL,
  strategic_priorities_json TEXT,
  constraints_json TEXT,
  raw_score REAL,
  normalized_score REAL,
  readiness_tier TEXT,
  executive_summary TEXT,
  status TEXT DEFAULT 'COMPLETED',
  version TEXT DEFAULT '1.0',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 24. Assessment Recommendations
CREATE TABLE IF NOT EXISTS assessment_recommendations (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  use_case_id TEXT NOT NULL REFERENCES use_cases(id),
  rank_order INTEGER NOT NULL,
  solution_level INTEGER NOT NULL,
  recommended_tier TEXT NOT NULL,
  necessity_gate_passed INTEGER NOT NULL,
  necessity_rationale TEXT,
  strategic_fit_score REAL,
  feasibility_score REAL,
  risk_score REAL,
  composite_score REAL,
  estimated_capex REAL,
  estimated_opex REAL,
  estimated_payback_months REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 25. Assessment ROI Projections (Scenarios)
CREATE TABLE IF NOT EXISTS assessment_roi_projections (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL, -- 'Conservative', 'Expected', 'Optimistic'
  implementation_cost REAL NOT NULL,
  annual_opex REAL NOT NULL,
  annual_labor_savings REAL NOT NULL,
  annual_error_reduction_value REAL NOT NULL,
  annual_revenue_gain REAL NOT NULL,
  annual_net_benefit REAL NOT NULL,
  payback_months REAL NOT NULL,
  three_year_roi_percent REAL NOT NULL,
  assumptions_json TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 26. Assessment Governance Flags
CREATE TABLE IF NOT EXISTS assessment_governance_flags (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mitigation_requirement TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 27. Assessment Snapshots (Tamper-evident verification)
CREATE TABLE IF NOT EXISTS assessment_snapshots (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  snapshot_data_json TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 28. Report Snapshots (Immutable deliverables)
CREATE TABLE IF NOT EXISTS report_snapshots (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  report_format TEXT NOT NULL,
  summary_json TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  generated_by TEXT NOT NULL,
  is_immutable INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 29. Uploaded Documents
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id TEXT REFERENCES assessments(id) ON DELETE SET NULL,
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  extraction_status TEXT DEFAULT 'PENDING',
  extracted_text TEXT,
  demo_mode INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 30. Document Analyses
CREATE TABLE IF NOT EXISTS document_analyses (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  detected_processes_json TEXT,
  pain_points_json TEXT,
  recommended_solution_types_json TEXT,
  ai_relevance_analysis_json TEXT,
  confidence_score REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 31. Industry Benchmarks
CREATE TABLE IF NOT EXISTS benchmarks (
  id TEXT PRIMARY KEY,
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  p25 REAL,
  p50 REAL,
  p75 REAL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 32. Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  amount_usd REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'PAID',
  invoice_pdf_url TEXT,
  line_items_json TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 33. Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role_id TEXT NOT NULL REFERENCES roles(id),
  token TEXT UNIQUE NOT NULL,
  invited_by TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  accepted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 34. Custom Scoring Models
CREATE TABLE IF NOT EXISTS custom_scoring_models (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default INTEGER DEFAULT 0,
  strategic_weight REAL DEFAULT 0.25,
  feasibility_weight REAL DEFAULT 0.20,
  economic_weight REAL DEFAULT 0.25,
  risk_weight REAL DEFAULT 0.15,
  time_to_value_weight REAL DEFAULT 0.15,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 35. System Settings
CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  is_public INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 36. Persistent Rate Limiting
CREATE TABLE IF NOT EXISTS rate_limit_records (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  expire_at INTEGER NOT NULL
);

-- Performance & Isolation Indexes
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_assessments_org ON assessments(organisation_id);
CREATE INDEX IF NOT EXISTS idx_drafts_org ON assessment_drafts(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_docs_org ON documents(organisation_id);
CREATE INDEX IF NOT EXISTS idx_use_cases_dept ON use_cases(department);
CREATE INDEX IF NOT EXISTS idx_use_cases_sol ON use_cases(recommended_solution_type);
