
/**
 * Type definitions for the reflection system
 */

// Categories of feeling words to help identify emotions in text
export type FeelingCategory = 
  'sad' | 'angry' | 'anxious' | 'happy' | 'confused' | 
  'relieved' | 'embarrassed' | 'overwhelmed' | 'lonely' | 'hopeful';

export type ConversationStage = 'initial' | 'early' | 'established';

export type ReflectionPhrases = Record<FeelingCategory, string[]>;

export interface ReflectionPrinciple {
  purpose: string;
  approach: string;
  goal: string;
}

