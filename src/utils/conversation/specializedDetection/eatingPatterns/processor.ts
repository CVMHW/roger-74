
/**
 * Main processor for food-related messages
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk, FoodSmallTalkResult } from './detectors';
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
  // CRITICAL: First check for binge eating or can't stop eating - HIGHEST PRIORITY
  if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row/i.test(userInput.toLowerCase())) {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      suggestedResponse: "I'm concerned about what you're sharing about your eating patterns. These feelings can be overwhelming and deserve support. The National Eating Disorders Association (NEDA) helpline at 1-800-931-2237 can provide guidance. Would you like to talk more about what you're experiencing right now?"
    };
  }
  
  // CRITICAL: Second check for "not eating" concerns
  if (/not eating|haven'?t (been )?eat(ing|en)|struggling not eating|can't eat|don't eat/i.test(userInput.toLowerCase())) {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      suggestedResponse: "I'm concerned about what you're sharing about not eating. This is something that needs professional support. The National Eating Disorders Association (NEDA) helpline at 1-800-931-2237 can provide immediate guidance. Would it be possible for you to reach out to them today?"
    };
  }
  
  // Next check for any other eating disorder concern
  const edResult = detectEatingDisorderConcerns(userInput);
  
  // Direct mentions of eating disorders always take priority
  if (/eating disorder|anorexia|bulimia|binge eating|eating issues|eating problems|purging/i.test(userInput.toLowerCase())) {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // Check for Cleveland-specific food talk
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  // NEVER classify as small talk if there's any eating disorder concern
  if (edResult.isEatingDisorderConcern || !smallTalkResult.isSmallTalk) {
    return {
      responseType: 'eating_disorder',
      riskLevel: edResult.riskLevel,
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // Special handling for Cleveland food contexts - ONLY if we're absolutely sure it's not an ED
  if (smallTalkResult.isClevelandSpecific && smallTalkResult.isSmallTalk) {
    return {
      responseType: 'food_small_talk',
      riskLevel: 'none',
      suggestedResponse: generateFoodSmallTalkResponse(userInput, smallTalkResult)
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
