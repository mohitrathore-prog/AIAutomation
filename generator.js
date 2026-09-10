/**
 * AI Use Case Discovery & Solution Blueprint Generator
 * Contains detailed templates and rules to compile enterprise-grade solution designs.
 */

const AIUseCaseRepository = [
  {
    title: "COiN (Contract Intelligence) Platform",
    industry: "Banking & Financial Services",
    summary: "RAG-based contract analysis pipeline validating compliance checkpoints and terms against legal playbooks.",
    source: "JPMorgan Chase (2023)",
    pattern: "Generative AI (RAG)",
    lessons: "Standardized query template restrictions prevent hallucinations on regulatory clauses."
  },
  {
    title: "Predictive Warehouse Demand Forecasting",
    industry: "Retail & Consumer Goods",
    summary: "Predictive ML pipeline analyzing sales seasons and logistics lag to forecast rolling warehouse replenishment.",
    source: "Walmart Inc (2024)",
    pattern: "Predictive AI & Machine Learning",
    lessons: "Incorporating soft manager overrides helps adjust forecasts during local marketing campaigns."
  },
  {
    title: "Agentic SRE Incident Handler",
    industry: "Technology, Media & Telecom (TMT)",
    summary: "Multi-agent system listening to webhook alerts, indexing log errors, and running recovery playbooks.",
    source: "Cloudflare (2025)",
    pattern: "Agentic AI Multi-Agent System",
    lessons: "Strict privilege sandboxing and human-in-the-loop validation is critical for automated remediations."
  },
  {
    title: "Cognitive Freight Rate Ledger Engine",
    industry: "Logistics & Supply Chain",
    summary: "OCR documents scanner extracting carrier rates and auditing journal transactions in SAP ERP.",
    source: "DHL Global Forwarding (2024)",
    pattern: "Generative AI (RAG)",
    lessons: "Establishing threshold checks on OCR extraction scores prevents malformed inputs to general ledgers."
  },
  {
    title: "Self-Service Patient Support Concierge",
    industry: "Healthcare & Life Sciences",
    summary: "HIPAA-compliant conversational assistant answering benefits and appointment queries using localized documents.",
    source: "Mayo Clinic (2024)",
    pattern: "Generative AI (RAG)",
    lessons: "Air-gapping PII data vaults and enforcing token masking is mandatory for patient queries."
  },
  {
    title: "Regulatory Intelligence Monitor",
    industry: "Professional Services",
    summary: "Monitoring government journals, translating updates, and mapping compliance changes to corporate policies.",
    source: "Deloitte Compliance (2025)",
    pattern: "Generative AI (RAG)",
    lessons: "Categorization vector matching requires continuous taxonomy tuning to avoid warning alert fatigue."
  }
];

// Export to window for settings panel browsing
if (typeof window !== 'undefined') {
  window.AIUseCaseRepository = AIUseCaseRepository;
}

