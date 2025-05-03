
import { useState, useCallback } from 'react';
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { checkForCrisisContent } from './useCrisisDetector';
import { processUserMessageMemory } from '../../../utils/response/enhancer';

/**
 * Hook for handling message sending and processing
 */
export const useMessageHandling = (
  updateUserMessageHistory: (message: string) => void,
  checkFeedbackLoop: (userInput: string, userMessageHistory: string[]) => boolean,
  userMessageHistory: string[],
  handleLocationData: (userInput: string, activeLocationConcern: any) => boolean,
  activeLocationConcern: any,
  checkDeception: (userInput: string, recentCrisisMessage: any, simulateTypingResponse: any, setMessages: any) => boolean,
  recentCrisisMessage: any,
  simulateTypingResponse: any,
  feedbackLoopDetected: boolean,
  setFeedbackLoopDetected: (detected: boolean) => void,
  processResponse: (userInput: string) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  setProcessingContext: (context: string | null) => void,
  setShowCrisisResources: (show: boolean) => void,
) => {
  // Track whether a message is currently being processed
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Main function to handle sending messages
  const handleSendMessage = useCallback((userInput: string) => {
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Record user message to memory system immediately
      processUserMessageMemory(userInput);
      
      // Add user message
      const newUserMessage = createMessage(userInput, 'user');
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      
      // Check for crisis content and show resources if needed
      if (checkForCrisisContent(userInput)) {
        setShowCrisisResources(true);
      }
      
      // Update user message history for context awareness
      updateUserMessageHistory(userInput);
      
      // Show processing context immediately to indicate Roger is "thinking"
      let context = "Roger is listening...";
      if (checkForCrisisContent(userInput)) {
        context = "Roger is carefully considering your message...";
      } else if (/pet|dog|cat|animal|died|passed away/i.test(userInput)) {
        context = "Roger is reflecting on what you shared...";
      }
      setProcessingContext(context);
      
      // UNCONDITIONAL RULE: Always check for feedback loops first
      if (checkFeedbackLoop(userInput, userMessageHistory)) {
        setIsProcessing(false);
        return;
      }
      
      // Check if this message might contain location data if we're currently asking for it
      if (handleLocationData(userInput, activeLocationConcern)) {
        // Process the user's message normally since they've provided location data
        processResponse(userInput);
        setIsProcessing(false);
        return;
      }
      
      // Check for deception if we have a recent crisis message
      if (checkDeception(userInput, recentCrisisMessage, simulateTypingResponse, setMessages)) {
        setIsProcessing(false);
        return;
      }
      
      // If we previously detected a feedback loop, reset the flag
      if (feedbackLoopDetected) {
        setFeedbackLoopDetected(false);
      }
      
      // Process user input normally, with appropriate throttling
      processResponse(userInput);
      
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      // Add fallback error response that's specific to what the user shared
      const userInputLower = userInput.toLowerCase();
      let errorResponse;
      
      if (userInputLower.includes("pet") || userInputLower.includes("died") || userInputLower.includes("passed away")) {
        errorResponse = createMessage(
          "I'm truly sorry about your loss. Losing a pet can be devastating. Would you like to tell me more about them?",
          'roger'
        );
      } else {
        errorResponse = createMessage(
          "I'm interested in hearing more about what you're experiencing. Could you share more about what's been going on?",
          'roger'
        );
      }
      
      // Add the error response after a brief delay to simulate thinking time
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, errorResponse]);
        
        // Clear the processing context
        setProcessingContext(null);
      }, 1500);
    }
  }, [
    isProcessing,
    setMessages,
    updateUserMessageHistory,
    checkFeedbackLoop,
    userMessageHistory,
    handleLocationData,
    activeLocationConcern,
    checkDeception,
    recentCrisisMessage,
    simulateTypingResponse,
    feedbackLoopDetected,
    setFeedbackLoopDetected,
    processResponse,
    setProcessingContext,
    checkForCrisisContent,
    setShowCrisisResources
  ]);

  return {
    isProcessing,
    setIsProcessing,
    handleSendMessage
  };
};
