
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { processWithRogerNervousSystem } from '../../../utils/rogerianNervousSystem';

/**
 * Hook that contains the main chat business logic with integrated crisis detection
 * NOW WITH FULL NERVOUS SYSTEM INTEGRATION
 */
export const useChatLogic = (): ChatLogicReturn => {
  // Core state
  const [messages, setMessages] = useState(getInitialMessages());
  const [showCrisisResources, setShowCrisisResources] = useState<boolean>(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import location concern hook with geolocation
  const { 
    locationData,
    activeLocationConcern, 
    handleLocationData, 
    setActiveLocationConcern 
  } = useLocationConcern();
  
  // Enhanced crisis detection hook - this is the main crisis detection system
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
  
  // Enhanced message handling with PRIORITY crisis detection AND NERVOUS SYSTEM INTEGRATION
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
    async (userInput: string) => {
      console.log("CHAT LOGIC: Processing user input with FULL NERVOUS SYSTEM:", userInput);
      
      // PRIORITY 1: Check for crisis content FIRST with integrated crisis detection
      const crisisResponse = await handleCrisisMessage(userInput);
      
      if (crisisResponse) {
        console.log("CHAT LOGIC: Crisis detected, using crisis response");
        setMessages(prevMessages => [...prevMessages, crisisResponse]);
        setShowCrisisResources(true);
        return;
      }
      
      // PRIORITY 2: Check for persistent crisis patterns
      const persistentCrisisResponse = handlePersistentCrisis(userInput);
      
      if (persistentCrisisResponse) {
        console.log("CHAT LOGIC: Persistent crisis detected");
        setMessages(prevMessages => [...prevMessages, persistentCrisisResponse]);
        setShowCrisisResources(true);
        return;
      }
      
      // PRIORITY 3: Process through FULL NERVOUS SYSTEM with RAG and memory integration
      console.log("CHAT LOGIC: No crisis detected, processing through Roger's Nervous System");
      
      try {
        // Get the base response first
        const baseResponse = await processUserMessage(userInput);
        
        // Process through Roger's complete nervous system with RAG and memory
        const enhancedResponseText = await processWithRogerNervousSystem(
          baseResponse.text,
          userInput,
          userMessageHistory,
          userMessageHistory.length,
          () => {} // updateStage function
        );
        
        // Create enhanced message
        const enhancedResponse = {
          ...baseResponse,
          text: enhancedResponseText
        };
        
        console.log("CHAT LOGIC: Response enhanced through nervous system");
        setMessages(prevMessages => [...prevMessages, enhancedResponse]);
        
        // Track response for feedback loop detection
        trackRogerResponse(enhancedResponse.text);
        updateRogerResponseHistory(enhancedResponse.text);
        
      } catch (error) {
        console.error("CHAT LOGIC: Error in nervous system processing:", error);
        
        // Fallback to regular processing
        const response = await processUserMessage(userInput);
        setMessages(prevMessages => [...prevMessages, response]);
        
        // Track response for feedback loop detection
        trackRogerResponse(response.text);
        updateRogerResponseHistory(response.text);
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

  // Log location data when available
  useEffect(() => {
    if (locationData) {
      console.log("CHAT LOGIC: Location data available:", locationData);
    }
  }, [locationData]);
  
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

export default useChatLogic;
