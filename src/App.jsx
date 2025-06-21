import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertTriangle, Trash2, Heart, Brain, Users, Home, Briefcase, Search, User, Phone, Wifi, WifiOff } from 'lucide-react';
import { apiClient } from './config/api';
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
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await apiClient.get('/health');
      console.log('Backend health check:', response);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Backend connection failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const data = await apiClient.post('/api/chat', {
        message: message,
        userName: userName || 'User',
        conversationHistory: messages.slice(-5) // Send only last 5 messages for context
      });

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update connection status on successful response
      if (connectionStatus !== 'connected') {
        setConnectionStatus('connected');
      }
      
    } catch (error) {
      console.error('Error:', error);
      
      // Update connection status
      setConnectionStatus('disconnected');
      
      let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
      
      if (error.message.includes('Unable to connect')) {
        errorMessage = "I'm having trouble connecting to my AI services. Please check your internet connection and try again.";
      } else if (error.message.includes('timeout')) {
        errorMessage = "I'm taking longer than usual to respond. Please try again with a shorter message.";
      }
      
      const assistantMessage = {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
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
        
        {/* Connection Status */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-primary-500">Connected</span>
            </>
          ) : connectionStatus === 'disconnected' ? (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">Connection Issues</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-dark-text/60">Checking connection...</span>
            </>
          )}
        </div>
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
              <button
                onClick={checkBackendConnection}
                className="btn-secondary flex items-center gap-2"
                disabled={connectionStatus === 'checking'}
              >
                {connectionStatus === 'checking' ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Wifi className="w-4 h-4" />
                )}
                Check Connection
              </button>
            </div>

            {/* Crisis Resources */}
            {showCrisis && <CrisisResources />}

            {/* Connection Warning */}
            {connectionStatus === 'disconnected' && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="w-5 h-5 text-red-400" />
                  <strong className="text-red-400">Connection Issues</strong>
                </div>
                <p className="text-sm text-red-200">
                  I'm having trouble connecting to my AI services. You can still send messages, but responses may be delayed or unavailable.
                </p>
              </div>
            )}

            {/* Chat Messages */}
            <div className="bg-dark-card rounded-xl p-6 mb-6 min-h-[400px] max-h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                💬 Chat with BrightBridge
              </h2>
              
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-dark-text/60 py-8">
                    <p>Start a conversation by selecting a quick action above or typing a message below.</p>
                    {connectionStatus === 'connected' && (
                      <p className="text-sm mt-2 text-primary-500">✓ Connected and ready to help!</p>
                    )}
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                
                {isLoading && (
                  <div className="assistant-message">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
                        🌈
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-sm font-semibold">BrightBridge</strong>
                        </div>
                        <div className="text-dark-text">
                          <span className="loading-dots">Thinking</span>
                        </div>
                      </div>
                    </div>
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