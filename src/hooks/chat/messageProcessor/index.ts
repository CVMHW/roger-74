import { useCallback } from 'react';
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { initializeNLPModel } from '../../../utils/nlpProcessor';
import { MessageProcessorProps } from './types';
import { determineProcessingContext } from './contextDeterminer';
import { handleNonResponsivenessComplaints } from './nonResponsivenessHandler';
import { processResponse } from './responseProcessor';
import { extractKeyTopics, getAppropriateAdjective } from './topicExtractor';

// Initialize the NLP model as early as possible
initializeNLPModel().catch(error => console.error('Failed to initialize NLP model:', error));

/**
 * Hook for processing messages and generating responses
 * UNCONDITIONAL RULE: Roger listens first, then responds with pinpoint accuracy
 */
export const useMessageProcessor = ({
  processUserMessage,
  setMessages,
  handleCrisisMessage,
  activeLocationConcern,
  setActiveLocationConcern,
  simulateTypingResponse,
  updateRogerResponseHistory,
  shouldThrottleResponse,
  getResponseDelay,
  setProcessingContext
}: MessageProcessorProps) => {
  
  // Track conversation history for context enhancement
  let conversationHistory: string[] = [];
  
  const processUserInput = useCallback(async (userInput: string) => {
    // Add user input to conversation history
    conversationHistory.push(userInput);
    
    // Always keep only the most recent messages for context
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }
    
    console.log("Current conversation history:", conversationHistory);
    
    // Use enhanced NLP to set an appropriate processing context
    const processingContext = await determineProcessingContext(userInput);
    setProcessingContext(processingContext);
    
    // Calculate appropriate delay time based on message content
    const responseDelay = getResponseDelay(userInput);
    
    // Check for non-responsiveness complaints first
    const nonResponsivenessHandled = await handleNonResponsivenessComplaints(
      userInput,
      conversationHistory,
      setMessages,
      simulateTypingResponse,
      updateRogerResponseHistory,
      setProcessingContext,
      responseDelay
    );
    
    if (nonResponsivenessHandled) {
      return;
    }
    
    // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
    const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
    
    // If this is the first substantive message, ensure we don't ask a redundant question
    if (isContentfulFirstMessage) {
      // Extract key topics from the user's message
      const topics = extractKeyTopics(userInput);
      
      if (topics.length > 0) {
        // Create a custom response acknowledging what they've shared
        const customResponse = `I hear that you're dealing with ${topics.join(" and ")}. That sounds ${getAppropriateAdjective(topics)}. Could you tell me more about how this has been affecting you?`;
        
        // Process with our custom response
        await processUserMessage(userInput)
          .then(rogerResponse => {
            // Create a new response with our custom text
            const customizedResponse = {
              ...rogerResponse,
              text: customResponse
            };
            
            // Add the response
            setMessages(prevMessages => [...prevMessages, customizedResponse]);
            
            // Update the response history
            updateRogerResponseHistory(customResponse);
            
            // Simulate typing
            simulateTypingResponse(customResponse, (text) => {
              setMessages(prevMessages => 
                prevMessages.map(msg => 
                  msg.id === customizedResponse.id ? { ...msg, text } : msg
                )
              );
              
              // Clear the processing context once response is complete
              setProcessingContext(null);
            });
          });
        
        return;
      }
    }
    
    // Process the standard response
    await processResponse({
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
      conversationHistory
    });
  }, [
    processUserMessage, 
    setMessages, 
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    updateRogerResponseHistory,
    shouldThrottleResponse,
    getResponseDelay,
    setProcessingContext
  ]);

  return { processResponse: processUserInput };
};
