
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ConcernType } from '../utils/reflection/reflectionTypes';
import RollbackIndicator from './RollbackIndicator';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'roger';
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
  concernType?: ConcernType | null;
  locationData?: {
    state?: string;
    city?: string;
  } | null;
  isRollingBack?: boolean;
  rollbackLevel?: 'low' | 'medium' | 'high';
  rollbackMessage?: string;
};

interface MessageProps {
  message: MessageType;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const Message: React.FC<MessageProps> = ({ message, onFeedback }) => {
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

  // Determine if this message should have a special concern styling
  const getConcernClass = () => {
    if (!message.concernType) return '';
    
    switch (message.concernType) {
      case 'crisis':
        return 'border-l-4 border-red-500 pl-2 bg-red-50';
      case 'medical':
        return 'border-l-4 border-amber-500 pl-2 bg-amber-50';
      case 'mental-health':
        return 'border-l-4 border-blue-500 pl-2 bg-blue-50';
      case 'eating-disorder':
        return 'border-l-4 border-purple-500 pl-2 bg-purple-50';
      case 'substance-use':
        return 'border-l-4 border-orange-500 pl-2 bg-orange-50';
      case 'tentative-harm':
        return 'border-l-4 border-yellow-500 pl-2 bg-yellow-50';
      case 'mild-gambling':
        return 'border-l-4 border-pink-500 pl-2 bg-pink-50';
      case 'ptsd':
        return 'border-l-4 border-pink-500 pl-2 bg-pink-50';
      case 'ptsd-mild':
        return 'border-l-4 border-pink-500 pl-2 bg-pink-50';
      case 'trauma-response':
        return 'border-l-4 border-pink-500 pl-2 bg-pink-50';
      case 'pet-illness':
        return 'border-l-4 border-green-500 pl-2 bg-green-50';
      default:
        return '';
    }
  };

  return (
    <div className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'roger' && (
        <div className="h-8 w-8 rounded-full bg-roger flex items-center justify-center mr-2 mt-1">
          <span className="text-white font-medium text-sm">R</span>
        </div>
      )}
      <div className="flex flex-col">
        {message.sender === 'roger' && message.isRollingBack && (
          <RollbackIndicator 
            isActive={true} 
            level={message.rollbackLevel}
            message={message.rollbackMessage}
          />
        )}
        <div 
          className={`chat-bubble ${message.sender === 'user' ? 'user-message' : 'roger-message'} ${message.concernType ? getConcernClass() : ''}`}
        >
          <div>
            {textParagraphs.map((paragraph, index) => (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {paragraph.trim()}
              </p>
            ))}
          </div>
          <div className={`flex justify-between items-center mt-2 ${message.sender === 'user' ? 'text-gray-500' : 'text-roger-light'}`}>
            <div className="text-xs">{formattedTime}</div>
            
            {message.sender === 'roger' && onFeedback && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => onFeedback(message.id, 'positive')} 
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${message.feedback === 'positive' ? 'text-green-500' : 'text-gray-400'}`}
                  aria-label="Helpful response"
                >
                  <ThumbsUp size={14} />
                </button>
                <button 
                  onClick={() => onFeedback(message.id, 'negative')} 
                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${message.feedback === 'negative' ? 'text-red-500' : 'text-gray-400'}`}
                  aria-label="Unhelpful response"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
