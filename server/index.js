import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chat.js';
import { errorHandler } from './middleware/error-handler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration for Railway
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://bright-bridge.netlify.app',
        'https://brightbridge-web-production.up.railway.app',
        /\.railway\.app$/,
        /\.netlify\.app$/
      ]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    railway: process.env.RAILWAY_ENVIRONMENT_NAME || 'not-railway',
    python_path: process.env.PYTHONPATH || 'not-set',
    google_api_configured: !!process.env.GOOGLE_API_KEY,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', chatRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Enhanced graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle Railway-specific signals
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BrightBridge server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚂 Railway: ${process.env.RAILWAY_ENVIRONMENT_NAME || 'not detected'}`);
  console.log(`🐍 Python path: ${process.env.PYTHONPATH || 'not set'}`);
});