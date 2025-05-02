
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { 
  isUserIndicatingFeedbackLoop, 
  extractConversationContext,
  generateFeedbackLoopRecoveryResponse 
} from '../../utils/conversationEnhancement/repetitionDetector';

/**
 * Hook for detecting and handling feedback loops in conversation
 */
export const useFeedbackLoop = (
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  // Track if we've detected a feedback loop pattern
  const [feedbackLoopDetected, setFeedbackLoopDetected] = useState<boolean>(false);
  
  // Check if the user is indicating Roger is in a feedback loop
  const checkFeedbackLoop = (
    userInput: string, 
    userMessageHistory: string[]
  ): boolean => {
    const isUserComplaining = isUserIndicatingFeedbackLoop(userInput);
    
    if (isUserComplaining) {
      // Set feedback loop detected flag
      setFeedbackLoopDetected(true);
      
      // Generate a context-aware recovery response
      const context = extractConversationContext(userInput, userMessageHistory);
      const recoveryResponse = generateFeedbackLoopRecoveryResponse(context);
      
      // Create Roger's response to acknowledge the problem
      const rogerResponse = createMessage(recoveryResponse, 'roger');
      
      // Add the response
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Simulate typing
      simulateTypingResponse(recoveryResponse, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
      
      return true;
    }
    
    return false;
  };
  
  return {
    feedbackLoopDetected,
    setFeedbackLoopDetected,
    checkFeedbackLoop
  };
};
