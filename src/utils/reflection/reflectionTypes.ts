
/**
 * Types used for reflection-based responses.
 */

export type ConversationStage = 'initial' | 'early' | 'middle' | 'established';

export type FeelingCategory = 'angry' | 'happy' | 'sad' | 'anxious' | 'confused' | 'relieved' | 'overwhelmed';

export type DevelopmentalStage = 'infant_toddler' | 'young_child' | 'middle_childhood' | 'adolescent' | 'adult' | 'young_adult';

export type ChildEmotionCategory = 'happy' | 'mad' | 'sad' | 'scared' | 'excited' | 'tired' | 'worried' | 'loved' | 'confused' | 'silly' | 'hungry' | 'calm';

// Updated to include PTSD, trauma-response, ptsd-mild
export type ConcernType = 'crisis' | 'medical' | 'mental-health' | 'eating-disorder' | 'substance-use' | 'tentative-harm' | 'mild-gambling' | 'ptsd' | 'ptsd-mild' | 'trauma-response' | null;

export interface FeelingsWheelEmotion {
  name: string;
  synonyms: string[];
  intensity?: 'low' | 'medium' | 'high';
  children?: FeelingsWheelEmotion[];
}

export interface ChildEmotion {
  detectedFeeling: string;
  category: ChildEmotionCategory;
  color: string;
  simpleDescription?: string;
  relatedFeelings: string[];
}

export interface EnhancedFeeling {
  detectedWord: string;
  category: FeelingCategory;
  intensity?: 'low' | 'medium' | 'high';
  childFriendly?: {
    translation: string;
    category: ChildEmotionCategory;
  };
}

// Add missing interfaces to fix build errors
export interface ChildWheelEmotionData {
  detectedFeeling: string;
  category: ChildEmotionCategory;
  color: string;
  relatedFeelings: string[];
  simpleDescription?: string;
}

export interface ContextAwareReflection {
  keywords: string[];
  phrases: string[];
  priority: number;
  // Add missing properties that are being used
  feeling?: string;
  context?: string;
  reflection?: string;
  wheelFeelingData?: {
    detectedFeeling?: string;
    coreEmotion: string;
    intensity?: 'low' | 'medium' | 'high';
    relatedFeelings?: string[];
  };
  specificDetails?: string[];
  relationshipContext?: string;
  timeContext?: string;
  locationContext?: string;
}

export interface ReflectionPhrases {
  opening: string[];
  middle: string[];
  closing: string[];
  // Add missing emotion categories
  sad?: string[];
  angry?: string[];
  anxious?: string[];
  happy?: string[];
  confused?: string[];
  relieved?: string[];
  embarrassed?: string[];
  overwhelmed?: string[];
  lonely?: string[];
  hopeful?: string[];
}

export interface ReflectionPrinciple {
  name: string;
  description: string;
  examples: string[];
  // Add missing properties
  purpose?: string;
  approach?: string;
  goal?: string;
}

// New trauma-related types
export interface TraumaResponseType {
  fightResponse?: boolean;
  flightResponse?: boolean;
  freezeResponse?: boolean;
  fawnResponse?: boolean;
  dominantResponseType?: 'fight' | 'flight' | 'freeze' | 'fawn' | 'hybrid';
  intensity?: 'mild' | 'moderate' | 'severe' | 'extreme';
}

// Add anger thermometer levels
export type AngerLevel = 'calm' | 'annoyed' | 'frustrated' | 'angry' | 'enraged';
