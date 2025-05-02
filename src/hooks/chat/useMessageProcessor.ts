
import { useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { isLocationDataNeeded } from '../../utils/messageUtils';

interface MessageProcessorProps {
  processUserMessage: (userInput: string) => Promise<MessageType>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  handleCrisisMessage: (userInput: string, rogerResponse: MessageType) => void;
  activeLocationConcern: any | null;
  setActiveLocationConcern: React.Dispatch<React.SetStateAction<any | null>>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  updateRogerResponseHistory: (response: string) => void;
}

/**
 * Hook for processing messages and generating responses
 */
export const useMessageProcessor = ({
  processUserMessage,
  setMessages,
  handleCrisisMessage,
  activeLocationConcern,
  setActiveLocationConcern,
  simulateTypingResponse,
  updateRogerResponseHistory
}: MessageProcessorProps) => {
  
  const processResponse = useCallback((userInput: string) => {
    // Process user input to generate Roger's response
    processUserMessage(userInput).then(rogerResponse => {
      // Add the response to history to prevent future repetition
      updateRogerResponseHistory(rogerResponse.text);
      
      // Check if this is a crisis-related response and store it for deception detection
      handleCrisisMessage(userInput, rogerResponse);
      
      // Add the empty response message first (will be updated during typing simulation)
      setMessages(prevMessages => [...prevMessages, rogerResponse]);
      
      // Set up to request location after this message if needed
      if (rogerResponse.concernType && 
          isLocationDataNeeded(rogerResponse.concernType) && 
          !activeLocationConcern) {
        
        setActiveLocationConcern({
          concernType: rogerResponse.concernType,
          messageId: rogerResponse.id,
          askedForLocation: false
        });
      }
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(rogerResponse.text, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === rogerResponse.id ? { ...msg, text } : msg
          )
        );
      });
    }).catch(error => {
      console.error("Error processing response:", error);
      // Add a fallback response in case of error
      const errorResponse = {
        id: Date.now().toString(),
        text: "I'm sorry, I'm having trouble responding right now. Could you try again?",
        sender: 'roger' as const,
        timestamp: new Date(),
        concernType: null
      };
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    });
  }, [
    processUserMessage, 
    setMessages, 
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory
  ]);

  return { processResponse };
};
