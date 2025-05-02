
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { calculateMinimumResponseTime } from '../../utils/masterRules';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectGriefThemes } from '../../utils/response/griefSupport';

interface ResponseProcessingParams {
  ensureResponseCompliance: (response: string) => string;
  addToResponseHistory: (response: string) => void;
  calculateResponseTime: (input: string) => number;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
}

export const useResponseProcessing = ({
  ensureResponseCompliance,
  addToResponseHistory,
  calculateResponseTime,
  simulateTypingResponse
}: ResponseProcessingParams) => {
  const [isTyping, setIsTyping] = useState(false);

  const processUserMessage = async (
    userInput: string,
    generateResponseFn: (userInput: string, concernType: ConcernType) => string,
    detectConcernsFn: (userInput: string) => ConcernType,
    responseTimeMultiplier: number = 1.0 // Parameter for response time adjustment
  ): Promise<MessageType> => {
    setIsTyping(true);
    
    // Detect any concerns in the user message
    const concernType = detectConcernsFn(userInput);
    
    // Calculate response time based on message complexity and emotional weight
    let responseTime = calculateResponseTime(userInput);
    
    // Estimate message complexity and emotional weight for timing adjustments
    const isCrisis = concernType === 'crisis' || concernType === 'tentative-harm';
    const isMentalHealth = concernType === 'mental-health';
    const isMedical = concernType === 'medical' || concernType === 'eating-disorder';
    const isMildGambling = concernType === 'mild-gambling';
    
    // Detect grief themes for response timing
    const griefThemes = detectGriefThemes(userInput);
    const hasSignificantGrief = griefThemes.themeIntensity >= 4;
    
    // Adjust complexity and emotional weight based on concerns and grief levels
    let estimatedComplexity = isCrisis ? 8 : 
                             isMentalHealth ? 7 :
                             isMedical ? 7 : 
                             isMildGambling ? 4 : 
                             hasSignificantGrief ? 6 : 5;
    
    let estimatedEmotionalWeight = isCrisis ? 9 : 
                                  concernType === 'substance-use' || isMentalHealth ? 7 : 
                                  isMildGambling ? 3 : 
                                  hasSignificantGrief ? 7 : 4;
    
    // Further adjust based on specific grief severity
    if (hasSignificantGrief) {
      if (griefThemes.griefSeverity === 'existential') {
        estimatedComplexity = 8;
        estimatedEmotionalWeight = 8;
      } else if (griefThemes.griefSeverity === 'severe') {
        estimatedComplexity = 7;
        estimatedEmotionalWeight = 8;
      } else if (griefThemes.griefSeverity === 'moderate') {
        estimatedComplexity = 6;
        estimatedEmotionalWeight = 6;
      }
      
      // If grief is specifically about spousal loss, increase weights
      if (griefThemes.griefType === 'spousal-loss') {
        estimatedEmotionalWeight = Math.min(estimatedEmotionalWeight + 1, 9);
      }
      
      // If grief mentions non-linear or roller coaster metaphors, increase complexity
      if (griefThemes.griefMetaphorModel === 'roller-coaster') {
        estimatedComplexity = Math.min(estimatedComplexity + 1, 9);
      }
    }
    
    // Get minimum response time from master rules
    const minimumTime = calculateMinimumResponseTime(estimatedComplexity, estimatedEmotionalWeight);
    
    // Ensure response time meets the minimum requirement
    responseTime = Math.max(responseTime, minimumTime);
    
    // Apply the response time multiplier for grief or other special cases
    responseTime = Math.round(responseTime * responseTimeMultiplier);
    
    // Return a promise that resolves with the appropriate response
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate the response
        let responseText = generateResponseFn(userInput, concernType);
        
        // Apply master rules to ensure no repetition
        responseText = ensureResponseCompliance(responseText);
        
        // Add this response to the history to prevent future repetition
        addToResponseHistory(responseText);
        
        // Create response message
        const rogerResponse = createMessage(responseText, 'roger', concernType);
        setIsTyping(false);
        resolve(rogerResponse);
      }, responseTime);
    });
  };

  return {
    isTyping,
    processUserMessage
  };
};
