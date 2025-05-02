
/**
 * Utilities for detecting feelings in user messages
 */

import { FeelingCategory } from './reflectionTypes';
import { feelingCategories } from './feelingCategories';

/**
 * Identifies potential feelings in a user's message
 * @param userMessage The user's message text
 * @returns Array of detected feelings
 */
export const identifyFeelings = (userMessage: string): FeelingCategory[] => {
  const lowerMessage = userMessage.toLowerCase();
  const detectedFeelings: FeelingCategory[] = [];
  
  for (const [category, words] of Object.entries(feelingCategories)) {
    if (words.some(word => lowerMessage.includes(word))) {
      detectedFeelings.push(category as FeelingCategory);
    }
  }
  
  return detectedFeelings;
};