const BlueprintTemplates = {
  "IT": {
    "DevOps": {
      title: "Agentic DevOps & SRE Incident Management System",
      aiType: "Agentic AI & LLMs",
      complexity: 7,
      readiness: 6,
      summary: "Deploy an intelligent agentic orchestration layer integrated with DevOps toolchains to automatically analyze, triage, and remediate system alerts, minimizing Mean Time to Repair (MTTR).",
      problem: "Incident management in DevOps operations is highly manual, leading to prolonged system outages, alert fatigue for SRE teams, and inconsistent root-cause analysis (RCA). System parameters are checked manually across multiple dashboard tools, delaying resolution.",
      currentState: "SREs manually parse logs from Observability tools, research post-mortems in Confluence, open Jira tickets, run scripts to verify server health, and manually restart services or apply hotfixes.",
      solution: "Deploy an Agentic AI SRE team that listens to webhook alerts. The lead agent coordinates specialized subagents: a Log Analyzer subagent, a Knowledge Base retriever (RAG over Confluence/post-mortems), and an Execution subagent that runs secure playbook scripts via API to safely diagnose and apply pre-approved remediations.",
      dataRequirements: [
        { category: "Application Logs", type: "Unstructured", format: "JSON/Text", purpose: "Error trace and stack dump analysis" },
        { category: "Historical Incidents", type: "Semi-Structured", format: "Jira API / JSON", purpose: "Finding historical resolution patterns" },
        { category: "Runbooks & Post-mortems", type: "Unstructured", format: "PDF / Markdown", purpose: "Instructional guides for system recovery" }
      ],
      dataSources: [
        { source: "ServiceNow / Jira", type: "Ticketing System", desc: "For tracking, updating, and raising incident logs." },
        { source: "Datadog / Prometheus", type: "Observability Platform", desc: "Source of metric alerts and trace logs." },
        { source: "Confluence", type: "Knowledge Base", desc: "SOPs, runbooks, and historical incident post-mortems." }
      ],
      stakeholders: ["VP of Infrastructure", "Director of SRE", "DevOps Manager", "Chief Information Security Officer (CISO)"],
      teamStructure: ["1 Program Manager", "1 Lead AI Architect", "1 SRE/DevOps Engineer", "1 Data Platform Engineer", "1 Prompt/Agent Engineer"],
      skills: ["Agentic workflows (LangGraph/Semantic Kernel)", "Observability APIs (Datadog/NewRelic)", "Kubernetes & Infrastructure-as-Code (Terraform)", "Secure API Gateways"],
      risks: {
        technical: "Incorrect playbook execution causing cascading server failures.",
        operational: "Resistance from traditional SRE teams fearing job displacement.",
        security: "Agent executing privileged CLI commands. Requires strict sandboxing.",
        compliance: "GDPR compliance on log data containing raw user PII."
      },
      successMetrics: [
        "70% reduction in Mean Time to Repair (MTTR)",
        "85% automated triage accuracy within 3 minutes of alert",
        "60% decrease in manual pager alerts for SRE team members"
      ],
      benchmarks: [
        {
          org: "Global Cloud Service Provider",
          story: "Implemented an agentic incident triager that reduced P1 incident resolution times from 45 minutes to under 8 minutes.",
          source: "AWS Case Studies (2025)",
          lessons: "Implementing a human-in-the-loop validation for any write/deploy action is critical in the early phases."
        }
      ]
    },
    "default": {
      title: "Self-Healing IT Service Desk & Knowledge Retrieval System",
      aiType: "Generative AI (RAG)",
      complexity: 5,
      readiness: 7,
      summary: "Implement an intelligent agentic assistant that resolves common IT service requests, resets passwords, and answers employee queries based on IT documentation.",
      problem: "IT Service Desk teams are overwhelmed with repetitive tickets (password resets, software provisioning, access management), resulting in high queue times and reduced productivity for employees.",
      currentState: "Employees raise Jira/ServiceNow tickets. IT support analysts manually verify identities, check rules, run scripts, and close tickets. Average resolution takes 4 hours.",
      solution: "Deploy an LLM-powered RAG agent connected to enterprise directories (Active Directory) and ticketing systems. The agent resolves tier-1 tickets instantly using natural language dialogue, auto-executing provisioning scripts upon approvals.",
      dataRequirements: [
        { category: "Knowledge Articles", type: "Unstructured", format: "HTML/Markdown", purpose: "Answering configuration questions" },
        { category: "AD Profiles", type: "Structured", format: "LDAP / API", purpose: "Verifying employee roles and privileges" }
      ],
      dataSources: [
        { source: "ServiceNow", type: "Service Catalog", desc: "To create, track, and close employee requests." },
        { source: "Active Directory", type: "Identity Provider", desc: "To authenticate user roles and group memberships." }
      ],
      stakeholders: ["IT Support Director", "Service Desk Manager", "Security Administrator"],
      teamStructure: ["1 Project Lead", "1 Integration Engineer", "1 Prompt Engineer", "1 Business Analyst"],
      skills: ["RAG architectures", "REST API integrations", "IAM & RBAC security frameworks"],
      risks: {
        technical: "Hallucinations causing wrong setup instructions.",
        operational: "Employees bypassing the chat system to call engineers directly.",
        security: "Privilege escalation risks via prompt injection."
      },
      successMetrics: [
        "50% deflection of tier-1 support tickets",
        "Instant resolution (<1 min) for standard access requests",
        "90% user satisfaction (CSAT) rating"
      ],
      benchmarks: [
        {
          org: "Global Consulting Firm",
          story: "Deployed a virtual assistant in MS Teams, deflecting 42% of support tickets within 6 months.",
          source: "ServiceNow Knowledge (2024)",
          lessons: "Build solid fallback loops to human agents when the AI confidence score drops below 80%."
        }
      ]
    }
  },
  "Human Resources": {
    "Talent Acquisition": {
      title: "Agentic Candidate Screening & Skills Profiler",
      aiType: "NLP & Predictive AI",
      complexity: 5,
      readiness: 7,
      summary: "Establish an intelligent candidate matching and skills validation pipeline that extracts real skills from resumes and matches them to open job descriptions.",
      problem: "Recruiters spend hundreds of hours scanning resumes, missing high-quality candidates due to inconsistent keyword matches and biased selections.",
      currentState: "Recruiters manually screen PDFs on LinkedIn and Workday, conducting short listing based on subjective criteria. High turnaround time to fill empty roles.",
      solution: "Deploy a semantic matching engine that analyzes candidate experience, structured achievements, and validates skills using contextual understanding, rather than simple keyword matches.",
      dataRequirements: [
        { category: "Candidate Profiles", type: "Unstructured", format: "PDF / DOCX", purpose: "Extracting work experience and education" },
        { category: "Job Descriptions", type: "Structured", format: "Plain Text / JSON", purpose: "Defining required qualifications" }
      ],
      dataSources: [
        { source: "Workday / SuccessFactors", type: "ATS", desc: "System of record for candidate and job profiles." }
      ],
      stakeholders: ["HR Director", "Head of Talent Acquisition", "Compliance Officer"],
      teamStructure: ["1 Project Manager", "1 NLP Specialist", "1 ATS Integration Engineer", "1 Change Manager"],
      skills: ["Information extraction (NER)", "Vector Embeddings & Semantic Search", "De-biasing algorithms"],
      risks: {
        technical: "Bias propagation from historical hiring records.",
        operational: "Recruiters ignoring AI matches due to lack of trust.",
        security: "Storage of candidates' personal identifiable information (PII).",
        compliance: "EU AI Act compliance regarding automated recruitment filtering."
      },
      successMetrics: [
        "65% reduction in resume screening time",
        "30% increase in candidate-to-interview conversion quality",
        "Zero compliance audit findings by anonymizing demographics"
      ],
      benchmarks: [
        {
          org: "Multinational Retailer",
          story: "Screened 100k+ candidates annually using semantic scoring, reducing time-to-hire by 18 days.",
          source: "Gartner HR Report (2024)",
          lessons: "Anonymize candidate names, gender, and age before feeding data into the screening model to ensure compliance."
        }
      ]
    },
    "default": {
      title: "Intelligent HR Assistant & Policy Q&A System",
      aiType: "Generative AI (RAG)",
      complexity: 4,
      readiness: 8,
      summary: "Deploy an HR-trained LLM assistant that provides personalized answers to employee benefits, leave policies, and onboarding queries in multiple languages.",
      problem: "HR Operations team spend excessive hours answering repetitive employee questions about leave, benefits, and workplace policies.",
      currentState: "Employees search SharePoint pages or email HR operations. HR representatives manually reply with PDF attachments or policy links.",
      solution: "Deploy a secure enterprise HR RAG system connected to the employee handbook and regional benefits documents. Integrates with Workday to pull employee-specific details (e.g., remaining vacation balance).",
      dataRequirements: [
        { category: "Employee Handbook", type: "Unstructured", format: "PDF / HTML", purpose: "Answering policy and guideline questions" },
        { category: "Benefits Documents", type: "Unstructured", format: "PDF / DOCX", purpose: "Explaining health plans, insurance options" }
      ],
      dataSources: [
        { source: "Workday / HRMS", type: "HR Portal", desc: "System storing employee region, department, and tenure." },
        { source: "SharePoint", type: "Document Management", desc: "Storage of the latest HR policies." }
      ],
      stakeholders: ["Head of HR Operations", "Internal Communications Lead", "HR Analytics Manager"],
      teamStructure: ["1 Business Analyst", "1 Prompt Engineer", "1 SharePoint Integrator"],
      skills: ["RAG frameworks", "Workday API integrations", "Data masking / PII handling"],
      risks: {
        technical: "Incorrect benefits explanations leading to employee frustration.",
        operational: "Low employee adoption if the bot is clunky.",
        security: "Leaks of restricted executive compensation policies."
      },
      successMetrics: [
        "60% reduction in general HR ticketing volume",
        "100% consistent policy representation across global teams",
        "Employee query resolution time reduced from 24 hours to instant"
      ],
      benchmarks: [
        {
          org: "Global Investment Bank",
          story: "Launched a virtual agent for HR queries, achieving a 92% accuracy rate in answering complex policy questions.",
          source: "McKinsey Digital Case Study (2025)",
          lessons: "Dynamic user context mapping (e.g., location, level) is essential to provide correct localized policy answers."
        }
      ]
    }
  },
  "Finance": {
    "Accounts Payable": {
      title: "Cognitive Accounts Payable Automation & Fraud Auditor",
      aiType: "RPA + AI & Computer Vision",
      complexity: 6,
      readiness: 8,
      summary: "Automate invoice processing from extraction to verification and ERP entry, including real-time double-payment and anomaly audits.",
      problem: "Accounts Payable processing suffers from high manual entry workloads, manual 3-way matching across Purchase Orders and Delivery Notes, and delayed payment cycles leading to lost early-payment discounts.",
      currentState: "Invoices arrive via email. AP staff download PDFs, manually transcribe line items into SAP, match them with purchase orders, and route them for approval via email.",
      solution: "Deploy a multi-modal AI model that reads invoice images/PDFs, extracts line items, performs automated 3-way matching with SAP POs and warehouse logs, flags duplicate/anomalous invoices, and drafts ERP transactions.",
      dataRequirements: [
        { category: "Invoice Documents", type: "Unstructured", format: "PDF / TIFF / PNG", purpose: "Extracting invoice numbers, amounts, line items" },
        { category: "Purchase Orders", type: "Structured", format: "SQL / SAP Tables", purpose: "Matching item descriptions and agreed rates" },
        { category: "Receiving Records", type: "Structured", format: "SAP Tables", purpose: "Verifying physical warehouse receipt" }
      ],
      dataSources: [
        { source: "SAP ERP / Oracle ERP", type: "Finance System", desc: "Central database of purchase orders and vendor ledgers." },
        { source: "AP Shared Inboxes", type: "Email Server", desc: "Where vendors submit electronic invoices." }
      ],
      stakeholders: ["CFO", "Director of Shared Services", "AP Manager", "Audit Head"],
      teamStructure: ["1 Project Manager", "1 Intelligent Document Processing (IDP) Dev", "1 SAP Integration Architect", "1 QA Analyst"],
      skills: ["IDP & OCR (Tesseract / Azure Form Recognizer)", "SAP GUI / API Automation", "Anomalous transaction detection algorithms"],
      risks: {
        technical: "High OCR failure rate on low-quality scans.",
        operational: "Vendors submitting non-standard invoices causing routing backlogs.",
        security: "Ransomware embedded inside invoice attachments.",
        compliance: "Sarbanes-Oxley (SOX) audit trails must track all automated ledger entries."
      },
      successMetrics: [
        "85% straight-through processing (STP) rate for invoices",
        "Reduction in processing cost from $12 per invoice to $1.50",
        "Elimination of double-payments and duplicate vendor payouts"
      ],
      benchmarks: [
        {
          org: "Global Manufacturing Conglomerate",
          story: "Processed 500,000+ invoices annually with RPA + AI. Saved $4.8M in operational overhead and avoided $350k in payment penalties.",
          source: "Deloitte Automation Insights (2024)",
          lessons: "Establish a strict human validation queue for invoices with OCR extraction confidence scores below 90%."
        }
      ]
    },
    "default": {
      title: "Predictive Corporate Budgeting & Variance Forecaster",
      aiType: "Predictive AI & Machine Learning",
      complexity: 7,
      readiness: 6,
      summary: "Apply machine learning forecasting models to historical financials, sales forecasts, and macroeconomic data to automate rolling forecast generation.",
      problem: "Corporate budgeting cycles are slow, static, and based on gut feelings, leading to inaccurate forecasting, missed budget targets, and slow responses to market changes.",
      currentState: "Department heads fill Excel spreadsheets annually. Finance aggregates them manually, updates static forecasts monthly, and tracks variances post-factum.",
      solution: "Build a predictive modeling pipeline that ingests historical spending records, CRM sales pipelines, and leading economic indicators. The model runs predictive forecasting simulations (Monte Carlo) to outline optimal rolling budgets.",
      dataRequirements: [
        { category: "Historical Expenditures", type: "Structured", format: "SQL / CSV", purpose: "Establishing seasonal spending baselines" },
        { category: "CRM Sales Pipeline", type: "Structured", format: "Salesforce API", purpose: "Incorporating projected revenue growth" }
      ],
      dataSources: [
        { source: "Salesforce", type: "CRM", desc: "Provides pipeline values and deal probabilities." },
        { source: "Workday Finance", type: "General Ledger", desc: "Contains transactional spend records." }
      ],
      stakeholders: ["CFO", "FP&A Lead", "Business Unit Controllers"],
      teamStructure: ["1 Data Scientist", "1 Finance Domain Specialist", "1 BI Engineer"],
      skills: ["Time-series forecasting (Prophet, XGBoost)", "Financial modeling", "Data pipeline orchestration (Airflow)"],
      risks: {
        technical: "Overfitting on abnormal COVID-era market data.",
        operational: "Executive reluctance to trust machine-generated budgets.",
        security: "Protecting highly sensitive pre-earnings financial estimates."
      },
      successMetrics: [
        "95% accuracy in 3-month rolling budget forecasting",
        "Reduction in budget preparation time from 6 weeks to 3 days",
        "Early warning of budget breaches 60 days before occurrence"
      ],
      benchmarks: [
        {
          org: "Global Retailer",
          story: "Replaced spreadsheet forecasting with ML models, reducing quarterly variance error rates from 8.2% to 1.9%.",
          source: "McKinsey Finance Practice (2025)",
          lessons: "Include qualitative event tags (e.g., supply chain shutdowns, marketing campaigns) to help models understand outlier months."
        }
      ]
    }
  },
  "Legal": {
    "Contract Management": {
      title: "Generative AI Contract Lifecycle Auditor",
      aiType: "Generative AI (RAG)",
      complexity: 6,
      readiness: 7,
      summary: "Build an intelligent contract audit system that reads incoming vendor/client agreements, compares terms to standard templates, and flags deviations.",
      problem: "Legal teams spend excessive hours reviewing contracts, checking compliance clauses (indemnification, liabilities), causing business delays and introducing liability risks.",
      currentState: "Sales or procurement drafts agreements. Legal reviews them word-by-word manually in Word, comparing terms against a checklist. Turnaround time is 5-10 days.",
      solution: "Deploy an enterprise RAG legal agent that extracts terms, flags non-compliant terms, suggests alternative standard clauses, and generates contract risk assessment reports in minutes.",
      dataRequirements: [
        { category: "Active Agreements", type: "Unstructured", format: "PDF / DOCX", purpose: "Extracting active clauses and definitions" },
        { category: "Playbooks & Policies", type: "Unstructured", format: "PDF", purpose: "Legal standard guidelines and clause checklists" }
      ],
      dataSources: [
        { source: "DocuSign CLM / Icertis", type: "Contract Platform", desc: "Repositories of signed and draft legal agreements." }
      ],
      stakeholders: ["General Counsel", "Risk Director", "Sales Operations Lead"],
      teamStructure: ["1 Legal Tech Specialist", "1 AI Engineer", "1 Change Coordinator"],
      skills: ["Legal LLMs (Llama-3-70B fine-tuned, Harvey API)", "Document processing (OCR + structure parsing)", "Prompt engineering for compliance"],
      risks: {
        technical: "Hallucinated legal cases or nonexistent regulatory rules.",
        operational: "Lawyers over-relying on AI and skipping final reviews.",
        security: "Exposure of trade secrets or vendor pricing metrics.",
        compliance: "Data sovereignty issues (contracts leaving regional cloud environments)."
      },
      successMetrics: [
        "75% reduction in contract review turnaround time",
        "100% consistency in applying standard liability policies",
        "Zero critical compliance clauses missed in draft documents"
      ],
      benchmarks: [
        {
          org: "Multinational Tech Enterprise",
          story: "Automated vendor contract reviews, cutting average review time from 6 hours to 12 minutes, saving $2M in external legal fees.",
          source: "Gartner Legal Tech Insights (2024)",
          lessons: "Establish strict prompt templates that forbid the AI from offering legal advice, positioning it solely as an audit tool."
        }
      ]
    },
    "default": {
      title: "Regulatory Intelligence & Compliance Monitor",
      aiType: "Generative AI & NLP",
      complexity: 5,
      readiness: 7,
      summary: "Deploy an AI monitoring system that watches regulatory databases, matches new updates to internal policies, and drafts compliance updates.",
      problem: "Firms struggles to keep pace with changing local and global regulatory changes, risking massive penalties and operational audit failures.",
      currentState: "Compliance teams manually monitor regulatory websites, read white papers, translate laws, and update internal compliance manuals.",
      solution: "Deploy a specialized NLP agent that monitors government and regulatory portals. The agent summarizes changes, maps them to impacted organizational policies, and notifications of needed actions.",
      dataRequirements: [
        { category: "Internal Policies", type: "Unstructured", format: "PDF / Word", purpose: "Mapping external updates to internal rules" },
        { category: "Regulatory Filings", type: "Unstructured", format: "HTML / PDF", purpose: "Tracking external legal modifications" }
      ],
      dataSources: [
        { source: "Government Web Portals", type: "Web Scraping / RSS", desc: "Federal registers, SEC/RBI updates, and compliance portals." }
      ],
      stakeholders: ["Chief Compliance Officer", "Risk Committee", "Operations Directors"],
      teamStructure: ["1 Compliance Analyst", "1 NLP Integrator", "1 Data QA"],
      skills: ["Scraping pipelines", "Multi-lingual translation & summaries", "Dependency mapping models"],
      risks: {
        technical: "Missing a minor sub-clause change due to model context limits.",
        operational: "False positives overwhelming the compliance group.",
        security: "Compliance data privacy in multitenant models."
      },
      successMetrics: [
        "100% coverage of monitored regulatory sites",
        "Alert response lag reduced from 2 weeks to under 4 hours",
        "90% accuracy in automated impact classification"
      ],
      benchmarks: [
        {
          org: "Global Insurance Firm",
          story: "Automated tracking across 12 countries, reducing compliance audit prep times by 40% and avoiding regulatory delay penalties.",
          source: "Accenture Compliance Study (2025)",
          lessons: "A dedicated taxonomy tagging ruleset must guide the classification vector model to avoid miscategorizations."
        }
      ]
    }
  },
  "Payroll": {
    "default": {
      title: "Intelligent Payroll Discrepancy Auditor & Query Handler",
      aiType: "Predictive AI & GenAI (RAG)",
      complexity: 5,
      readiness: 8,
      summary: "Deploy an automated payroll anomaly auditor that flags variance discrepancies between months and provides automated answers to employee payroll queries.",
      problem: "Payroll processing is time-critical. Manual reviews are prone to missing bulk changes, tax miscalculations, or employee bank updates, causing employee queries and regulatory audit risks.",
      currentState: "HR uploads timesheets and rosters. Payroll analysts review variance logs in Excel. Employees raise tickets for paycheck discrepancies that take days to answer.",
      solution: "Deploy a machine learning anomaly detection engine that reviews payroll calculations, comparing them with historical norms and current timesheets. Pair it with a conversational agent to resolve employee tax, benefit, and salary questions.",
      dataRequirements: [
        { category: "Rosters & Timesheets", type: "Structured", format: "CSV / SQL", purpose: "Extracting actual hours worked and overtime" },
        { category: "Tax Rules & Rates", type: "Structured", format: "PDF / Table", purpose: "Applying national and local tax computations" }
      ],
      dataSources: [
        { source: "Workday / HRMS", type: "HR Database", desc: "Main source of employee details and bank details." },
        { source: "ADP / SAP SuccessFactors", type: "Payroll Ledger", desc: "The transaction processing engine." }
      ],
      stakeholders: ["Payroll Director", "Compensation Manager", "Internal Audit Lead"],
      teamStructure: ["1 Business Analyst", "1 Data Engineer", "1 Prompt Specialist"],
      skills: ["SQL analytics", "Anomaly detection (Isolation Forest / Outlier)", "RAG integration"],
      risks: {
        technical: "Incorrect payroll calculations suggested by the model.",
        operational: "Sensitive payroll data accessed by unauthorized personnel.",
        security: "Prompt injection to leak salary details."
      },
      successMetrics: [
        "99.9% payroll execution accuracy rate",
        "80% of employee payroll queries resolved instantly via chat",
        "Manual validation time reduced from 3 days to 4 hours"
      ],
      benchmarks: [
        {
          org: "Logistics Enterprise",
          story: "Integrated automated payroll validation, cutting manual reconciliation time by 75% for 45,000 employees.",
          source: "Workday Innovation Stories (2024)",
          lessons: "Perform payroll audits in a strictly air-gapped system, masking social security numbers and using hash identifiers."
        }
      ]
    }
  },
  "Procurement": {
    "default": {
      title: "Cognitive Spend Analytics & Vendor Sourcing Advisor",
      aiType: "NLP & Predictive AI",
      complexity: 6,
      readiness: 7,
      summary: "Implement an intelligent procurement platform that analyzes purchase orders and invoices to identify savings leaks, and recommends optimal vendors.",
      problem: "Procurement teams struggle to identify redundant spend, trace contract compliance leakage, and select the best vendor due to fragmented data across regional offices.",
      currentState: "Purchases are requested in SAP. Procurement analysts run Excel pivot tables monthly, manually classifying items and auditing price deviations from master agreements.",
      solution: "Deploy a semantic classification engine that categorizes purchase items, matches invoice rates to active vendor contracts, flags compliance leaks, and predicts vendor performance based on delivery logs.",
      dataRequirements: [
        { category: "Purchase Orders", type: "Structured", format: "SQL", purpose: "Analyzing item descriptions, pricing, and quantities" },
        { category: "Vendor Contracts", type: "Unstructured", format: "PDF", purpose: "Extracting agreed rebate terms and SLA penalty clauses" }
      ],
      dataSources: [
        { source: "SAP ERP", type: "Transactional Database", desc: "Stores spend history, orders, and receipts." },
        { source: "Ariba", type: "Procurement Portal", desc: "Vendor catalogs and procurement tracking." }
      ],
      stakeholders: ["Chief Procurement Officer", "Sourcing Director", "Vendor Relations Manager"],
      teamStructure: ["1 Lead Data Engineer", "1 Business Analyst", "1 ERP Integrator"],
      skills: ["NLP Text Classification", "Entity extraction", "SAP Ariba APIs"],
      risks: {
        technical: "Inaccurate classification of specialized engineering tools.",
        operational: "Resistance from buyers accustomed to legacy vendors.",
        security: "Leaking negotiated vendor pricing discounts externally."
      },
      successMetrics: [
        "4% to 7% savings in addressable indirect spend",
        "92% accuracy in automated spend categorization",
        "Reduction in vendor onboarding time from 30 days to 5 days"
      ],
      benchmarks: [
        {
          org: "Global Beverage Maker",
          story: "Automated spend analytics using NLP, identifying $14M in savings opportunities across indirect procurement categories.",
          source: "Deloitte Procurement Insights (2025)",
          lessons: "Establish standard classification taxonomy (UNSPSC) before training the text model."
        }
      ]
    }
  },
  "Sales": {
    "default": {
      title: "Intelligent Pipeline Forecasting & Quote Assistant",
      aiType: "Predictive AI & GenAI",
      complexity: 5,
      readiness: 7,
      summary: "Apply machine learning forecasting to CRM pipeline data to predict win probabilities, paired with an assistant that writes tailored sales quotations.",
      problem: "Sales forecasts are highly subjective, relying on salesperson optimism. Additionally, sales teams spend substantial time writing proposals and quotes.",
      currentState: "Representatives update Salesforce opportunities. Managers apply subjective discounts to forecasts. Proposals are written using generic Word templates.",
      solution: "Deploy a predictive pipeline forecasting model that analyzes historical deal trajectories, email engagement metrics, and buyer intent. Pair it with a GenAI proposal generator that drafts tailored quotes based on CRM notes.",
      dataRequirements: [
        { category: "Deal Activity Logs", type: "Structured", format: "API / CSV", purpose: "Tracking email touchpoints and meetings" },
        { category: "Historical Win/Loss Data", type: "Structured", format: "SQL", purpose: "Training deal outcome prediction models" }
      ],
      dataSources: [
        { source: "Salesforce CRM", type: "Sales Hub", desc: "Deals, contacts, and opportunity histories." },
        { source: "Outlook / GSuite", type: "Communications", desc: "Sources of customer email logs and calendar events." }
      ],
      stakeholders: ["VP of Global Sales", "Sales Operations Director", "Chief Commercial Officer"],
      teamStructure: ["1 Business Analyst", "1 ML Engineer", "1 Salesforce Architect"],
      skills: ["Machine learning classification", "Salesforce API integration", "LLM fine-tuning / dynamic templating"],
      risks: {
        technical: "Erroneous quotation amounts drafted, causing contract conflicts.",
        operational: "Representatives falsifying activity logs to trick the model.",
        security: "Customer contact details leaked via LLM completions."
      },
      successMetrics: [
        "30% increase in sales forecasting accuracy",
        "50% reduction in average proposal creation time",
        "15% increase in pipeline conversion rate due to timely follow-up recommendations"
      ],
      benchmarks: [
        {
          org: "Enterprise Software Vendor",
          story: "Deployed AI win prediction models, improving forecast reliability by 35% and increasing sales representative quotas met by 12%.",
          source: "Salesforce Case Studies (2024)",
          lessons: "Integrate email sentiment analytics to evaluate customer engagement rather than counting raw email numbers."
        }
      ]
    }
  },
  "Marketing": {
    "default": {
      title: "Cognitive Campaign Orchestrator & Content Factory",
      aiType: "Generative AI",
      complexity: 4,
      readiness: 8,
      summary: "Deploy an enterprise content generation platform that creates personalized marketing copy, images, and social posts aligned to brand guidelines.",
      problem: "Content creation is slow, expensive, and difficult to scale across multiple channels, regions, and customer segments, leading to generic marketing campaigns.",
      currentState: "Marketing teams work with external agencies to write copy and design assets. A single campaign takes 3-4 weeks from concept to launch.",
      solution: "Deploy a centralized AI content workstation. Connects LLMs trained on brand voice, guidelines, and historical high-performing ads. Generates localized copy, email sequences, and banners dynamically.",
      dataRequirements: [
        { category: "Brand Guidelines", type: "Unstructured", format: "PDF", purpose: "Enforcing brand voice, colors, and tone restrictions" },
        { category: "Ad Performance Metrics", type: "Structured", format: "JSON / API", purpose: "Optimizing generation patterns for high CTR" }
      ],
      dataSources: [
        { source: "Adobe Experience Manager", type: "CMS", desc: "Storage of brand media and web assets." },
        { source: "Google Ads / Meta Ads", type: "Ad Managers", desc: "Provides click-through rates and campaign history." }
      ],
      stakeholders: ["CMO", "Brand Director", "Creative Operations Head"],
      teamStructure: ["1 Creative Director", "1 Prompt Engineer", "1 Data Analyst", "1 Marketing Integrator"],
      skills: ["LLM alignment / instruction tuning", "Multi-modal model integration (DALL-E/Midjourney)", "Social media APIs"],
      risks: {
        technical: "AI hallucinating inaccurate product specs in ad copy.",
        operational: "Ad fatigue due to high volumes of generic-looking AI content.",
        security: "Leakage of upcoming product details before official launch.",
        compliance: "Copyright infringement risks from image generator models."
      },
      successMetrics: [
        "80% reduction in localized content creation costs",
        "Ad copy production turnaround cut from 5 days to 10 minutes",
        "22% higher engagement via dynamic personalization"
      ],
      benchmarks: [
        {
          org: "Global Consumer Brand",
          story: "Generated 10,000 localized banner ads, achieving a 30% uplift in conversion and reducing asset creation costs by $1.2M.",
          source: "Google Marketing Innovation (2024)",
          lessons: "Establish a rigorous brand safety filter that scans output copy for restricted terms before publishing."
        }
      ]
    }
  },
  "Customer Service": {
    "Contact Center": {
      title: "Agentic Customer Experience & Contact Center Autopilot",
      aiType: "Agentic AI & Multi-Agent Systems",
      complexity: 7,
      readiness: 8,
      summary: "Deploy a voice and chat agentic customer service system that handles customer queries, processes transactions, and assists agents in real-time.",
      problem: "Contact centers suffer from high call volumes, long queue times, high agent attrition, and inconsistent customer support experiences, driving up operations costs.",
      currentState: "Customers queue for support. Agents manually query legacy databases, copy and paste answers, and type transaction notes after calls. Average call handle time is 8 minutes.",
      solution: "Deploy a voice/chat multi-agent system. A Customer Facing agent communicates with users via speech-to-text. Specialized routing agents fetch account data from Salesforce, issue credits in SAP, and draft CRM summaries automatically.",
      dataRequirements: [
        { category: "Call Transcripts", type: "Unstructured", format: "JSON/Text", purpose: "Understanding common user pain points" },
        { category: "Customer Accounts", type: "Structured", format: "API / CRM Tables", purpose: "Checking purchase histories and eligibility" }
      ],
      dataSources: [
        { source: "Salesforce / Zendesk", type: "CRM / Service desk", desc: "For storing customer accounts and ticket histories." },
        { source: "Genesys / Twilio", type: "Telephony Platform", desc: "Source of incoming customer phone calls." }
      ],
      stakeholders: ["VP of Customer Experience", "Contact Center Operations Director", "CISO"],
      teamStructure: ["1 Program Manager", "1 Conversational AI Engineer", "1 CRM Integration Developer", "1 QA Specialist"],
      skills: ["Real-time speech translation", "Dynamic prompt chaining", "Salesforce APIs", "Dialogflow / Voice agents"],
      risks: {
        technical: "Model misunderstandings on accented speech or low-quality voice signals.",
        operational: "Customers demanding human agents immediately.",
        security: "Malicious users attempting social engineering via voice agents.",
        compliance: "PCI compliance: avoiding recording credit card details in call logs."
      },
      successMetrics: [
        "60% reduction in average handle time (AHT)",
        "45% first contact resolution (FCR) rate by AI agents",
        "95% automated summarization accuracy for CRM logs"
      ],
      benchmarks: [
        {
          org: "Digital Telecom Provider",
          story: "Launched voice-agents that automated 35% of billing queries, reducing peak wait times from 12 minutes to 15 seconds.",
          source: "Gartner Customer Service Summit (2025)",
          lessons: "Mask billing inputs at the telephone gateway to ensure credit cards are never passed to the LLM model."
        }
      ]
    },
    "default": {
      title: "Self-Service Semantic Search & Knowledge Concierge",
      aiType: "Generative AI (RAG)",
      complexity: 4,
      readiness: 8,
      summary: "Implement a semantic search assistant on the customer portal that extracts answers directly from manuals and FAQs.",
      problem: "Customers cannot find answers on portals using keyword search, resulting in them raising support tickets for issues already documented.",
      currentState: "Web search is based on exact keywords. If misspelled, it returns no results. Customers submit email tickets. Support agents copy-paste manual links.",
      solution: "Deploy a RAG search widget on the customer portal. It translates user queries, searches PDF manuals using vector embeddings, and summarizes the specific troubleshooting steps.",
      dataRequirements: [
        { category: "Product Manuals", type: "Unstructured", format: "PDF", purpose: "Detailed step-by-step troubleshooting" },
        { category: "FAQ Databases", type: "Structured", format: "CSV / JSON", purpose: "Fast lookup for simple questions" }
      ],
      dataSources: [
        { source: "Confluence / Zendesk Guide", type: "Knowledge Hub", desc: "Source of support documentation." }
      ],
      stakeholders: ["Customer Service Manager", "Product Support Lead", "Web Platform Owner"],
      teamStructure: ["1 Front-End Developer", "1 Search/Data Engineer", "1 Product Expert"],
      skills: ["Vector search engines (Pinecone / Qdrant)", "Chunking strategy optimization", "CSS styling"],
      risks: {
        technical: "Incorrect assembly of instructions from separate documents.",
        operational: "Users ignoring the portal widget.",
        security: "Exposing draft or internal-only product manuals."
      },
      successMetrics: [
        "35% deflection of customer support tickets",
        "80% accuracy in providing correct troubleshooting steps",
        "Increase in portal engagement duration by 3x"
      ],
      benchmarks: [
        {
          org: "Consumer Electronics Brand",
          story: "Deployed vector search for manuals, deflecting 28,000 tickets in the first month and saving $120,000 in support operations.",
          source: "AWS Case Studies (2024)",
          lessons: "Establish metadata filters to ensure only publicly released manuals are searchable."
        }
      ]
    }
  },
  "Operations": {
    "default": {
      title: "Cognitive Supply Chain & Predictive Inventory Optimizer",
      aiType: "Predictive AI & Machine Learning",
      complexity: 7,
      readiness: 6,
      summary: "Build an AI replenishment planner that analyzes inventory logs, transit delays, and sales demand to predict optimal warehouse stocking limits.",
      problem: "Operations suffer from stockouts of high-demand items, and expensive excess inventory of slow-moving items due to disjointed demand signal systems.",
      currentState: "Purchasing managers review stock logs monthly in Excel, manually estimating order quantities based on simple averages, causing freight delays and lost sales.",
      solution: "Deploy a predictive replenishment model that integrates historical sales, lead times, transit delays, and weather alerts. The model runs predictive simulations to draft daily supply purchase orders.",
      dataRequirements: [
        { category: "Inventory Records", type: "Structured", format: "SQL", purpose: "Tracking daily stock balances" },
        { category: "Transit Logs", type: "Structured", format: "CSV", purpose: "Calculating regional shipment delay variables" }
      ],
      dataSources: [
        { source: "SAP ERP", type: "Supply Ledger", desc: "Warehouse stock quantities and supplier details." }
      ],
      stakeholders: ["Supply Chain VP", "Warehouse Operations Director", "Finance Head"],
      teamStructure: ["1 Lead Data Scientist", "1 Supply Analyst", "1 Integration Engineer"],
      skills: ["Supply chain analytics", "LSTM / Prophet forecasting models", "SAP integrations"],
      risks: {
        technical: "Incorrect lead-time predictions due to global logistics black swan events.",
        operational: "Warehouse staff placing emergency orders due to lack of trust.",
        security: "Supply logistics vulnerabilities and freight route leaks."
      },
      successMetrics: [
        "18% reduction in carrying inventory costs",
        "98% product availability rate across regional warehouses",
        "40% reduction in emergency express freight expenses"
      ],
      benchmarks: [
        {
          org: "Global Electronics Distributor",
          story: "Integrated AI demand planning, reducing excess inventory by $22M while increasing order fill rates by 3%.",
          source: "IBM Case Studies (2025)",
          lessons: "Combine ML predictions with soft buyer overrides to handle local promotional activities."
        }
      ]
    }
  },
  "Risk & Compliance": {
    "default": {
      title: "Autonomous Audit Automation & Risk Monitor",
      aiType: "Generative AI & Predictive AI",
      complexity: 6,
      readiness: 7,
      summary: "Deploy an intelligent compliance inspector that monitors system transaction logs, emails, and database edits to flag anomalies.",
      problem: "Manual internal audits are conducted quarterly or annually, leaving compliance gaps undiscovered for months, risking regulatory fines.",
      currentState: "Internal auditors pull transaction samples manually into Excel, cross-reference them against policies, and write reports twice a year.",
      solution: "Deploy a continuous compliance audit agent. The engine scans system logs, database modifications, and communication patterns in real-time, automatically drafting audit reports for any flagged compliance anomalies.",
      dataRequirements: [
        { category: "Transaction Logs", type: "Structured", format: "JSON / SQL", purpose: "Verifying standard approval steps were followed" },
        { category: "System Audits", type: "Semi-Structured", format: "Plain Text / Logs", purpose: "Extracting details of authorization overrides" }
      ],
      dataSources: [
        { source: "SAP / ServiceNow Logs", type: "System Logs", desc: "Tracks user access and database edits." },
        { source: "Active Directory Logs", type: "Identity Logs", desc: "Traces permission changes and role modifications." }
      ],
      stakeholders: ["Audit Committee Head", "Chief Risk Officer", "CISO"],
      teamStructure: ["1 Lead Compliance Dev", "1 Data Audit Analyst", "1 InfoSec Architect"],
      skills: ["Risk scoring models", "Audit trail integrations", "LLM compliance classification"],
      risks: {
        technical: "False positives triggering too many audit investigations.",
        operational: "Security teams ignoring automated audit reports.",
        security: "Auditing agent itself becoming a point of security risk."
      },
      successMetrics: [
        "Transition from static sampling audits to 100% continuous compliance audits",
        "90% reduction in external auditor prep time",
        "Zero unnoticed internal control failures"
      ],
      benchmarks: [
        {
          org: "International Financial Services Corp",
          story: "Deployed automated risk monitoring, reducing internal audit cycles from 6 months to daily continuous tracking.",
          source: "Deloitte Risk Advisory (2025)",
          lessons: "Secure the audit outputs inside a blockchain or write-once ledger to guarantee data integrity."
        }
      ]
    }
  }
};

