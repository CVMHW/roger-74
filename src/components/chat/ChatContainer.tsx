
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
      {/* Show crisis resources at the top when triggered */}
      {showCrisisResources && (
        <div className="mt-2 mb-4 sticky top-0 z-10">
          <CrisisResources forceOpen={true} />
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          isTyping={isTyping} 
          onFeedback={handleFeedback}
        />
      </div>
      
      {/* Show crisis resources at the bottom as well */}
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
