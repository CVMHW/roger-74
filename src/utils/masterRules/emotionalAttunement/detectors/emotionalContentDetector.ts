
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
  
  // Enhanced contextual emotion detection for subtle language
  // Look for hedging language that often surrounds emotion words
  const hedgingPatterns = [
    /kind of|sort of|a bit|slightly|somewhat|a little|not really|almost/i,
    /feels like I('m| am)|seems like I('m| am)|I think I might be/i
  ];
  
  const emotionIndicators = [
    { words: /(?:not (?:feeling|doing)) (?:so |too |very )?(good|great|well|okay|fine)/i, emotion: 'sad', intensity: 'low' as "low" | "medium" | "high" },
    { words: /(?:been better|seen better days|not my best|not myself)/i, emotion: 'sad', intensity: 'low' as "low" | "medium" | "high" },
    { words: /(?:meh|blah|whatever|who cares|doesn't matter)/i, emotion: 'apathetic', intensity: 'medium' as "low" | "medium" | "high" },
    { words: /(?:on my mind|can't stop thinking|keeps coming up|dwelling on)/i, emotion: 'preoccupied', intensity: 'medium' as "low" | "medium" | "high" }
  ];
  
  for (const indicator of emotionIndicators) {
    if (indicator.words.test(lowerInput)) {
      return {
        hasEmotion: true,
        primaryEmotion: indicator.emotion,
        intensity: indicator.intensity,
        isImplicit: true
      };
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
  
  // Enhanced detection of mixed emotions
  if (/(mixed feelings|conflicted|torn|bittersweet|complicated)/i.test(input)) {
    // Try to determine which emotions are mixed
    const emotions = [];
    
    if (/(happy|excited|good|positive)/i.test(input)) emotions.push('happy');
    if (/(sad|down|unhappy|upset)/i.test(input)) emotions.push('sad');
    if (/(nervous|anxious|worried)/i.test(input)) emotions.push('anxious');
    if (/(angry|frustrated|annoyed)/i.test(input)) emotions.push('angry');
    
    // If we found specific emotions, return the dominant one with mixed flag
    if (emotions.length > 0) {
      return {
        hasEmotion: true,
        primaryEmotion: emotions[0], // Return the first detected emotion as primary
        intensity: "medium",
        isImplicit: false,
        isMixed: true, // Add this flag to indicate mixed emotions
        secondaryEmotions: emotions.slice(1) // Include other detected emotions
      };
    }
    
    // If specific emotions aren't clear, return generic conflicted state
    return {
      hasEmotion: true,
      primaryEmotion: 'conflicted',
      intensity: "medium",
      isImplicit: true
    };
  }
  
  return {
    hasEmotion: false,
    primaryEmotion: null,
    intensity: null,
    isImplicit: false
  };
};
