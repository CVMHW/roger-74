
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { isLocationDataNeeded } from '../../../utils/messageUtils';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { ProcessResponseParams } from './types';
import { MessageType } from '../../../components/Message';

/**
 * Handles the core logic for processing user input and generating responses
 */
export const processResponse = async ({
  userInput,
  processUserMessage,
  setMessages,
  handleCrisisMessage,
  activeLocationConcern,
  setActiveLocationConcern,
  simulateTypingResponse,
  updateRogerResponseHistory,
  shouldThrottleResponse,
  getResponseDelay,
  setProcessingContext,
  conversationHistory,
}: ProcessResponseParams): Promise<void> => {
  // Check if this is a potentially critical message
  const isCritical = containsCriticalKeywords(userInput);
  
  // Calculate appropriate delay time based on message content
  const responseDelay = getResponseDelay(userInput);
  
  // Double-check throttling for non-critical messages
  if (shouldThrottleResponse() && !isCritical) {
    console.log("Response throttled to ensure quality listening");
    // Add an additional 700-1200ms delay for more natural conversation
    const extraDelay = Math.floor(Math.random() * 500) + 700;
    setTimeout(() => {
      setProcessingContext("Roger is taking time to understand your message...");
    }, 800);
  }
  
  // Process user input to generate Roger's response after appropriate delay
  setTimeout(async () => {
    try {
      const rogerResponse = await processUserMessage(userInput);
      
      try {
        // Use master rules to process response with conversation context - ensure we await result
        const responseWithContextCheck = await processResponseThroughMasterRules(
          rogerResponse.text,
          userInput,
          conversationHistory
        );
        
        // Update the response with enhanced text that has contextual awareness
        const updatedResponse = {
          ...rogerResponse,
          text: responseWithContextCheck
        };
        
        // Add the response to history to prevent future repetition
        updateRogerResponseHistory(responseWithContextCheck);
        
        // Check if this is a crisis-related response and store it for deception detection
        handleCrisisMessage(userInput, updatedResponse);
        
        // Add the empty response message first (will be updated during typing simulation)
        setMessages(prevMessages => [...prevMessages, updatedResponse]);
        
        // Set up to request location after this message if needed
        if (updatedResponse.concernType && 
            isLocationDataNeeded(updatedResponse.concernType) && 
            !activeLocationConcern) {
          
          setActiveLocationConcern({
            concernType: updatedResponse.concernType,
            messageId: updatedResponse.id,
            askedForLocation: false
          });
        }
        
        // Add response to conversation history for better context
        conversationHistory.push(responseWithContextCheck);
        
        // Simulate typing with a callback to update the message text
        simulateTypingResponse(responseWithContextCheck, (text) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === updatedResponse.id ? { ...msg, text } : msg
            )
          );
          
          // Clear the processing context once response is complete
          setProcessingContext(null);
        });
      } catch (innerError) {
        console.error("Error processing Roger's response:", innerError);
        handleErrorResponse(isCritical, setMessages, simulateTypingResponse, setProcessingContext);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      handleErrorResponse(isCritical, setMessages, simulateTypingResponse, setProcessingContext);
    }
  }, responseDelay);
};

/**
 * Helper function to handle error responses
 */
const handleErrorResponse = (
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

// Import containsCriticalKeywords 
import { containsCriticalKeywords } from './detectionUtils';
