
/**
 * Emotions Wheel Dictionary
 * 
 * Comprehensive emotions dictionary based on the emotions wheel model
 * This serves as the source of truth for all emotional recognition across Roger
 */

export interface EmotionEntry {
  name: string;
  synonyms: string[];
  intensity: 'low' | 'medium' | 'high';
  category: CoreEmotion;
  color: string;
  description?: string;
}

export type CoreEmotion = 'happy' | 'sad' | 'angry' | 'fearful' | 'surprised' | 'disgusted';

// Main emotions wheel data
export const emotionsWheel: Record<string, EmotionEntry> = {
  // HAPPY emotions
  'happy': { 
    name: 'happy', 
    synonyms: ['glad', 'pleased', 'content', 'joyful', 'good'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C',
    description: 'Feeling pleasure or contentment'
  },
  'proud': { 
    name: 'proud', 
    synonyms: ['accomplished', 'successful', 'confident'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'accepted': { 
    name: 'accepted', 
    synonyms: ['included', 'welcomed', 'belonging'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'powerful': { 
    name: 'powerful', 
    synonyms: ['strong', 'capable', 'effective'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'peaceful': { 
    name: 'peaceful', 
    synonyms: ['calm', 'tranquil', 'serene', 'relaxed'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'optimistic': { 
    name: 'optimistic', 
    synonyms: ['hopeful', 'positive', 'encouraged'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'excited': { 
    name: 'excited', 
    synonyms: ['eager', 'enthusiastic', 'thrilled'], 
    intensity: 'high', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'playful': { 
    name: 'playful', 
    synonyms: ['silly', 'amusing', 'fun', 'light-hearted'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'content': { 
    name: 'content', 
    synonyms: ['satisfied', 'fulfilled', 'pleased'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'interested': { 
    name: 'interested', 
    synonyms: ['curious', 'engaged', 'attentive'], 
    intensity: 'medium', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'loving': { 
    name: 'loving', 
    synonyms: ['affectionate', 'caring', 'warm'], 
    intensity: 'high', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  'courageous': { 
    name: 'courageous', 
    synonyms: ['brave', 'fearless', 'bold'], 
    intensity: 'high', 
    category: 'happy', 
    color: '#FF9F1C' 
  },
  
  // SAD emotions
  'sad': { 
    name: 'sad', 
    synonyms: ['unhappy', 'down', 'blue', 'upset', 'depressed', 'sorrowful'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F',
    description: 'Feeling unhappy or sorrowful'
  },
  'lonely': { 
    name: 'lonely', 
    synonyms: ['isolated', 'alone', 'abandoned'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'vulnerable': { 
    name: 'vulnerable', 
    synonyms: ['exposed', 'unprotected', 'unsafe'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'despair': { 
    name: 'despair', 
    synonyms: ['hopeless', 'despondent', 'devastated'], 
    intensity: 'high', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'guilty': { 
    name: 'guilty', 
    synonyms: ['remorseful', 'ashamed', 'regretful'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'depressed': { 
    name: 'depressed', 
    synonyms: ['dejected', 'miserable', 'gloomy'], 
    intensity: 'high', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'hurt': { 
    name: 'hurt', 
    synonyms: ['pained', 'wounded', 'injured'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F' 
  },
  'embarrassed': { 
    name: 'embarrassed', 
    synonyms: ['humiliated', 'mortified', 'ashamed'], 
    intensity: 'medium', 
    category: 'sad', 
    color: '#E35B6F',
    description: 'Feeling uncomfortable or self-conscious about something that happened'
  },
  
  // ANGRY emotions
  'angry': { 
    name: 'angry', 
    synonyms: ['mad', 'irate', 'outraged', 'furious'], 
    intensity: 'high', 
    category: 'angry', 
    color: '#8A508F',
    description: 'Feeling strong displeasure or hostility'
  },
  'frustrated': { 
    name: 'frustrated', 
    synonyms: ['annoyed', 'irritated', 'agitated'], 
    intensity: 'medium', 
    category: 'angry', 
    color: '#8A508F' 
  },
  'critical': { 
    name: 'critical', 
    synonyms: ['judgmental', 'disapproving', 'faultfinding'], 
    intensity: 'medium', 
    category: 'angry', 
    color: '#8A508F' 
  },
  'distant': { 
    name: 'distant', 
    synonyms: ['withdrawn', 'detached', 'removed'], 
    intensity: 'medium', 
    category: 'angry', 
    color: '#8A508F' 
  },
  'jealous': { 
    name: 'jealous', 
    synonyms: ['envious', 'resentful', 'covetous'], 
    intensity: 'medium', 
    category: 'angry', 
    color: '#8A508F' 
  },
  
  // FEARFUL emotions
  'fearful': { 
    name: 'fearful', 
    synonyms: ['afraid', 'scared', 'frightened', 'terrified'], 
    intensity: 'high', 
    category: 'fearful', 
    color: '#3066BE',
    description: 'Feeling afraid or anxious'
  },
  'anxious': { 
    name: 'anxious', 
    synonyms: ['worried', 'nervous', 'concerned', 'uneasy'], 
    intensity: 'medium', 
    category: 'fearful', 
    color: '#3066BE' 
  },
  'rejected': { 
    name: 'rejected', 
    synonyms: ['unwanted', 'dismissed', 'excluded'], 
    intensity: 'medium', 
    category: 'fearful', 
    color: '#3066BE' 
  },
  'confused': { 
    name: 'confused', 
    synonyms: ['puzzled', 'perplexed', 'bewildered'], 
    intensity: 'medium', 
    category: 'fearful', 
    color: '#3066BE' 
  },
  'overwhelmed': { 
    name: 'overwhelmed', 
    synonyms: ['swamped', 'overloaded', 'overpowered'], 
    intensity: 'high', 
    category: 'fearful', 
    color: '#3066BE' 
  },
  'nervous': { 
    name: 'nervous', 
    synonyms: ['jittery', 'anxious', 'apprehensive'], 
    intensity: 'medium', 
    category: 'fearful', 
    color: '#3066BE' 
  },
  
  // SURPRISED emotions
  'surprised': { 
    name: 'surprised', 
    synonyms: ['shocked', 'astonished', 'amazed'], 
    intensity: 'medium', 
    category: 'surprised', 
    color: '#E5D4C0',
    description: 'Feeling taken aback by something unexpected'
  },
  'amazed': { 
    name: 'amazed', 
    synonyms: ['awestruck', 'astounded', 'wonderstruck'], 
    intensity: 'high', 
    category: 'surprised', 
    color: '#E5D4C0' 
  },
  'surprised_confused': { 
    name: 'confused', 
    synonyms: ['puzzled', 'perplexed', 'bewildered'], 
    intensity: 'medium', 
    category: 'surprised', 
    color: '#E5D4C0' 
  },
  
  // DISGUSTED emotions  
  'disgusted': { 
    name: 'disgusted', 
    synonyms: ['revolted', 'appalled', 'repulsed'], 
    intensity: 'high', 
    category: 'disgusted', 
    color: '#774936',
    description: 'Feeling strong aversion or revulsion'
  },
  'disappointed': { 
    name: 'disappointed', 
    synonyms: ['let down', 'disheartened', 'disillusioned'], 
    intensity: 'medium', 
    category: 'disgusted', 
    color: '#774936' 
  },
  'awful': { 
    name: 'awful', 
    synonyms: ['terrible', 'horrible', 'dreadful'], 
    intensity: 'high', 
    category: 'disgusted', 
    color: '#774936' 
  }
};

/**
 * Social Emotional Contexts - specialized contexts that cause specific emotional reactions
 * These often combine multiple emotions or have specific situational connotations
 */
export interface SocialEmotionalContext {
  trigger: RegExp;
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: 'low' | 'medium' | 'high';
  description: string;
}

export const socialEmotionalContexts: SocialEmotionalContext[] = [
  {
    trigger: /spill(ed)?.*drink.*girl|spill(ed)?.*on.*girl/i,
    primaryEmotion: 'embarrassed',
    secondaryEmotion: 'sad',
    intensity: 'high',
    description: 'Social embarrassment from spilling a drink on someone'
  },
  {
    trigger: /spill(ed)?|mess(ed)? up|accident|dropped/i,
    primaryEmotion: 'embarrassed',
    intensity: 'medium',
    description: 'Embarrassment from a minor accident or mistake'
  },
  {
    trigger: /awkward.*conversation|awkward.*date|awkward.*meeting/i,
    primaryEmotion: 'embarrassed',
    secondaryEmotion: 'anxious',
    intensity: 'medium',
    description: 'Social discomfort from an awkward interaction'
  },
  {
    trigger: /rejected|turned down|stood up|ghosted/i,
    primaryEmotion: 'sad',
    secondaryEmotion: 'embarrassed',
    intensity: 'medium',
    description: 'Feeling rejected in a social or romantic context'
  },
  {
    trigger: /date.*went bad|date.*went wrong|bad date/i,
    primaryEmotion: 'disappointed',
    secondaryEmotion: 'embarrassed',
    intensity: 'medium',
    description: "Disappointment from a date that didn't go well"
  }
];

/**
 * Finds the emotion object from the emotions wheel using the name or synonyms
 * @param emotion The emotion name or synonym to search for
 * @returns The emotion entry if found, or undefined
 */
export const getEmotionFromWheel = (emotion: string): EmotionEntry | undefined => {
  const normalizedEmotion = emotion.toLowerCase().trim();
  
  // Direct match by name
  if (emotionsWheel[normalizedEmotion]) {
    return emotionsWheel[normalizedEmotion];
  }
  
  // Search through synonyms
  for (const key in emotionsWheel) {
    if (emotionsWheel[key].synonyms.includes(normalizedEmotion)) {
      return emotionsWheel[key];
    }
  }
  
  return undefined;
};

/**
 * Detects social emotional context from user input
 * @param userInput User's message text
 * @returns Detected social context if any
 */
export const detectSocialEmotionalContext = (userInput: string): SocialEmotionalContext | undefined => {
  for (const context of socialEmotionalContexts) {
    if (context.trigger.test(userInput)) {
      return context;
    }
  }
  return undefined;
};

/**
 * Gets related emotions for a given emotion
 * @param emotionName The emotion to find related emotions for
 * @returns Array of related emotion names
 */
export const getRelatedEmotions = (emotionName: string): string[] => {
  const emotion = getEmotionFromWheel(emotionName);
  if (!emotion) return [];
  
  const category = emotion.category;
  return Object.values(emotionsWheel)
    .filter(e => e.category === category && e.name !== emotionName)
    .map(e => e.name);
};

/**
 * Gets all emotion words including synonyms
 * @returns Array of all emotion words
 */
export const getAllEmotionWords = (): string[] => {
  const words: string[] = [];
  
  for (const key in emotionsWheel) {
    words.push(emotionsWheel[key].name);
    words.push(...emotionsWheel[key].synonyms);
  }
  
  return [...new Set(words)]; // Remove duplicates
};
