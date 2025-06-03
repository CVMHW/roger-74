
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ConcernType } from '../utils/reflection/reflectionTypes';
import RollbackIndicator from './RollbackIndicator';
import { useIsMobile } from '../hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const formattedTime = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Enhanced text processing for better mobile display with aggressive wrapping
  const textParagraphs = message.text
    .split(/(?<=\.|\?|\!) /) // Split at sentence endings
    .reduce((acc: string[], sentence, index, array) => {
      // Group related sentences into paragraphs (max 2 sentences per paragraph on mobile)
      const maxSentencesPerParagraph = isMobile ? 2 : 3;
      if (index % maxSentencesPerParagraph === 0 || index === 0) {
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
    <div className={`flex ${isMobile ? 'mb-2 px-1' : 'mb-2 sm:mb-4'} ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
      {message.sender === 'roger' && (
        <div className={`rounded-full bg-roger flex items-center justify-center text-white font-medium mr-2 mt-1 flex-shrink-0 ${isMobile ? 'h-7 w-7 text-xs' : 'h-6 w-6 sm:h-8 sm:w-8 text-xs sm:text-sm'}`}>
          R
        </div>
      )}
      <div className={`flex flex-col ${isMobile ? 'max-w-[85%]' : 'max-w-[85%] sm:max-w-[80%]'} min-w-0`}>
        {message.sender === 'roger' && message.isRollingBack && (
          <RollbackIndicator 
            isActive={true} 
            level={message.rollbackLevel}
            message={message.rollbackMessage}
          />
        )}
        <div 
          className={`
            chat-bubble 
            ${message.sender === 'user' ? 'user-message' : 'roger-message'} 
            ${message.concernType ? getConcernClass() : ''} 
            ${isMobile ? 'px-2 py-2 text-sm' : 'px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base'}
            break-words overflow-hidden
          `}
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
            minWidth: 0
          }}
        >
          <div className="overflow-hidden">
            {textParagraphs.map((paragraph, index) => (
              <p key={index} className={`${index > 0 ? (isMobile ? 'mt-1' : 'mt-1 sm:mt-2') : ''} leading-relaxed break-words`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word', hyphens: 'auto' }}>
                {paragraph.trim()}
              </p>
            ))}
          </div>
          <div className={`flex justify-between items-center ${isMobile ? 'mt-1.5 gap-2' : 'mt-1 sm:mt-2 gap-2'} ${message.sender === 'user' ? 'text-gray-500' : 'text-roger-light'}`}>
            <div className={`${isMobile ? 'text-xs' : 'text-xs'} flex-shrink-0`}>{formattedTime}</div>
            
            {message.sender === 'roger' && onFeedback && (
              <div className={`flex ${isMobile ? 'space-x-1' : 'space-x-1 sm:space-x-2'} flex-shrink-0`}>
                <button 
                  onClick={() => onFeedback(message.id, 'positive')} 
                  className={`rounded-full hover:bg-gray-100 transition-colors ${isMobile ? 'p-1.5' : 'p-1'} ${message.feedback === 'positive' ? 'text-green-500' : 'text-gray-400'} flex items-center justify-center`}
                  style={{ minWidth: '36px', minHeight: '36px' }}
                  aria-label="Helpful response"
                >
                  <ThumbsUp size={isMobile ? 12 : 12} className="sm:w-3.5 sm:h-3.5" />
                </button>
                <button 
                  onClick={() => onFeedback(message.id, 'negative')} 
                  className={`rounded-full hover:bg-gray-100 transition-colors ${isMobile ? 'p-1.5' : 'p-1'} ${message.feedback === 'negative' ? 'text-red-500' : 'text-gray-400'} flex items-center justify-center`}
                  style={{ minWidth: '36px', minHeight: '36px' }}
                  aria-label="Unhelpful response"
                >
                  <ThumbsDown size={isMobile ? 12 : 12} className="sm:w-3.5 sm:h-3.5" />
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
