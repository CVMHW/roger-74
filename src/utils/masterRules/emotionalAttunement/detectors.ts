
/**
 * Detectors for emotional content and everyday situations
 * Enhanced with the comprehensive emotions wheel
 */

import { EmotionInfo, EverydaySituationInfo } from './types';
import { 
  getEmotionFromWheel, 
  detectSocialEmotionalContext, 
  emotionsWheel 
} from '../../emotions/emotionsWheel';

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
      // Use a proper type assertion chain with 'as unknown' first, then to the specific type
      intensity: socialContext.intensity ? (socialContext.intensity as unknown as "high" | "medium" | "low") : "medium",
      isImplicit: false
    };
  }
  
  // Check for explicit emotion words using the emotions wheel
  const lowerInput = input.toLowerCase();
  for (const emotion in emotionsWheel) {
    // Check for direct emotion name mention
    if (new RegExp(`\\b${emotion}\\b`, 'i').test(input)) {
      // Safely define intensity with a default fallback
      const intensityValue = "medium";
      return {
        hasEmotion: true,
        primaryEmotion: emotion,
        intensity: intensityValue as "high" | "medium" | "low",
        isImplicit: false
      };
    }
    
    // Check synonyms
    for (const childEmotion in emotionsWheel[emotion]) {
      const synonyms = emotionsWheel[emotion][childEmotion].synonyms;
      for (const synonym of synonyms) {
        if (new RegExp(`\\b${synonym}\\b`, 'i').test(input)) {
          // Safely define intensity with a default fallback
          const intensityValue = "medium";
          return {
            hasEmotion: true,
            primaryEmotion: emotion,
            intensity: intensityValue as "high" | "medium" | "low",
            isImplicit: false
          };
        }
      }
    }
  }
  
  // Check for implicit emotional content through situations
  const implicitEmotionPatterns = [
    { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxious', intensity: 'medium' as const },
    { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'angry', intensity: 'medium' as const },
    { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'happy', intensity: 'medium' as const },
    { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'embarrassed', intensity: 'medium' as const },
    { situation: /(spill|mess|dropped|broke something)/i, emotion: 'embarrassed', intensity: 'medium' as const }
  ];
  
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

/**
 * Detects everyday situations that require practical support response
 * @param input User message
 * @returns Information about everyday situation
 */
export const detectEverydaySituation = (input: string): EverydaySituationInfo => {
  const everydaySituations = [
    { type: "spill_or_stain", pattern: /(spill|stain|mess|dirt|clean)/i, needsSupport: true },
    { type: "traffic_commute", pattern: /(traffic|commute|drive|late|stuck)/i, needsSupport: false },
    { type: "weather_issue", pattern: /(rain|snow|storm|weather|forecast|cold|hot)/i, needsSupport: true },
    { type: "minor_injury", pattern: /(cut|bruise|scratch|bump|hurt)/i, needsSupport: true },
    { type: "lost_item", pattern: /(lost|misplaced|can't find|where is|looking for)/i, needsSupport: true },
    { type: "minor_conflict", pattern: /(argument|disagreement|fight|mad at|angry with)/i, needsSupport: true },
    { type: "schedule_issue", pattern: /(schedule|appointment|meeting|calendar|forgot)/i, needsSupport: false },
    { type: "tired_sleep", pattern: /(tired|exhausted|sleep|nap|rest|fatigue)/i, needsSupport: true },
    { type: "social_embarrassment", pattern: /(embarrassing|awkward|uncomfortable|spill)/i, needsSupport: true }
  ];
  
  for (const situation of everydaySituations) {
    if (situation.pattern.test(input)) {
      return {
        isEverydaySituation: true,
        situationType: situation.type,
        practicalSupportNeeded: situation.needsSupport
      };
    }
  }
  
  return {
    isEverydaySituation: false,
    situationType: null,
    practicalSupportNeeded: false
  };
};

/**
 * Detects emotion from explicit statement
 * @param userInput User's message text
 * @returns Detected emotion or null
 */
export const detectExplicitEmotionStatement = (userInput: string): string | null => {
  // Detect "I feel X" or "I am X" statements
  const explicitPatterns = [
    /\bI\s+(?:feel|am|was|got|become|became)\s+(\w+)/i,
    /\bfeeling\s+(\w+)/i,
    /\bJust\s+(?:feeling|feel)\s+(\w+)/i
  ];
  
  for (const pattern of explicitPatterns) {
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
