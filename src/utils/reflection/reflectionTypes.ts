
// Define the type for concerns that might need special responses
export type ConcernType = 
  | 'tentative-harm' 
  | 'crisis' 
  | 'medical' 
  | 'mental-health' 
  | 'eating-disorder'
  | 'substance-use'
  | 'mild-gambling'
  | 'ptsd'
  | 'ptsd-mild'
  | 'trauma-response'
  | 'cultural-adjustment'
  | 'weather-related'
  | 'pet-illness';

// Define the stages of conversation
export type ConversationStage = 'initial' | 'early' | 'established';

// Define developmental stages for age-appropriate responses
export type DevelopmentalStage = 
  'infant_toddler' | 
  'young_child' | 
  'middle_childhood' | 
  'adolescent' | 
  'young_adult' | 
  'adult';

// Define feeling categories for emotion detection
export type FeelingCategory = 
  'angry' | 
  'happy' | 
  'sad' | 
  'anxious' | 
  'confused' | 
  'relieved' | 
  'overwhelmed';

// Define child-specific emotion categories
export type ChildEmotionCategory = 
  'happy' | 
  'mad' | 
  'sad' | 
  'scared' | 
  'excited' | 
  'tired' | 
  'worried' | 
  'loved' | 
  'confused' | 
  'silly' | 
  'hungry' | 
  'calm';

// Structure for child emotions wheel data
export interface ChildWheelEmotionData {
  detectedFeeling: string;
  category: ChildEmotionCategory;
  color: string;
  simpleDescription?: string;
  relatedFeelings: string[];
}

// Structure for context-aware reflections
export interface ContextAwareReflection {
  trigger: string[];
  response: string[];
  priority: number;
  keywords?: string[];
  feeling?: string;
  wheelFeelingData?: ChildWheelEmotionData;
  specificDetails?: string;
  relationshipContext?: string;
  timeContext?: string;
}

// Structure for reflection principles
export interface ReflectionPrinciple {
  name: string;
  description: string;
  examples: string[];
}

// Structure for reflection phrases by category
export interface ReflectionPhrases {
  [category: string]: string[];
}

// Structure for trauma response patterns
export interface TraumaResponsePattern {
  type: 'fight' | 'flight' | 'freeze' | 'fawn';
  intensity: 'mild' | 'moderate' | 'severe' | 'extreme';
  indicators: string[];
}

// Structure for enhanced trauma response analysis
export interface TraumaResponseAnalysis {
  dominant4F?: TraumaResponsePattern;
  secondary4F?: TraumaResponsePattern;
  hybrid?: boolean;
  angerLevel?: 'none' | 'irritated' | 'angry' | 'enraged';
  signs: string[];
}
