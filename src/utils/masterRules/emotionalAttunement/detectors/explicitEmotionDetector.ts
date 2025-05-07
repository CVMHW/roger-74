
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
  // First check for direct statements using explicit patterns
  for (const pattern of explicitEmotionPatterns) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      const potentialEmotion = match[1].toLowerCase().trim();
      // Check if it's a known emotion
      if (getEmotionFromWheel(potentialEmotion)) {
        return potentialEmotion;
      }
    }
  }
  
  // Check for nuanced expressions of emotion
  const nuancedPatterns = [
    { pattern: /not (feeling|doing) (so |too |very )?(good|great|well|okay|fine)/i, emotion: 'sad' },
    { pattern: /been better|seen better days/i, emotion: 'sad' },
    { pattern: /can't (seem to )?stop (thinking|worrying) about/i, emotion: 'anxious' },
    { pattern: /feeling (a bit|kind of|sort of|slightly|somewhat) (off|down|upset|sad|anxious|nervous|worried|happy|excited)/i, emotion: null },
    { pattern: /mixed feelings about/i, emotion: 'conflicted' },
    { pattern: /don't (really |quite )?know (how|what) (I'm|I am) feeling/i, emotion: 'confused' }
  ];
  
  for (const { pattern, emotion } of nuancedPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      // For patterns where we extract the emotion from the match
      if (!emotion && match[2]) {
        const extractedEmotion = match[2].toLowerCase().trim();
        if (getEmotionFromWheel(extractedEmotion)) {
          return extractedEmotion;
        }
      }
      // For patterns where we return a predefined emotion
      if (emotion) {
        return emotion;
      }
    }
  }
  
  return null;
};
