# 🌈 BrightBridge - Neurodivergent Support Assistant

BrightBridge is a modern web-based AI support system designed specifically for neurodivergent individuals, providing comprehensive guidance across learning, mental health, social skills, daily living, career development, and more.

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

### Modern Web Interface
- **React-based frontend** with modern, accessible design
- **Real-time chat interface** with intelligent message routing
- **Quick action buttons** for common support needs
- **Crisis support resources** prominently displayed
- **Responsive design** optimized for all devices
- **Dark theme** designed for neurodivergent users

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brightbridge-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start the backend server
   npm run server

   # Terminal 2: Start the frontend development server
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🌐 Deployment Options

### Option 1: Netlify (Recommended for Frontend)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

### Option 2: Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 3: Railway/Render (Full-Stack)

1. **Connect your repository** to Railway or Render
2. **Set environment variables**
3. **Deploy** - the platform will automatically detect and build your app

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "run", "server"]
   ```

2. **Build and run**
   ```bash
   docker build -t brightbridge .
   docker run -p 3001:3001 brightbridge
   ```

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Google Cloud (for future ADK integration)
GOOGLE_API_KEY=your_api_key
GOOGLE_PROJECT_ID=your_project_id

# Frontend
VITE_API_URL=https://your-api-domain.com
```

### Google ADK Integration (Future Enhancement)

To integrate with Google's ADK for more advanced AI capabilities:

1. **Install Google ADK dependencies**
   ```bash
   npm install @google-cloud/aiplatform
   ```

2. **Update the BrightBridge service** to use Google ADK agents
3. **Configure authentication** with Google Cloud credentials

## 🎯 Usage

### Getting Started
1. **Enter your name** for a personalized experience
2. **Choose a quick action** or start typing in the chat
3. **The AI intelligently routes** your request to the appropriate specialist
4. **Receive comprehensive support** tailored to your needs

### Available Quick Actions
- 🗣️ **General Chat** - Start a conversation
- 📚 **Learning Support** - Academic help and strategies
- 😰 **Anxiety/Stress** - Emotional support and coping
- 👥 **Social Skills** - Communication improvement
- 💼 **Interview Prep** - Career development
- 🔍 **Understanding Myself** - Learn about neurodivergence

### Crisis Support
- **Emergency Resources** button provides immediate access to:
  - National Suicide Prevention Lifeline: 988
  - Crisis Text Line: Text HOME to 741741
  - Emergency Services: 911

## 🛡️ Safety & Ethics

### Important Disclaimers
- **Not Medical Advice**: This system provides educational support only
- **Professional Consultation**: Always consult qualified specialists for diagnosis
- **Crisis Situations**: Emergency situations require immediate professional help
- **Privacy**: Conversations are not permanently stored

## 🤝 Contributing

We welcome contributions! Please:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Development Guidelines
- Follow React best practices
- Maintain accessibility standards
- Write clear, documented code
- Test thoroughly before submitting

## 📞 Support

For technical support:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the wiki for detailed guides
- **Community**: Join our discussions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React, Express, and modern web technologies
- Designed specifically for neurodivergent users
- Inspired by the need for accessible, comprehensive support systems

---

**Remember**: BrightBridge is designed to support and empower neurodivergent individuals, but it's not a replacement for professional medical care. Always consult qualified specialists for diagnosis and treatment.