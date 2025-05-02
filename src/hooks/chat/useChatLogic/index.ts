
import { useState, useCallback, useEffect } from 'react';
import { MessageType } from '../../../components/Message';
import { useToast } from '@/components/ui/use-toast';
import { getInitialMessages, createMessage } from '../../../utils/messageUtils';
import useRogerianResponse from '../../useRogerianResponse';
import { useLocationConcern } from '../useLocationConcern';
import { useCrisisDetection } from '../useCrisisDetection';
import { useFeedbackLoop } from '../useFeedbackLoop';
import { useMessageHistory } from '../useMessageHistory';
import { useFeedbackHandler } from '../useFeedbackHandler';
import { useMessageProcessor } from '../useMessageProcessor';
import { 
  detectEverydayFrustration, 
  generateEverydayFrustrationResponse,
  detectSmallTalkCategory,
  generateSmallTalkResponse,
  enhanceRapportInEarlyConversation,
  generateFirstMessageResponse,
  generateSmallTalkTransition
} from '../../../utils/conversation/theSmallStuff';

// Import our new modularized hooks
import { useProcessContext } from './useProcessContext';
import { useGenericResponseDetection } from './useGenericResponseDetection';
import { useResponseValidator } from './useResponseValidator';
import { useCrisisDetector } from './useCrisisDetector';
import { useSpecificResponseGenerator } from './useSpecificResponseGenerator';
import { ChatLogicReturn } from './types';

/**
 * Hook that contains the main chat business logic
 * UNCONDITIONAL RULE: Roger will answer inquiries with pinpoint accuracy
 * UNCONDITIONAL RULE: Roger listens first, then responds, never automatic
 */
export const useChatLogic = (): ChatLogicReturn => {
  // Core state
  const [messages, setMessages] = useState<MessageType[]>(getInitialMessages());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showCrisisResources, setShowCrisisResources] = useState<boolean>(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import needed hooks for specific functionality
  const { activeLocationConcern, handleLocationData, setActiveLocationConcern } = useLocationConcern();
  const { recentCrisisMessage, handleCrisisMessage, checkDeception } = useCrisisDetection(simulateTypingResponse, setMessages);
  
  // Message history hooks
  const { 
    rogerResponseHistory, 
    userMessageHistory, 
    updateRogerResponseHistory, 
    updateUserMessageHistory 
  } = useMessageHistory();
  
  // Hook to handle feedback
  const { handleFeedback } = useFeedbackHandler(setMessages, toast);
  
  // Enhanced feedback loop prevention system
  const { 
    feedbackLoopDetected, 
    checkFeedbackLoop, 
    setFeedbackLoopDetected,
    trackRogerResponse,
    shouldThrottleResponse,
    getResponseDelay
  } = useFeedbackLoop(simulateTypingResponse, setMessages);
  
  // Our new modularized hooks
  const { processingContext, setProcessingContext } = useProcessContext();
  const { consecutiveGenericResponses, setConsecutiveGenericResponses, isGenericResponse } = useGenericResponseDetection();
  const { validateResponse } = useResponseValidator(rogerResponseHistory, isGenericResponse);
  const { checkForCrisisContent } = useCrisisDetector();
  const { createSpecificResponse } = useSpecificResponseGenerator();
  
  // Message processing hook with enhanced repetition detection
  const { processResponse } = useMessageProcessor({
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    shouldThrottleResponse,
    getResponseDelay,
    setProcessingContext,
    updateRogerResponseHistory: (responseText: string) => {
      // Track the response for feedback loop detection
      trackRogerResponse(responseText);
      
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
      
      // Update the regular response history
      updateRogerResponseHistory(responseText);
    }
  });

  // Main function to handle sending messages
  const handleSendMessage = useCallback((userInput: string) => {
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);

    try {
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
    checkForCrisisContent
  ]);

  // Reset processing state when typing indicator changes
  useEffect(() => {
    if (!isTyping && isProcessing) {
      setIsProcessing(false);
      
      // Clear processing context when typing stops
      if (processingContext) {
        setProcessingContext(null);
      }
    }
  }, [isTyping, isProcessing, processingContext]);
  
  return {
    messages,
    isTyping,
    isProcessing,
    handleSendMessage,
    handleFeedback,
    showCrisisResources,
    processingContext
  };
};

// Export the default hook
export default useChatLogic;