/**
 * Main Generation Logic
 * @param {Object} input User inputs collected from guided form or document parser
 * @returns {Object} Compiled solution blueprint object
 */
/**
 * Helper to synthesize a premium, custom solution title from user problem statement
 */
function synthesizeTitle(problem, baseTitle, systems, department, domain) {
  if (!problem || problem.trim().length < 15) return baseTitle;
  
  const lowerProblem = problem.toLowerCase();
  let subject = "";
  
  // Try to find common subjects
  const subjectsMap = [
    { keys: ["freight", "shipping", "transport", "logistics"], name: "Freight Rate Ledger Entry" },
    { keys: ["invoice", "payable", "billing", "receipt"], name: "Accounts Payable Invoice Processing" },
    { keys: ["contract", "agreement", "nda", "legal"], name: "Contract Lifecycle Review" },
    { keys: ["onboard", "hire", "recruit", "candidate", "resume"], name: "Talent Acquisition & Onboarding" },
    { keys: ["incident", "outage", "alert", "sre", "crash"], name: "DevOps Incident Remediation" },
    { keys: ["budget", "forecast", "spend", "expense"], name: "Corporate Spend & Budget Forecasting" },
    { keys: ["payroll", "tax", "salary", "compensation"], name: "Payroll Validation & Query Resolution" },
    { keys: ["ticket", "support", "customer", "chat", "email"], name: "Customer Support Automation" },
    { keys: ["compliance", "audit", "regulatory", "sox", "gdpr"], name: "Continuous Compliance & Risk Monitoring" }
  ];
  
  for (const item of subjectsMap) {
    if (item.keys.some(k => lowerProblem.includes(k))) {
      subject = item.name;
      break;
    }
  }
  
  // If no common subject found, try to extract a simple noun phrase
  if (!subject) {
    const match = problem.match(/(?:manual|automation of|processing of|entry of|management of)\s+([a-zA-Z0-9\s]{3,25})(?:\s+in|\s+causing|\s+causes|\.|\,|$)/i);
    if (match && match[1]) {
      subject = match[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  
  if (!subject) {
    // Default fallback to domain
    subject = domain !== "default" ? domain : `${department} Operations`;
  }
  
  // Format Title
  let title = `AI-Powered ${subject} Automation`;
  if (systems && systems.length > 0) {
    const primarySystem = systems[0];
    title = `${primarySystem}-Integrated Intelligent ${subject}`;
  }
  
  return title;
}

/**
 * Helper to compile raw agent drafts to simulate parallel models execution
 */
function compileAgentDrafts(input, systems, regulations, techStack) {
  const primarySystem = systems[0] || "SAP";
  const primaryReg = regulations[0] || "GDPR";
  const preferredLLM = techStack.llmProviders[0] || "Claude 3.5 Sonnet";
  const preferredVDB = techStack.vectorDatabases[0] || "Pinecone";

  return [
    {
      role: "Business Consultant",
      openai: `Automate manual entry workflows in ${primarySystem} to reduce operating costs by 85% and eliminate SLA delays.`,
      anthropic: `Deploy cognitive orchestration to optimize throughput, saving estimated $350k annually.`,
      google: `Integrate AI checkpoints to optimize business unit operating margins by 15%.`,
      consensus: `Implement cognitive automation to reduce processing costs by 80% and optimize SLA compliance inside ${primarySystem}.`
    },
    {
      role: "Solution Architect",
      openai: `Deploy AWS API Gateway with containerized microservices and RDS SQL backend.`,
      anthropic: `Connect systems via secure webhook events feeding a serverless Lambda + DynamoDB model.`,
      google: `Host in Cloud Run using Cloud SQL databases and Cloud Pub/Sub orchestration.`,
      consensus: `Establish secure webhook ingestion gateways connected to Python Orchestrator hosted in Cloud VPC.`
    },
    {
      role: "AI Architect",
      openai: `Fine-tune GPT-4o for document extraction and categorization.`,
      anthropic: `Utilize Claude 3.5 Sonnet RAG pipeline with pgvector indexing.`,
      google: `Deploy Gemini 1.5 Pro to parse raw unstructured files natively via vision APIs.`,
      consensus: `Deploy ${preferredLLM} RAG pipeline backed by ${preferredVDB} vector indexing.`
    },
    {
      role: "Data Architect",
      openai: `Ingest raw datasets and logs to Snowflake data warehouse tables.`,
      anthropic: `Store document chunks in pgvector and backup raw assets in AWS S3 / Azure Blob.`,
      google: `Load transactional records into BigQuery and trace line-item entities.`,
      consensus: `Structure ingestion folders in Cloud Storage, chunking documents into vector indexes.`
    },
    {
      role: "Security Agent",
      openai: `Secure APIs with OAuth 2.0 and encrypt data-at-rest with AES-256.`,
      anthropic: `Mask PII data at the gate, enforce TLS 1.3, and run in air-gapped vaults to protect ${primaryReg} data.`,
      google: `Monitor queries in Guardrails to prevent prompt injections.`,
      consensus: `Enforce TLS 1.3 transmission, mask PII before LLM calls to comply with ${primaryReg}, and host keys in Key Vaults.`
    },
    {
      role: "Industry Expert",
      openai: `Align with standard banking automation best practices.`,
      anthropic: `Model architecture on verified case benchmarks and lessons learned.`,
      google: `Verify benchmark outcomes against retail logistics statistics.`,
      consensus: `Align solution parameters with benchmarked cases (e.g. JPMorgan and DHL Forwarding studies).`
    },
    {
      role: "Project Manager",
      openai: `Run a standard 16-week timeline with 4 phases.`,
      anthropic: `Execute a 20-week Agile delivery timeline with bi-weekly client feedback loops.`,
      google: `Deliver pilot sandbox in 6 weeks and full scale in 22 weeks.`,
      consensus: `Schedule a phased roadmap: Discovery, Sandbox Pilot, Prod Integration, Scaling.`
    }
  ];
}

/**
 * Main Generation Logic
 * @param {Object} input User inputs collected from guided form or document parser
 * @returns {Object} Compiled solution blueprint object
 */
function generateBlueprint(input) {
  const department = input.department || "IT";
  const domain = input.domain || "default";
  
  // 1. Fetch closest matching template, fallback to department default, then global default
  let deptTemplates = BlueprintTemplates[department] || BlueprintTemplates["IT"];
  let baseTemplate = deptTemplates[domain] || deptTemplates["default"] || BlueprintTemplates["IT"]["default"];

  // 2. Extract context variables
  const companyName = input.companyName || "Enterprise Client";
  const industry = input.industry || "General Industry";
  const companySize = input.companySize || "10,000+ Employees";
  const annualRevenue = input.revenue || "$100M - $500M";
  
  // Clean inputs or fall back to templates
  const problemStatement = input.problemStatement && input.problemStatement.trim().length > 10 
    ? input.problemStatement.trim() 
    : baseTemplate.problem;
    
  const currentProcess = input.currentProcess && input.currentProcess.trim().length > 10
    ? input.currentProcess.trim()
    : baseTemplate.currentState;
    
  const desiredOutcome = input.desiredOutcome && input.desiredOutcome.trim().length > 10
    ? input.desiredOutcome.trim()
    : baseTemplate.summary;

  const systemsList = Array.isArray(input.systems) && input.systems.length > 0 
    ? input.systems 
    : (baseTemplate.dataSources ? baseTemplate.dataSources.map(s => s.source) : ["ServiceNow", "Jira", "SAP"]);
    
  const painPointsList = Array.isArray(input.painPoints) && input.painPoints.length > 0
    ? input.painPoints.map(p => {
        const found = window.EnterpriseTaxonomy?.painPoints.find(item => item.id === p);
        return found ? found.name : p;
      })
    : ["Manual overhead", "Process delays", "Data inaccuracies"];

  const dataAvailableList = Array.isArray(input.dataAvailable) && input.dataAvailable.length > 0
    ? input.dataAvailable
    : ["Structured DBs", "Unstructured PDFs"];

  const regulationsList = Array.isArray(input.regulations) && input.regulations.length > 0
    ? input.regulations
    : ["ISO 27001", "GDPR"];

  // Determine Title
  const dynamicTitle = synthesizeTitle(problemStatement, baseTemplate.title, systemsList, department, domain);

  // Determine AI Type from preferred tech stack or template
  let aiType = baseTemplate.aiType;
  const preferredTech = input.preferredTechStack || "";
  const lowerTech = preferredTech.toLowerCase();
  if (lowerTech.includes("agent") || lowerTech.includes("crew") || lowerTech.includes("autogen") || lowerTech.includes("swarm")) {
    aiType = "Agentic AI Multi-Agent System";
  } else if (lowerTech.includes("rag") || lowerTech.includes("langchain") || lowerTech.includes("llm") || lowerTech.includes("gpt") || lowerTech.includes("claude")) {
    aiType = "Generative AI (RAG)";
  } else if (lowerTech.includes("predict") || lowerTech.includes("forecast") || lowerTech.includes("ml") || lowerTech.includes("xgboost") || lowerTech.includes("regression")) {
    aiType = "Predictive AI & Machine Learning";
  }

  // Synthesize Summary
  let dynamicSummary = `For ${companyName}: Deploy an enterprise-grade ${aiType} solution to optimize ${domain} operations. The platform integrates directly with ${systemsList.join(' and ')} to automate workflows, addressing the bottleneck: "${problemStatement}". It enables the organization to achieve its target: "${desiredOutcome}".`;

  // Synthesize recommended solution details
  let dynamicSolution = `Deploy a custom AI solution utilizing ${aiType} tailored to the operations of ${companyName} in the ${industry} sector. The architecture is specifically designed to address the problem: "${problemStatement}". By replacing manual procedures (currently tracked as: "${currentProcess}") with API-driven automations, the platform resolves major pain points including ${painPointsList.join(', ')}. To achieve the target goal ("${desiredOutcome}"), the system introduces secure data ingestion connectors, an LLM-powered decision reasoning engine, and automated transaction staging scripts.`;
  if (preferredTech) {
    dynamicSolution += ` The system is optimized to build on the client's preferred technology stack, leveraging ${preferredTech}.`;
  }
  if (input.additionalNotes && input.additionalNotes.trim().length > 5) {
    dynamicSolution += ` Additionally, the architecture accommodates the specific requirements: "${input.additionalNotes.trim()}".`;
  }

  // Dynamic process flows
  const asIsList = [];
  const toBeList = [];

  if (input.currentProcess && input.currentProcess.trim().length > 10) {
    asIsList.push(`Process triggered: Operator identifies task related to "${problemStatement.substring(0, 50)}...".`);
    asIsList.push(`Manual transcription: Data is extracted and typed into systems (${systemsList.slice(0, 2).join(', ')}).`);
    asIsList.push(`Review overhead: Manual checks are conducted to identify data errors, causing bottlenecks.`);
    asIsList.push(`Friction delay: Staff logs the transaction and coordinates approvals via email/spreadsheets.`);
  } else {
    asIsList.push("Receive task notification or raw files manually via email attachment.");
    asIsList.push(`Transcribe entries and rates into systems (${systemsList.slice(0, 2).join(', ')}).`);
    asIsList.push("Conduct checklist rules and manual validation checks across systems.");
    asIsList.push("Open ERP general ledger and wait for manager approval.");
  }

  toBeList.push(`Automated ingestion: Data files or system hooks trigger the pipeline automatically inside ${systemsList[0]}.`);
  toBeList.push(`AI parsing layer: Cognitive models extract metadata and structured entries instantly.`);
  toBeList.push(`Rule validation: AI agent validates entries against business logic and ${regulationsList.join(', ')} standards.`);
  toBeList.push(`Transaction staging: Draft updates are pre-staged in ${systemsList[systemsList.length - 1]} via secure APIs.`);
  toBeList.push("Human-in-the-loop: Administrator reviews exceptions and clicks to approve, leaving 100% audit log.");

  // Dynamic ROI calculations
  // Parse company revenue scale to estimate savings multiplier
  let revNum = 250000000; // default 250M
  if (annualRevenue.includes("1M") && annualRevenue.includes("10M")) revNum = 5000000;
  else if (annualRevenue.includes("10M") && annualRevenue.includes("50M")) revNum = 30000000;
  else if (annualRevenue.includes("50M") && annualRevenue.includes("100M")) revNum = 75000000;
  else if (annualRevenue.includes("500M") && annualRevenue.includes("1B")) revNum = 750000000;
  else if (annualRevenue.includes("1B")) revNum = 2000000000;

  // Investment calculation based on complexity and timeline scale
  const complexityFactor = baseTemplate.complexity / 10; // 0.4 - 0.9
  let baseInvestment = 85000 + (complexityFactor * 180000); 

  // Adjust investment cost based on budget selection
  if (input.budget) {
    if (input.budget === "Under $50k") baseInvestment = 45000;
    else if (input.budget === "$50k - $150k") baseInvestment = 120000;
    else if (input.budget === "$150k - $500k") baseInvestment = 320000;
    else if (input.budget === "$500k - $1M+") baseInvestment = 750000;
  }
  const implementationCost = Math.round(baseInvestment);
  
  // Savings estimate based on revenue and complexity
  const savingsRate = 0.002 + (complexityFactor * 0.008); // 0.2% - 1% of revenue as savings in domain
  const maxSavingsMultiplier = companySize.includes("100") ? 0.2 : companySize.includes("1000") ? 0.6 : 1;
  let annualSavings = Math.round(Math.min(revNum * savingsRate * maxSavingsMultiplier, 4500000));
  
  // Adjust savings if custom ROI goal is specified
  if (input.roiGoals) {
    const goalsLower = input.roiGoals.toLowerCase();
    if (goalsLower.includes("x") || goalsLower.includes("payback")) {
      // e.g. "5x investment"
      const match = goalsLower.match(/([0-9]+)\s*x/);
      if (match && match[1]) {
        const multiplier = parseInt(match[1]);
        annualSavings = Math.round(implementationCost * multiplier);
      }
    }
  }
  
  // Payback period (Months)
  const paybackPeriod = Math.round((implementationCost / (annualSavings / 12)) * 10) / 10;

  // Generate implementation timeline weeks
  const totalWeeks = 8 + Math.round(complexityFactor * 24);
  const phase1Weeks = Math.round(totalWeeks * 0.2);
  const phase2Weeks = Math.round(totalWeeks * 0.25);
  const phase3Weeks = Math.round(totalWeeks * 0.4);
  const phase4Weeks = totalWeeks - (phase1Weeks + phase2Weeks + phase3Weeks);

  // Tech Stack generation
  let customLLMProviders = ["GPT-4o (OpenAI)", "Claude 3.5 Sonnet (Anthropic)", "Llama 3.1 70B (Meta)"];
  if (typeof window !== 'undefined' && window.AppState && window.AppState.orchestratorSettings && window.AppState.orchestratorSettings.models) {
    const active = window.AppState.orchestratorSettings.models
      .filter(m => m.status === "Enabled")
      .map(m => `${m.name} (${m.provider})`);
    if (active.length > 0) {
      customLLMProviders = active;
    }
  }

  const techStack = {
    aiPlatforms: ["OpenAI API", "Hugging Face Transformers", "Microsoft Azure AI Hub"],
    llmProviders: customLLMProviders,
    vectorDatabases: ["Pinecone", "pgvector (PostgreSQL)", "Milvus"],
    dataPlatforms: ["Snowflake", "Databricks", "AWS S3 / Azure Blob Storage"],
    cloudPlatforms: systemsList.includes("Microsoft Azure") ? ["Microsoft Azure"] : systemsList.includes("Amazon Web Services (AWS)") ? ["AWS"] : ["AWS", "Google Cloud Platform"],
    securityTools: ["Azure Key Vault", "HashiCorp Vault", "WAF & API Gateways"],
    integrationTools: ["ServiceNow Integration Hub", "MuleSoft APIs", "Zapier Enterprise"],
    monitoringTools: ["Datadog", "Prometheus & Grafana", "Dynatrace"]
  };

  // Adjust tech stack if user provided preferred stack
  if (preferredTech) {
    const customTechs = preferredTech.split(',').map(t => t.trim());
    customTechs.forEach(tech => {
      const lower = tech.toLowerCase();
      if (lower.includes("gpt") || lower.includes("openai") || lower.includes("claude") || lower.includes("llama") || lower.includes("gemini") || lower.includes("mistral")) {
        techStack.llmProviders.unshift(tech);
      } else if (lower.includes("pinecone") || lower.includes("qdrant") || lower.includes("milvus") || lower.includes("pgvector") || lower.includes("weaviate")) {
        techStack.vectorDatabases.unshift(tech);
      } else if (lower.includes("aws") || lower.includes("amazon") || lower.includes("azure") || lower.includes("gcp") || lower.includes("google cloud")) {
        techStack.cloudPlatforms.unshift(tech);
      } else if (lower.includes("snowflake") || lower.includes("databricks") || lower.includes("postgresql") || lower.includes("sql") || lower.includes("oracle")) {
        techStack.dataPlatforms.unshift(tech);
      } else if (lower.includes("langchain") || lower.includes("langgraph") || lower.includes("llamaindex") || lower.includes("semantic") || lower.includes("crew") || lower.includes("autogen")) {
        techStack.aiPlatforms.unshift(tech);
      } else {
        techStack.integrationTools.unshift(tech);
      }
    });
  }

  // De-duplicate lists
  for (const key in techStack) {
    techStack[key] = Array.from(new Set(techStack[key])).slice(0, 4);
  }

  // Add system specific integration tools
  if (systemsList.includes("SAP")) {
    techStack.integrationTools.unshift("SAP Integration Suite");
  }
  if (systemsList.includes("Salesforce")) {
    techStack.integrationTools.unshift("Salesforce MuleSoft APIs");
    techStack.dataPlatforms.unshift("Salesforce Data Cloud");
  }

  // Customize Success Metrics
  const customMetrics = [
    `80% reduction in manual cycle times for ${domain} operations`,
    `Elimination of manual entry errors across ${systemsList.slice(0, 2).join(' and ')}`,
    `100% continuous audit compliance logged against ${regulationsList.join(', ')}`,
    `Estimated payback in ${paybackPeriod} months with annual run-rate savings of $${annualSavings.toLocaleString()}`
  ];

  // Compile Final Solution Blueprint
  const blueprint = {
    metadata: {
      companyName,
      industry,
      companySize,
      revenue: annualRevenue,
      department,
      domain,
      generatedAt: new Date().toLocaleDateString(),
      confidenceScore: Math.round(85 + (10 - baseTemplate.complexity) + (baseTemplate.readiness)),
      aiReadinessScore: baseTemplate.readiness,
      complexityScore: baseTemplate.complexity,
      timeline: input.timeline || `${totalWeeks} Weeks`,
      desiredOutcome: desiredOutcome,
      preferredTechStack: preferredTech,
      roiGoals: input.roiGoals || "",
      additionalNotes: input.additionalNotes || ""
    },
    title: dynamicTitle,
    aiType: aiType,
    summary: dynamicSummary,
    problemStatement: problemStatement,
    currentStateAssessment: {
      description: currentProcess,
      painPointsList,
      existingSystems: systemsList
    },
    recommendedSolution: {
      headline: dynamicTitle,
      summary: baseTemplate.summary,
      details: dynamicSolution,
      aiType: aiType
    },
    businessBenefits: customMetrics,
    roi: {
      investment: `$${implementationCost.toLocaleString()}`,
      savings: `$${annualSavings.toLocaleString()} / Year`,
      payback: `${paybackPeriod} Months`
    },
    roadmap: {
      totalWeeks,
      phases: [
        { 
          phase: "Phase 1: Discovery & Scoping", 
          duration: `${phase1Weeks} Weeks`, 
          tasks: [
            `Define technical API interfaces for ${systemsList.slice(0, 2).join(' and ')}`,
            `Formulate custom AI prompt guardrails and data validation schema`,
            `Obtain information security and compliance clearances`
          ] 
        },
        { 
          phase: "Phase 2: Pilot & Sandbox Setup", 
          duration: `${phase2Weeks} Weeks`, 
          tasks: [
            `Deploy cloud workspace in ${techStack.cloudPlatforms[0]}`,
            `Build prototype parser for ${dataAvailableList[0] || 'input files'}`,
            `Conduct sandbox integrations with ${systemsList[0]} and test flows`
          ] 
        },
        { 
          phase: "Phase 3: Production Integration", 
          duration: `${phase3Weeks} Weeks`, 
          tasks: [
            `Launch production API bridges to ${systemsList.join(' and ')}`,
            `Establish live monitoring dashboards via ${techStack.monitoringTools[0]}`,
            `Enforce encryption key vaults and GDPR/SOX data masking compliance`
          ] 
        },
        { 
          phase: "Phase 4: Optimization & Scaling", 
          duration: `${phase4Weeks} Weeks`, 
          tasks: [
            `Fine-tune prompts and optimize LLM token usage`,
            `Deploy user onboarding and run support transition playbooks`,
            `Conduct project audit and finalize savings verification`
          ] 
        }
      ]
    },
    processWorkflows: {
      asIs: asIsList,
      toBe: toBeList
    },
    dataRequirements: baseTemplate.dataRequirements,
    dataSources: baseTemplate.dataSources,
    techStack,
    stakeholders: baseTemplate.stakeholders,
    teamStructure: baseTemplate.teamStructure,
    skillsets: baseTemplate.skills,
    risks: {
      technical: `API response exceptions or token lockouts on ${systemsList.join(', ')}.`,
      operational: `Friction in staff transitioning to automation workflow for ${domain}.`,
      security: `Leakage of raw files or sensitive data through public models. Prevented by ${techStack.securityTools[0]}.`,
      compliance: `Auditing and logging constraints for continuous ${regulationsList.join('/')} compliance.`
    },
    benchmarks: baseTemplate.benchmarks,
    regulations: regulationsList
  };

  // 1. RAG Simulation: Scan Use Case Repository
  const matchedCases = [];
  const lowerProb = problemStatement.toLowerCase();
  AIUseCaseRepository.forEach(item => {
    if (lowerProb.includes(item.title.toLowerCase().split(' ')[0]) || 
        lowerProb.includes(item.industry.toLowerCase().split(' ')[0]) ||
        item.industry.toLowerCase() === industry.toLowerCase() ||
        (item.summary && item.summary.toLowerCase().split(' ').some(word => word.length > 4 && lowerProb.includes(word)))) {
      matchedCases.push(item);
    }
  });
  if (matchedCases.length === 0) {
    matchedCases.push(AIUseCaseRepository[0]);
    matchedCases.push(AIUseCaseRepository[3]);
  }

  // 2. Multi-Agent Parallel Draft Compile
  const compiledDrafts = compileAgentDrafts(input, systemsList, regulationsList, techStack);

  // 3. Consensus Calculations
  const confidenceScore = Math.round(85 + (10 - baseTemplate.complexity) + (baseTemplate.readiness));
  const consensusLevel = confidenceScore >= 90 ? "High" : confidenceScore >= 80 ? "Medium" : "Low";
  
  const agreementAreas = [
    `Unanimous agreement on deploying a **RAG-powered architecture** backed by **${techStack.vectorDatabases[0]}** for semantic document queries.`,
    `Agreement on utilizing **human-in-the-loop validation consoles** to review staging outputs before writing to **${systemsList[0]}**.`,
    `Unanimous consensus on enforcing PII masking and transport encryption in accordance with **${regulationsList.join(', ')}** compliance standards.`
  ];
  
  const disagreementHighlights = [
    `**OpenAI GPT-5** proposed deploying AWS RDS (PostgreSQL) for transaction history, while **Anthropic Claude 3.5** suggested DynamoDB for lower read latency. Consensus aligned on **${techStack.vectorDatabases[0] || 'Pinecone'}** for context lookup.`,
    `**Google Gemini** recommended native multimodal PDF scanning, whereas **OpenAI** proposed pre-processing tables via OCR packages. Consensus agreed on **OCR pre-processing** to maximize accuracy for structured data.`
  ];

  // 4. Explainability compilation
  let customContributingModels = [
    { name: "GPT-5 (OpenAI)", weight: "35%" },
    { name: "Claude 3.5 Sonnet (Anthropic)", weight: "35%" },
    { name: "Gemini 1.5 Pro (Google)", weight: "20%" },
    { name: "DeepSeek-V3", weight: "10%" }
  ];
  if (typeof window !== 'undefined' && window.AppState && window.AppState.orchestratorSettings && window.AppState.orchestratorSettings.models) {
    const enabled = window.AppState.orchestratorSettings.models.filter(m => m.status === "Enabled");
    if (enabled.length > 0) {
      const total = enabled.length;
      customContributingModels = enabled.map((m, index) => {
        let weight = Math.round(100 / total);
        if (index === total - 1) {
          const sumPrev = Math.round(100 / total) * (total - 1);
          weight = 100 - sumPrev;
        }
        return { name: `${m.name} (${m.provider})`, weight: `${weight}%` };
      });
    }
  }

  const explainability = {
    whyThisRecommendation: `This architecture is selected because it directly mitigates the manual entry bottlenecks reported at ${companyName}. Utilizing ${aiType} allows automated validation of document flows, reducing latency by over 80% while preserving strict regulatory guardrails.`,
    contributingModels: customContributingModels,
    sourcesUsed: [
      `User Business Assessment form`,
      `Comparable Case Study: ${matchedCases[0].title} (${matchedCases[0].source})`,
      `Comparable Case Study: ${matchedCases[1] ? matchedCases[1].title : matchedCases[0].title} (${matchedCases[1] ? matchedCases[1].source : matchedCases[0].source})`,
      `Enterprise Data Ingest and Security SOPs`,
      `Gartner Cloud AI Integration Framework 2025`
    ],
    assumptions: [
      `1. Target systems (${systemsList.slice(0, 2).join(' and ')}) support REST APIs and secure Token credentials.`,
      `2. Data files follow standard digital formats (low-quality scans will fail automated parsing without human queue overrides).`,
      `3. Operating cloud environments support KMS key storage to safeguard client API access codes.`
    ],
    alternatives: [
      `Alternative A: **Fully Serverless Agentic Flow**. Uses AWS Step Functions instead of LangGraph orchestrators. Refused due to higher state management latency.`,
      `Alternative B: **Local Open-Source Ingestion**. Deploys Llama 3.1 70B on internal GPUs. Refused due to higher initial capital expenditure ($120k GPU acquisition cost).`
    ]
  };

  blueprint.consensus = {
    confidenceScore,
    consensusLevel,
    sourcesChecked: explainability.sourcesUsed.length,
    agreements: agreementAreas,
    disagreements: disagreementHighlights,
    drafts: compiledDrafts
  };
  blueprint.explainability = explainability;

  return blueprint;
}

/**
 * Text-based document NLP parsing simulation.
 * Extract business data, pain points and system names to prepare discovery inputs.
 * @param {string} text Raw content of uploaded files
 * @param {string} filename Name of the file uploaded
 * @returns {Object} Extracted entities and proposed department/domain
 */
function parseDocumentContent(text, filename) {
  const docLower = text.toLowerCase();
  
  // Initialize default discovery input values
  let extracted = {
    companyName: "Document Insights Inc",
    department: "IT",
    domain: "default",
    systems: [],
    painPoints: [],
    problemStatement: "",
    currentProcess: ""
  };

  // Attempt to match systems
  const systemsKeywords = {
    "SAP": ["sap", "s4hana", "erp"],
    "Salesforce": ["salesforce", "sfdc", "crm"],
    "Workday": ["workday", "hrms", "hr portal"],
    "ServiceNow": ["servicenow", "snow", "service desk"],
    "Jira": ["jira", "atlassian", "confluence"],
    "Microsoft Azure": ["azure", "microsoft cloud"],
    "Amazon Web Services (AWS)": ["aws", "amazon cloud", "s3"],
    "Google Cloud Platform (GCP)": ["gcp", "google cloud"]
  };

  for (const [systemName, keywords] of Object.entries(systemsKeywords)) {
    if (keywords.some(keyword => docLower.includes(keyword))) {
      extracted.systems.push(systemName);
    }
  }

  // Attempt to match pain points
  const painKeywords = {
    "manual_effort": ["manual", "hand-craft", "spreadsheets", "excel sheet", "transcribe"],
    "delays": ["delay", "slow", "days to", "weeks to", "turnaround", "backlog", "sla breach"],
    "errors": ["error", "mistake", "duplicate", "incorrect", "inaccurate"],
    "compliance_issues": ["audit", "fines", "compliance", "regulatory", "gdpr", "hipaa", "sox"],
    "high_cost": ["expensive", "costly", "fees", "overhead", "high cost", "budget overrun"],
    "security_risks": ["security", "vulnerability", "leak", "breach", "hack", "threat"]
  };

  for (const [painId, keywords] of Object.entries(painKeywords)) {
    if (keywords.some(keyword => docLower.includes(keyword))) {
      extracted.painPoints.push(painId);
    }
  }

  // Determine Department and Domain from content or filename
  const filenameLower = filename.toLowerCase();
  if (filenameLower.includes("invoice") || filenameLower.includes("payable") || filenameLower.includes("finance") || docLower.includes("invoice") || docLower.includes("accounts payable")) {
    extracted.department = "Finance";
    extracted.domain = "Accounts Payable";
    extracted.problemStatement = "Manual verification and data transcription of supplier invoices causing long processing times and payment delays.";
    extracted.currentProcess = "Finance operations staff download PDF invoices received via email, manually enter invoice details into ERP, and seek approvals through email chains.";
  } else if (filenameLower.includes("contract") || filenameLower.includes("legal") || docLower.includes("agreement") || docLower.includes("contract")) {
    extracted.department = "Legal";
    extracted.domain = "Contract Management";
    extracted.problemStatement = "Slow contract review pipeline. Missing liability clauses or non-standard language causing legal risk exposure.";
    extracted.currentProcess = "Attorneys check third-party contract drafts against standard legal templates page-by-page, suggesting edits in word files.";
  } else if (filenameLower.includes("sre") || filenameLower.includes("incident") || docLower.includes("alert") || docLower.includes("server") || docLower.includes("outage")) {
    extracted.department = "IT";
    extracted.domain = "DevOps";
    extracted.problemStatement = "Prolonged incident triage times for network and server alerts, causing system downtime and alert fatigue.";
    extracted.currentProcess = "SREs manually parse error logs from Datadog dashboards, cross-reference runbooks in Confluence, and raise tracking tickets.";
  } else if (filenameLower.includes("recruit") || filenameLower.includes("resume") || docLower.includes("candidate") || docLower.includes("hiring")) {
    extracted.department = "Human Resources";
    extracted.domain = "Talent Acquisition";
    extracted.problemStatement = "Excessive manual screening hours for open roles. High candidate backlog leading to missed skilled profiles.";
    extracted.currentProcess = "Recruiters download applicant resumes, manually search keywords, and coordinate interviews via email.";
  } else {
    // General default fallback
    extracted.department = "IT";
    extracted.domain = "default";
    extracted.problemStatement = "Inability to dynamically access documentation causing delays in tier-1 IT support resolution.";
    extracted.currentProcess = "Employees submit support tickets on the portal. IT agents research answers in SharePoint and email users resolution scripts.";
  }

  return extracted;
}

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.generateBlueprint = generateBlueprint;
  window.parseDocumentContent = parseDocumentContent;
}
