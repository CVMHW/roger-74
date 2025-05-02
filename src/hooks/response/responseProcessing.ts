
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { calculateMessageResponseTime } from './processing/responseTimeCalculation';
import { analyzeSpecialConcerns } from './processing/concernAnalyzer';
import { generateYoungAdultResponse } from './processing/youngAdultResponseHandler';
import { finalizeResponse } from './processing/responseFinisher';

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
    responseTimeMultiplier: number = 1.0, // Parameter for response time adjustment
    youngAdultConcernFn?: () => any // Function to get young adult concerns
  ): Promise<MessageType> => {
    setIsTyping(true);
    
    // Detect any concerns in the user message
    const concernType = detectConcernsFn(userInput);
    
    // Calculate response time based on message complexity
    let responseTime = calculateResponseTime(userInput);
    
    // Analyze special concerns
    const { youngAdultConcern, traumaResponsePatterns } = 
      await analyzeSpecialConcerns(userInput, concernType, youngAdultConcernFn);
    
    // Recalculate response time based on analysis
    responseTime = calculateMessageResponseTime(userInput, concernType);
    
    // Apply the response time multiplier for any special cases
    responseTime = Math.round(responseTime * responseTimeMultiplier);
    
    // Return a promise that resolves with the appropriate response
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate the response
        let responseText = generateResponseFn(userInput, concernType);
        
        // If we have a young adult concern and no response yet, try to generate a young adult specific response
        if (youngAdultConcern && !responseText && youngAdultConcern.category) {
          generateYoungAdultResponse(userInput, concernType, youngAdultConcern)
            .then(youngAdultResponse => {
              if (youngAdultResponse) {
                responseText = youngAdultResponse;
              }
              completeResponse(responseText);
            })
            .catch(e => {
              console.log("Error generating young adult response:", e);
              completeResponse(responseText);
            });
        } else {
          completeResponse(responseText);
        }
        
        // Helper function to complete response processing
        function completeResponse(text: string) {
          const rogerResponse = finalizeResponse(
            text,
            ensureResponseCompliance,
            addToResponseHistory,
            concernType
          );
          setIsTyping(false);
          resolve(rogerResponse);
        }
      }, responseTime);
    });
  };

  return {
    isTyping,
    processUserMessage
  };
};
