
/**
 * Types for reflection module
 */

// Feeling categories that can be detected
export type FeelingCategory = 
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'confused'
  | 'hurt'
  | 'embarrassed'
  | 'guilty'
  | 'ashamed'
  | 'fearful'
  | 'hopeful'
  | 'grateful'
  | 'proud'
  | 'excited'
  | 'passionate'
  | 'neutral'
  | 'relieved'
  | 'overwhelmed';

// Concern types that can be identified
export type ConcernType = 
  | 'crisis'
  | 'depression'
  | 'anxiety'
  | 'grief'
  | 'trauma'
  | 'relationship'
  | 'family'
  | 'work'
  | 'general'
  | 'subclinical'
  | 'waiting-room'
  | 'medical'
  | 'mental-health'
  | 'eating-disorder'
  | 'substance-use'
  | 'tentative-harm'
  | 'mild-gambling'
  | 'ptsd'
  | 'ptsd-mild'
  | 'trauma-response'
  | 'pet-illness'
  | 'weather-related'
  | 'cultural-adjustment'
  | null;

// Developmental stages for age-appropriate responses  
export type DevelopmentalStage =
  | 'child'
  | 'adolescent'
  | 'young-adult'
  | 'adult'
  | 'older-adult'
  | 'unknown'
  | 'infant_toddler'
  | 'young_child'
  | 'middle_childhood'
  | 'young_adult';

// Conversation stages for adaptive response
export type ConversationStage =
  | 'initial-greeting'
  | 'early-rapport'
  | 'problem-identification'
  | 'exploration'
  | 'goal-setting'
  | 'coping-strategies'
  | 'wrap-up'
  | 'follow-up'
  | 'initial'
  | 'early'
  | 'established';

// Memory structure for response enhancement
export interface PatientMemory {
  topics: string[];
  concerns: ConcernType[];
  feelings: FeelingCategory[];
  statements: string[];
  timestamp: number;
}

// TraumaResponseAnalysis type
export interface TraumaResponseAnalysis {
  dominant4F: {
    type: 'fight' | 'flight' | 'freeze' | 'fawn';
    intensity: 'mild' | 'moderate' | 'severe' | 'extreme';
  };
  secondary4F?: {
    type: 'fight' | 'flight' | 'freeze' | 'fawn';
    intensity: 'mild' | 'moderate' | 'severe' | 'extreme';
  };
  angerLevel: 'calm' | 'irritated' | 'angry' | 'enraged';
  hybrid?: boolean; // Adding this property to fix related error
}

// Child emotion related types
export type ChildEmotionCategory = 
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'confused'
  | 'silly'
  | 'excited'
  | 'calm'
  | 'hungry'
  | 'tired'
  | 'worried'
  | 'scared'
  | 'mad'
  | 'loved';

export interface ChildWheelEmotionData {
  detectedFeeling: string;
  category: ChildEmotionCategory;
  relatedFeelings: string[];
  color: string;
  simpleDescription?: string;
}

// Context aware reflection type
export interface ContextAwareReflection {
  patterns: RegExp[];
  response: string;
  tags?: string[];
  priority?: number;
}

// Reflection phrases and principles types
export interface ReflectionPhrases {
  openingPhrases: string[];
  transitionPhrases: string[];
  closingPhrases: string[];
}

export interface ReflectionPrinciple {
  name: string;
  description: string;
  examples: string[];
}
