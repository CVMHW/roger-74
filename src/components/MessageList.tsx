
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import Message, { MessageType } from './Message';
import TypingIndicator from './TypingIndicator';
import { ScrollArea } from './ui/scroll-area';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  processingContext?: string | null; // Add processing context
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping, 
  processingContext, 
  onFeedback 
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLength = useRef(messages.length);

  // More reliable scroll to bottom that runs after DOM updates
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Force scroll after layout is complete
  useLayoutEffect(() => {
    // Only auto-scroll when new messages are added or typing status changes
    if (messages.length > prevMessagesLength.current || isTyping !== undefined) {
      scrollToBottom();
    }
    
    prevMessagesLength.current = messages.length;
  }, [messages, isTyping]);

  // Add a regular effect for good measure
  useEffect(() => {
    scrollToBottom();
    
    // Add a delayed scroll to handle any rendering delays
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping, processingContext]);

  // Find any rollback messages
  const hasRollbackInProgress = messages.some(msg => msg.isRollingBack);

  return (
    <ScrollArea className="h-full overflow-y-auto" scrollHideDelay={0}>
      <div 
        className="flex flex-col space-y-2 sm:space-y-4 p-1 sm:p-4"
        ref={scrollContainerRef}
      >
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
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs sm:text-sm shrink-0">
              R
            </div>
            <div className="ml-2 p-2">
              <TypingIndicator isSlowMode={hasRollbackInProgress} />
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
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs sm:text-sm shrink-0">
              R
            </div>
            <div className="ml-2 p-2">
              <div className="text-sm text-gray-500 italic">{processingContext}</div>
            </div>
          </div>
        )}
        
        {/* This div is the reference for scrolling to the bottom */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
