
/**
 * Emotion Response Processing
 * 
 * Handles emotion detection and correction in responses
 */

import * as emotionModule from './emotionHandler';

/**
 * Processes emotions in responses, fixing misidentifications
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @returns Processed response text
 */
export function processEmotions(responseText: string, userInput: string): string {
  try {
    if (emotionModule.fixEmotionMisidentification) {
      return emotionModule.fixEmotionMisidentification(responseText, userInput);
    }
  } catch (error) {
    console.error("Error in processEmotions:", error);
  }
  
  return responseText;
}
