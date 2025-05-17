
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { getInitialMessages } from '../../../utils/messageUtils';
import useRogerianResponse from '../../useRogerianResponse';
import { useLocationConcern } from '../useLocationConcern';
import { useCrisisDetection } from '../useCrisisDetection';
import { useFeedbackLoop } from '../useFeedbackLoop';
import { useMessageHistory } from '../useMessageHistory';
import { useFeedbackHandler } from '../useFeedbackHandler';
import { useProcessContext } from './useProcessContext';
import { useGenericResponseDetection } from './useGenericResponseDetection';
import { useResponseValidator } from './useResponseValidator';
import { useCrisisDetector } from './useCrisisDetector';
import { useSpecificResponseGenerator } from './useSpecificResponseGenerator';
import { useMessageHandling } from './useMessageHandling';
import { useResponseEnhancement } from './useResponseEnhancement';
import { useResponseHooks } from './useResponseHooks';
import { ChatLogicReturn } from './types';

/**
 * Hook that contains the main chat business logic
 * UNCONDITIONAL RULE: Roger will answer inquiries with pinpoint accuracy
 * UNCONDITIONAL RULE: Roger listens first, then responds, never automatic
 */
export const useChatLogic = (): ChatLogicReturn => {
  // Core state
  const [messages, setMessages] = useState(getInitialMessages());
  const [showCrisisResources, setShowCrisisResources] = useState<boolean>(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import needed hooks for specific functionality
  const { 
    activeLocationConcern, 
    handleLocationData, 
    setActiveLocationConcern 
  } = useLocationConcern();
  
  // Enhanced crisis detection hook with persistent crisis handling
  const { 
    recentCrisisMessage, 
    handleCrisisMessage, 
    checkDeception,
    handlePersistentCrisis,
    consecutiveCrisisCount 
  } = useCrisisDetection(simulateTypingResponse, setMessages);
  
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
  
  // Our modularized hooks
  const { processingContext, setProcessingContext } = useProcessContext();
  const { isGenericResponse } = useGenericResponseDetection();
  const { validateResponse } = useResponseValidator(rogerResponseHistory, isGenericResponse);
  // Get crisis detector functionality
  const { checkForCrisisContent } = useCrisisDetector();
  const { createSpecificResponse } = useSpecificResponseGenerator();

  // Enhanced response handling with tracking
  const { enhanceAndTrackResponse } = useResponseEnhancement(
    isGenericResponse,
    createSpecificResponse,
    userMessageHistory,
    setMessages,
    simulateTypingResponse,
    getResponseDelay
  );
  
  // Response processing hooks
  const { processResponse } = useResponseHooks(
    processUserMessage,
    setMessages,
    handleCrisisMessage,
    activeLocationConcern,
    setActiveLocationConcern,
    simulateTypingResponse,
    shouldThrottleResponse,
    getResponseDelay,
    setProcessingContext,
    (responseText) => {
      // Track the response for feedback loop detection
      trackRogerResponse(responseText);
      
      // Enhanced response tracking with generic detection
      const enhancedResponse = enhanceAndTrackResponse(responseText);
      
      // Update regular response history 
      updateRogerResponseHistory(responseText);
      
      return enhancedResponse;
    }
  );
  
  // Message handling hooks with added crisis persistence handling
  const { isProcessing, setIsProcessing, handleSendMessage } = useMessageHandling(
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
    (userInput: string) => {
      // First check for persistent crisis patterns
      const persistentCrisisResponse = handlePersistentCrisis(userInput);
      
      if (persistentCrisisResponse) {
        // Add the persistent crisis response
        setMessages(prevMessages => [...prevMessages, persistentCrisisResponse]);
        
        // Simulate typing for this response
        simulateTypingResponse(persistentCrisisResponse.text, (text) => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === persistentCrisisResponse.id ? { ...msg, text } : msg
            )
          );
          
          // Clear the processing context once response is complete
          setProcessingContext(null);
        });
      } else {
        // Process normally if not a persistent crisis
        processResponse(userInput);
      }
    },
    setMessages, 
    setProcessingContext,
    setShowCrisisResources
  );

  // Reset processing state when typing indicator changes
  useEffect(() => {
    if (!isTyping && isProcessing) {
      setIsProcessing(false);
      
      // Clear processing context when typing stops
      if (processingContext) {
        setProcessingContext(null);
      }
    }
  }, [isTyping, isProcessing, processingContext, setProcessingContext]);
  
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
