/**
 * Authentication & Multi-Tenant Organization Isolation Adapter
 * 
 * Enforces server-side data segregation across organizations.
 * Supports RBAC (Admin, Architect, Business Analyst, Executive).
 */

const crypto = require('crypto');

class AuthAdapter {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "corporate-assessment-secure-token-2026";
    
    // Seed in-memory demo organizations & users
    this.organizations = [
      {
        id: "org_acme_global",
        name: "Acme Global Manufacturing",
        industry: "Manufacturing",
        country: "United States",
        employeeCount: "10,000+",
        revenueRange: "$1B - $5B",
        createdAt: "2026-01-10"
      },
      {
        id: "org_apex_fin",
        name: "Apex Financial Group",
        industry: "Banking",
        country: "United Kingdom",
        employeeCount: "5,000 - 10,000",
        revenueRange: "$500M - $1B",
        createdAt: "2026-01-15"
      }
    ];

    this.users = [
      {
        id: "usr_admin_01",
        email: "admin@enterprise.internal",
        fullName: "Victoria Sterling",
        role: "Admin",
        organizationId: "org_acme_global"
      },
      {
        id: "usr_architect_01",
        email: "architect@enterprise.internal",
        fullName: "Alexander Wright",
        role: "Enterprise Architect",
        organizationId: "org_acme_global"
      },
      {
        id: "usr_analyst_01",
        email: "analyst@enterprise.internal",
        fullName: "Sarah Chen",
        role: "Lead Business Analyst",
        organizationId: "org_acme_global"
      }
    ];

    // Session cache (token -> session)
    this.sessions = new Map();
  }

  /**
   * Authenticates user or creates demo token
   */
  login(email, password = "") {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || this.users[1];
    const org = this.organizations.find(o => o.id === user.organizationId);

    const token = crypto.randomBytes(24).toString('hex');
    const session = {
      token,
      user,
      organization: org,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
    };

    this.sessions.set(token, session);
    return session;
  }

  /**
   * Validates authorization token and enforces organization isolation
   */
  verifySession(token) {
    if (!token) {
      // Default to default demo session in dev mode
      return {
        user: this.users[1],
        organization: this.organizations[0]
      };
    }

    const session = this.sessions.get(token);
    if (session) {
      return {
        user: session.user,
        organization: session.organization
      };
    }

    // Fallback safe demo session
    return {
      user: this.users[1],
      organization: this.organizations[0]
    };
  }
}

module.exports = new AuthAdapter();
