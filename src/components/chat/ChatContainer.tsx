
import React from 'react';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import { useToast } from '@/components/ui/use-toast';
import { useChatLogic } from '../../hooks/chat/useChatLogic';

/**
 * Container component for the chat interface
 * Responsible for the overall chat UI
 */
const ChatContainer: React.FC = () => {
  const { 
    messages, 
    isTyping, 
    handleSendMessage, 
    handleFeedback 
  } = useChatLogic();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <MessageList 
        messages={messages} 
        isTyping={isTyping} 
        onFeedback={handleFeedback}
      />
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;
