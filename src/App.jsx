import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, Trash2, Heart, Brain, Users, Home, Briefcase, Search, User, Phone } from 'lucide-react';
import CrisisResources from './components/CrisisResources';
import FeatureCard from './components/FeatureCard';
import ChatMessage from './components/ChatMessage';
import QuickActions from './components/QuickActions';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userName: userName,
          conversationHistory: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message) => {
    handleSendMessage(message);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Learning Support",
      description: "Study strategies, time management, and academic accommodations"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Mental Health",
      description: "Emotional regulation, anxiety management, and coping strategies"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Skills",
      description: "Communication, social interaction, and relationship building"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Daily Living",
      description: "Life skills, routines, and independent living support"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Career Support",
      description: "Interview preparation, workplace accommodations, and professional development"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Understanding",
      description: "Educational information about neurodivergent conditions"
    }
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-8 text-center">
        <h1 className="text-4xl font-bold text-dark-text mb-2">🌈 BrightBridge</h1>
        <p className="text-lg text-dark-text/80">Your AI companion for neurodivergent support and guidance</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Name Input */}
        {!userName && (
          <div className="max-w-md mx-auto mb-8 p-6 bg-dark-card rounded-xl border border-primary-500">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold">What should I call you?</h2>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your name"
                className="flex-1 px-4 py-2 bg-dark-bg border border-primary-500 rounded-lg 
                         text-dark-text placeholder-dark-text/60 focus:outline-none 
                         focus:ring-2 focus:ring-primary-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setUserName(e.target.value.trim());
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input.value.trim()) {
                    setUserName(input.value.trim());
                  }
                }}
                className="btn-primary"
              >
                Start
              </button>
            </div>
          </div>
        )}

        {userName && (
          <div className="text-center mb-8">
            <p className="text-lg text-primary-500">Welcome, {userName}! 👋</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <QuickActions onActionClick={handleQuickAction} />

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowCrisis(!showCrisis)}
                className="btn-secondary flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency Resources
              </button>
              <button
                onClick={clearConversation}
                className="btn-secondary flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Chat
              </button>
            </div>

            {/* Crisis Resources */}
            {showCrisis && <CrisisResources />}

            {/* Chat Messages */}
            <div className="bg-dark-card rounded-xl p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                💬 Chat with BrightBridge
              </h2>
              
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-dark-text/60 py-8">
                    <p>Start a conversation by selecting a quick action above or typing a message below.</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                
                {isLoading && (
                  <div className="assistant-message">
                    <strong>BrightBridge:</strong> <span className="loading-dots">Thinking</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 bg-dark-bg border border-primary-500 rounded-lg 
                         text-dark-text placeholder-dark-text/60 focus:outline-none 
                         focus:ring-2 focus:ring-primary-900"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                🎯 What I Can Help With
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <FeatureCard key={index} feature={feature} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-dark-text/60">
          <p className="font-semibold mb-2">BrightBridge - Supporting neurodivergent individuals with AI-powered guidance</p>
          <p className="text-sm">Remember: This is not a substitute for professional medical advice. Always consult qualified specialists for diagnosis and treatment.</p>
        </div>
      </div>
    </div>
  );
}

export default App;