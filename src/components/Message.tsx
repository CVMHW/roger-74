
import React from 'react';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'roger';
  timestamp: Date;
};

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`chat-bubble ${message.sender === 'user' ? 'user-message' : 'roger-message'}`}
      >
        <p>{message.text}</p>
        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-500' : 'text-roger-light'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
