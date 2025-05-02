import React from 'react';
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import { useChatLogic } from '../../hooks/chat/useChatLogic';
import CrisisResources from '../CrisisResources';

const ChatContainer: React.FC = () => {
  const { 
    messages, 
    isTyping, 
    handleSendMessage, 
    handleFeedback,
    showCrisisResources
  } = useChatLogic();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          onFeedback={handleFeedback}
        />
      </div>
      
      <div className="mt-4 mb-4">
        <CrisisResources forceOpen={showCrisisResources} />
      </div>
      
      <div>
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
