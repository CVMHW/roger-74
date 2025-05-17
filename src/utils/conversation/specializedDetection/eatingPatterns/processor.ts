
/**
 * Food-Related Message Processor
 * Executive control system for processing food-related messages
 */

import { detectEatingDisorderConcerns } from './detectors';

/**
 * Result of food-related message processing
 */
export interface FoodProcessingResult {
  responseType: 'casual' | 'eating_disorder' | 'general_concern' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
  needsSpecialist: boolean;
}

/**
 * Process food-related messages to determine appropriate response category
 */
export const processFoodRelatedMessage = (userInput: string): FoodProcessingResult => {
  // First check with specialized detector
  const edResult = detectEatingDisorderConcerns(userInput);
  
  // If high-risk eating disorder is detected, prioritize that
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      needsSpecialist: true
    };
  }
  
  // Check for neutral/casual food discussion
  const casualFoodPatterns = [
    /restaurant|dining|recipe|cook(ing)?|meal prep|grocery|favorite food/i,
    /breakfast|lunch|dinner|snack|taste|delicious|yummy|flavor/i
  ];
  
  const isCasualFoodTalk = casualFoodPatterns.some(pattern => pattern.test(userInput.toLowerCase()));
  
  if (isCasualFoodTalk && !edResult.isEatingDisorderConcern) {
    return {
      responseType: 'casual',
      riskLevel: 'low',
      needsSpecialist: false
    };
  }
  
  // For medium risk ED concerns
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'medium') {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'medium',
      needsSpecialist: true
    };
  }
  
  // For low risk ED concerns
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'low') {
    return {
      responseType: 'general_concern',
      riskLevel: 'low',
      needsSpecialist: false
    };
  }
  
  // Default neutral response
  return {
    responseType: 'neutral',
    riskLevel: 'low',
    needsSpecialist: false
  };
};
