
/**
 * Detects explicit emotion statements in user input
 */

import { getEmotionFromWheel } from '../../../emotions/emotionsWheel';
import { explicitEmotionPatterns } from './constants';

/**
 * Detects emotion from explicit statement
 * @param userInput User's message text
 * @returns Detected emotion or null
 */
export const detectExplicitEmotionStatement = (userInput: string): string | null => {
  for (const pattern of explicitEmotionPatterns) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      const potentialEmotion = match[1].toLowerCase();
      // Check if it's a known emotion
      if (getEmotionFromWheel(potentialEmotion)) {
        return potentialEmotion;
      }
    }
  }
  
  return null;
};
