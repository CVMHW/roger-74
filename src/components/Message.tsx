
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
  
  // Split longer messages into separate paragraphs for better readability
  const textParagraphs = message.text
    .split(/(?<=\.|\?|\!) /) // Split at sentence endings
    .filter(text => text.trim() !== '');

  return (
    <div className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'roger' && (
        <div className="h-8 w-8 rounded-full bg-roger flex items-center justify-center mr-2 mt-1">
          <span className="text-white font-medium text-sm">R</span>
        </div>
      )}
      <div 
        className={`chat-bubble ${message.sender === 'user' ? 'user-message' : 'roger-message'}`}
      >
        <div>
          {textParagraphs.map((paragraph, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {paragraph.trim()}
            </p>
          ))}
        </div>
        <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-500' : 'text-roger-light'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Message;
