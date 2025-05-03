
import { useState, useCallback } from 'react';
import { MessageType } from '../../../components/Message';

/**
 * Hook that combines and orchestrates various response-related hooks
 */
export const useResponseHooks = (
  processUserMessage: (userInput: string) => Promise<MessageType>,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  handleCrisisMessage: (userInput: string, rogerResponse: MessageType) => void,
  activeLocationConcern: any,
  setActiveLocationConcern: React.Dispatch<React.SetStateAction<any>>,
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  shouldThrottleResponse: () => boolean,
  getResponseDelay: (content: string) => number,
  setProcessingContext: (context: string | null) => void,
  enhanceAndTrackResponse: (responseText: string) => string
) => {
  // Track conversation history
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Process a response with appropriate delay and handling
  const processResponse = useCallback((userInput: string) => {
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
    setTimeout(() => {
      processUserMessage(userInput)
        .then(rogerResponse => {
          try {
            // Use master rules to process response with conversation context
            const responseWithContextCheck = processResponseThroughMasterRules(
              rogerResponse.text,
              userInput,
              conversationHistory.length,
              conversationHistory
            );
            
            // Update the response with enhanced text that has contextual awareness
            const updatedResponse = {
              ...rogerResponse,
              text: responseWithContextCheck
            };
            
            // Add the response to history to prevent future repetition through enhanced tracking
            const enhancedText = enhanceAndTrackResponse(responseWithContextCheck);
            
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
            setConversationHistory(prev => [...prev, responseWithContextCheck]);
            
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
        })
        .catch(error => {
          console.error("Error generating response:", error);
          handleErrorResponse(isCritical, setMessages, simulateTypingResponse, setProcessingContext);
        });
    }, responseDelay);
  }, [
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    shouldThrottleResponse,
    getResponseDelay,
    setProcessingContext,
    conversationHistory,
    enhanceAndTrackResponse
  ]);

  return {
    processResponse,
    conversationHistory
  };
};

// Import dependencies needed for implementation
import { containsCriticalKeywords } from '../messageProcessor/detectionUtils';
import { handleErrorResponse } from './useErrorHandling';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { isLocationDataNeeded } from '../../../utils/messageUtils';
