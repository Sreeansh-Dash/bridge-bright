#!/usr/bin/env python3
"""
Bridge script to interface between Node.js and Google ADK agents
Enhanced for Railway deployment with better error handling
"""
import sys
import json
import asyncio
import time
import uuid
from datetime import datetime
import os

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def log_error(message):
    """Log error to stderr for debugging"""
    print(f"ERROR: {message}", file=sys.stderr, flush=True)

def log_info(message):
    """Log info to stderr for debugging"""
    print(f"INFO: {message}", file=sys.stderr, flush=True)

# Enhanced development mode detection
DEVELOPMENT_MODE = (
    os.getenv('NODE_ENV') == 'development' or 
    not os.getenv('GOOGLE_API_KEY') or
    os.getenv('RAILWAY_ENVIRONMENT_NAME') is not None  # Railway deployment
)

if DEVELOPMENT_MODE:
    log_info("Running in development/Railway mode - using enhanced mock responses")
    
    class MockAgentBridge:
        def __init__(self):
            self.responses = {
                'crisis': [
                    "I understand you're going through a really difficult time right now, and I want you to know that reaching out shows incredible strength. Your feelings are valid, and you don't have to face this alone.",
                    "I'm here to support you through this crisis. While I'm currently in development mode, please know that immediate help is available if you need it.",
                    "Thank you for trusting me with how you're feeling. Crisis situations can feel overwhelming, but there are people trained to help you through this."
                ],
                'therapy': [
                    "I can hear that you're looking for emotional support, and I'm glad you reached out. It takes courage to acknowledge when we need help with our mental health.",
                    "Your emotional wellbeing matters, and it's completely normal to need support. While my full therapeutic capabilities are being developed, I want you to know that what you're feeling is valid.",
                    "Mental health is just as important as physical health. I'm here to listen and provide what support I can while encouraging you to also connect with professional resources."
                ],
                'education': [
                    "Learning can be challenging, especially when you're neurodivergent, but everyone has their own unique learning style and strengths. Let's explore what works best for you.",
                    "Education should be accessible and tailored to your needs. While my specialized education agent is being configured, I can share some general strategies that many neurodivergent learners find helpful.",
                    "Your learning journey is unique, and there's no one-size-fits-all approach. Let's work together to find strategies that play to your strengths."
                ],
                'social': [
                    "Social interactions can feel complex, but remember that everyone struggles with social situations sometimes. You're not alone in finding this challenging.",
                    "Building social skills is a process, and it's okay to take it one step at a time. Authenticity is more valuable than trying to fit into social expectations that don't feel natural.",
                    "Social connections are important, but they should feel genuine and comfortable for you. Let's explore ways to build meaningful relationships at your own pace."
                ],
                'interview': [
                    "Job interviews can be particularly challenging for neurodivergent individuals, but your unique perspective and skills are valuable assets. Let's work on presenting your best self authentically.",
                    "Interview preparation is about more than just answering questions - it's about communicating your value and finding the right fit for both you and the employer.",
                    "Your neurodivergent traits can be strengths in the workplace. Let's focus on how to effectively communicate your abilities and any accommodations you might need."
                ],
                'screening': [
                    "Understanding yourself better is a wonderful step toward self-advocacy and getting the support you need. Self-awareness is incredibly valuable.",
                    "Learning about neurodivergent conditions can be enlightening and validating. Remember, neurodivergence isn't something to be 'fixed' - it's a different way of experiencing the world.",
                    "Exploring whether you might be neurodivergent is a personal journey. While I can provide educational information, professional evaluation is important for accurate understanding."
                ],
                'caregiver': [
                    "Supporting a neurodivergent loved one shows incredible care and dedication. Your efforts to understand and help make a real difference in their life.",
                    "Being a caregiver can be both rewarding and challenging. Remember to take care of yourself too - you can't pour from an empty cup.",
                    "Every neurodivergent individual is unique, so what works for one person might not work for another. Patience, understanding, and open communication are key."
                ],
                'dailyLiving': [
                    "Daily living skills are fundamental to independence, and it's completely normal to need support in developing these. Everyone learns at their own pace.",
                    "Creating structure and routines can be incredibly helpful for neurodivergent individuals. Let's explore strategies that can make daily tasks more manageable.",
                    "Independence looks different for everyone. The goal is to develop skills that help you live as autonomously as possible while recognizing when you need support."
                ],
                'general': [
                    "Thank you for reaching out. I'm here to listen and provide support in whatever way I can. What's on your mind today?",
                    "I'm glad you're here. Whether you're looking for information, support, or just someone to talk to, I'm here to help.",
                    "Every conversation is an opportunity to learn and grow. I'm here to support you on your journey, whatever that looks like for you."
                ]
            }
            
        async def process_request(self, agent_type, message, user_name, conversation_history):
            """Enhanced mock response with context awareness"""
            # Simulate processing time
            await asyncio.sleep(0.5)
            
            # Get base responses for the agent type
            base_responses = self.responses.get(agent_type, self.responses['general'])
            base_response = base_responses[hash(message) % len(base_responses)]
            
            # Personalize the response
            personalized_response = f"Hi {user_name}! {base_response}"
            
            # Add context-aware additions based on message content
            message_lower = message.lower()
            
            if agent_type == 'crisis':
                personalized_response += "\n\n🚨 **IMMEDIATE RESOURCES:**\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: 911\n\nIf you're in immediate danger, please reach out to these resources right away."
            
            elif 'anxious' in message_lower or 'anxiety' in message_lower:
                personalized_response += "\n\n💙 **Quick Anxiety Tips:**\n• Try the 4-7-8 breathing technique\n• Ground yourself using the 5-4-3-2-1 method\n• Remember: this feeling will pass"
            
            elif 'study' in message_lower or 'homework' in message_lower:
                personalized_response += "\n\n📚 **Study Strategies:**\n• Break tasks into smaller chunks\n• Use visual aids and color coding\n• Take regular breaks (Pomodoro technique)\n• Find your optimal study environment"
            
            elif 'social' in message_lower or 'friends' in message_lower:
                personalized_response += "\n\n👥 **Social Tips:**\n• Start with shared interests or activities\n• Practice active listening\n• It's okay to need breaks from social situations\n• Quality over quantity in relationships"
            
            elif 'interview' in message_lower or 'job' in message_lower:
                personalized_response += "\n\n💼 **Interview Preparation:**\n• Research the company and role thoroughly\n• Practice common questions out loud\n• Prepare examples using the STAR method\n• Consider disclosure strategies for accommodations"
            
            # Add encouraging closing
            personalized_response += f"\n\nRemember, {user_name}, you're taking positive steps by reaching out for support. That takes courage, and I'm here to help you along the way."
            
            return personalized_response
    
    AgentBridge = MockAgentBridge

