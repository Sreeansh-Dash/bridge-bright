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

# Import the BrightBridge agents
try:
    from bridgebright.agent import root_agent
    from google.adk.sessions.in_memory_session_service import InMemorySessionService
    from google.adk.sessions.session import Session
    from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
    from google.genai.types import UserContent
except ImportError as e:
    print(json.dumps({"error": f"Failed to import required modules: {str(e)}"}), file=sys.stderr)
    sys.exit(1)

class AgentBridge:
    def __init__(self):
        self.session_service = InMemorySessionService()
        
    async def process_request(self, agent_type, message, user_name, conversation_history):
        """Process a request using the appropriate agent"""
        try:
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
            
            # Run the root agent (it will delegate to appropriate sub-agents)
            response_content = ""
            async for event in root_agent.run_async(context):
                if hasattr(event, "content") and event.content:
                    response_content = event.content
                    break
            
            if not response_content:
                response_content = "I'm sorry, I couldn't generate a response at this time. Please try again."
            
            return response_content
            
        except Exception as e:
            return f"I apologize, but I'm experiencing some technical difficulties right now. Please try again in a moment. (Error: {str(e)})"

async def main():
    """Main function to handle the bridge communication"""
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        request = json.loads(input_data)
        
        # Extract request parameters
        agent_type = request.get('agent_type', 'general')
        message = request.get('message', '')
        user_name = request.get('user_name', 'User')
        conversation_history = request.get('conversation_history', [])
        
        # Create bridge instance and process request
        bridge = AgentBridge()
        response = await bridge.process_request(agent_type, message, user_name, conversation_history)
        
        # Return response as JSON
        result = {
            "success": True,
            "response": response,
            "agent_type": agent_type
        }
        
        print(json.dumps(result))
        
    except json.JSONDecodeError as e:
        error_response = {
            "success": False,
            "error": f"Invalid JSON input: {str(e)}",
            "response": "I'm sorry, there was a communication error. Please try again."
        }
        print(json.dumps(error_response))
        sys.exit(1)
        
    except Exception as e:
        error_response = {
            "success": False,
            "error": str(e),
            "response": "I'm experiencing technical difficulties. Please try again in a moment."
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())