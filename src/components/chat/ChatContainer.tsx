
import React, { useRef } from 'react';
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
    showCrisisResources,
    processingContext // New context state to show when Roger is "thinking"
  } = useChatLogic();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Show crisis resources at the top when triggered */}
      {showCrisisResources && (
        <div className="mt-2 mb-4 sticky top-0 z-10">
          <CrisisResources forceOpen={true} />
        </div>
      )}
      
      {/* Main chat area - explicit height and overflow handling */}
      <div 
        className="flex-1 overflow-hidden" 
        ref={chatContainerRef}
      >
        <MessageList 
          messages={messages} 
          isTyping={isTyping}
          processingContext={processingContext}
          onFeedback={handleFeedback}
        />
      </div>
      
      {/* Footer with crisis resources and input */}
      <div className="mt-auto">
        {/* Show crisis resources at the bottom as well */}
        <div className="my-4">
          <CrisisResources forceOpen={showCrisisResources} />
        </div>
        
        <div className="border-t">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
