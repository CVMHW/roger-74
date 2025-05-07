
/**
 * Detects emotional content in user input using the emotions wheel
 */

import { EmotionInfo } from '../types';
import { 
  getEmotionFromWheel, 
  detectSocialEmotionalContext, 
  emotionsWheel 
} from '../../../emotions/emotionsWheel';
import { implicitEmotionPatterns } from './constants';

/**
 * Detects emotional content in user input using the emotions wheel
 * @param input User message
 * @returns Information about detected emotions
 */
export const detectEmotionalContent = (input: string): EmotionInfo => {
  // First check for social emotional contexts (specific situations)
  const socialContext = detectSocialEmotionalContext(input);
  if (socialContext) {
    return {
      hasEmotion: true,
      primaryEmotion: socialContext.primaryEmotion,
      // Fix: Ensure we cast the intensity to the correct type if it exists, or use "medium" as default
      intensity: (socialContext.intensity as "low" | "medium" | "high") || "medium",
      isImplicit: false
    };
  }
  
  // Check for explicit emotion words using the emotions wheel
  const lowerInput = input.toLowerCase();
  for (const emotion in emotionsWheel) {
    // Check for direct emotion name mention
    if (new RegExp(`\\b${emotion}\\b`, 'i').test(input)) {
      return {
        hasEmotion: true,
        primaryEmotion: emotion,
        intensity: "medium",
        isImplicit: false
      };
    }
    
    // Check synonyms
    for (const childEmotion in emotionsWheel[emotion]) {
      const synonyms = emotionsWheel[emotion][childEmotion].synonyms;
      for (const synonym of synonyms) {
        if (new RegExp(`\\b${synonym}\\b`, 'i').test(input)) {
          return {
            hasEmotion: true,
            primaryEmotion: emotion,
            intensity: "medium",
            isImplicit: false
          };
        }
      }
    }
  }
  
  // Check for implicit emotional content through situations
  for (const pattern of implicitEmotionPatterns) {
    if (pattern.situation.test(input)) {
      return {
        hasEmotion: true,
        primaryEmotion: pattern.emotion,
        intensity: pattern.intensity,
        isImplicit: true
      };
    }
  }
  
  return {
    hasEmotion: false,
    primaryEmotion: null,
    intensity: null,
    isImplicit: false
  };
};
