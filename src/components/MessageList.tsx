
import React, { useRef, useEffect, useState } from 'react';
import Message, { MessageType } from './Message';
import TypingIndicator from './TypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, onFeedback }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Function to check if user has manually scrolled up
  const checkIfUserScrolledUp = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // Only change autoScroll if the value would change
    if (autoScroll !== isAtBottom) {
      setAutoScroll(isAtBottom);
    }
  };

  // Scroll to bottom when messages change, but only if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && chatEndRef.current) {
      scrollToBottom();
    }
  }, [messages, isTyping, autoScroll]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ScrollArea 
      className="h-[60vh] max-h-[500px]"
      onScrollCapture={checkIfUserScrolledUp}
      ref={scrollContainerRef}
    >
      <div className="chat-container" id="chat-container">
        {messages.map(message => (
          <Message 
            key={message.id} 
            message={message} 
            onFeedback={message.sender === 'roger' ? onFeedback : undefined}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
