import { v4 as uuidv4 } from 'uuid';

export class BrightBridgeAgent {
  constructor() {
    this.agents = {
      educator: new EducatorAgent(),
      therapist: new TherapistAgent(),
      caregiver: new CaregiverAgent(),
      socialSkills: new SocialSkillsAgent(),
      dailyLiving: new DailyLivingAgent(),
      crisisSupport: new CrisisSupportAgent(),
      interviewSkills: new InterviewSkillsAgent(),
      screening: new ScreeningAgent()
    };
  }

  async processMessage({ message, userName, conversationHistory }) {
    try {
      // Analyze the message to determine which agent(s) to use
      const intent = this.analyzeIntent(message, conversationHistory);
      
      // Route to appropriate agent
      const response = await this.routeToAgent(intent, message, userName, conversationHistory);
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return "I'm sorry, I'm having trouble understanding your request right now. Could you please try rephrasing it?";
    }
  }

  analyzeIntent(message, conversationHistory) {
    const lowerMessage = message.toLowerCase();
    
    // Crisis detection keywords
    const crisisKeywords = ['crisis', 'emergency', 'suicide', 'hurt myself', 'panic', 'overwhelmed', 'meltdown'];
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'crisis';
    }
    
    // Learning/education keywords
    const educationKeywords = ['study', 'learn', 'school', 'homework', 'exam', 'test', 'academic', 'college'];
    if (educationKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'education';
    }
    
    // Mental health keywords
    const therapyKeywords = ['anxious', 'stressed', 'depressed', 'sad', 'worried', 'emotional', 'feelings', 'mental health'];
    if (therapyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'therapy';
    }
    
    // Social skills keywords
    const socialKeywords = ['social', 'friends', 'communication', 'conversation', 'relationship', 'interact'];
    if (socialKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'social';
    }
    
    // Interview/career keywords
    const interviewKeywords = ['interview', 'job', 'career', 'work', 'employment', 'professional'];
    if (interviewKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'interview';
    }
    
    // Daily living keywords
    const dailyLivingKeywords = ['routine', 'daily', 'organize', 'time management', 'independent', 'life skills'];
    if (dailyLivingKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'dailyLiving';
    }
    
    // Screening keywords
    const screeningKeywords = ['adhd', 'autism', 'dyslexia', 'neurodivergent', 'diagnosis', 'condition', 'understand myself'];
    if (screeningKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'screening';
    }
    
    // Caregiver keywords
    const caregiverKeywords = ['family', 'parent', 'caregiver', 'support', 'help my child'];
    if (caregiverKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'caregiver';
    }
    
