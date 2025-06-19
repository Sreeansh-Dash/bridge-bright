#!/usr/bin/env python3
"""
Environment setup script for BrightBridge Google ADK integration
"""
import os
import sys
import subprocess
import json

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_requirements():
    """Install Python requirements"""
    try:
        print("📦 Installing Python requirements...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Python requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False

def check_google_credentials():
    """Check if Google Cloud credentials are configured"""
    google_creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    google_api_key = os.getenv('GOOGLE_API_KEY')
    
    if not google_creds and not google_api_key:
        print("⚠️  Google Cloud credentials not found")
        print("   Please set either:")
        print("   - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)")
        print("   - GOOGLE_API_KEY (API key)")
        return False
    
    if google_creds:
        if os.path.exists(google_creds):
            print("✅ Google Cloud service account credentials found")
        else:
            print(f"❌ Credentials file not found: {google_creds}")
            return False
    
    if google_api_key:
        print("✅ Google API key configured")
    
    return True

def test_imports():
    """Test if all required modules can be imported"""
    try:
        print("🧪 Testing module imports...")
        
        # Test Google ADK imports
        from google.adk.sessions.in_memory_session_service import InMemorySessionService
        from google.adk.sessions.session import Session
        from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
        from google.genai.types import UserContent
        print("✅ Google ADK modules imported successfully")
        
        # Test BrightBridge imports
        from bridgebright.agent import root_agent
        print("✅ BrightBridge agents imported successfully")
        
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Make sure all requirements are installed and Google Cloud is configured")
        return False

def test_agent_functionality():
    """Test basic agent functionality"""
    try:
        print("🤖 Testing agent functionality...")
        
        from bridgebright.agent import root_agent
        from google.adk.sessions.in_memory_session_service import InMemorySessionService
        from google.adk.sessions.session import Session
        from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
        from google.genai.types import UserContent
        import uuid
        import time
        
        # Create a test session
        session_service = InMemorySessionService()
        session_id = str(uuid.uuid4())
        session = Session(
            id=session_id,
            app_name="brightbridge",
            user_id="test_user",
            state={},
            events=[],
            last_update_time=time.time(),
        )
        
        # Create test context
        user_content = UserContent("Hello, this is a test message")
        context = InvocationContext(
            session_service=session_service,
            invocation_id=new_invocation_context_id(),
            agent=root_agent,
            user_content=user_content,
            session=session,
        )
        
        print("✅ Agent test setup completed successfully")
        print("   (Full agent testing requires async execution)")
        return True
        
    except Exception as e:
        print(f"❌ Agent test failed: {e}")
        return False

def main():
    """Main setup function"""
    print("🌈 BrightBridge Environment Setup")
    print("=" * 40)
    
    success = True
    
    # Check Python version
    if not check_python_version():
        success = False
    
    # Install requirements
    if not install_requirements():
        success = False
    
    # Check Google credentials
    if not check_google_credentials():
        success = False
        print("\n📝 To set up Google Cloud credentials:")
        print("   1. Create a service account in Google Cloud Console")
        print("   2. Download the JSON key file")
        print("   3. Set GOOGLE_APPLICATION_CREDENTIALS to the file path")
        print("   4. Or set GOOGLE_API_KEY with your API key")
    
    # Test imports
    if not test_imports():
        success = False
    
    # Test agent functionality
    if not test_agent_functionality():
        success = False
    
    print("\n" + "=" * 40)
    if success:
        print("✅ Environment setup completed successfully!")
        print("🚀 BrightBridge is ready to run")
    else:
        print("❌ Environment setup encountered issues")
        print("   Please resolve the above issues before running BrightBridge")
        sys.exit(1)

if __name__ == "__main__":
    main()