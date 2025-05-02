
import React, { useEffect, useRef } from 'react';
import Message, { MessageType } from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  processingContext?: string | null; // Add processing context
  onFeedback?: (messageId: string, isLike: boolean) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping, 
  processingContext, 
  onFeedback 
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-full">
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          onFeedback={onFeedback}
        />
      ))}
      
      {/* Show typing indicator when messages are being typed */}
      {isTyping && (
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm shrink-0">
            R
          </div>
          <div className="ml-2 p-2">
            <TypingIndicator />
            {/* Show processing context if provided */}
            {processingContext && (
              <div className="text-xs text-gray-500 italic mt-1">{processingContext}</div>
            )}
          </div>
        </div>
      )}
      
      {/* Show processing context even without typing indicator if appropriate */}
      {!isTyping && processingContext && (
        <div className="flex items-start">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm shrink-0">
            R
          </div>
          <div className="ml-2 p-2">
            <div className="text-sm text-gray-500 italic">{processingContext}</div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
