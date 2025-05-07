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
      intensity: socialContext.intensity || "medium", // Ensure we have a valid intensity value
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
  const implicitEmotionPatterns = [
    { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxious', intensity: 'medium' as const },
    { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'angry', intensity: 'medium' as const },
    { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'happy', intensity: 'medium' as const },
    { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'embarrassed', intensity: 'medium' as const },
    { situation: /(spill|mess|dropped|broke something)/i, emotion: 'embarrassed', intensity: 'medium' as const },
    // New patterns for temporal descriptions that often have meaning implications
    { situation: /(terrible|awful|horrible|rough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'high' as const },
    { situation: /(bad|rough|tough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'medium' as const },
    { situation: /(great|amazing|wonderful) (day|night|week|morning|evening)/i, emotion: 'happy', intensity: 'high' as const }
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

/**
 * Detects underlying meaning themes in user input
 * This helps differentiate between surface feelings and deeper meaning
 * @param userInput User's message
 * @returns Object with meaning themes and importance indicators
 */
export const detectMeaningThemes = (userInput: string): {
  hasMeaningTheme: boolean;
  themes: string[];
  conflictingValues?: string[];
  lifeValues?: string[];
} => {
  const lowerInput = userInput.toLowerCase();
  const meaningThemes = [];
  const conflictingValues = [];
  const lifeValues = [];
  
  // Detect themes related to balance and priorities
  if (/balance|priorit(y|ies)|juggl(e|ing)|difficult choice|hard to choose/i.test(userInput)) {
    meaningThemes.push("balancing priorities");
    
    // Detect specific conflicting priorities
    if (/work.*and.*(life|family|relationship|personal|home)/i.test(userInput) || 
        /(life|family|relationship|personal|home).*and.*work/i.test(userInput)) {
      conflictingValues.push("work-life balance");
    }
    
    if (/(want|desire|need).*but.*(should|have to|must|obligation|responsibility)/i.test(userInput) ||
        /(should|have to|must|obligation|responsibility).*but.*(want|desire|need)/i.test(userInput)) {
      conflictingValues.push("personal desires vs. responsibilities");
    }
  }
  
  // Detect themes related to purpose and fulfillment
  if (/purpose|meaning|fulfillment|significant|impact|worthwhile|pointless|matter/i.test(userInput)) {
    meaningThemes.push("seeking purpose");
    lifeValues.push("meaningful contribution");
  }
  
  // Detect themes related to connection and belonging
  if (/connect(ion|ed)|belong(ing)?|lonely|isolated|part of something|community|relationship/i.test(userInput)) {
    meaningThemes.push("seeking connection");
    lifeValues.push("meaningful relationships");
  }
  
  // Detect themes related to identity and self-worth
  if (/identity|who (I am|am I)|self-worth|value as a person|purpose|role|contribution/i.test(userInput)) {
    meaningThemes.push("questioning identity");
    lifeValues.push("sense of self");
  }
  
  // Detect themes related to desire for autonomy
  if (/control|choice|freedom|decision|autonomy|independence|rely on|depend(ent|ence)/i.test(userInput)) {
    meaningThemes.push("seeking autonomy");
    lifeValues.push("personal freedom");
  }
  
  // Detect themes related to achievement and competence
  if (/achieve|success|fail|accomplish|proud|disappointed|let down|let.*down|expectation/i.test(userInput)) {
    meaningThemes.push("striving for achievement");
    lifeValues.push("personal accomplishment");
  }
  
  // Detect themes related to values and moral concerns
  if (/right|wrong|should|fair|unfair|justice|moral|ethic|values|believe|principle/i.test(userInput)) {
    meaningThemes.push("aligning with values");
    lifeValues.push("integrity");
  }
  
  // Detect themes related to struggle
  if (/tough|difficult|hard|struggle|challenging|overwhelming|too much/i.test(userInput)) {
    meaningThemes.push("facing challenges");
  }
  
  // NEW: Detect experiential time patterns that often indicate deeper meaning
  // Brief statements about time periods often carry deep meaning implications
  if (/(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i.test(userInput)) {
    meaningThemes.push("processing difficult experiences");
    lifeValues.push("finding meaning in hardship");
  }
  
  // NEW: Special handling for very brief statements
  // When a user provides a very brief statement, it often carries deeper meaning
  if (userInput.split(/\s+/).length <= 5 && 
      /(terrible|awful|horrible|rough|bad|tough|difficult)/i.test(userInput)) {
    meaningThemes.push("reflecting on challenges");
    lifeValues.push("resilience");
  }
  
  return {
    hasMeaningTheme: meaningThemes.length > 0,
    themes: meaningThemes,
    conflictingValues: conflictingValues.length > 0 ? conflictingValues : undefined,
    lifeValues: lifeValues.length > 0 ? lifeValues : undefined
  };
};
