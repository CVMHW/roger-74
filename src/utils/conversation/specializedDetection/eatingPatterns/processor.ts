/**
 * Main processor for food-related messages
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk } from './detectors';
import { 
  generateEatingDisorderResponse, 
  generateFoodSmallTalkResponse 
} from './responseGenerators';
import { FoodRelatedMessageResult } from './types';

/**
 * Main function to process food-related messages and determine appropriate response type
 * with enhanced Cleveland food context awareness
 */
export const processFoodRelatedMessage = (userInput: string): FoodRelatedMessageResult => {
  // First check if this is an eating disorder concern
  const edResult = detectEatingDisorderConcerns(userInput);
  
  // Check for Cleveland-specific food talk
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  // Special handling for Cleveland food contexts - generally treat as small talk
  // unless there's very strong evidence of an eating disorder
  if (smallTalkResult.isClevelandSpecific && 
      (edResult.riskLevel !== 'high' || edResult.contextMarkers.length < 2)) {
    return {
      responseType: 'food_small_talk',
      riskLevel: 'none',
      suggestedResponse: generateFoodSmallTalkResponse(userInput, smallTalkResult)
    };
  }
  
  // For non-Cleveland contexts, process normally
  if (edResult.isEatingDisorderConcern) {
    return {
      responseType: 'eating_disorder',
      riskLevel: edResult.riskLevel,
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // If not an ED concern, check if it's food small talk
  if (smallTalkResult.isSmallTalk) {
    return {
      responseType: 'food_small_talk',
      riskLevel: 'none',
      suggestedResponse: generateFoodSmallTalkResponse(userInput, smallTalkResult)
    };
  }
  
  // Otherwise, it's not primarily food-related
  return {
    responseType: 'not_food_related',
    riskLevel: 'none',
    suggestedResponse: ''
  };
};
