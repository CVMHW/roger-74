
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
    
    // Check for grief themes to adjust response time and approach
    const griefThemes = detectGriefThemes(userInput);
    let responseGenerator = generateResponse;
    let responseTimeMultiplier = 1.0;
    
    // If grief themes are detected, adjust response time based on severity and metaphor
    if (griefThemes.themeIntensity >= 2) {
      // For all grief messages, ensure proper response time
      
      // Adjust response time based on grief severity
      responseTimeMultiplier = 
        griefThemes.griefSeverity === 'existential' ? 1.5 :
        griefThemes.griefSeverity === 'severe' ? 1.5 :
        griefThemes.griefSeverity === 'moderate' ? 1.3 :
        griefThemes.griefSeverity === 'mild' ? 1.2 : 1.0;
      
      // Further adjust for metaphor complexity - roller coaster metaphors need more time
      if (griefThemes.griefMetaphorModel === 'roller-coaster') {
        responseTimeMultiplier += 0.2;
      }
      
      // If many grief stages are mentioned, add more time for a thoughtful response
      if (griefThemes.detectedGriefStages.length >= 3) {
        responseTimeMultiplier += 0.1;
      }
    }
    
    // Check for trauma response patterns to adjust response time
    let traumaResponsePatterns = null;
    try {
      const traumaModule = require('../utils/response/traumaResponsePatterns');
      if (traumaModule && traumaModule.detectTraumaResponsePatterns) {
        traumaResponsePatterns = traumaModule.detectTraumaResponsePatterns(userInput);
      }
    } catch (e) {
      console.log("Trauma module not available for response timing:", e);
    }
    
    // Adjust response time for trauma responses
    if (traumaResponsePatterns && traumaResponsePatterns.dominant4F) {
      const intensityMap = {
        'mild': 1.1,
        'moderate': 1.3,
        'severe': 1.4,
        'extreme': 1.5
      };
      
      // Base multiplier on intensity
      const intensityMultiplier = intensityMap[traumaResponsePatterns.dominant4F.intensity] || 1.0;
      
      // If the current multiplier from grief is lower, use the trauma multiplier
      if (intensityMultiplier > responseTimeMultiplier) {
        responseTimeMultiplier = intensityMultiplier;
      }
      
      // Add extra time for hybrid responses (multiple strong patterns)
      if (traumaResponsePatterns.secondary4F) {
        responseTimeMultiplier += 0.1;
      }
    }
    
    // Update conversation stage before processing
    updateStage();
    
    return baseProcessUserMessage(
      userInput,
      responseGenerator,
      detectConcerns,
      responseTimeMultiplier // Pass the multiplier to adjust response time
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
