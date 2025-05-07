/**
 * Eating Pattern Handler
 * 
 * Integration between the eating pattern detector and Roger's response system
 */

import { 
  processFoodRelatedMessage, 
  detectEatingDisorderConcerns 
} from '../../conversation/specializedDetection/eatingPatterns';
import { recordToMemory } from '../../nlpProcessor';

// Constants for resource referrals
const EMILY_PROGRAM_INFO = {
  name: "The Emily Program",
  website: "https://www.emilyprogram.com/",
  helpline: "1-888-364-5977",
  description: "The Emily Program specializes in eating disorder treatment with locations across the country, including Ohio."
};

// Cleveland-specific food contexts to help distinguish food enjoyment from concerns
const CLEVELAND_FOOD_CONTEXTS = [
  "west side market", "little italy", "tremont", "ohio city", 
  "pierogi", "polish food", "corned beef", "slyman's", 
  "great lakes brewing", "mitchell's ice cream", "melt",
  "cleveland food scene", "lakewood restaurants"
];

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
  
  // Check if this might be Cleveland-specific food enjoyment
  const isClevelandFoodContext = CLEVELAND_FOOD_CONTEXTS.some(
    context => userInput.toLowerCase().includes(context)
  );
  
  // For eating disorder concerns, record to memory with high priority
  if (result.responseType === 'eating_disorder') {
    const detectionResult = detectEatingDisorderConcerns(userInput);
    
    // Create memory entry with detailed analysis
    recordToMemory(
      userInput, 
      `EATING CONCERN: ${result.riskLevel}. Phrases: ${detectionResult.matchedPhrases.join(', ')}`
    );
    
    // For non-Cleveland food contexts with moderate to high risk,
    // include Emily Program referral in response
    if (!isClevelandFoodContext && 
        (detectionResult.riskLevel === 'moderate' || detectionResult.riskLevel === 'high')) {
      return `${result.suggestedResponse} If you're looking for specialized support with these feelings about food or body image, The Emily Program (${EMILY_PROGRAM_INFO.helpline}) offers resources that many find helpful.`;
    }
    
    // Return the suggested response without referral for other cases
    return result.suggestedResponse;
  }
  
  // For food small talk, just return the suggested response
  // No special memory recording needed for casual food talk
  return result.suggestedResponse;
};

/**
 * Updates the given eating disorder response based on conversation history and
 * improves it if needed, including Emily Program referrals when appropriate
 */
export const enhanceEatingDisorderResponse = (
  initialResponse: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  const detectionResult = detectEatingDisorderConcerns(userInput);
  
  // Check if this is Cleveland-specific food enjoyment
  const isClevelandFoodContext = CLEVELAND_FOOD_CONTEXTS.some(
    context => userInput.toLowerCase().includes(context)
  );
  
  // If this is a high-risk situation and we've talked about it before,
  // add resources and support including Emily Program
  if (detectionResult.riskLevel === 'high' && 
      conversationHistory.length > 3 && 
      conversationHistory.some(msg => /eating|food|weight|body|diet/i.test(msg)) &&
      !isClevelandFoodContext) {
    
    return `${initialResponse} I want you to know that support is available for these feelings. The Emily Program (${EMILY_PROGRAM_INFO.helpline} or ${EMILY_PROGRAM_INFO.website}) specializes in supporting people with complex feelings about food and body image.`;
  }
  
  // If it's a moderate concern, causing distress, and not just Cleveland food talk
  if (detectionResult.riskLevel === 'moderate' && 
      detectionResult.contextMarkers.length > 0 &&
      !isClevelandFoodContext) {
    
    return `${initialResponse} These thoughts can sometimes take up a lot of mental space. Some people find it helpful to talk with specialists like those at The Emily Program. Would it be helpful to explore resources for support with these feelings?`;
  }
  
  // For lower risk or first-time mentions
  return initialResponse;
};

/**
 * Checks if a message might need specialized eating disorder response handling
 * while being careful not to misclassify casual food enjoyment in Cleveland
 */
export const needsSpecializedEatingResponseHandling = (userInput: string): boolean => {
  const { isEatingDisorderConcern, riskLevel } = detectEatingDisorderConcerns(userInput);
  
  // Check if this might be Cleveland-specific food enjoyment
  const isClevelandFoodContext = CLEVELAND_FOOD_CONTEXTS.some(
    context => userInput.toLowerCase().includes(context)
  );
  
  // If it's Cleveland food talk, be extra cautious about flagging as a concern
  if (isClevelandFoodContext) {
    // Only flag as needing special handling if it's high risk despite the food context
    return isEatingDisorderConcern && riskLevel === 'high';
  }
  
  // Otherwise use normal risk assessment
  return isEatingDisorderConcern && (riskLevel === 'high' || riskLevel === 'moderate');
};

export default {
  handleEatingPatterns,
  enhanceEatingDisorderResponse,
  needsSpecializedEatingResponseHandling
};
