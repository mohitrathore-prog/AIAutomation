/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Database Connection & Query Orchestration Layer (SQLite / better-sqlite3)
 * Enforces Tenant Isolation, Foreign Key Constraints, and Audit Trails.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/assessment_platform.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Configure SQLite for high performance and integrity
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

// Run Schema Definition
function initializeDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }
}

// Initialise schema immediately on load
initializeDatabase();

/**
 * Executes a query returning all matching rows
 */
function query(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.all(params);
  } catch (err) {
    console.error(`[DB QUERY ERROR] ${sql}`, err);
    throw err;
  }
}

/**
 * Executes a query returning a single row
 */
function get(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.get(params);
  } catch (err) {
    console.error(`[DB GET ERROR] ${sql}`, err);
    throw err;
  }
}

/**
 * Executes an INSERT, UPDATE, or DELETE statement
 */
function run(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    return stmt.run(params);
  } catch (err) {
    console.error(`[DB RUN ERROR] ${sql}`, err);
    throw err;
  }
}

/**
 * Executes multiple operations in an atomic transaction
 */
function transaction(fn) {
  const execute = db.transaction(fn);
  return execute;
}

/**
 * Writes an immutable audit log entry
 */
function recordAudit({
  organisationId = null,
  userId = null,
  userEmail = null,
  action,
  entityType,
  entityId = null,
  oldValues = null,
  newValues = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const stmt = db.prepare(`
      INSERT INTO audit_logs (
        id, organisation_id, user_id, user_email, action, entity_type,
        entity_id, old_values, new_values, ip_address, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(
      id,
      organisationId,
      userId,
      userEmail,
      action,
      entityType,
      entityId ? String(entityId) : null,
      oldValues ? (typeof oldValues === 'string' ? oldValues : JSON.stringify(oldValues)) : null,
      newValues ? (typeof newValues === 'string' ? newValues : JSON.stringify(newValues)) : null,
      ipAddress,
      userAgent
    );
    return id;
  } catch (err) {
    console.error('[AUDIT LOG ERROR]', err);
    // Audit logging should never crash primary flow, but must be alerted
    return null;
  }
}

/**
 * Strict tenant isolation check: Ensures entity belongs to the requesting organisation
 */
function checkTenantOwnership(table, recordId, organisationId) {
  if (!organisationId) return false;
  try {
    const row = db.prepare(`SELECT organisation_id FROM ${table} WHERE id = ?`).get(recordId);
    if (!row) return false;
    return row.organisation_id === organisationId;
  } catch {
    return false;
  }
}

module.exports = {
  db,
  query,
  get,
  run,
  transaction,
  recordAudit,
  checkTenantOwnership,
  initializeDatabase
};
