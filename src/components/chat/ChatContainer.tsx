
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageList from '../MessageList';
import MessageInput from '../MessageInput';
import useChatLogic from '../../hooks/chat/useChatLogic';
import CrisisResources from '../CrisisResources';
import { useStrictResponseVerification } from '../../hooks/useStrictResponseVerification';

const ChatContainer: React.FC = () => {
  const { 
    messages, 
    isTyping, 
    handleSendMessage, 
    handleFeedback,
    showCrisisResources,
    processingContext
  } = useChatLogic();
  
  // Get the verification system with rollback visualization
  const {
    applyRollbackState
  } = useStrictResponseVerification();
  
  // Apply rollback state to any messages that need it
  const messagesWithRollbackState = messages.map(message => applyRollbackState(message));
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden rounded-lg border border-cvmhw-blue shadow-md">
      {/* Header with crisis resources - only shown when triggered */}
      {showCrisisResources && (
        <div className="sticky top-0 z-10">
          <CrisisResources forceOpen={true} />
        </div>
      )}
      
      {/* Main chat area with ScrollArea for proper scrolling */}
      <ScrollArea className="flex-1 h-[400px] md:h-[500px]">
        <div 
          className="p-4" 
          ref={chatContainerRef}
        >
          <MessageList 
            messages={messagesWithRollbackState}
            isTyping={isTyping}
            processingContext={processingContext}
            onFeedback={handleFeedback}
          />
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <div className="border-t border-cvmhw-blue mt-auto">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
