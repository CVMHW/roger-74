
import { useState, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import useTypingEffect from '../useTypingEffect';
import useAdaptiveResponse from '../useAdaptiveResponse';
import { useConcernDetection } from '../response/concernDetection';
import { useConversationStage } from '../response/conversationStageManager';
import { useResponseCompliance } from '../response/responseCompliance';
import { useResponseGenerator } from '../response/responseGenerator';
import { useResponseProcessing } from '../response/responseProcessing';
import { createMessage } from '../../utils/messageUtils';
import { useRogerianState } from './stateManagement';
import { handlePotentialDeception } from './deceptionHandler';
import { initializeNLPModel } from '../../utils/nlpProcessor';
import { checkAllRules } from '../../utils/rulesEnforcement/rulesEnforcer';
import { verifyFiveResponseMemorySystem } from '../../utils/memory/fiveResponseMemory';
import { processUserMessage as processUserMessageUtil } from './utils/processUserMessage';
import { RogerianResponseHook } from './utils/types';

// Initialize the NLP model when the module loads
initializeNLPModel().catch(error => console.error('Failed to initialize NLP model:', error));

// Verify 5ResponseMemory system is operational
verifyFiveResponseMemorySystem();

/**
 * Hook for generating Rogerian responses to user messages
 * Enhanced with pattern-matching NLP capabilities, memory retention,
 * and comprehensive chat log review
 */
const useRogerianResponse = (): RogerianResponseHook => {
  // Run rule compliance check on every execution
  checkAllRules();
  
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
  
  // Import all necessary hooks
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  const { detectConcerns } = useConcernDetection();
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  const { calculateResponseTime, simulateTypingResponse, isTyping } = useTypingEffect();
  
  // Hook for response generation - fix the function signature
  const { generateResponse } = useResponseGenerator({
    conversationStage,
    messageCount,
    introductionMade,
    adaptiveResponseFn: generateAdaptiveResponse,
    conversationHistory
  });
  
  // Create a wrapper for generateResponse to match expected signature
  const generateResponseWrapper = useCallback((input: string) => {
    const concernType = detectConcerns(input);
    return generateResponse(input, concernType);
  }, [generateResponse, detectConcerns]);
  
  // Hook for response processing
  const { processUserMessage: baseProcessUserMessage } = useResponseProcessing({
    ensureResponseCompliance,
    addToResponseHistory,
    calculateResponseTime,
    simulateTypingResponse
  });
  
  // Handle potential deception with our custom deception handler
  const handlePotentialDeceptionWrapper = useCallback(async (
    originalMessage: string,
    followUpMessage: string
  ): Promise<MessageType | null> => {
    return handlePotentialDeception(originalMessage, followUpMessage, addToResponseHistory);
  }, [addToResponseHistory]);
  
  // Enhanced process user message with all dependencies
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    return processUserMessageUtil(userInput, {
      conversationHistory,
      updateConversationHistory,
      conversationStage,
      messageCount,
      updateStage,
      detectConcerns,
      generateResponse: generateResponseWrapper,
      baseProcessUserMessage,
      clientPreferences
    });
  }, [
    conversationHistory,
    updateConversationHistory,
    conversationStage,
    messageCount,
    updateStage,
    detectConcerns,
    generateResponseWrapper,
    baseProcessUserMessage,
    clientPreferences
  ]);
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach,
    handlePotentialDeception: handlePotentialDeceptionWrapper
  };
};

export default useRogerianResponse;
