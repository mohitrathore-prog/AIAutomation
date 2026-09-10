/**
 * End-to-End API Integration Test Suite
 * Tests server routes, assessment pipeline, research adapter, report generation, and admin endpoints.
 */

const app = require('../server/server');
const http = require('http');

async function runIntegrationTests() {
  console.log("==================================================================");
  console.log("  RUNNING COMPREHENSIVE INTEGRATION TESTS");
  console.log("==================================================================\n");

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(3001, resolve));
  console.log("[SERVER] Test instance listening on port 3001\n");

  let passed = 0;
  let failed = 0;

  async function check(name, url, options = {}, validator) {
    try {
      const res = await fetch(`http://localhost:3001${url}`, options);
      const data = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.text();
      const isValid = validator(res.status, data);
      if (isValid) {
        console.log(`[PASS] ${name}`);
        passed++;
      } else {
        console.error(`[FAIL] ${name} - Validation failed. Status: ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[FAIL] ${name} - Exception: ${e.message}`);
      failed++;
    }
  }

  // 1. Health check
  await check("Health Endpoint", "/api/health", {}, (status, data) => status === 200 && data.status === "healthy");

  // 2. Taxonomy endpoint
  await check("Taxonomy Endpoint", "/api/taxonomy", {}, (status, data) => status === 200 && data.industries.length >= 20 && data.departments.length === 10);

  // 3. Technologies Catalogue
  await check("Technologies Catalogue", "/api/technologies", {}, (status, data) => status === 200 && Array.isArray(data) && data.length >= 20);

  // 4. Dynamic Questions
  await check("Dynamic Questions", "/api/questions?department=Finance", {}, (status, data) => status === 200 && Array.isArray(data) && data.length > 0);

  // 5. Use Cases Library
  await check("Use Cases Library (100+ cases)", "/api/use-cases", {}, (status, data) => status === 200 && Array.isArray(data) && data.length >= 100);

  // 6. Company Research Adapter
  await check("Company Research Adapter", "/api/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyName: "Acme Global Manufacturing", industry: "Manufacturing" })
  }, (status, data) => status === 200 && data.researchedTechnologies.length >= 3 && data.researchedTechnologies.some(t => t.sourceTier === "Tier 1"));

  // 7. Full Assessment Evaluation Pipeline
  await check("Full Assessment Evaluation Pipeline", "/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      organization: { name: "Acme Global Manufacturing", industry: "Manufacturing" },
      departments: ["Finance", "IT", "Legal"],
      existingSystems: ["SAP S/4HANA", "ServiceNow", "UiPath"],
      customVolume: 80000
    })
  }, (status, data) => {
    return status === 200 &&
      data.summary.totalOpportunities > 0 &&
      data.summary.automationCount > 0 &&
      data.summary.expectedPaybackMonths > 0 &&
      data.matrixPoints.length > 0 &&
      data.roadmap.phase1.opportunities.length > 0;
  });

  // 8. Live Anti-AI Overuse Test Harness
  await check("Live Test Harness", "/api/tests/run", { method: "POST" }, (status, data) => status === 200 && data.allPassed === true && data.passedCount === 17);

  // 9. Sample Report
  await check("Sample Report HTML", "/api/reports/sample", {}, (status, data) => status === 200 && typeof data === 'string' && data.includes("Global Industrial Logistics Corp"));

  // 10. Admin Stats
  await check("Admin Dashboard Stats", "/api/admin/dashboard-stats", {}, (status, data) => status === 200 && data.useCasesCount >= 100 && data.auditLogs.length > 0);

  console.log("\n------------------------------------------------------------------");
  console.log(`  INTEGRATION TEST SUMMARY: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("------------------------------------------------------------------\n");

  server.close();

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log(">>> ALL INTEGRATION TESTS PASSED CLEANLY! <<<\n");
    process.exit(0);
  }
}

runIntegrationTests();
