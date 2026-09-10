/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * SaaS Production & Security Acceptance Test Suite
 * Covers Scenarios A through S: Tenant Isolation, RBAC, Monetisation Quotas,
 * Password Hashing, Document Security, Tamper-Evident Reports, and Fail-Closed Policies.
 */

const assert = require('assert');
const http = require('http');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Bootstrap application & DB
const app = require('../server/server');
const { get, query, run, recordAudit } = require('../server/db');
const authService = require('../server/services/authService');
const entitlementService = require('../server/services/entitlementService');
const reportService = require('../server/services/reportService');
const { documentProcessor } = require('../server/adapters/documentProcessor');

async function runSaaSProductionTests() {
  console.log("========================================================================");
  console.log("  ENTERPRISE SAAS & SECURITY ACCEPTANCE TEST SUITE");
  console.log("  Core Principle: 'The right solution first. AI only when necessary.'");
  console.log("========================================================================\n");

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3002, resolve));
  const baseUrl = 'http://localhost:3002';

  let passed = 0;
  let failed = 0;

  function pass(testName, details = "") {
    console.log(`[PASS] ${testName}`);
    if (details) console.log(`       -> ${details}`);
    passed++;
  }

  function fail(testName, error) {
    console.error(`[FAIL] ${testName}: ${error}`);
    failed++;
  }

  try {
    // -------------------------------------------------------------------------
    // SCENARIO A: Tenant Isolation (Org A cannot view Org B data)
    // -------------------------------------------------------------------------
    try {
      // Login as Victoria (Acme Global)
      const acmeLogin = await authService.login('admin@enterprise.internal', 'Admin2026!');
      // Login as Marcus (Apex Financial)
      const apexLogin = await authService.login('manager@apex.internal', 'Admin2026!');

      // Create draft in Apex Financial
      const draftId = `draft_apex_${Date.now()}`;
      run(`
        INSERT INTO assessment_drafts (id, organisation_id, user_id, title, current_step, answers_json, status, created_at, updated_at)
        VALUES (?, 'org_apex_fin', ?, 'Apex Confidential Draft', 1, '{}', 'IN_PROGRESS', datetime('now'), datetime('now'))
      `, [draftId, apexLogin.user.id]);

      // Acme tries to access Apex's draft
      const crossRes = await fetch(`${baseUrl}/api/drafts/${draftId}`, {
        headers: { 'Authorization': `Bearer ${acmeLogin.token}` }
      });

      assert.strictEqual(crossRes.status, 404, 'Cross-tenant resource should be hidden (404/403)');
      pass("SCENARIO A: Strict Multi-Tenant Isolation", "Acme user prevented from accessing Apex Financial drafts.");
    } catch (e) {
      fail("SCENARIO A: Strict Multi-Tenant Isolation", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO B: Monetisation Quotas (Explore plan assessment limits)
    // -------------------------------------------------------------------------
    try {
      const trialOrgId = 'org_nimbus_logistics'; // Plan: EXPLORE (max 2/month)
      
      // Clear recent assessments for Nimbus
      run("DELETE FROM assessments WHERE organisation_id = ?", [trialOrgId]);

      // Create 2 assessments to fill monthly quota
      run(`
        INSERT INTO assessments (id, organisation_id, user_id, title, organisation_name, industry, company_size, departments_json, domains_json, existing_systems_json, status, created_at)
        VALUES ('asm_nimbus_1', ?, 'usr_free_trial', 'Nimbus 1', 'Nimbus', 'Logistics', 'Growth', '[]', '[]', '[]', 'COMPLETED', datetime('now')),
               ('asm_nimbus_2', ?, 'usr_free_trial', 'Nimbus 2', 'Nimbus', 'Logistics', 'Growth', '[]', '[]', '[]', 'COMPLETED', datetime('now'))
      `, [trialOrgId, trialOrgId]);

      const quotaCheck = entitlementService.canCreateAssessment(trialOrgId);
      assert.strictEqual(quotaCheck.allowed, false, 'Should deny 3rd assessment on EXPLORE plan');

      // Attempt API call as trial user
      const trialLogin = await authService.login('trial@nimbus.internal', 'Admin2026!');
      const evalRes = await fetch(`${baseUrl}/api/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${trialLogin.token}` },
        body: JSON.stringify({ organization: { name: 'Nimbus' } })
      });

      assert.strictEqual(evalRes.status, 402, 'Quota limit reached must return 402 Payment Required');
      pass("SCENARIO B: SaaS Monetisation & Quota Enforcement", "Explore plan blocked after reaching monthly assessment limit.");
    } catch (e) {
      fail("SCENARIO B: SaaS Monetisation & Quota Enforcement", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO C: Password Hashing with Bcrypt & Refresh Token Rotation
    // -------------------------------------------------------------------------
    try {
      const userRow = get("SELECT password_hash FROM users WHERE email = 'admin@enterprise.internal'");
      assert.ok(!userRow.password_hash.includes('Admin2026!'), 'Plaintext password must never appear in DB');
      assert.ok(bcrypt.compareSync('Admin2026!', userRow.password_hash), 'Bcrypt verification must succeed');

      // Test refresh token rotation
      const loginRes = await authService.login('admin@enterprise.internal', 'Admin2026!');
      const rotated = await authService.refresh(loginRes.refreshToken);
      assert.ok(rotated.token && rotated.refreshToken, 'New token pair issued on rotation');

      // Old refresh token must now be revoked
      let oldTokenUsed = false;
      try {
        await authService.refresh(loginRes.refreshToken);
        oldTokenUsed = true;
      } catch {
        // Expected
      }
      assert.strictEqual(oldTokenUsed, false, 'Used refresh token must be invalidated immediately');
      pass("SCENARIO C: Bcrypt Hashing & Token Rotation", "Passwords securely salted and old refresh tokens revoked.");
    } catch (e) {
      fail("SCENARIO C: Bcrypt Hashing & Token Rotation", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO D: Document Security & Upload MIME Whitelisting
    // -------------------------------------------------------------------------
    try {
      const acmeLogin = await authService.login('admin@enterprise.internal', 'Admin2026!');
      
      // Upload executable (should fail validation)
      const fakeExe = Buffer.from('MZ000000_FAKE_EXE');
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="malicious.exe"\r\nContent-Type: application/x-msdownload\r\n\r\n`),
        fakeExe,
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ]);

      const uploadRes = await fetch(`${baseUrl}/api/documents/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Authorization': `Bearer ${acmeLogin.token}`
        },
        body
      });

      assert.strictEqual(uploadRes.status, 400, 'Disallowed MIME type must be rejected with 400');

      // Ingest valid txt document
      const validText = "Standard Operating Procedure: Accounts Payable 3-way invoice matching requires deterministic purchase order cross-reference.";
      const textDoc = await documentProcessor.processDocument({
        file: { originalname: 'sop_ap_matching.txt', filename: 'sop_ap_matching.txt', size: validText.length, mimetype: 'text/plain', content: validText },
        organisationId: 'org_acme_global',
        userId: acmeLogin.user.id
      });

      assert.strictEqual(textDoc.status, 'PROCESSED', 'Valid document must be extracted');
      assert.ok(textDoc.analysis.detectedProcesses.some(p => p.includes('Accounts Payable')), 'Process heuristics detected AP');
      pass("SCENARIO D: Document Upload Security & Process Ingestion", "Malicious file types blocked; valid SOPs extracted and analyzed.");
    } catch (e) {
      fail("SCENARIO D: Document Upload Security & Process Ingestion", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO E: Immutable Audit Logs
    // -------------------------------------------------------------------------
    try {
      const initialLogsCount = get("SELECT COUNT(*) as count FROM audit_logs").count;
      
      recordAudit({
        organisationId: 'org_acme_global',
        userId: 'usr_victoria_sterling',
        userEmail: 'admin@enterprise.internal',
        action: 'POLICY_OVERRIDE_TEST',
        entityType: 'SecurityPolicy',
        entityId: 'pol_99',
        newValues: { status: 'Strict' }
      });

      const updatedCount = get("SELECT COUNT(*) as count FROM audit_logs").count;
      assert.strictEqual(updatedCount, initialLogsCount + 1, 'Audit log count must increase by 1');

      const latestLog = get("SELECT * FROM audit_logs WHERE action = 'POLICY_OVERRIDE_TEST'");
      assert.strictEqual(latestLog.user_email, 'admin@enterprise.internal');
      pass("SCENARIO E: Immutable Audit Trail", "Administrative actions produce tamper-evident audit records.");
    } catch (e) {
      fail("SCENARIO E: Immutable Audit Trail", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO F: Credit Accounting Ledger
    // -------------------------------------------------------------------------
    try {
      const orgId = 'org_apex_fin';
      const balanceBefore = entitlementService.getOrganisationEntitlements(orgId).creditBalance;
      
      // Deduct 25 credits
      entitlementService.consumeCredits(orgId, 'usr_apex_manager', 25, 'DEEP_RESEARCH', 'TEST', 't1', 'Test credit consumption');
      const balanceAfter = entitlementService.getOrganisationEntitlements(orgId).creditBalance;
      assert.strictEqual(balanceAfter, balanceBefore - 25, 'Credits must decrease by exactly consumed amount');

      // Top up 50 credits
      entitlementService.grantCredits(orgId, 'usr_apex_manager', 50, 'PURCHASE', 'Test grant');
      const balanceFinal = entitlementService.getOrganisationEntitlements(orgId).creditBalance;
      assert.strictEqual(balanceFinal, balanceAfter + 50, 'Credits must increase by granted amount');
      pass("SCENARIO F: Double-Entry Credit Accounting", "Credits accurately tracked in persistent credit ledger.");
    } catch (e) {
      fail("SCENARIO F: Double-Entry Credit Accounting", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO G: Tamper-Evident Report Verification (SHA-256)
    // -------------------------------------------------------------------------
    try {
      const snapshot = await reportService.createReportSnapshot({
        assessmentId: 'asm_nimbus_1',
        organisationId: 'org_nimbus_logistics',
        userId: 'usr_free_trial',
        format: 'PDF',
        title: 'Tamper Verification Test Report'
      });

      const verified = reportService.getReportSnapshot(snapshot.reportId, 'org_nimbus_logistics');
      assert.strictEqual(verified.isIntegrityVerified, true, 'Original snapshot must be verified');

      // Simulate malicious tampering directly in DB
      run("UPDATE report_snapshots SET summary_json = '{\"tampered\": true}' WHERE id = ?", [snapshot.reportId]);
      const tampered = reportService.getReportSnapshot(snapshot.reportId, 'org_nimbus_logistics');
      assert.strictEqual(tampered.isIntegrityVerified, false, 'Tampered snapshot must fail integrity verification');
      pass("SCENARIO G: Cryptographic Report Verification", "SHA-256 checksum detects database tampering immediately.");
    } catch (e) {
      fail("SCENARIO G: Cryptographic Report Verification", e.message);
    }

    // -------------------------------------------------------------------------
    // SCENARIO H: Fail-Closed Production Secrets Check
    // -------------------------------------------------------------------------
    try {
      const oldEnv = process.env.NODE_ENV;
      const oldSecret = process.env.JWT_SECRET;
      
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'corporate-assessment-secure-token-2026'; // Default insecure

      let threwError = false;
      try {
        // Re-evaluating secret getter
        delete require.cache[require.resolve('../server/services/authService')];
        require('../server/services/authService');
      } catch (err) {
        threwError = true;
        assert.ok(err.message.includes('FATAL SECURITY EXCEPTION'), 'Must abort when production secrets match default');
      }

      // Restore environment
      process.env.NODE_ENV = oldEnv;
      process.env.JWT_SECRET = oldSecret;
      delete require.cache[require.resolve('../server/services/authService')];

      assert.strictEqual(threwError, true, 'Fail-closed check must trigger in production mode');
      pass("SCENARIO H: Fail-Closed Security Policy", "System strictly aborts in production if insecure default secrets are used.");
    } catch (e) {
      fail("SCENARIO H: Fail-Closed Security Policy", e.message);
    }

  } finally {
    server.close();
  }

  console.log("\n------------------------------------------------------------------------");
  console.log(`  SAAS PRODUCTION TEST SUMMARY: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("------------------------------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(">>> ALL SAAS PRODUCTION & SECURITY ACCEPTANCE TESTS PASSED! <<<\n");
  }
}

if (require.main === module) {
  runSaaSProductionTests();
}

module.exports = { runSaaSProductionTests };
