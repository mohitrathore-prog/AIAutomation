/**
 * Enterprise AI & Automation Opportunity Assessment Platform
 * Document Ingestion API Endpoints
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { uploadMiddleware, documentProcessor } = require('../adapters/documentProcessor');
const multer = require('multer');

// 1. Upload & Process Document
router.post('/upload', requireAuth, (req, res) => {
  uploadMiddleware.single('document')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          error: 'File size exceeds the 15MB limit. Please upload a smaller document.',
          code: 'FILE_TOO_LARGE'
        });
      }
      return res.status(400).json({
        error: err.message,
        code: err.code || 'UPLOAD_ERROR'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No document file provided.' });
    }

    try {
      const result = await documentProcessor.processDocument({
        file: req.file,
        organisationId: req.organisationId,
        userId: req.user.id,
        assessmentId: req.body.assessmentId || null
      });
      res.status(201).json(result);
    } catch (processErr) {
      res.status(500).json({ error: processErr.message });
    }
  });
});

// 2. List tenant documents
router.get('/', requireAuth, (req, res) => {
  try {
    const docs = documentProcessor.listDocuments(req.organisationId);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
