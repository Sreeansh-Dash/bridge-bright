#!/usr/bin/env python3
"""
Bridge script to interface between Node.js and Google ADK agents
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

# Check if we're in a development environment without Google ADK
DEVELOPMENT_MODE = os.getenv('NODE_ENV') == 'development' or not os.getenv('GOOGLE_API_KEY')

if DEVELOPMENT_MODE:
    log_info("Running in development mode - using mock responses")
    
    class MockAgentBridge:
        def __init__(self):
            pass
            
        async def process_request(self, agent_type, message, user_name, conversation_history):
            """Mock response for development"""
            responses = {
                'crisis': f"Hi {user_name}, I understand you're going through a difficult time. While I'm currently in development mode, please know that help is available. If you're in immediate danger, please call 911 or contact the National Suicide Prevention Lifeline at 988.",
                'therapy': f"Hello {user_name}, I can see you're looking for emotional support. While my full therapeutic capabilities are being set up, remember that it's okay to feel what you're feeling. Consider reaching out to a mental health professional or trusted friend.",
                'education': f"Hi {user_name}! I'd love to help with your learning needs. While my specialized education agent is being configured, here are some general tips: break tasks into smaller chunks, use visual aids, and don't hesitate to ask for help.",
                'social': f"Hello {user_name}! Social interactions can be challenging. While my social skills agent is being set up, remember that practice makes progress, and it's okay to take things at your own pace.",
                'interview': f"Hi {user_name}! Interview preparation is important. While my interview coach is being configured, remember to practice common questions, research the company, and be yourself.",
                'screening': f"Hello {user_name}! Understanding yourself is a great step. While my screening agent is being set up, remember that only qualified professionals can provide diagnoses. Consider consulting with a psychologist or psychiatrist.",
                'caregiver': f"Hi {user_name}! Supporting a neurodivergent loved one is wonderful. While my caregiver support agent is being configured, remember that patience, understanding, and professional guidance are key.",
                'dailyLiving': f"Hello {user_name}! Daily living skills are important for independence. While my daily living agent is being set up, try creating routines, using visual schedules, and breaking tasks into steps.",
                'general': f"Hi {user_name}! Thanks for reaching out. While my full AI system is being configured, I'm here to listen and provide basic support. What would you like to talk about?"
            }
            
            return responses.get(agent_type, responses['general'])
    
    AgentBridge = MockAgentBridge

else:
    # Import the BrightBridge agents with error handling
    try:
        log_info("Starting import process...")
        
        # Try to import Google ADK components
        try:
            from google.adk.sessions.in_memory_session_service import InMemorySessionService
            from google.adk.sessions.session import Session
            from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
            from google.genai.types import UserContent
            log_info("Google ADK imports successful")
        except ImportError as e:
            log_error(f"Google ADK import failed: {str(e)}")
            raise
        
        # Try to import BrightBridge agents
        try:
            from bridgebright.agent import root_agent
            log_info("BrightBridge agent import successful")
        except ImportError as e:
            log_error(f"BrightBridge agent import failed: {str(e)}")
            raise
            
    except ImportError as e:
        log_error(f"Critical import failure: {str(e)}")
        # Return a structured error response
        error_response = {
            "success": False,
            "error": f"Failed to import required modules: {str(e)}",
            "response": "I'm experiencing technical difficulties with my AI system. This might be due to missing dependencies or configuration issues. Please contact support."
        }
        print(json.dumps(error_response), flush=True)
        sys.exit(0)  # Exit with 0 to avoid process errors

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
                
                # Run the root agent (it will delegate to appropriate sub-agents)
                response_content = ""
                try:
                    async for event in root_agent.run_async(context):
                        if hasattr(event, "content") and event.content:
                            response_content = event.content
                            log_info(f"Received response: {response_content[:100]}...")
                            break
                except Exception as agent_error:
                    log_error(f"Agent execution error: {str(agent_error)}")
                    response_content = f"I'm experiencing some technical difficulties with my AI agents right now. Please try again in a moment. (Agent Error: {str(agent_error)})"
                
                if not response_content:
                    response_content = "I'm sorry, I couldn't generate a response at this time. Please try again."
                
                return response_content
                
            except Exception as e:
                log_error(f"Process request error: {str(e)}")
                return f"I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment. (Error: {str(e)})"

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
                "agent_type": agent_type
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