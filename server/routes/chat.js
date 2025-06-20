import express from 'express';
import { BrightBridgeAgent } from '../services/brightbridge.js';

const router = express.Router();
const brightBridge = new BrightBridgeAgent();

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // Reduced for production

const rateLimit = (req, res, next) => {
  const clientId = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientId);
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests',
      response: "I'm receiving too many messages too quickly. Please wait a moment before sending another message."
    });
  }
  
  clientData.count++;
  next();
};

router.post('/chat', rateLimit, async (req, res) => {
  try {
    console.log('Received chat request:', {
      body: req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    const { message, userName, conversationHistory } = req.body;

    // Input validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ 
        error: 'Message is required',
        response: "Please enter a message to continue our conversation."
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: 'Message too long',
        response: "Your message is quite long. Please try breaking it into smaller parts so I can better help you."
      });
    }

    // Sanitize inputs
    const sanitizedMessage = message.trim();
    const sanitizedUserName = userName ? userName.trim().substring(0, 50) : 'User';
    const sanitizedHistory = Array.isArray(conversationHistory) 
      ? conversationHistory.slice(-10) // Keep only last 10 messages for context
      : [];

    console.log(`Processing message from ${sanitizedUserName}: ${sanitizedMessage.substring(0, 100)}...`);

    const response = await brightBridge.processMessage({
      message: sanitizedMessage,
      userName: sanitizedUserName,
      conversationHistory: sanitizedHistory
    });

    console.log(`Sending response: ${response.substring(0, 100)}...`);

    res.json({ 
      response,
      timestamp: new Date().toISOString(),
      success: true
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({ 
      error: 'Failed to process message',
      response: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
      success: false
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    python_path: process.env.PYTHONPATH || 'not set'
  });
});

// Test endpoint for development
router.get('/test', (req, res) => {
  res.json({
    message: 'BrightBridge API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    python_available: process.env.PYTHONPATH ? 'configured' : 'not configured'
  });
});

export default router;