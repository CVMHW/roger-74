
import { useState } from 'react';
import { MessageType } from '../../components/Message';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { calculateMessageResponseTime } from './processing/responseTimeCalculation';
import { analyzeSpecialConcerns } from './processing/concernAnalyzer';
import { generateYoungAdultResponse } from './processing/youngAdultResponseHandler';
import { finalizeResponse } from './processing/responseFinisher';
import { createMessage } from '../../utils/messageUtils';

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
    generateResponseFn: (userInput: string) => string,
    detectConcernsFn: () => ConcernType | null,
    responseTimeMultiplier: number = 1.0, // Parameter for response time adjustment
    youngAdultConcernFn?: () => any // Function to get young adult concerns
  ): Promise<MessageType> => {
    try {
      setIsTyping(true);
      
      // Detect any concerns in the user message
      const concernType = detectConcernsFn();
      
      // Calculate response time based on message complexity
      let responseTime = calculateResponseTime(userInput);
      
      try {
        // Analyze special concerns
        const { youngAdultConcern, traumaResponsePatterns } = 
          await analyzeSpecialConcerns(userInput, concernType || undefined, youngAdultConcernFn);
        
        // Recalculate response time based on analysis
        responseTime = calculateMessageResponseTime(userInput, concernType || undefined);
        
        // Apply the response time multiplier for any special cases
        responseTime = Math.round(responseTime * responseTimeMultiplier);
      } catch (error) {
        console.error("Error in special concerns analysis:", error);
      }
      
      // Return a promise that resolves with the appropriate response
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Generate the response
            let responseText = "";
            try {
              responseText = generateResponseFn(userInput);
            } catch (generateError) {
              console.error("Error generating response:", generateError);
              responseText = "I'm listening. What's been going on with you?";
            }
            
            // If we have a young adult concern, try to generate a young adult specific response
            if (youngAdultConcernFn && responseText.length === 0) {
              const youngAdultConcern = youngAdultConcernFn();
              if (youngAdultConcern && youngAdultConcern.category) {
                generateYoungAdultResponse(userInput, concernType || undefined, youngAdultConcern)
                  .then(youngAdultResponse => {
                    if (youngAdultResponse) {
                      responseText = youngAdultResponse;
                    }
                    completeResponse(responseText);
                  })
                  .catch(e => {
                    console.error("Error generating young adult response:", e);
                    completeResponse(responseText || "I'm here to listen. What would you like to talk about?");
                  });
              } else {
                completeResponse(responseText || "I'm here to listen. What would you like to talk about?");
              }
            } else {
              completeResponse(responseText || "I'm here to listen. What would you like to talk about?");
            }
            
            // Helper function to complete response processing
            function completeResponse(text: string) {
              try {
                // Ensure we have text content
                if (!text || text.trim() === "") {
                  text = "I'm here to listen. What would you like to talk about?";
                }
                
                let rogerResponse;
                try {
                  rogerResponse = finalizeResponse(
                    text,
                    ensureResponseCompliance,
                    addToResponseHistory,
                    concernType || undefined
                  );
                } catch (finalizeError) {
                  console.error("Error finalizing response:", finalizeError);
                  rogerResponse = createMessage(
                    "I'm listening. What's been going on with you?",
                    'roger'
                  );
                }
                
                setIsTyping(false);
                resolve(rogerResponse);
              } catch (completionError) {
                console.error("Error completing response:", completionError);
                setIsTyping(false);
                resolve(createMessage(
                  "I'm listening. What's been going on with you?",
                  'roger'
                ));
              }
            }
          } catch (timeoutError) {
            console.error("Error in response timeout handler:", timeoutError);
            setIsTyping(false);
            resolve(createMessage(
              "I'm listening. What's been going on with you?", 
              'roger'
            ));
          }
        }, responseTime);
      });
    } catch (outerError) {
      console.error("Error in processUserMessage:", outerError);
      setIsTyping(false);
      return Promise.resolve(createMessage(
        "I'm sorry, I'm having trouble responding right now. Could you try again?", 
        'roger'
      ));
    }
  };

  return {
    isTyping,
    processUserMessage
  };
};
