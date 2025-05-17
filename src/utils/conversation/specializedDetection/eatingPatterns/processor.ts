
/**
 * Food-Related Message Processor
 * Executive control system for processing food-related messages
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk } from './detectors';
import { RiskLevel, FoodResponseType } from './types';

/**
 * Result of food-related message processing
 */
export interface FoodProcessingResult {
  responseType: FoodResponseType;
  riskLevel: RiskLevel;
  needsSpecialist: boolean;
  suggestedResponse: string;
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
      needsSpecialist: true,
      suggestedResponse: "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?"
    };
  }
  
  // Check for neutral/casual food discussion
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  if (smallTalkResult.isFoodSmallTalk && !edResult.isEatingDisorderConcern) {
    return {
      responseType: 'casual',
      riskLevel: 'low',
      needsSpecialist: false,
      suggestedResponse: "Thanks for sharing about your food preferences. It's always interesting to hear about different tastes and dining experiences. Would you like to tell me more about that?"
    };
  }
  
  // For medium risk ED concerns
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'medium') {
    return {
      responseType: 'eating_disorder',
      riskLevel: 'medium',
      needsSpecialist: true,
      suggestedResponse: "I hear that you're struggling with thoughts about food and eating. These challenges can be really difficult to navigate alone. The National Eating Disorders Association offers specialized support through their helpline at 1-800-931-2237. Would you like to talk more about what you've been experiencing?"
    };
  }
  
  // For low risk ED concerns
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'low') {
    return {
      responseType: 'general_concern',
      riskLevel: 'low',
      needsSpecialist: false,
      suggestedResponse: "Thank you for sharing about your relationship with food and body image. These topics can be challenging to talk about. While we can discuss this together, specialized support is also available if you'd find it helpful. Would you like to tell me more about what you've been experiencing?"
    };
  }
  
  // Default neutral response
  return {
    responseType: 'neutral',
    riskLevel: 'low',
    needsSpecialist: false,
    suggestedResponse: "I notice you mentioned something about food. Is there something specific about this topic you'd like to discuss?"
  };
};