    return 'general';
  }

  async routeToAgent(intent, message, userName, conversationHistory) {
    switch (intent) {
      case 'crisis':
        return await this.agents.crisisSupport.respond(message, userName, conversationHistory);
      case 'education':
        return await this.agents.educator.respond(message, userName, conversationHistory);
      case 'therapy':
        return await this.agents.therapist.respond(message, userName, conversationHistory);
      case 'social':
        return await this.agents.socialSkills.respond(message, userName, conversationHistory);
      case 'interview':
        return await this.agents.interviewSkills.respond(message, userName, conversationHistory);
      case 'dailyLiving':
        return await this.agents.dailyLiving.respond(message, userName, conversationHistory);
      case 'screening':
        return await this.agents.screening.respond(message, userName, conversationHistory);
      case 'caregiver':
        return await this.agents.caregiver.respond(message, userName, conversationHistory);
      default:
        return await this.generateGeneralResponse(message, userName, conversationHistory);
    }
  }

  async generateGeneralResponse(message, userName, conversationHistory) {
    const responses = [
      `Hi ${userName}! I'm here to help you with whatever you need. Could you tell me a bit more about what's on your mind today?`,
      `Hello ${userName}! I'm BrightBridge, your neurodivergent support assistant. What would you like to talk about or get help with?`,
      `Thanks for reaching out, ${userName}! I'm here to support you. What's something I can help you with today?`,
      `Hi there, ${userName}! I'm glad you're here. What's something you'd like to explore or get support with?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Base Agent Class
class BaseAgent {
  constructor(name, expertise) {
    this.name = name;
    this.expertise = expertise;
  }

  async respond(message, userName, conversationHistory) {
    // This would integrate with Google ADK in a real implementation
    // For now, we'll provide simulated responses
    return await this.generateResponse(message, userName, conversationHistory);
  }

  async generateResponse(message, userName, conversationHistory) {
    // Override in subclasses
    return "I'm here to help you with " + this.expertise;
  }
}

// Specialized Agent Classes
class EducatorAgent extends BaseAgent {
  constructor() {
    super('Educator', 'learning strategies and academic support');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, I'd be happy to help you with your learning needs! Let's start by understanding your specific challenges. Are you having trouble with focus, organization, note-taking, or test preparation?`,
      `Great question about learning, ${userName}! Every neurodivergent learner has unique strengths. What subject or learning area would you like to focus on today?`,
      `I can definitely help you develop effective study strategies, ${userName}. What's your current biggest challenge with learning or academics?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class TherapistAgent extends BaseAgent {
  constructor() {
    super('Therapist', 'mental health and emotional support');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, I hear that you're dealing with some difficult feelings. That takes courage to share. Can you tell me more about what you're experiencing right now?`,
      `Thank you for trusting me with your feelings, ${userName}. It's completely normal to feel anxious or stressed. What situations tend to trigger these feelings for you?`,
      `I'm here to support you through this, ${userName}. Let's work together on some coping strategies. What usually helps you feel a bit better when you're stressed?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class CaregiverAgent extends BaseAgent {
  constructor() {
    super('Caregiver', 'family support and guidance');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, supporting a neurodivergent family member can be both rewarding and challenging. What specific situation would you like guidance on?`,
      `I understand you're looking for family support, ${userName}. Every family's journey is unique. What's your biggest concern or question right now?`,
      `Thank you for reaching out, ${userName}. Caregivers need support too. What aspect of caregiving would you like to discuss today?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class SocialSkillsAgent extends BaseAgent {
  constructor() {
    super('Social Skills', 'communication and social interaction');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, social interactions can feel challenging sometimes. I'm here to help you build confidence in communication. What social situation would you like to work on?`,
      `Great that you're focusing on social skills, ${userName}! Everyone learns social interaction differently. What specific area would you like to improve?`,
      `I can help you navigate social situations, ${userName}. Are you looking for help with conversations, making friends, or understanding social cues?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class DailyLivingAgent extends BaseAgent {
  constructor() {
    super('Daily Living', 'life skills and independent living');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, developing daily living skills is so important for independence. What area of daily life would you like to work on - routines, organization, or time management?`,
      `I'm here to help you with practical life skills, ${userName}. What daily challenge would you like to tackle first?`,
      `Building independence is a great goal, ${userName}! What specific daily living skill would you like to develop or improve?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class CrisisSupportAgent extends BaseAgent {
  constructor() {
    super('Crisis Support', 'immediate support and intervention');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, I'm here to help you through this difficult moment. Your safety is the most important thing right now. Can you tell me how you're feeling and what's happening?`,
      `Thank you for reaching out, ${userName}. That shows real strength. Let's focus on helping you feel safer right now. Are you in immediate danger?`,
      `I'm glad you contacted me, ${userName}. Crisis moments can feel overwhelming, but you don't have to face this alone. What's the most pressing thing you need help with right now?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\n⚠️ If you're in immediate danger, please call 911 or go to your nearest emergency room. For crisis support, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741.";
  }
}

class InterviewSkillsAgent extends BaseAgent {
  constructor() {
    super('Interview Skills', 'job interview preparation and professional development');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, I'm excited to help you prepare for your interview! Job interviews can feel nerve-wracking, but with the right preparation, you can showcase your strengths. What type of interview are you preparing for?`,
      `Great that you're working on interview skills, ${userName}! Every person has unique strengths to offer. What aspect of interviewing would you like to focus on - preparation, answering questions, or managing anxiety?`,
      `I can definitely help you build confidence for interviews, ${userName}. What's your biggest concern about the upcoming interview process?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

class ScreeningAgent extends BaseAgent {
  constructor() {
    super('Screening', 'educational information about neurodivergent conditions');
  }

  async generateResponse(message, userName, conversationHistory) {
    const responses = [
      `${userName}, it's wonderful that you're seeking to understand yourself better. Self-awareness is a powerful tool. What specific aspects of neurodivergence are you curious about?`,
      `I can provide educational information about various neurodivergent conditions, ${userName}. Remember, I can't diagnose, but I can help you understand different traits and when it might be helpful to consult a professional. What would you like to learn about?`,
      `Thank you for your question, ${userName}. Understanding neurodivergence can be really empowering. What experiences or traits have you been wondering about?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\n📝 Important: I provide educational information only and cannot diagnose conditions. For professional evaluation, please consult a qualified psychologist or psychiatrist.";
  }
}