import { v4 as uuidv4 } from 'uuid';
import { PythonBridge } from './python-bridge.js';

export class BrightBridgeAgent {
  constructor() {
    this.pythonBridge = new PythonBridge();
    this.fallbackEnabled = true;
  }

  async processMessage({ message, userName, conversationHistory }) {
    try {
      console.log(`Processing message from ${userName}: ${message.substring(0, 100)}...`);
      
      // Analyze the message to determine which agent(s) to use
      const intent = this.analyzeIntent(message, conversationHistory);
      console.log(`Detected intent: ${intent}`);
      
      // Route to appropriate agent via Python bridge
      const response = await this.pythonBridge.callPythonAgent(
        intent, 
        message, 
        userName, 
        conversationHistory
      );
      
      console.log(`Received response: ${response.substring(0, 100)}...`);
      return response;
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback to local response if Python bridge fails
      return this.getFallbackResponse(message, userName, error);
    }
  }

  analyzeIntent(message, conversationHistory) {
    const lowerMessage = message.toLowerCase();
    
    // Crisis detection keywords - highest priority
    const crisisKeywords = ['crisis', 'emergency', 'suicide', 'hurt myself', 'panic', 'overwhelmed', 'meltdown', 'can\'t cope', 'want to die', 'kill myself'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'crisis';
    }
    
    // Learning/education keywords
    const educationKeywords = ['study', 'learn', 'school', 'homework', 'exam', 'test', 'academic', 'college', 'university', 'assignment', 'learning', 'education'];
    if (educationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'education';
    }
    
    // Mental health keywords
    const therapyKeywords = ['anxious', 'stressed', 'depressed', 'sad', 'worried', 'emotional', 'feelings', 'mental health', 'therapy', 'counseling', 'anxiety', 'depression'];
    if (therapyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'therapy';
    }
    
    // Social skills keywords
    const socialKeywords = ['social', 'friends', 'communication', 'conversation', 'relationship', 'interact', 'awkward', 'shy', 'talking', 'people'];
    if (socialKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'social';
    }
    
    // Interview/career keywords
    const interviewKeywords = ['interview', 'job', 'career', 'work', 'employment', 'professional', 'resume', 'cv', 'workplace'];
    if (interviewKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'interview';
    }
    
    // Daily living keywords
    const dailyLivingKeywords = ['routine', 'daily', 'organize', 'time management', 'independent', 'life skills', 'chores', 'schedule', 'organization'];
    if (dailyLivingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'dailyLiving';
    }
    
    // Screening keywords
    const screeningKeywords = ['adhd', 'autism', 'dyslexia', 'neurodivergent', 'diagnosis', 'condition', 'understand myself', 'symptoms', 'autistic', 'add'];
    if (screeningKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'screening';
    }
    
    // Caregiver keywords
    const caregiverKeywords = ['family', 'parent', 'caregiver', 'support', 'help my child', 'my kid', 'my son', 'my daughter', 'parenting'];
    if (caregiverKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'caregiver';
    }
    
    return 'general';
  }

  getFallbackResponse(message, userName, error) {
    console.error('Using fallback response due to error:', error?.message || error);
    
    const fallbackResponses = [
      `Hi ${userName}! I'm currently experiencing some technical difficulties with my specialized AI agents, but I'm still here to help. Could you tell me more about what you'd like to discuss?`,
      `Hello ${userName}! While I'm having some connectivity issues with my full system, I can still provide support. What's on your mind today?`,
      `Thanks for reaching out, ${userName}! I'm currently running in limited mode due to technical issues, but I'm still here to listen and help as best I can. What would you like to talk about?`
    ];
    
    const baseResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    // Add specific guidance based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('crisis') || lowerMessage.includes('emergency') || lowerMessage.includes('suicide')) {
      return baseResponse + "\n\n⚠️ **IMPORTANT**: If you're in immediate danger, please call 911 or go to your nearest emergency room. For crisis support, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741.";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stressed') || lowerMessage.includes('anxiety')) {
      return baseResponse + "\n\nI can see you're dealing with anxiety or stress. While my full therapeutic support system is temporarily unavailable, remember that these feelings are valid and you're not alone. Consider taking some deep breaths and reaching out to a trusted friend, family member, or mental health professional.";
    }
    
    if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('school')) {
      return baseResponse + "\n\nI notice you're asking about learning or academic support. While my specialized education agent is temporarily unavailable, I can suggest some general strategies: break tasks into smaller chunks, use visual aids, create a consistent study schedule, and don't hesitate to ask for help from teachers or tutors.";
    }
    
    return baseResponse + "\n\nIn the meantime, if you need immediate support, please don't hesitate to reach out to appropriate professional services or trusted individuals in your life. I'll do my best to help with what I can!";
  }
}