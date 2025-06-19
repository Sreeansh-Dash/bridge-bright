# 🌈 BrightBridge - Neurodivergent Support Assistant

BrightBridge is an AI-powered support system designed specifically for neurodivergent individuals, providing comprehensive guidance across learning, mental health, social skills, daily living, career development, and more.

## 🚀 Features

### 8 Specialized AI Agents
- **📚 Educator Agent** - Learning strategies and academic support
- **🧠 Therapist Agent** - Mental health and emotional support  
- **👨‍👩‍👧‍👦 Caregiver Agent** - Family and caregiver guidance
- **👥 Social Skills Agent** - Communication and social interaction
- **🏠 Daily Living Agent** - Life skills and independent living
- **🚨 Crisis Support Agent** - Emergency and crisis intervention
- **💼 Interview Skills Agent** - Professional development and interviews
- **🔍 Screening Agent** - Preliminary screening and educational guidance

### Web Interface
- **Modern, accessible UI** built with Streamlit
- **Quick action buttons** for common support needs
- **Real-time chat interface** with the AI system
- **Crisis support resources** prominently displayed
- **Responsive design** that works on all devices

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- Google Cloud account with ADK access
- API credentials configured

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brightbridgeDir
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   GOOGLE_PROJECT_ID=your_project_id_here
   ```

4. **Run the application**
   ```bash
   streamlit run bridgebright_app.py
   ```

5. **Access the app**
   Open your browser and go to `http://localhost:8501`

## 🎯 How to Use

### Getting Started
1. **Enter your name** in the sidebar for a personalized experience
2. **Choose a quick action** or start typing in the chat
3. **The AI will intelligently route** your request to the most appropriate specialist agent
4. **Get comprehensive support** tailored to your specific needs

### Quick Actions Available
- 🗣️ **General Chat** - Start a conversation about how you're feeling
- 📚 **Learning Support** - Get help with studies and learning strategies
- 😰 **Anxiety/Stress** - Receive support for emotional challenges
- 👥 **Social Skills** - Improve communication and social interaction
- 💼 **Interview Prep** - Prepare for job interviews and career development
- 🔍 **Understanding Myself** - Learn about neurodivergent conditions

### Crisis Support
If you're experiencing a crisis or need immediate help:
- Click the **"Emergency Resources"** button in the sidebar
- Contact the **National Suicide Prevention Lifeline**: 988 (US)
- Text **Crisis Text Line**: HOME to 741741
- Call **Emergency Services**: 911

## 🔧 Technical Architecture

### Agent System
- **Main Orchestrator**: Routes user requests to specialized agents
- **Tool-based Architecture**: Uses Google ADK AgentTool for seamless integration
- **Context Awareness**: Maintains conversation context across interactions
- **Safety Features**: Built-in disclaimers and crisis support

### Web Interface
- **Streamlit Framework**: Modern, responsive web application
- **Session Management**: Maintains conversation history
- **Real-time Updates**: Instant response display
- **Accessibility**: Designed with neurodivergent users in mind

## 🛡️ Safety & Ethics

### Important Disclaimers
- **Not Medical Advice**: This system is not a substitute for professional medical care
- **Educational Purpose**: The screening agent provides educational information only
- **Professional Consultation**: Always consult qualified specialists for diagnosis and treatment
- **Crisis Support**: Emergency situations require immediate professional intervention

### Privacy & Security
- **Local Processing**: Conversations are processed locally when possible
- **No Data Storage**: Chat history is not permanently stored
- **Secure API**: Uses Google's secure ADK infrastructure

## 🤝 Contributing

We welcome contributions to improve BrightBridge! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For technical support or questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Remember**: BrightBridge is designed to support and empower neurodivergent individuals, but it's not a replacement for professional medical care. Always consult qualified specialists for diagnosis and treatment. 