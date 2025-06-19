import streamlit as st
import time
import sys
import os
import asyncio
from datetime import datetime
import json
import uuid

# Add the current directory to Python path to import bridgebright
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from bridgebright.agent import root_agent
    from google.adk.sessions.in_memory_session_service import InMemorySessionService
    from google.adk.sessions.session import Session
    from google.adk.agents.invocation_context import InvocationContext, new_invocation_context_id
    from google.genai.types import UserContent
except ImportError as e:
    st.error(f"Error importing BrightBridge: {e}")
    st.stop()

# Page configuration
st.set_page_config(
    page_title="BrightBridge - Neurodivergent Support Assistant",
    page_icon="🌈",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for dark mode and focus-friendly UI
st.markdown("""
<style>
    body, .stApp {
        background: #181c24 !important;
        color: #e0e6ed !important;
    }
    .main-header {
        background: linear-gradient(90deg, #232946 0%, #3a506b 100%);
        padding: 2rem;
        border-radius: 10px;
        color: #e0e6ed;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .chat-message {
        padding: 1rem;
        border-radius: 10px;
        margin: 0.5rem 0;
        border-left: 4px solid;
        background: #232946;
        color: #e0e6ed;
        box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    }
    .user-message {
        border-left-color: #3ddc97;
        margin-left: 2rem;
        background: #232946;
    }
    .assistant-message {
        border-left-color: #eebbc3;
        margin-right: 2rem;
        background: #232946;
    }
    .crisis-alert {
        background-color: #2d3142;
        border: 2px solid #e84545;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
        text-align: center;
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .feature-card {
        background: #232946;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        margin: 1rem 0;
        border: 2px solid #3ddc97;
        color: #e0e6ed;
        transition: border 0.2s, box-shadow 0.2s;
    }
    .feature-card:focus-within, .feature-card:hover {
        border: 2.5px solid #eebbc3;
        box-shadow: 0 4px 16px rgba(238,187,195,0.12);
        outline: none;
    }
    .stButton > button {
        background: linear-gradient(90deg, #3ddc97 0%, #232946 100%);
        color: #181c24;
        border: none;
        border-radius: 25px;
        padding: 0.5rem 2rem;
        font-weight: bold;
        outline: 2px solid transparent;
        transition: outline 0.2s, background 0.2s;
    }
    .stButton > button:focus {
        outline: 2.5px solid #eebbc3;
        background: #3ddc97;
    }
    .stButton > button:hover {
        background: linear-gradient(90deg, #232946 0%, #3ddc97 100%);
        color: #e0e6ed;
        outline: 2.5px solid #eebbc3;
    }
    .stTextInput > div > input {
        background: #232946;
        color: #e0e6ed;
        border: 1.5px solid #3ddc97;
        border-radius: 8px;
        padding: 0.5rem;
        font-size: 1.1rem;
        outline: none;
        transition: border 0.2s;
    }
    .stTextInput > div > input:focus {
        border: 2px solid #eebbc3;
    }
    .stChatInputContainer, .stChatInputContainer textarea {
        background: #232946 !important;
        color: #e0e6ed !important;
        border-radius: 8px;
    }
    .stChatInputContainer textarea:focus {
        border: 2px solid #3ddc97 !important;
    }
    .stMarkdown, .stMarkdown p, .stMarkdown h1, .stMarkdown h2, .stMarkdown h3, .stMarkdown h4, .stMarkdown h5, .stMarkdown h6 {
        color: #e0e6ed !important;
    }
    .stSidebar, .stSidebarContent {
        background: #181c24 !important;
        color: #e0e6ed !important;
    }
    ::selection {
        background: #3ddc97;
        color: #181c24;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'conversation_started' not in st.session_state:
    st.session_state.conversation_started = False
if 'user_name' not in st.session_state:
    st.session_state.user_name = ""

def display_crisis_resources():
    """Display crisis support resources"""
    st.markdown("""
    <div class="crisis-alert">
        <h3>🚨 Need Immediate Help?</h3>
        <p>If you're experiencing a crisis or need immediate support:</p>
        <ul style="text-align: left; display: inline-block;">
            <li><strong>National Suicide Prevention Lifeline:</strong> 988 (US)</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
            <li><strong>Emergency Services:</strong> 911</li>
        </ul>
        <p><em>These resources are available 24/7 and provide immediate, confidential support.</em></p>
    </div>
    """, unsafe_allow_html=True)

async def get_agent_response(prompt):
    # 1. Create a session service (reuse across requests for real apps)
    session_service = InMemorySessionService()
    # 2. Create a session (use a persistent user_id and session_id for real apps)
    session_id = str(uuid.uuid4())
    session = Session(
        id=session_id,
        app_name="brightbridge",
        user_id=st.session_state.user_name or "user",
        state={},
        events=[],
        last_update_time=time.time(),
    )
    # 3. Create user content
    user_content = UserContent(prompt)
    # 4. Create invocation context
    context = InvocationContext(
        session_service=session_service,
        invocation_id=new_invocation_context_id(),
        agent=root_agent,
        user_content=user_content,
        session=session,
    )
    # 5. Run the agent
    async for event in root_agent.run_async(context):
        if hasattr(event, "content") and event.content:
            return event.content
    return "Sorry, I couldn't generate a response."

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🌈 BrightBridge</h1>
        <p><em>Your AI companion for neurodivergent support and guidance</em></p>
    </div>
    """, unsafe_allow_html=True)

    # Name input at the top
    st.subheader("👤 What should I call you?")
    if not st.session_state.user_name:
        st.session_state.user_name = st.text_input("Enter your name", placeholder="Your name")
    if st.session_state.user_name:
        st.success(f"Welcome, {st.session_state.user_name}! 👋")

    # Quick Actions in main area
    st.subheader("💬 Start a Conversation")
    quick_actions = [
        ("🗣️ General Chat", "Hello! I'd like to chat about how I'm feeling today."),
        ("📚 Learning Support", "I need help with my studies and learning strategies."),
        ("😰 Anxiety/Stress", "I'm feeling anxious and stressed. Can you help me?"),
        ("👥 Social Skills", "I need help with social interactions and communication."),
        ("💼 Interview Prep", "I have a job interview coming up and need help preparing."),
        ("🔍 Understanding Myself", "I'd like to understand more about neurodivergent conditions and how they might relate to my experiences.")
    ]
    cols = st.columns(3)
    for i, (label, msg) in enumerate(quick_actions):
        if cols[i % 3].button(label):
            st.session_state.messages.append({"role": "user", "content": msg})
            st.session_state.conversation_started = True
            st.rerun()

    # Crisis support and clear conversation
    st.markdown("---")
    colA, colB = st.columns(2)
    with colA:
        if st.button("🚨 Emergency Resources"):
            display_crisis_resources()
    with colB:
        if st.button("🗑️ Clear Conversation"):
            st.session_state.messages = []
            st.session_state.conversation_started = False
            st.rerun()

    # Main content area
    col1, col2 = st.columns([2, 1])
    with col1:
        st.subheader("💬 Chat with BrightBridge")
        # Display chat messages
        for message in st.session_state.messages:
            if message["role"] == "user":
                st.markdown(f"""
                <div class="chat-message user-message">
                    <strong>You:</strong> {message["content"]}
                </div>
                """, unsafe_allow_html=True)
            else:
                st.markdown(f"""
                <div class="chat-message assistant-message">
                    <strong>BrightBridge:</strong> {message["content"]}
                </div>
                """, unsafe_allow_html=True)
        # Chat input
        if prompt := st.chat_input("Type your message here..."):
            st.session_state.messages.append({"role": "user", "content": prompt})
            st.session_state.conversation_started = True
            st.markdown(f"""
            <div class="chat-message user-message">
                <strong>You:</strong> {prompt}
            </div>
            """, unsafe_allow_html=True)
            with st.spinner("BrightBridge is thinking..."):
                try:
                    assistant_response = asyncio.run(get_agent_response(prompt))
                    st.session_state.messages.append({"role": "assistant", "content": assistant_response})
                    st.markdown(f"""
                    <div class="chat-message assistant-message">
                        <strong>BrightBridge:</strong> {assistant_response}
                    </div>
                    """, unsafe_allow_html=True)
                except Exception as e:
                    st.error(f"Error getting response: {e}")
                    st.session_state.messages.append({"role": "assistant", "content": "I'm sorry, I'm having trouble responding right now. Please try again."})
    with col2:
        st.subheader("🎯 What I Can Help With")
        features = [
            {"icon": "📚", "title": "Learning Support", "description": "Study strategies, time management, and academic accommodations"},
            {"icon": "🧠", "title": "Mental Health", "description": "Emotional regulation, anxiety management, and coping strategies"},
            {"icon": "👥", "title": "Social Skills", "description": "Communication, social interaction, and relationship building"},
            {"icon": "🏠", "title": "Daily Living", "description": "Life skills, routines, and independent living support"},
            {"icon": "💼", "title": "Career Support", "description": "Interview preparation, workplace accommodations, and professional development"},
            {"icon": "🔍", "title": "Understanding", "description": "Educational information about neurodivergent conditions"},
            {"icon": "👨‍👩‍👧‍👦", "title": "Family Support", "description": "Guidance for caregivers and family members"},
            {"icon": "🚨", "title": "Crisis Support", "description": "Immediate help during overwhelming situations"}
        ]
        for feature in features:
            st.markdown(f"""
            <div class="feature-card">
                <h4>{feature['icon']} {feature['title']}</h4>
                <p>{feature['description']}</p>
            </div>
            """, unsafe_allow_html=True)
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; color: #666; padding: 1rem;">
        <p><strong>BrightBridge</strong> - Supporting neurodivergent individuals with AI-powered guidance</p>
        <p><em>Remember: This is not a substitute for professional medical advice. Always consult qualified specialists for diagnosis and treatment.</em></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 