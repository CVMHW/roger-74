
import { useState, useEffect } from 'react';
import { MessageType } from '../components/Message';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { useConcernDetection } from './response/concernDetection';
import { useConversationStage } from './response/conversationStageManager';
import { useResponseCompliance } from './response/responseCompliance';
import { useResponseGenerator } from './response/responseGenerator';
import { useResponseProcessing } from './response/responseProcessing';

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
}

export const useRogerianResponse = (): UseRogerianResponseReturn => {
  // Hook for conversation stage management
  const { 
    conversationStage, 
    messageCount, 
    introductionMade,
    updateStage, 
    setIntroductionMade 
  } = useConversationStage();
  
  // Hook for adaptive response generation strategy
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  
  // Hook for concern detection
  const { detectConcerns } = useConcernDetection();
  
  // Hook for response compliance with master rules
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  
  // Hook for typing effect simulation
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  
  // Hook for response generation - pass messageCount to respect the 30-minute rule
  const { generateResponse } = useResponseGenerator({
    conversationStage,
    messageCount,
    introductionMade,
    adaptiveResponseFn: generateAdaptiveResponse
  });
  
  // Hook for response processing
  const { isTyping, processUserMessage: baseProcessUserMessage } = useResponseProcessing({
    ensureResponseCompliance,
    addToResponseHistory,
    calculateResponseTime,
    simulateTypingResponse
  });
  
  // Process user message with stage update
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Update conversation stage before processing
    updateStage();
    
    return baseProcessUserMessage(
      userInput,
      generateResponse,
      detectConcerns
    );
  };
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach
  };
};

export default useRogerianResponse;
