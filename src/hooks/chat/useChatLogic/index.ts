
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
 * Hook that contains the main chat business logic with PRIORITY crisis detection
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
  
  // MAIN crisis detection hook - this handles all crisis detection and emailing
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
  
  // Enhanced message handling with ABSOLUTE PRIORITY crisis detection
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
      console.log("🚨 CHAT LOGIC: Processing user input with ABSOLUTE PRIORITY crisis detection:", userInput);
      
      // ABSOLUTE PRIORITY 1: Check for ANY crisis content FIRST - This must work!
      console.log("🚨 CHAT LOGIC: PRIORITY 1 - Checking for crisis content");
      
      // Check if input contains crisis keywords immediately
      const hasCrisisKeywords = /\b(kill myself|suicide|suicidal|want to die|end my life|hurt myself|harm myself|can't go on|better off dead)\b/i.test(userInput);
      
      if (hasCrisisKeywords) {
        console.log("🚨 CHAT LOGIC: CRISIS KEYWORDS DETECTED - Calling handleCrisisMessage");
        const crisisResponse = await handleCrisisMessage(userInput);
        
        if (crisisResponse) {
          console.log("🚨 CHAT LOGIC: CRISIS RESPONSE GENERATED - Adding to messages and showing resources");
          setMessages(prevMessages => [...prevMessages, crisisResponse]);
          setShowCrisisResources(true);
          return;
        }
      }
      
      // PRIORITY 2: Check for persistent crisis patterns
      console.log("CHAT LOGIC: PRIORITY 2 - Checking for persistent crisis");
      const persistentCrisisResponse = handlePersistentCrisis(userInput);
      
      if (persistentCrisisResponse) {
        console.log("CHAT LOGIC: Persistent crisis detected");
        setMessages(prevMessages => [...prevMessages, persistentCrisisResponse]);
        setShowCrisisResources(true);
        return;
      }
      
      // PRIORITY 3: Regular processing with nervous system
      console.log("CHAT LOGIC: PRIORITY 3 - No crisis detected, processing normally");
      
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
