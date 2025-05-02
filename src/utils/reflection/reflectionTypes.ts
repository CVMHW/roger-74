
/**
 * Types used for reflection-based responses.
 */

export type ConversationStage = 'initial' | 'early' | 'middle' | 'established';

export type FeelingCategory = 'angry' | 'happy' | 'sad' | 'anxious' | 'confused' | 'relieved' | 'overwhelmed';

export type DevelopmentalStage = 'infant_toddler' | 'young_child' | 'middle_childhood' | 'adolescent' | 'adult';

export type ChildEmotionCategory = 'happy' | 'mad' | 'sad' | 'scared' | 'excited' | 'tired' | 'worried' | 'loved' | 'confused' | 'silly' | 'hungry' | 'calm';

// Updated to include PTSD and mild-gambling
export type ConcernType = 'crisis' | 'medical' | 'mental-health' | 'eating-disorder' | 'substance-use' | 'tentative-harm' | 'mild-gambling' | 'ptsd' | 'ptsd-mild' | null;

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
