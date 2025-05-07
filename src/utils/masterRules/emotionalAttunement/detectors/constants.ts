
/**
 * Constants and shared patterns for emotion detection
 */

/**
 * Emotion intensity types
 */
export type EmotionIntensity = 'low' | 'medium' | 'high';

/**
 * Patterns for detecting implicit emotions
 */
export const implicitEmotionPatterns = [
  { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxious', intensity: 'medium' as EmotionIntensity },
  { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'angry', intensity: 'medium' as EmotionIntensity },
  { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'happy', intensity: 'medium' as EmotionIntensity },
  { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'embarrassed', intensity: 'medium' as EmotionIntensity },
  { situation: /(spill|mess|dropped|broke something)/i, emotion: 'embarrassed', intensity: 'medium' as EmotionIntensity },
  // Temporal descriptions with meaning implications
  { situation: /(terrible|awful|horrible|rough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'high' as EmotionIntensity },
  { situation: /(bad|rough|tough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(great|amazing|wonderful) (day|night|week|morning|evening)/i, emotion: 'happy', intensity: 'high' as EmotionIntensity }
];

/**
 * Patterns for detecting everyday situations
 */
export const everydaySituationPatterns = [
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

/**
 * Patterns for detecting explicit emotion statements
 */
export const explicitEmotionPatterns = [
  /\bI\s+(?:feel|am|was|got|become|became)\s+(\w+)/i,
  /\bfeeling\s+(\w+)/i,
  /\bJust\s+(?:feeling|feel)\s+(\w+)/i
];
