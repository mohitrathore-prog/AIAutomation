/**
 * Storage Service Adapter
 * Provides abstract storage operations for process documents, exported reports, and logs.
 * Supports Local Filesystem (MVP default) and Amazon S3 / Azure Blob Storage extension points.
 */

const fs = require('fs');
const path = require('path');

class StorageAdapter {
  constructor() {
    this.storageType = process.env.STORAGE_PROVIDER || "local";
    this.uploadDir = path.join(__dirname, '../../uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      try {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      } catch (e) {
        // Ignored in restricted environments
      }
    }
  }

  /**
   * Saves a file payload
   * @param {string} fileName Destination filename
   * @param {Buffer|string} content File data
   * @returns {Promise<Object>} Metadata including relative path and URI
   */
  async saveFile(fileName, content) {
    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const targetPath = path.join(this.uploadDir, safeName);
    
    await fs.promises.writeFile(targetPath, content);
    return {
      fileName: safeName,
      path: targetPath,
      sizeBytes: Buffer.byteLength(content),
      storageType: this.storageType,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Reads a file
   * @param {string} fileName Filename
   * @returns {Promise<Buffer>}
   */
  async getFile(fileName) {
    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const targetPath = path.join(this.uploadDir, safeName);
    return await fs.promises.readFile(targetPath);
  }
}

module.exports = new StorageAdapter();
