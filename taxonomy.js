/**
 * Enterprise Taxonomy & Reference Data Models
 * Contains all departments, domains, systems, pain points, data types, and compliance standards.
 */

const EnterpriseTaxonomy = {
  departments: {
    "IT": [
      "Infrastructure",
      "Cloud",
      "Networks",
      "Security",
      "IAM",
      "PAM",
      "Service Desk",
      "IT Operations",
      "Application Support",
      "DevOps",
      "Platform Engineering",
      "Enterprise Architecture",
      "Database Administration",
      "Observability",
      "SRE",
      "IT Asset Management",
      "Software Development",
      "Data Engineering",
      "Data Governance",
      "API Management"
    ],
    "Human Resources": [
      "Recruitment",
      "Talent Acquisition",
      "Onboarding",
      "Learning & Development",
      "Employee Engagement",
      "Performance Management",
      "Workforce Planning",
      "Compensation",
      "Benefits",
      "HR Operations",
      "HR Analytics",
      "Payroll Support"
    ],
    "Finance": [
      "Accounts Payable",
      "Accounts Receivable",
      "Financial Planning",
      "Budgeting",
      "Treasury",
      "Taxation",
      "Audit",
      "Risk Management",
      "Procurement Finance",
      "Financial Reporting",
      "Compliance"
    ],
    "Legal": [
      "Contract Management",
      "Legal Research",
      "Compliance",
      "Risk Assessment",
      "Litigation Support",
      "Regulatory Management",
      "Policy Review"
    ],
    "Payroll": [
      "Payroll Processing",
      "Payroll Validation",
      "Tax Processing",
      "Compliance",
      "Benefits Administration",
      "Employee Queries"
    ],
    "Procurement": [
      "Vendor Management",
      "Purchase Orders",
      "Contract Procurement",
      "Spend Analysis",
      "Inventory Procurement",
      "Strategic Sourcing"
    ],
    "Sales": [
      "Lead Generation",
      "CRM",
      "Pipeline Management",
      "Forecasting",
      "Customer Intelligence",
      "Quotation Management"
    ],
    "Marketing": [
      "Campaign Management",
      "Content Generation",
      "Social Media",
      "Market Intelligence",
      "Customer Analytics",
      "Brand Management"
    ],
    "Customer Service": [
      "Contact Center",
      "Ticketing",
      "Customer Experience",
      "Self-Service",
      "Knowledge Management",
      "Service Quality"
    ],
    "Operations": [
      "Process Automation",
      "Quality Management",
      "Logistics",
      "Supply Chain",
      "Manufacturing",
      "Inventory Management"
    ],
    "Risk & Compliance": [
      "Regulatory Compliance",
      "Internal Controls",
      "Governance",
      "Risk Monitoring",
      "Audit Automation"
    ]
  },
  
  existingSystems: [
    "SAP",
    "Oracle ERP",
    "Workday",
    "ServiceNow",
    "Salesforce",
    "Active Directory",
    "Microsoft Azure",
    "Amazon Web Services (AWS)",
    "Google Cloud Platform (GCP)",
    "Jira",
    "Confluence",
    "SharePoint",
    "HubSpot",
    "Zendesk",
    "Microsoft Dynamics 365",
    "Snowflake"
  ],

  painPoints: [
    { id: "manual_effort", name: "Manual effort & resource intensive" },
    { id: "delays", name: "Process delays & high SLA breach rates" },
    { id: "errors", name: "Human errors & data inaccuracies" },
    { id: "compliance_issues", name: "Regulatory compliance audit risks" },
    { id: "high_cost", name: "High operational costs" },
    { id: "poor_visibility", name: "Lack of process visibility & reporting" },
    { id: "security_risks", name: "Security vulnerabilities & threat vectors" },
    { id: "poor_adoption", name: "Low stakeholder / end-user adoption" }
  ],

  dataCategories: [
    "Structured (Databases, CSV, SQL)",
    "Semi-Structured (JSON, XML, Emails)",
    "Unstructured (PDF, Word Docs, Call Recordings, Images)"
  ],

  regulatoryConstraints: [
    "GDPR (Europe Data Protection)",
    "HIPAA (Healthcare Portability & Accountability)",
    "SOX (Sarbanes-Oxley Corporate Governance)",
    "PCI-DSS (Payment Card Industry Security)",
    "ISO 27001 (Information Security Standard)",
    "RBI Compliance (Reserve Bank of India)",
    "SEBI Compliance (Securities and Exchange Board of India)"
  ],

  budgets: [
    "Under $50k",
    "$50k - $150k",
    "$150k - $500k",
    "$500k - $1M+",
    "Undecided"
  ],

  timelines: [
    "1 - 3 Months",
    "3 - 6 Months",
    "6 - 12 Months",
    "12+ Months"
  ],

  industries: [
    "Banking & Financial Services",
    "Healthcare & Life Sciences",
    "Technology, Media & Telecom (TMT)",
    "Retail & Consumer Goods",
    "Manufacturing & Heavy Industry",
    "Energy & Utilities",
    "Public Sector & Government",
    "Logistics & Supply Chain",
    "Professional Services"
  ]
};

// Export to window object for browser access
if (typeof window !== 'undefined') {
  window.EnterpriseTaxonomy = EnterpriseTaxonomy;
}
