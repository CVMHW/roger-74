
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
    responseTimeMultiplier: number = 1.0, // Parameter for response time adjustment
    youngAdultConcernFn?: () => any // Function to get young adult concerns
  ): Promise<MessageType> => {
    setIsTyping(true);
    
    // Detect any concerns in the user message
    const concernType = detectConcernsFn(userInput);
    
    // Check for young adult concerns
    let youngAdultConcern = null;
    if (youngAdultConcernFn) {
      youngAdultConcern = youngAdultConcernFn();
    }
    
    // Calculate response time based on message complexity and emotional weight
    let responseTime = calculateResponseTime(userInput);
    
    // Estimate message complexity and emotional weight for timing adjustments
    const isCrisis = concernType === 'crisis' || concernType === 'tentative-harm';
    const isMentalHealth = concernType === 'mental-health';
    const isMedical = concernType === 'medical' || concernType === 'eating-disorder';
    const isMildGambling = concernType === 'mild-gambling';
    const isPTSD = concernType === 'ptsd' || concernType === 'ptsd-mild';
    const isTraumaResponse = concernType === 'trauma-response';
    
    // Detect grief themes for response timing
    const griefThemes = detectGriefThemes(userInput);
    const hasSignificantGrief = griefThemes.themeIntensity >= 4;
    
    // Check for trauma response patterns
    let traumaResponsePatterns = null;
    try {
      // Dynamic import to avoid circular dependencies
      const traumaModule = require('../../utils/response/traumaResponsePatterns');
      if (traumaModule.detectTraumaResponsePatterns) {
        traumaResponsePatterns = traumaModule.detectTraumaResponsePatterns(userInput);
      }
    } catch (e) {
      console.log("Trauma patterns module not available:", e);
    }
    
    // Adjust complexity and emotional weight based on concerns and grief levels
    let estimatedComplexity = isCrisis ? 8 : 
                             isMentalHealth ? 7 :
                             isMedical ? 7 : 
                             isPTSD ? 8 :  // Higher complexity for PTSD
                             isTraumaResponse ? 7 : // Higher for trauma responses
                             isMildGambling ? 4 : 
                             hasSignificantGrief ? 6 : 
                             youngAdultConcern ? 6 : 5;
    
    let estimatedEmotionalWeight = isCrisis ? 9 : 
                                  concernType === 'substance-use' || isMentalHealth ? 7 : 
                                  isPTSD ? 8 : // Higher emotional weight for PTSD
                                  isTraumaResponse ? 7 : 
                                  isMildGambling ? 3 : 
                                  hasSignificantGrief ? 7 : 
                                  youngAdultConcern ? 5 : 4;
    
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
    
    // Further adjust for young adult concerns if present
    if (youngAdultConcern) {
      // Young adult financial concerns often have higher emotional weight
      if (youngAdultConcern.category === 'financial') {
        estimatedEmotionalWeight += 1;
      }
      
      // Quarter-life crisis concerns are more complex
      if (youngAdultConcern.category === 'identity' && 
          (youngAdultConcern.specificIssue?.includes('purpose') || 
           youngAdultConcern.specificIssue?.includes('quarter'))) {
        estimatedComplexity += 1;
      }
    }
    
    // Further adjust for trauma response patterns if detected
    if (traumaResponsePatterns && traumaResponsePatterns.dominant4F) {
      const intensityMap = {
        'mild': 1,
        'moderate': 2,
        'severe': 3,
        'extreme': 4
      };
      
      const intensity = intensityMap[traumaResponsePatterns.dominant4F.intensity] || 1;
      
      // Increase complexity based on intensity and dominant pattern
      if (traumaResponsePatterns.dominant4F.type === 'freeze' || 
          traumaResponsePatterns.dominant4F.type === 'fawn') {
        // For freeze and fawn, which need more delicate responses
        estimatedComplexity += Math.min(intensity, 2);
      }
      
      // For hybrid responses (multiple strong patterns), increase complexity
      if (traumaResponsePatterns.secondary4F) {
        estimatedComplexity += 1;
      }
      
      // Increase emotional weight for higher intensity responses
      if (intensity >= 3) {
        estimatedEmotionalWeight += 1;
      }
      
      // If anger level is high in trauma response, increase emotional weight
      if (traumaResponsePatterns.angerLevel === 'angry' || 
          traumaResponsePatterns.angerLevel === 'enraged') {
        estimatedEmotionalWeight += 1;
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
        
        // If we have a young adult concern and no response yet, try to generate a young adult specific response
        if (youngAdultConcern && !responseText && youngAdultConcern.category) {
          try {
            const youngAdultModule = require('../../utils/response/youngAdultResponses');
            if (youngAdultModule.generateYoungAdultResponse) {
              const youngAdultResponse = youngAdultModule.generateYoungAdultResponse({
                concernInfo: youngAdultConcern,
                userMessage: userInput,
                concernType
              });
              
              if (youngAdultResponse) {
                responseText = youngAdultResponse;
              }
            }
          } catch (e) {
            console.log("Young adult response module not available:", e);
          }
        }
        
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
