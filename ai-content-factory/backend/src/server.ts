import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend client
app.use(cors({
  origin: '*', // Adjust in production to match Next.js client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express config
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static route to access rendered assets
app.use('/renders', express.static('public/renders'));

// Mount routes
app.use('/api', apiRouter);

// Health Check
app.get('/', (req, res) => {
  res.send('AI Content Factory Orchestration Server Running.');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error Handler]:', err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 AI Content Factory Server Listening on Port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🧪 API Health Check: http://localhost:${PORT}/api/status`);
  console.log(`==================================================`);
});