else:
    # Production mode with Google ADK (if available)
    try:
        log_info("Attempting to load Google ADK components...")
        
        from google.adk.sessions.in_memory_session_service import InMemorySessionService
        from google.adk.sessions.session import Session
        from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
        from google.genai.types import UserContent
        from bridgebright.agent import root_agent
        
        log_info("Google ADK components loaded successfully")
        
        class AgentBridge:
            def __init__(self):
                try:
                    self.session_service = InMemorySessionService()
                    log_info("AgentBridge initialized successfully")
                except Exception as e:
                    log_error(f"Failed to initialize AgentBridge: {str(e)}")
                    raise
                
            async def process_request(self, agent_type, message, user_name, conversation_history):
                """Process a request using the appropriate agent"""
                try:
                    log_info(f"Processing request for agent_type: {agent_type}")
                    
                    # Create a session
                    session_id = str(uuid.uuid4())
                    session = Session(
                        id=session_id,
                        app_name="brightbridge",
                        user_id=user_name or "user",
                        state={},
                        events=[],
                        last_update_time=time.time(),
                    )
                    
                    # Create user content
                    user_content = UserContent(message)
                    
                    # Create invocation context
                    context = InvocationContext(
                        session_service=self.session_service,
                        invocation_id=new_invocation_context_id(),
                        agent=root_agent,
                        user_content=user_content,
                        session=session,
                    )
                    
                    log_info("Running root agent...")
                    
                    # Run the root agent
                    response_content = ""
                    try:
                        async for event in root_agent.run_async(context):
                            if hasattr(event, "content") and event.content:
                                response_content = event.content
                                log_info(f"Received response: {response_content[:100]}...")
                                break
                    except Exception as agent_error:
                        log_error(f"Agent execution error: {str(agent_error)}")
                        response_content = f"I'm experiencing some technical difficulties with my AI agents right now. Please try again in a moment."
                    
                    if not response_content:
                        response_content = "I'm sorry, I couldn't generate a response at this time. Please try again."
                    
                    return response_content
                    
                except Exception as e:
                    log_error(f"Process request error: {str(e)}")
                    return f"I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment."
        
    except ImportError as e:
        log_error(f"Google ADK not available, falling back to mock mode: {str(e)}")
        # Fall back to mock mode
        DEVELOPMENT_MODE = True
        AgentBridge = MockAgentBridge

async def main():
    """Main function to handle the bridge communication"""
    try:
        log_info("Starting agent bridge main function...")
        
        # Read input from stdin
        input_data = sys.stdin.read()
        log_info(f"Received input data: {input_data[:200]}...")
        
        try:
            request = json.loads(input_data)
        except json.JSONDecodeError as e:
            log_error(f"JSON decode error: {str(e)}")
            error_response = {
                "success": False,
                "error": f"Invalid JSON input: {str(e)}",
                "response": "I'm sorry, there was a communication error. Please try again."
            }
            print(json.dumps(error_response), flush=True)
            return
        
        # Extract request parameters
        agent_type = request.get('agent_type', 'general')
        message = request.get('message', '')
        user_name = request.get('user_name', 'User')
        conversation_history = request.get('conversation_history', [])
        
        log_info(f"Processing: agent_type={agent_type}, user={user_name}, message_length={len(message)}")
        
        # Create bridge instance and process request
        try:
            bridge = AgentBridge()
            response = await bridge.process_request(agent_type, message, user_name, conversation_history)
            
            # Return response as JSON
            result = {
                "success": True,
                "response": response,
                "agent_type": agent_type,
                "mode": "development" if DEVELOPMENT_MODE else "production"
            }
            
            log_info("Successfully processed request")
            print(json.dumps(result), flush=True)
            
        except Exception as bridge_error:
            log_error(f"Bridge processing error: {str(bridge_error)}")
            error_response = {
                "success": False,
                "error": str(bridge_error),
                "response": "I'm experiencing technical difficulties with my AI system. Please try again in a moment."
            }
            print(json.dumps(error_response), flush=True)
        
    except Exception as e:
        log_error(f"Main function error: {str(e)}")
        error_response = {
            "success": False,
            "error": str(e),
            "response": "I'm experiencing technical difficulties. Please try again in a moment."
        }
        print(json.dumps(error_response), flush=True)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        log_error(f"Asyncio run error: {str(e)}")
        error_response = {
            "success": False,
            "error": str(e),
            "response": "I'm experiencing technical difficulties. Please try again in a moment."
        }
        print(json.dumps(error_response), flush=True)