import express from 'express';
import { BrightBridgeAgent } from '../services/brightbridge.js';

const router = express.Router();
const brightBridge = new BrightBridgeAgent();

router.post('/chat', async (req, res) => {
  try {
    const { message, userName, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await brightBridge.processMessage({
      message: message.trim(),
      userName: userName || 'User',
      conversationHistory: conversationHistory || []
    });

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      response: "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
    });
  }
});

export default router;