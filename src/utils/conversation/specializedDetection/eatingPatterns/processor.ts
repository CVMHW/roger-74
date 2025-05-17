
/**
 * Food-related message processor that combines detection with response generation
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk } from './detectors';
import { RiskLevel, FoodResponseType, FoodRelatedMessageResult } from './types';
import { generateEatingDisorderResponse, generateFoodSmallTalkResponse, generateNeutralResponse } from './responseGenerators';

export interface FoodProcessingResult {
  responseType: FoodResponseType;
  riskLevel: RiskLevel;
  needsSpecialist: boolean;
  matchedPhrases?: string[];
  contextMarkers?: string[];
  suggestedResponse: string;
}

/**
 * Processes a food-related message to determine how to respond
 */
export const processFoodRelatedMessage = (userInput: string): FoodProcessingResult => {
  // Check for eating disorder indicators first
  const edResult = detectEatingDisorderConcerns(userInput);
  
  // Check if this is casual food small talk
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  // Default result
  const result: FoodProcessingResult = {
    responseType: 'neutral',
    riskLevel: 'low',
    needsSpecialist: false,
    matchedPhrases: edResult.matchedPhrases,
    contextMarkers: edResult.contextMarkers,
    suggestedResponse: ""
  };
  
  // Determine response type based on detection results
  if (edResult.isEatingDisorderConcern && !smallTalkResult.isFoodSmallTalk) {
    result.responseType = 'eating_disorder';
    result.riskLevel = edResult.riskLevel;
    result.needsSpecialist = edResult.riskLevel === 'high' || edResult.riskLevel === 'medium';
    result.suggestedResponse = generateEatingDisorderResponse(userInput, edResult.riskLevel);
  } else if (smallTalkResult.isFoodSmallTalk && smallTalkResult.confidence > 0.6) {
    result.responseType = 'casual';
    result.suggestedResponse = generateFoodSmallTalkResponse(userInput, smallTalkResult.context);
  } else if (smallTalkResult.isFoodSmallTalk) {
    result.responseType = 'general_concern';
    result.suggestedResponse = generateNeutralResponse(userInput);
  } else {
    result.responseType = 'neutral';
    result.suggestedResponse = "";
  }
  
  return result;
};
