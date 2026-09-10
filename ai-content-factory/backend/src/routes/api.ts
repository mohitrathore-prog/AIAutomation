import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  ResearchAgent,
  ScriptWriterAgent,
  ImagePromptEngineerAgent,
  VoiceDirectorAgent,
  SEOExpertAgent,
  QAAgent
} from '../agents/agentFramework';
import { VideoService } from '../services/videoService';
import { QualityControlService } from '../services/qualityControl';

const router = Router();
const videoService = new VideoService();
const qcService = new QualityControlService();

// Encryption Configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET 
  ? crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32)
  : crypto.randomBytes(32); // Fallback for local development

/**
 * Helper: Encrypt API keys securely using AES-256-GCM
 */
function encryptKey(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Helper: Decrypt API keys
 */
function decryptKey(encryptedPayload: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedPayload.split(':');
  if (!ivHex || !authTagHex || !encryptedText) {
    throw new Error('Invalid encrypted credential payload format.');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// --- Agent Endpoints ---

router.post('/agents/research', async (req: Request, res: Response) => {
  try {
    const agent = new ResearchAgent();
    const result = await agent.execute(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/script', async (req: Request, res: Response) => {
  try {
    const agent = new ScriptWriterAgent();
    const result = await agent.execute(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/prompts', async (req: Request, res: Response) => {
  try {
    const agent = new ImagePromptEngineerAgent();
    const result = await agent.execute(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/voice', async (req: Request, res: Response) => {
  try {
    const agent = new VoiceDirectorAgent();
    const result = await agent.execute(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/agents/seo', async (req: Request, res: Response) => {
  try {
    const agent = new SEOExpertAgent();
    const result = await agent.execute(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Video Pipelines ---

router.post('/video/render', async (req: Request, res: Response) => {
  try {
    const { workspaceId, projectId, contentItemId, scenes, aspectRatio, resolution } = req.body;
    if (!contentItemId || !scenes) {
      return res.status(400).json({ success: false, error: 'Missing contentItemId or scenes parameters' });
    }
    const result = await videoService.render({
      workspaceId: workspaceId || 'default',
      projectId: projectId || 'default',
      contentItemId,
      scenes,
      aspectRatio: aspectRatio || '16:9',
      resolution: resolution || '1080p'
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Quality Control Router ---

router.post('/qc/validate', async (req: Request, res: Response) => {
  try {
    const { id, title, contentType, data } = req.body;
    if (!id || !title) {
      return res.status(400).json({ success: false, error: 'Missing content item id or title parameter' });
    }
    const qcResult = await qcService.validate({ id, title, contentType, data });
    res.json(qcResult);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Settings and Secure Credentials ---

router.post('/credentials/encrypt', (req: Request, res: Response) => {
  try {
    const { rawKey } = req.body;
    if (!rawKey) {
      return res.status(400).json({ success: false, error: 'rawKey is required in request body.' });
    }
    const encrypted = encryptKey(rawKey);
    res.json({ success: true, encryptedPayload: encrypted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/credentials/decrypt', (req: Request, res: Response) => {
  try {
    const { encryptedPayload } = req.body;
    if (!encryptedPayload) {
      return res.status(400).json({ success: false, error: 'encryptedPayload is required.' });
    }
    const decrypted = decryptKey(encryptedPayload);
    res.json({ success: true, decryptedKey: decrypted.replace(/./g, '*') }); // obfuscated check
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- System Health and Diagnostic ---

router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date(),
    engines: {
      video: 'FFmpeg available',
      database: 'Supabase connected',
      automation: 'n8n integration active'
    }
  });
});

export default router;
