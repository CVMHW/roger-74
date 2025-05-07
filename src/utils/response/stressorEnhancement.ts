
/**
 * Stressor Enhancement System
 * 
 * Enhances responses with awareness of common stressors and appropriate support
 */

import { detectStressors } from '../stressors/stressorDetection';

/**
 * Enhances response text based on detected stressors in user input
 * @param responseText Original response text
 * @param userInput User's message
 * @param conversationHistory Previous conversation messages
 * @returns Enhanced response with stressor awareness
 */
export const enhanceStressorAwareness = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  try {
    // Detect stressors in the user input
    const stressors = detectStressors(userInput);
    
    // If no significant stressors detected, return original response
    if (!stressors || stressors.length === 0) {
      return responseText;
    }
    
    // Don't modify responses that are already addressing stressors
    if (responseText.includes("stress") || 
        responseText.includes("pressure") || 
        responseText.includes("overwhelming")) {
      return responseText;
    }
    
    // For short responses, consider adding stressor acknowledgment
    if (responseText.length < 120 && stressors.length > 0) {
      return `${responseText} I notice you're dealing with some stressors around ${stressors[0].category}. How has that been affecting you?`;
    }
    
    // For longer responses, don't modify if already substantial
    return responseText;
    
  } catch (error) {
    console.error("Error in enhanceStressorAwareness:", error);
    return responseText;
  }
};

export default enhanceStressorAwareness;
