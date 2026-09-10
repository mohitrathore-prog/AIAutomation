# Enterprise AI & Automation Opportunity Assessment Platform

> **"The right solution first. AI only when necessary."**

[![Automated Tests](https://img.shields.io/badge/Anti--AI%20Overuse%20Tests-17%2F17%20Passing-brightgreen)](tests/antiAiOveruse.test.js)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](package.json)
[![Node](https://img.shields.io/badge/Node.js-v18%2B-informational)](package.json)

A corporate-grade enterprise web application designed to identify, assess, prioritise, and quantify opportunities for process improvement, automation, and artificial intelligence across an organisation.

This is **NOT** an "AI idea generator". The platform is **technology-neutral, evidence-based, cost-conscious, and business-outcome focused**.

---

## 🏛 Core Philosophy

The central principle governing the entire platform:

> **Never recommend AI merely because AI is fashionable or because an AI solution is possible. Introduce AI only when it is genuinely required to solve the identified business problem, or when it provides a demonstrable and economically justified advantage over a simpler solution.**

The system actively finds the **simplest, most effective, secure, maintainable, and economically justified solution** for every business problem:
* If a process can be eliminated or simplified $\rightarrow$ **Process Improvement**
* If existing ERP/ITSM capabilities can solve it $\rightarrow$ **Existing Platform Feature**
* If business rules or thresholds suffice $\rightarrow$ **Deterministic Rule-Based Engine**
* If sequential steps or approvals are needed $\rightarrow$ **Workflow Automation**
* If two systems have structured data $\rightarrow$ **API / Integration**
* If an air-gapped legacy terminal lacks APIs $\rightarrow$ **RPA**
* If multi-variate statistical prediction is required $\rightarrow$ **Machine Learning**
* If unstructured semantic understanding is strictly needed $\rightarrow$ **Targeted Generative AI / RAG**
* If multi-step dynamic execution across systems is required $\rightarrow$ **Supervised Agentic AI**

---

## ✨ Key Features

### 1. 14-Level Solution-Selection Hierarchy
Every business problem passes through a contextual 14-level hierarchy:
```text
BUSINESS PROBLEM
      ↓
Can the process be eliminated?
      ↓
Can the process be simplified?
      ↓
Can existing application functionality solve it?
      ↓
Can configuration solve it?
      ↓
Can rules solve it?
      ↓
Can workflow solve it?
      ↓
Can an existing API/integration solve it?
      ↓
Can scripting solve it?
      ↓
Can RPA solve it?
      ↓
Is machine learning required?
      ↓
Is generative AI genuinely required?
      ↓
Is AI-enabled automation genuinely required?
      ↓
Is agentic AI genuinely required?
      ↓
Only then recommend the applicable technology
```

### 2. 8-Criteria AI Necessity Gate
No AI recommendation can be made unless at least one core necessity criterion is proven:
1. **Unstructured Information**: High variance in documents, images, audio, or natural language.
2. **Subjective Interpretation**: Non-deterministic interpretation required.
3. **Forecasting / Prediction**: Non-linear regression or statistical clustering.
4. **Semantic Understanding**: Context and meaning needed beyond exact rule matching.
5. **Contextual Reasoning**: Complex ambiguous multi-variable constraints.
6. **Natural Language Interaction**: Conversational dialogue required.
7. **Dynamic Decision-Making**: Selecting actions dynamically based on runtime context.
8. **Autonomous Multi-Step Execution**: Coordinated multi-tool agent planning.

### 3. Incremental Economic Justification
Even if AI is technically viable, the engine models:
$$\text{Incremental Net Benefit} = \Delta \text{Annual Benefits} - \Delta \text{Annual Operating Costs}$$
If incremental value does not cover the additional implementation, token consumption, security review, and maintenance overhead, the engine flags:
> **"AI technically applicable but economically unjustified."** $\rightarrow$ Recommends the simpler option.

### 4. Existing Technology First (Minimum Technology Principle)
Reuses existing enterprise footprints before introducing new vendor licenses:
* **SAP** (S/4HANA automated 3-way matching and clearing rules)
* **ServiceNow** (Flow Designer, IntegrationHub, Service Catalog)
* **Microsoft 365 / Azure** (Power Automate, Entra ID SSPR, Logic Apps, Azure OpenAI private endpoints)
* **Salesforce** (Flow Builder, Omnichannel routing)
* **UiPath** (Existing Unattended Robot runtime and Document Understanding)
* **Workday** (Business Process Framework)

### 5. 108 Curated Enterprise Use Cases
Structured database spanning all 10 departments with full 40-point metadata schemas:
* **IT** (16 cases): Self-Service Password Reset, Ticket Triage, AIOps, Patch Management, Cloud FinOps...
* **Finance** (16 cases): Intelligent Invoice Processing, Automated 3-Way Matching, Bank Statement Reconciliation, Expense Audit...
* **HR** (12 cases): Employee Onboarding Pipeline, Grounded Policy Assistant, Candidate Resume Screening, Offboarding...
* **Legal** (8 cases): Non-Standard Contract Clause Deviation Review, Mutual NDA Triage, Regulatory Monitoring...
* **Procurement** (10 cases): PO Conversion, Supplier Onboarding, Spend Classification, Price Leakage Audit...
* **Customer Service** (10 cases): Case Triage, Real-Time Response Drafter, SLA Countdown Escalations...
* **Sales** (10 cases): CRM Meeting Sync, Territory Lead Routing, CPQ Proposal Generation...
* **Supply Chain** (8 cases): Inventory Safety Stock Reorders, Machine Learning Demand Forecasting, Carrier Audits...
* **Operations** (6 cases): Shift Scheduling Optimization, Digital SOP Auditing, Predictive Maintenance...
* **Back Office** (12 cases): Unstructured Document Ingestion, AS400 Legacy RPA, Master Data Hygiene...

### 6. Institutional Executive Deliverables
* **Executive Results Dashboard**: KPIs, Phased Transformation Roadmap (0–3m, 3–6m, 6–12m, 12–24m).
* **Interactive 2x2 Opportunity Matrix**: Business Value vs. Implementation Readiness SVG plot.
* **Deep-Dive Use Case Explorer**: 40-point metadata, Current-State vs. Future-State SVG workflow diagrams, and conceptual UI mockups with mandatory disclaimers.
* **Downloadable Corporate Report**: Self-contained, print-optimized executive PDF report.
* **Admin Portal (`/admin`)**: Full CRUD management for use cases, technologies, questions, and system audit trails.

---

## 🧪 Automated Testing & Verification

The platform contains a dedicated test harness implementing **17 automated assertions** covering mandatory Anti-AI Overuse scenarios and Critical Acceptance Tests A through L.

To run the test suite:
```bash
npm test
```

### Test Suite Results (17/17 Passing):
* `[PASS]` **TEST 1**: Fixed data transfer between two systems $\rightarrow$ **API / Integration** (AI strictly rejected).
* `[PASS]` **TEST 2**: Fixed approval workflow $\rightarrow$ **Workflow Automation** (AI strictly rejected).
* `[PASS]` **TEST 3**: Scheduled batch report $\rightarrow$ **Scripting & Automation** (AI strictly rejected).
* `[PASS]` **TEST 4**: Simple threshold validation $\rightarrow$ **Rule-Based Engine** (AI strictly rejected).
* `[PASS]` **TEST 5**: Variable contract interpretation $\rightarrow$ **AI-assisted solution with mandatory Human-In-The-Loop**.
* `[PASS]` **TEST 6**: Document classification economic gate $\rightarrow$ **Rejects AI if incremental ROI is insufficient**.
* `[PASS]` **TEST 7**: Enterprise conversational assistant $\rightarrow$ **Generative AI / RAG with grounded citations**.
* `[PASS]` **TEST 8**: Multi-system dynamic task execution $\rightarrow$ **Agentic AI with strict supervisor boundaries**.
* `[PASS]` **ACCEPTANCE A**: Deterministic process receives NO AI recommendation.
* `[PASS]` **ACCEPTANCE B**: Existing enterprise capability (SAP) reused before recommending new software.
* `[PASS]` **ACCEPTANCE C**: AI recommendation provides explicit necessity justification.
* `[PASS]` **ACCEPTANCE D**: Economic justification rejects low incremental ROI AI.
* `[PASS]` **ACCEPTANCE F**: Unverified vendor pricing replaced with *"Vendor quotation required"*.
* `[PASS]` **ACCEPTANCE G**: ROI is formula-driven with transparent stated assumptions.
* `[PASS]` **ACCEPTANCE I**: System explicitly recommends *"No AI"* as a positive outcome.
* `[PASS]` **ACCEPTANCE J**: System recommends *"No new technology required"* when existing stack suffices.
* `[PASS]` **ACCEPTANCE L**: Quality controller blocks high-risk AI lacking human-in-the-loop oversight.

---

## 🚀 Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm (v9 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mohitrathore-prog/AIAutomation.git
   cd AIAutomation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for demo mode):
   ```bash
   cp .env.example .env
   ```

4. Start the application:
   ```bash
   npm start
   ```

5. Open your browser:
   * **Web Application**: `http://localhost:3050`
   * **Admin Portal**: `http://localhost:3050/#admin`
   * **Live Test Harness**: `http://localhost:3050/#live-tests`
   * **My Workspace**: `http://localhost:3050/#workspace`
   * **Plans & Billing**: `http://localhost:3050/#billing`
   * **Sample Report**: `http://localhost:3050/#sample-report`

---

## 🏛 Production SaaS Architecture

### 1. Multi-Tenant Database Layer (`server/db/`)
* **36 Tables** with SQLite WAL mode and strict relational foreign keys.
* Complete tenant isolation where every tenant-owned record contains `organisation_id`.
* Automatic migrations, atomic ACID transactions, and double-entry credit ledger.

### 2. Enterprise Authentication & Granular RBAC (`server/services/authService.js`)
* **Password Security**: Bcrypt with work factor 10.
* **Token Rotation**: Cryptographic session tokens with refresh token rotation and revocation.
* **Fail-Closed Security**: In production (`NODE_ENV=production`), server strictly terminates if `JWT_SECRET` is default or weak.
* **8 Enterprise Roles**: Super Admin, Owner, Admin, Assessment Manager, Architect, Analyst, Executive, Consultant.

### 3. Monetisation, Entitlements & Pluggable Billing (`server/services/entitlementService.js`)
* **Plans**: `EXPLORE` ($0), `ASSESS` ($499/mo), `TRANSFORM` ($1,999/mo), `ACCELERATE` ($4,999/mo).
* **Enforced Limits**: Monthly assessment caps, team user limits, export formats (PDF, HTML, DOCX, EXCEL), custom scoring weights, and priority SLA.
* **Credit Ledger**: Double-entry accounting for AI model runs, deep research, and document extraction.
* **Billing Adapter**: Pluggable provider architecture with Mock provider and Stripe webhook endpoints.

### 4. Document Ingestion & Process Discovery (`server/adapters/documentProcessor.js`)
* Strict MIME validation (PDF, DOCX, XLSX, TXT, CSV) with 15MB file size limit.
* Heuristic process discovery detecting Accounts Payable, IT Service Desk, Legal Review, and HR workflows.

### 5. Cryptographic Report Verification (`server/services/reportService.js`)
* Immutable report snapshots stamped with SHA-256 checksums to guarantee regulatory auditability.

---

## 🏗 Directory Structure

```text
AIAutomation/
├── public/                       # Corporate Frontend Single-Page App
│   ├── index.html                # Executive layout (Wizard, Dashboard, Workspace, Billing, Admin, Tests)
│   ├── styles/
│   │   └── corporate.css         # Executive design system (Accessible, Slate/Navy theme)
│   └── scripts/
│       ├── app.js                # Frontend state, auth, routing, wizard controller
│       ├── matrix.js             # Interactive 2x2 Opportunity Matrix SVG renderer
│       └── admin.js              # Admin portal management controller
├── server/                       # Backend Application & Services
│   ├── server.js                 # Production Express gateway (Helmet, Rate-Limiting, Fail-Closed)
│   ├── db/                       # Database Persistence Layer
│   │   ├── schema.sql            # 36-table schema definition
│   │   ├── index.js              # Connection runner, transactions, and audit logger
│   │   └── seed.js               # Multi-tenant RBAC, plans, and knowledge base seeder
│   ├── middleware/               # Security & Gateway Middleware
│   │   ├── auth.js               # JWT extraction, session verification, demo fallback
│   │   ├── rbac.js               # Role & permission enforcement, tenant isolation
│   │   └── entitlements.js       # Monthly quota and credit enforcement
│   ├── services/                 # Core Business Services
│   │   ├── authService.js        # Bcrypt, JWT rotation, session revocation
│   │   ├── entitlementService.js # Quotas, plan features, credit ledger
│   │   └── reportService.js      # Immutable snapshots & SHA-256 integrity checks
│   ├── adapters/                 # Pluggable Service Adapters
│   │   ├── billingAdapter.js     # Mock billing provider & Stripe webhook architecture
│   │   ├── documentProcessor.js  # Multer upload, MIME validation, process extractor
│   │   ├── aiProvider.js         # Unified LLM adapter (Mock, OpenAI, Azure, Claude)
│   │   ├── researchAdapter.js    # Company footprint research (Tier 1/2/3 sources)
│   │   ├── diagramAdapter.js     # Structured SVG workflow & architecture generator
│   │   ├── visualAdapter.js      # Conceptual UI mockup renderer (with disclaimers)
│   │   └── pdfAdapter.js         # Printable executive report generator
│   ├── engine/                   # Core Deterministic Logic Engines
│   │   ├── solutionHierarchy.js  # 14-Level Solution-Selection Hierarchy
│   │   ├── aiNecessityGate.js    # 8-Criteria AI Necessity Gate
│   │   ├── economicJustification.js # Incremental ROI & Hurdle model
│   │   ├── technologyMatcher.js  # Compatibility matrix & existing stack reuse
│   │   ├── roiEngine.js          # Deterministic ROI & scenario modeler
│   │   ├── scoringEngine.js      # 7-factor weighted scoring & priority classification
│   │   └── qualityController.js  # Gatekeeper: pricing integrity & deduplication
│   ├── data/                     # Knowledge Base & Reference Data
│   │   ├── useCasesLibrary.json  # 108 Real-world enterprise use cases (40-point metadata)
│   │   ├── technologyCatalogue.json # 21+ Enterprise systems with pricing & lifecycle
│   │   ├── questionsCatalogue.json  # Dynamic conditional questions bank
│   │   ├── industryTaxonomy.json    # 24 Selectable enterprise industries & standards
│   │   └── researchEvidence.json    # Verified Tier-1/2 analyst citations
│   └── routes/                   # REST API Endpoints
│       ├── authRoutes.js         # /api/auth register, login, refresh, logout, me
│       ├── billingRoutes.js      # /api/billing plans, entitlements, upgrade, invoices
│       ├── documentRoutes.js     # /api/documents upload and list
│       ├── assessmentRoutes.js   # /api/evaluate, /api/drafts, /api/assessments, /api/reports
│       ├── adminRoutes.js        # /api/admin CRUD & audit logging
│       └── testRoutes.js         # /api/tests live execution harness
├── tests/
│   ├── antiAiOveruse.test.js     # Anti-AI Overuse CLI test suite (17 tests)
│   ├── integration.test.js       # End-to-end API route validation (10 tests)
│   └── saasProduction.test.js    # SaaS Production & Security test suite (8 scenarios)
├── .env.example                  # Environment configuration template
├── package.json
└── README.md
```

---

## 🧪 Comprehensive Automated Test Suites

The platform includes **35 automated test assertions** verifying anti-AI overuse, end-to-end integration, and production SaaS security:

```bash
# Run all test suites
npm test

# Run individual test suites
npm run test:anti-ai
npm run test:integration
npm run test:saas
```

---

## 📄 License
ISC License. Built for enterprise process assessment, automation prioritization, and evidence-based AI transformation.
