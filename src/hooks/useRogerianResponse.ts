
import { useState, useEffect } from 'react';
import { MessageType } from '../components/Message';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { useConcernDetection } from './response/concernDetection';
import { useConversationStage } from './response/conversationStageManager';
import { useResponseCompliance } from './response/responseCompliance';
import { useResponseGenerator } from './response/responseGenerator';
import { useResponseProcessing } from './response/responseProcessing';
import { detectGriefThemes } from '../utils/response/griefSupport';

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
  
  // Process user message with stage update and special cases
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Check for asking if Roger is Drew (unconditional rule)
    if (
      userInput.toLowerCase().includes("are you drew") || 
      userInput.toLowerCase().includes("is your name drew") ||
      userInput.toLowerCase().includes("your name is drew") ||
      userInput.toLowerCase().includes("you're drew") ||
      userInput.toLowerCase().includes("youre drew") ||
      userInput.toLowerCase().includes("you are drew")
    ) {
      // Direct response to redirect focus
      const redirectResponse = "I'm Roger, your peer support companion. My role is to be here for you and focus on your needs and experiences. What would be most helpful for us to explore together today?";
      
      // Update conversation stage before processing
      updateStage();
      
      // Process the usual way but with our specific response
      return baseProcessUserMessage(
        userInput,
        () => redirectResponse,
        detectConcerns
      );
    }
    
    // Check for grief and existential loneliness themes to adjust response time
    const griefThemes = detectGriefThemes(userInput);
    let responseGenerator = generateResponse;
    
    // If intense grief themes are detected, potentially use existential approach
    // and ensure adequate response time for sensitive topic
    if (griefThemes.themeIntensity >= 7) {
      // The generateResponse function will handle the grief response internally
      // but we can adjust how we call processUserMessage to account for the sensitivity
      
      // Update conversation stage before processing
      updateStage();
      
      // For intense grief messages, ensure proper response time
      return baseProcessUserMessage(
        userInput,
        responseGenerator,
        detectConcerns
      );
    }
    
    // Update conversation stage before processing
    updateStage();
    
    return baseProcessUserMessage(
      userInput,
      responseGenerator,
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
