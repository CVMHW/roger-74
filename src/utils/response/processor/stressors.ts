
/**
 * Stressor Awareness Processing
 * 
 * Handles integration of stressor awareness into responses
 */

import { enhanceWithStressorAwareness } from './stressorEnhancement';

/**
 * Enhance responses with stressor awareness
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @param conversationHistory Previous conversation for context
 * @returns Stressor-aware enhanced response
 */
export function processStressors(
  responseText: string, 
  userInput: string, 
  conversationHistory: string[] = []
): string {
  try {
    return enhanceWithStressorAwareness(responseText, userInput, conversationHistory);
  } catch (error) {
    console.error("Error in processStressors:", error);
  }
  
  return responseText;
}
