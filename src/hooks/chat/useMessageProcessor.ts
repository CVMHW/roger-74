
import { useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { isLocationDataNeeded } from '../../utils/messageUtils';
import { createMessage } from '../../utils/messageUtils';
import { ConcernType } from '../../utils/reflection/reflectionTypes';

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
  
  // Function to check for critical keywords in user input
  const containsCriticalKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    return /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide|fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill|crisis|emergency|urgent|need help now|immediate danger/.test(lowerText);
  };
  
  const processResponse = useCallback((userInput: string) => {
    // Check if this is a potentially critical message
    const isCritical = containsCriticalKeywords(userInput);
    
    // Process user input to generate Roger's response
    processUserMessage(userInput)
      .then(rogerResponse => {
        try {
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
          
          // For critical messages, use a faster typing simulation
          // Simulate typing with a callback to update the message text
          simulateTypingResponse(rogerResponse.text, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === rogerResponse.id ? { ...msg, text } : msg
              )
            );
          });
        } catch (innerError) {
          console.error("Error processing Roger's response:", innerError);
          
          // Critical fallback for error cases
          const fallbackResponse = createMessage(
            isCritical 
              ? "I'm concerned about what you're sharing. If you're in crisis or having thoughts about harming yourself, please reach out to a crisis hotline or emergency services immediately." 
              : "I'm here to listen. What would you like to talk about?",
            'roger',
            isCritical ? ('crisis' as ConcernType) : null
          );
          
          setMessages(prevMessages => [...prevMessages, fallbackResponse]);
          
          // Simulate typing for the error response
          simulateTypingResponse(fallbackResponse.text, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === fallbackResponse.id ? { ...msg, text } : msg
              )
            );
          });
        }
      })
      .catch(error => {
        console.error("Error generating response:", error);
        
        // Add a fallback response in case of error - more urgent for critical messages
        const errorResponse = createMessage(
          isCritical 
            ? "I notice you may be in crisis. If you're having thoughts of harming yourself, please reach out to a crisis hotline or emergency services immediately. I'm here to support you." 
            : "I'm sorry, I'm having trouble responding right now. I'm here to listen when you're ready to continue.",
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
        });
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
