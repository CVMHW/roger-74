
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
  | 'neutral';

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
  | 'unknown';

// Conversation stages for adaptive response
export type ConversationStage =
  | 'initial-greeting'
  | 'early-rapport'
  | 'problem-identification'
  | 'exploration'
  | 'goal-setting'
  | 'coping-strategies'
  | 'wrap-up'
  | 'follow-up';

// Memory structure for response enhancement
export interface PatientMemory {
  topics: string[];
  concerns: ConcernType[];
  feelings: FeelingCategory[];
  statements: string[];
  timestamp: number;
}

// Add TraumaResponseAnalysis type which was missing
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
}

// Export all types
export {
  FeelingCategory,
  ConcernType,
  DevelopmentalStage,
  ConversationStage,
  PatientMemory,
  TraumaResponseAnalysis
};
