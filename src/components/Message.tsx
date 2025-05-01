
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
  
  // Use a more natural paragraph splitting approach
  // This helps make Roger's responses look more like human typing patterns
  const textParagraphs = message.text
    .split(/(?<=\.|\?|\!) /) // Split at sentence endings
    .reduce((acc: string[], sentence, index, array) => {
      // Group related sentences into paragraphs (max 3 sentences per paragraph)
      // This creates a more natural reading pattern
      if (index % 3 === 0 || index === 0) {
        acc.push(sentence);
      } else {
        acc[acc.length - 1] += ' ' + sentence;
      }
      return acc;
    }, [])
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
