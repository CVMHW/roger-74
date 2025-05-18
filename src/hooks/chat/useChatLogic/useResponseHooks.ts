import { useState, useCallback } from 'react';
import { MessageType } from '../../../components/Message';
import { enhanceResponse } from '../../../utils/response/enhancer';
import { checkForResponseRepetition, getRepetitionRecoveryResponse, processUserMessageMemory } from '../../../utils/response/enhancer/repetitionDetection';
import { isLocationDataNeeded } from '../../../utils/messageUtils';
import { containsCriticalKeywords } from '../messageProcessor/detectionUtils';
import { handleErrorResponse } from './useErrorHandling';

/**
 * Hook that combines and orchestrates various response-related hooks
 * with support for async RAG enhancement
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
  const processResponse = useCallback(async (userInput: string) => {
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
    setTimeout(async () => {
      try {
        const rogerResponse = await processUserMessage(userInput);
        
        // Set an initial empty version of the response for better UX
        setMessages(prevMessages => [...prevMessages, rogerResponse]);
        
        try {
          // Use unified enhancement pipeline for comprehensive response processing
          // Now with async support for vector operations
          let responseWithContextCheck = rogerResponse.text;
          
          try {
            // Call the async enhanceResponse function and await the result
            responseWithContextCheck = await enhanceResponse(
              rogerResponse.text,
              userInput,
              conversationHistory.length,
              conversationHistory
            );
          } catch (enhanceError) {
            console.error("Error enhancing response:", enhanceError);
            // Continue with original response if enhancement fails
          }
          
          // Check for repetition in recent responses
          if (checkForResponseRepetition(responseWithContextCheck, recentResponses)) {
            // If repetition detected, use a recovery response
            const recoveryResponse = getRepetitionRecoveryResponse();
            
            // Update the response with the recovery text
            const updatedResponse = {
              ...rogerResponse,
              text: recoveryResponse
            };
            
            // Update message in state
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === rogerResponse.id ? updatedResponse : msg
              )
            );
            
            // Use the recovery text for simulation
            simulateTypingResponse(recoveryResponse, (text) => {
              // No need to update message again, already updated above
              setProcessingContext(null);
            });
          } else {
            // Update the response with enhanced text
            const updatedResponse = {
              ...rogerResponse,
              text: responseWithContextCheck
            };
            
            // Update message in state
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === rogerResponse.id ? updatedResponse : msg
              )
            );
            
            // Update recent responses for future repetition checks
            setRecentResponses(prev => {
              const updated = [responseWithContextCheck, ...prev];
              // Keep only the 5 most recent responses
              return updated.slice(0, 5);
            });
            
            // Track response with enhanced tracking system
            enhanceAndTrackResponse(responseWithContextCheck);
            
            // Check if this is a crisis-related response and store it for deception detection
            handleCrisisMessage(userInput, updatedResponse);
            
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
            simulateTypingResponse(updatedResponse.text, (text) => {
              // No need to update message again - already handled above
              // Clear the processing context once response is complete
              setProcessingContext(null);
            });
          }
        } catch (innerError) {
          console.error("Error enhancing Roger's response:", innerError);
          
          // Still proceed with original response if enhancement fails
          simulateTypingResponse(rogerResponse.text, (text) => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === rogerResponse.id ? { ...msg, text } : msg
              )
            );
            
            setProcessingContext(null);
          });
        }
      } catch (error) {
        console.error("Error generating response:", error);
        handleErrorResponse(isCritical, setMessages, simulateTypingResponse, setProcessingContext);
      }
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
