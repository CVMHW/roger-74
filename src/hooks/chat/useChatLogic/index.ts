
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getInitialMessages } from '../../../utils/messageUtils';
import useRogerianResponse from '../../useRogerianResponse';
import { useLocationConcern } from '../useLocationConcern';
import { useFeedbackLoop } from '../useFeedbackLoop';
import { useMessageHistory } from '../useMessageHistory';
import { useFeedbackHandler } from '../useFeedbackHandler';
import { useProcessContext } from './useProcessContext';
import { useGenericResponseDetection } from './useGenericResponseDetection';
import { useResponseValidator } from './useResponseValidator';
import { useSpecificResponseGenerator } from './useSpecificResponseGenerator';
import { useMessageHandling } from './useMessageHandling';
import { useResponseEnhancement } from './useResponseEnhancement';
import { ChatLogicReturn } from './types';
import { processWithRogerNervousSystem } from '../../../utils/rogerianNervousSystem';
import { useSimplifiedCrisisDetection } from '../useSimplifiedCrisisDetection';

/**
 * Simplified chat logic with reliable crisis detection and email alerts
 */
export const useChatLogic = (): ChatLogicReturn => {
  // Core state
  const [messages, setMessages] = useState(getInitialMessages());
  const [showCrisisResources, setShowCrisisResources] = useState<boolean>(false);
  
  // Toast notification
  const { toast } = useToast();
  
  // Simplified crisis detection
  const { handleCrisis } = useSimplifiedCrisisDetection();
  
  // Import response generation hook
  const { isTyping, processUserMessage, simulateTypingResponse } = useRogerianResponse();
  
  // Import location concern hook with geolocation
  const { 
    locationData,
    activeLocationConcern, 
    handleLocationData, 
    setActiveLocationConcern 
  } = useLocationConcern();
  
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
  
  // Enhanced message handling with SIMPLIFIED crisis detection
  const { isProcessing, setIsProcessing, handleSendMessage } = useMessageHandling(
    updateUserMessageHistory,
    checkFeedbackLoop,
    userMessageHistory,
    handleLocationData,
    activeLocationConcern,
    () => false, // Remove old checkDeception
    null, // Remove old recentCrisisMessage
    simulateTypingResponse,
    feedbackLoopDetected,
    setFeedbackLoopDetected,
    async (userInput: string) => {
      console.log("🚨 CHAT LOGIC: Processing with simplified crisis detection:", userInput);
      
      // PRIORITY 1: Simple, reliable crisis detection with immediate email
      const crisisResponse = await handleCrisis(userInput);
      
      if (crisisResponse) {
        console.log("🚨 CRISIS DETECTED: Adding response and showing resources");
        setMessages(prevMessages => [...prevMessages, crisisResponse]);
        setShowCrisisResources(true);
        return;
      }
      
      // PRIORITY 2: Regular processing with nervous system
      console.log("CHAT LOGIC: No crisis detected, processing normally");
      
      try {
        // Get the base response first
        const baseResponse = await processUserMessage(userInput);
        
        // Process through Roger's nervous system
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
        console.error("CHAT LOGIC: Error in processing:", error);
        
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
