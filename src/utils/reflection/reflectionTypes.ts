
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

// Export all types
export {
  FeelingCategory,
  ConcernType,
  DevelopmentalStage,
  ConversationStage,
  PatientMemory
};
