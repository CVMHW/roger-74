
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';

/**
 * Helper function to handle error responses
 */
export const handleErrorResponse = (
  isCritical: boolean,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  setProcessingContext: (context: string | null) => void
): void => {
  // Add a fallback response in case of error - more urgent for critical messages
  const errorResponse = createMessage(
    isCritical 
      ? "I notice you may be in crisis. If you're having thoughts of harming yourself, please reach out to a crisis hotline or emergency services immediately. I'm here to support you." 
      : "I'm hearing that you're dealing with a frustrating situation. What would be most helpful to focus on right now?",
    'roger',
    isCritical ? ('crisis' as ConcernType) : null
  );
  
  setMessages(prevMessages => [...prevMessages, errorResponse]);
  
  // Simulate typing for the error response - faster for critical messages
  simulateTypingResponse(errorResponse.text, (text) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === errorResponse.id ? { ...msg, text } : msg
      )
    );
    
    // Clear the processing context once response is complete
    setProcessingContext(null);
  });
};

/**
 * Hook for centralized error handling
 */
export const useErrorHandling = () => {
  return {
    handleErrorResponse
  };
};
