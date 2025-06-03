
import React, { useEffect, useRef, useLayoutEffect } from 'react';
import Message, { MessageType } from './Message';
import TypingIndicator from './TypingIndicator';
import ProfileBubble from './ProfileBubble';
import { ScrollArea } from './ui/scroll-area';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  processingContext?: string | null;
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
        className="flex flex-col space-y-4 p-4"
        ref={scrollContainerRef}
      >
        {messages.map((message) => {
          // Special handling for welcome message to add profile bubble to R
          if (message.isWelcome && message.sender === 'roger') {
            return (
              <div key={message.id} className="flex items-start">
                <ProfileBubble>
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm shrink-0 cursor-pointer hover:bg-blue-600 transition-colors">
                    R
                  </div>
                </ProfileBubble>
                <div className="ml-2 p-2 bg-gray-100 rounded-lg max-w-[80%]">
                  <p className="text-sm text-gray-800">{message.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          }
          
          return (
            <Message 
              key={message.id} 
              message={message} 
              onFeedback={onFeedback}
            />
          );
        })}
        
        {/* Show typing indicator when messages are being typed */}
        {isTyping && (
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm shrink-0">
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
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm shrink-0">
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
