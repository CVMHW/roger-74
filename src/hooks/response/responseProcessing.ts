
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { calculateMinimumResponseTime } from '../../utils/masterRules';

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
    generateResponseFn: (userInput: string, concernType: string | null) => string,
    detectConcernsFn: (userInput: string) => string | null
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
    
    const estimatedComplexity = isCrisis ? 8 : 
                               isMentalHealth ? 7 :
                               isMedical ? 7 : 5;
    
    const estimatedEmotionalWeight = isCrisis ? 9 : 
                                    concernType === 'substance-use' || isMentalHealth ? 7 : 4;
    
    // Get minimum response time from master rules
    const minimumTime = calculateMinimumResponseTime(estimatedComplexity, estimatedEmotionalWeight);
    
    // Ensure response time meets the minimum requirement
    responseTime = Math.max(responseTime, minimumTime);
    
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
