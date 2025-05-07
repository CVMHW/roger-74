
/**
 * Eating Pattern Handler
 * 
 * Integration between the eating pattern detector and Roger's response system
 */

import { 
  processFoodRelatedMessage, 
  detectEatingDisorderConcerns 
} from '../../conversation/specializedDetection/eatingPatternDetector';
import { recordToMemory } from '../../nlpProcessor';

/**
 * Processes a message to check for eating patterns and generate appropriate responses
 * @param userInput User's message text
 * @returns Response with categorization if related to eating patterns, null otherwise
 */
export const handleEatingPatterns = (userInput: string): string | null => {
  // Process the message through our specialized detector
  const result = processFoodRelatedMessage(userInput);
  
  // If it's not food-related, return null to let other handlers process it
  if (result.responseType === 'not_food_related') {
    return null;
  }
  
  // For eating disorder concerns, record to memory with high priority
  if (result.responseType === 'eating_disorder') {
    const detectionResult = detectEatingDisorderConcerns(userInput);
    
    // Create memory entry with detailed analysis
    recordToMemory(
      userInput, 
      `EATING CONCERN: ${result.riskLevel}. Phrases: ${detectionResult.matchedPhrases.join(', ')}`,
      0.9 // High priority
    );
    
    // Return the suggested response
    return result.suggestedResponse;
  }
  
  // For food small talk, just return the suggested response
  // No special memory recording needed for casual food talk
  return result.suggestedResponse;
};

/**
 * Updates the given eating disorder response based on conversation history and
 * improves it if needed
 */
export const enhanceEatingDisorderResponse = (
  initialResponse: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  const detectionResult = detectEatingDisorderConcerns(userInput);
  
  // If this is a high-risk situation and we've talked about it before,
  // add resources and support
  if (detectionResult.riskLevel === 'high' && 
      conversationHistory.length > 3 && 
      conversationHistory.some(msg => /eating|food|weight|body|diet/i.test(msg))) {
    
    return `${initialResponse} I want you to know that support is available for these feelings. Many people find it helpful to talk with professionals who specialize in supporting people with complex feelings about food and body image.`;
  }
  
  // If it's a moderate concern and seems to be causing distress
  if (detectionResult.riskLevel === 'moderate' && 
      detectionResult.contextMarkers.length > 0) {
    
    return `${initialResponse} These thoughts can sometimes take up a lot of mental space. Would it be helpful to explore other ways of thinking about food and body image that might feel more peaceful?`;
  }
  
  // For lower risk or first-time mentions
  return initialResponse;
};

/**
 * Checks if a message might need specialized eating disorder response handling
 */
export const needsSpecializedEatingResponseHandling = (userInput: string): boolean => {
  const { isEatingDisorderConcern, riskLevel } = detectEatingDisorderConcerns(userInput);
  
  // If it's a high or moderate risk, we should use specialized handling
  return isEatingDisorderConcern && (riskLevel === 'high' || riskLevel === 'moderate');
};

export default {
  handleEatingPatterns,
  enhanceEatingDisorderResponse,
  needsSpecializedEatingResponseHandling
};
