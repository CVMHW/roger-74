import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import useTypingEffect from '../useTypingEffect';
import useAdaptiveResponse from '../useAdaptiveResponse';
import { useConcernDetection } from '../response/concernDetection';
import { useConversationStage } from '../response/conversationStageManager';
import { useResponseCompliance } from '../response/responseCompliance';
import { useResponseGenerator } from '../response/responseGenerator';
import { useResponseProcessing } from '../response/responseProcessing';
import { createMessage } from '../../utils/messageUtils';
import { useAlternativeResponseGenerator } from '../response/alternativeResponseGenerator';
import { useFeedbackLoopHandler } from '../response/feedbackLoopHandler';
import { handlePotentialDeception } from './deceptionHandler';
import { useRogerianState } from './stateManagement';
import { handleEmotionalPatterns } from './emotionalResponseHandlers';
import { processUserMessage as processMessage } from './messageProcessor';
import { RecentCrisisMessage, UseRogerianResponseReturn } from './types';

/**
 * Hook for generating Rogerian responses to user messages
 */
const useRogerianResponse = (): UseRogerianResponseReturn => {
  // Hook for conversation stage management
  const { 
    conversationStage, 
    messageCount, 
    introductionMade,
    updateStage, 
    setIntroductionMade 
  } = useConversationStage();
  
  // Get state management hooks
  const {
    conversationHistory,
    clientPreferences,
    recentResponses,
    feedbackLoopRecoveryMode,
    updateConversationHistory,
    setRecentResponses,
    setFeedbackLoopRecoveryMode
  } = useRogerianState();
  
  // Track potential crisis messaging for deception detection
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<RecentCrisisMessage | null>(null);
  
  // Track if we've detected a feedback loop pattern
  const [feedbackLoopDetected, setFeedbackLoopDetected] = useState<boolean>(false);
  
  // Import all necessary hooks
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  const { detectConcerns } = useConcernDetection();
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  const { generateAlternativeResponse, isResponseRepetitive } = useAlternativeResponseGenerator();
  const { checkForFeedbackLoopComplaints, handleFeedbackLoop } = useFeedbackLoopHandler();
  
  // Hook for response generation
  const { generateResponse } = useResponseGenerator({
    conversationStage,
    messageCount,
    introductionMade,
    adaptiveResponseFn: generateAdaptiveResponse,
    conversationHistory
  });
  
  // Hook for response processing
  const { isTyping, processUserMessage: baseProcessUserMessage } = useResponseProcessing({
    ensureResponseCompliance,
    addToResponseHistory,
    calculateResponseTime,
    simulateTypingResponse
  });
  
  // Effect to prevent response repetition
  useEffect(() => {
    // Keep only the last 5 responses to compare against
    if (recentResponses.length > 5) {
      setRecentResponses(prev => prev.slice(-5));
    }
  }, [recentResponses]);
  
  // Handle potential deception with our custom deception handler
  const handlePotentialDeceptionWrapper = async (
    originalMessage: string,
    followUpMessage: string
  ): Promise<MessageType | null> => {
    return handlePotentialDeception(originalMessage, followUpMessage, addToResponseHistory);
  };
  
  // Process user message with stage update and special cases
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Update conversation history and client preferences
    updateConversationHistory(userInput);
    
    // Check if the user is indicating Roger isn't listening or is stuck in a loop
    const feedbackLoopResponse = handleFeedbackLoop(userInput, conversationHistory);
    if (feedbackLoopResponse) {
      // Update conversation stage
      updateStage();
      
      // Create a message with the recovery response
      return Promise.resolve(createMessage(feedbackLoopResponse, 'roger'));
    }
    
    // Handle emotional patterns and special cases
    const emotionalResponse = await handleEmotionalPatterns(
      userInput, 
      conversationHistory,
      baseProcessUserMessage,
      detectConcerns,
      updateStage
    );
    
    if (emotionalResponse) {
      return emotionalResponse;
    }
    
    // Process standard messages
    return processMessage(
      userInput,
      detectConcerns,
      generateResponse,
      baseProcessUserMessage,
      conversationHistory,
      clientPreferences,
      updateStage
    );
  };
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach,
    handlePotentialDeception: handlePotentialDeceptionWrapper
  };
};

export default useRogerianResponse;
