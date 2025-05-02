
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
  const [prevMessagesLength, setPrevMessagesLength] = useState(messages.length);
  // Track if the typing indicator was previously shown to prevent unwanted scrolling
  const [wasTyping, setWasTyping] = useState(isTyping);
  
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

  // Track when messages change
  useEffect(() => {
    // Store the previous message length to detect new messages
    setPrevMessagesLength(messages.length);
  }, [messages]);

  // Track typing state changes
  useEffect(() => {
    // Only update wasTyping after the effect runs
    setWasTyping(isTyping);
  }, [isTyping]);

  // Scroll to bottom only in specific conditions
  useEffect(() => {
    // Only scroll if:
    // 1. User is already at the bottom (autoScroll is true)
    // 2. A new message has been added (not just updating an existing typing message)
    // 3. The chat end ref exists
    // 4. Not scrolling just because typing state changed
    const isNewMessage = messages.length > prevMessagesLength;
    const shouldScrollForNewMessage = autoScroll && chatEndRef.current && isNewMessage;
    
    // Special case: User sent a message (should always scroll to view their own message)
    const isUserSentMessage = isNewMessage && messages[messages.length - 1]?.sender === 'user';
    
    if (shouldScrollForNewMessage || isUserSentMessage) {
      // Use a small timeout to ensure DOM updates before scrolling
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      // Clean up timeout if component unmounts or effect re-runs
      return () => clearTimeout(timeoutId);
    }
  }, [messages, autoScroll, prevMessagesLength, isTyping]);

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
