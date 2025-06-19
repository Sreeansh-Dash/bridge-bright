import React from 'react';
import { MessageCircle, BookOpen, Heart, Users, Briefcase, Search } from 'lucide-react';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "General Chat",
      message: "Hello! I'd like to chat about how I'm feeling today."
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Learning Support",
      message: "I need help with my studies and learning strategies."
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Anxiety/Stress",
      message: "I'm feeling anxious and stressed. Can you help me?"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Social Skills",
      message: "I need help with social interactions and communication."
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: "Interview Prep",
      message: "I have a job interview coming up and need help preparing."
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Understanding Myself",
      message: "I'd like to understand more about neurodivergent conditions and how they might relate to my experiences."
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">💬 Start a Conversation</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action.message)}
            className="btn-secondary flex items-center gap-2 text-left p-3 h-auto"
          >
            {action.icon}
            <span className="text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;