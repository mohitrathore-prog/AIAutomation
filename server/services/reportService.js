/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Immutable Report Snapshot Service
 * Generates cryptographic tamper-evident snapshots of assessment reports.
 */

const crypto = require('crypto');
const { get, query, run, recordAudit } = require('../db');

class ReportService {
  /**
   * Generates and freezes an immutable report snapshot in the database
   */
  async createReportSnapshot({ assessmentId, organisationId, userId, format = 'PDF', title = null }) {
    const assessment = get(`
      SELECT * FROM assessments WHERE id = ? AND organisation_id = ?
    `, [assessmentId, organisationId]);

    if (!assessment) {
      throw new Error('Assessment not found or access denied');
    }

    const recommendations = query(`
      SELECT ar.*, uc.name as use_case_name, uc.department, uc.domain, uc.problem_statement
      FROM assessment_recommendations ar
      JOIN use_cases uc ON ar.use_case_id = uc.id
      WHERE ar.assessment_id = ?
      ORDER BY ar.rank_order ASC
    `, [assessmentId]);

    const roiProjections = query(`
      SELECT * FROM assessment_roi_projections WHERE assessment_id = ? ORDER BY scenario ASC
    `, [assessmentId]).map(r => ({ ...r, assumptions: JSON.parse(r.assumptions_json || '{}') }));

    const governanceFlags = query(`
      SELECT * FROM assessment_governance_flags WHERE assessment_id = ?
    `, [assessmentId]);

    // Find highest version
    const lastReport = get(`
      SELECT MAX(version) as max_v FROM report_snapshots WHERE assessment_id = ?
    `, [assessmentId]);
    const nextVersion = (lastReport && lastReport.max_v ? lastReport.max_v : 0) + 1;

    const reportContent = {
      assessmentId,
      organisationId,
      version: nextVersion,
      generatedAt: new Date().toISOString(),
      governingPrinciple: 'The right solution first. AI only when necessary.',
      title: title || `${assessment.title} - Version ${nextVersion}`,
      organisationName: assessment.organisation_name,
      industry: assessment.industry,
      companySize: assessment.company_size,
      normalizedScore: assessment.normalized_score,
      readinessTier: assessment.readiness_tier,
      executiveSummary: assessment.executive_summary,
      recommendations,
      roiProjections,
      governanceFlags
    };

    const contentJson = JSON.stringify(reportContent);
    const contentHash = crypto.createHash('sha256').update(contentJson).digest('hex');
    const reportId = `rep_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    run(`
      INSERT INTO report_snapshots (
        id, organisation_id, assessment_id, version, title, report_format,
        summary_json, content_hash, generated_by, is_immutable, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
    `, [
      reportId,
      organisationId,
      assessmentId,
      nextVersion,
      reportContent.title,
      format.toUpperCase(),
      contentJson,
      contentHash,
      userId || 'System'
    ]);

    recordAudit({
      organisationId,
      userId,
      action: 'REPORT_SNAPSHOT_CREATED',
      entityType: 'ReportSnapshot',
      entityId: reportId,
      newValues: { version: nextVersion, format: format.toUpperCase(), contentHash }
    });

    return {
      reportId,
      version: nextVersion,
      title: reportContent.title,
      format: format.toUpperCase(),
      contentHash,
      createdAt: reportContent.generatedAt,
      reportData: reportContent
    };
  }

  /**
   * Retrieves a snapshot and verifies tamper-evident integrity
   */
  getReportSnapshot(reportId, organisationId) {
    const report = get(`
      SELECT * FROM report_snapshots WHERE id = ? AND organisation_id = ?
    `, [reportId, organisationId]);

    if (!report) return null;

    // Verify hash integrity
    const recomputedHash = crypto.createHash('sha256').update(report.summary_json).digest('hex');
    const isIntegrityVerified = recomputedHash === report.content_hash;

    return {
      id: report.id,
      assessmentId: report.assessment_id,
      organisationId: report.organisation_id,
      version: report.version,
      title: report.title,
      format: report.report_format,
      contentHash: report.content_hash,
      isIntegrityVerified,
      createdAt: report.created_at,
      reportData: JSON.parse(report.summary_json)
    };
  }

  /**
   * Lists all report snapshots for an organisation
   */
  listReports(organisationId) {
    return query(`
      SELECT id, assessment_id, version, title, report_format, content_hash, created_at
      FROM report_snapshots
      WHERE organisation_id = ?
      ORDER BY created_at DESC
    `, [organisationId]);
  }
}

module.exports = new ReportService();
