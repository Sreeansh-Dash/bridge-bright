import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-dark-bg font-semibold">
              U
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
              🌈
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <strong className="text-sm font-semibold">
              {isUser ? 'You' : 'BrightBridge'}
            </strong>
            <span className="text-xs text-dark-text/60">
              {message.timestamp?.toLocaleTimeString()}
            </span>
          </div>
          <div className="text-dark-text leading-relaxed">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;