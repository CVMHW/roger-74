
import { useState, useCallback } from 'react';
import { MessageType } from '../../../components/Message';
import { enhanceResponse } from '../../../utils/response/enhancer';
import { processUserMessageMemory, checkForResponseRepetition, getRepetitionRecoveryResponse } from '../../../utils/response/enhancer';
import { isLocationDataNeeded } from '../../../utils/messageUtils';
import { containsCriticalKeywords } from '../messageProcessor/detectionUtils';
import { handleErrorResponse } from './useErrorHandling';

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
  // Track recent responses for repetition detection
  const [recentResponses, setRecentResponses] = useState<string[]>([]);

  // Process a response with appropriate delay and handling
  const processResponse = useCallback((userInput: string) => {
    // Record user message to memory system
    processUserMessageMemory(userInput);
    
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
            // Use unified enhancement pipeline for comprehensive response processing
            const responseWithContextCheck = enhanceResponse(
              rogerResponse.text,
              userInput,
              conversationHistory.length,
              conversationHistory
            );
            
            // Check for repetition in recent responses
            if (checkForResponseRepetition(responseWithContextCheck, recentResponses)) {
              // If repetition detected, use a recovery response
              const recoveryResponse = getRepetitionRecoveryResponse();
              
              // Update the response with the recovery text
              rogerResponse = {
                ...rogerResponse,
                text: recoveryResponse
              };
            } else {
              // Update the response with enhanced text
              rogerResponse = {
                ...rogerResponse,
                text: responseWithContextCheck
              };
              
              // Update recent responses for future repetition checks
              setRecentResponses(prev => {
                const updated = [responseWithContextCheck, ...prev];
                // Keep only the 5 most recent responses
                return updated.slice(0, 5);
              });
            }
            
            // Track response with enhanced tracking system
            enhanceAndTrackResponse(rogerResponse.text);
            
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
            
            // Add response to conversation history for better context
            setConversationHistory(prev => [...prev, responseWithContextCheck]);
            
            // Simulate typing with a callback to update the message text
            simulateTypingResponse(rogerResponse.text, (text) => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === rogerResponse.id ? { ...msg, text } : msg
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
    enhanceAndTrackResponse,
    recentResponses
  ]);

  return {
    processResponse,
    conversationHistory
  };
};
