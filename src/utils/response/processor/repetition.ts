
/**
 * Repetition Detection and Prevention
 * 
 * Handles detection and correction of repetitive patterns in responses
 */

import { detectHarmfulRepetitions, fixHarmfulRepetitions } from './repetitionPrevention';

/**
 * Process response for repetition patterns
 * @param responseText Original response text
 * @param conversationHistory Previous conversation for context
 * @returns Object containing processed text and modification flag
 */
export function processRepetition(
  responseText: string, 
  conversationHistory: string[] = []
): { text: string; wasModified: boolean } {
  try {
    // Detect repetitive patterns
    const repetitionResult = detectHarmfulRepetitions(responseText);
    
    // If harmful repetition is detected with high enough score, fix it
    if (repetitionResult.hasRepetition && repetitionResult.repetitionScore > 0.6) {
      return {
        text: fixHarmfulRepetitions(responseText),
        wasModified: true
      };
    }
  } catch (error) {
    console.error("Error in processRepetition:", error);
  }
  
  return { text: responseText, wasModified: false };
}
