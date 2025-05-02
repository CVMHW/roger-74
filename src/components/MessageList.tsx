
import React, { useRef, useEffect } from 'react';
import Message, { MessageType } from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isTyping: boolean;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, onFeedback }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
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
  );
};

export default MessageList;
