
/**
 * Detectors for emotional content and everyday situations
 */

import { EmotionInfo, EverydaySituationInfo } from './types';

/**
 * Detects emotional content in user input
 * @param input User message
 * @returns Information about detected emotions
 */
export const detectEmotionalContent = (input: string): EmotionInfo => {
  // Check for explicit emotion words
  const emotionPatterns = {
    sadness: {
      high: /(devastated|heartbroken|despair|miserable|hopeless)/i,
      medium: /(sad|down|depressed|blue|unhappy|upset)/i,
      low: /(disappointed|bummed|bit sad|little down)/i
    },
    anxiety: {
      high: /(terrified|panicking|freaking out|can't breathe|panic)/i,
      medium: /(anxious|nervous|worried|stressed|afraid|on edge)/i,
      low: /(concerned|uneasy|unsettled|little nervous|slight worry)/i
    },
    anger: {
      high: /(furious|enraged|livid|seething|outraged)/i,
      medium: /(angry|mad|frustrated|irritated|annoyed)/i,
      low: /(bothered|irked|peeved|bugged|rubbed wrong)/i
    },
    joy: {
      high: /(thrilled|elated|overjoyed|ecstatic|over the moon)/i,
      medium: /(happy|glad|pleased|delighted|content)/i,
      low: /(content|satisfied|okay|fine|alright)/i
    },
    shame: {
      high: /(mortified|humiliated|ashamed|disgraced)/i,
      medium: /(embarrassed|guilty|regretful|foolish)/i,
      low: /(awkward|silly|sheepish|bit embarrassed)/i
    }
  };
  
  // Check for explicit emotions first
  for (const [emotion, intensities] of Object.entries(emotionPatterns)) {
    for (const [level, pattern] of Object.entries(intensities)) {
      if (pattern.test(input)) {
        return {
          hasEmotion: true,
          primaryEmotion: emotion,
          intensity: level as 'low' | 'medium' | 'high',
          isImplicit: false
        };
      }
    }
  }
  
  // Check for implicit emotional content through situations
  const implicitEmotionPatterns = [
    { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxiety', intensity: 'medium' as const },
    { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'anger', intensity: 'medium' as const },
    { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'joy', intensity: 'medium' as const },
    { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'shame', intensity: 'low' as const }
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
    { type: "tired_sleep", pattern: /(tired|exhausted|sleep|nap|rest|fatigue)/i, needsSupport: true }
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

