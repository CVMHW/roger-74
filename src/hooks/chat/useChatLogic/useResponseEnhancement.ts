
import { useCallback } from 'react';
import { MessageType } from '../../../components/Message';

/**
 * Hook for enhancing responses with specific context and improving response quality
 */
export const useResponseEnhancement = (
  isGenericResponse: (response: string) => boolean,
  createSpecificResponse: (userInput: string, userMessageHistory: string[]) => string,
  userMessageHistory: string[],
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  getResponseDelay: (content: string) => number
) => {
  // Track consecutive generic responses
  const [consecutiveGenericResponses, setConsecutiveGenericResponses] = 
    React.useState<number>(0);

  // Enhanced response tracking with generic response detection
  const enhanceAndTrackResponse = useCallback((responseText: string) => {
    // Check if this is a generic response
    if (isGenericResponse(responseText)) {
      setConsecutiveGenericResponses(prev => prev + 1);
      
      // If we've had too many generic responses in a row, force a more specific response
      if (consecutiveGenericResponses >= 1) {
        console.warn("TOO MANY GENERIC RESPONSES: Forcing more specific response");
        
        // Force a more specific response that acknowledges the user's input
        const lastUserMessage = userMessageHistory[userMessageHistory.length - 1] || "";
        
        // Generate a specific acknowledgment based on the user's input
        const specificResponse = createSpecificResponse(lastUserMessage, userMessageHistory);
        
        // Replace the generic response with a specific one after a deliberate pause
        setTimeout(() => {
          const specificMsg = createMessage(specificResponse, 'roger');
          
          // Add the response
          setMessages(prevMessages => {
            // Replace the last Roger message if it was generic
            const lastMsg = prevMessages[prevMessages.length - 1];
            if (lastMsg && lastMsg.sender === 'roger' && isGenericResponse(lastMsg.text)) {
              return [...prevMessages.slice(0, prevMessages.length - 1), specificMsg];
            }
            return [...prevMessages, specificMsg];
          });
          
          // Simulate typing for the specific response
          simulateTypingResponse(specificResponse, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === specificMsg.id ? { ...msg, text } : msg
              )
            );
          });
          
          // Reset the counter
          setConsecutiveGenericResponses(0);
        }, getResponseDelay(lastUserMessage));
      }
    } else {
      // Reset the counter if we get a non-generic response
      setConsecutiveGenericResponses(0);
    }
    
    return responseText;
  }, [
    isGenericResponse,
    consecutiveGenericResponses,
    userMessageHistory, 
    createSpecificResponse,
    setMessages,
    simulateTypingResponse,
    getResponseDelay
  ]);

  return {
    consecutiveGenericResponses,
    setConsecutiveGenericResponses,
    enhanceAndTrackResponse
  };
};

// Import dependencies needed for implementation
import React from 'react';
import { createMessage } from '../../../utils/messageUtils';
