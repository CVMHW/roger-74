
/**
 * Type definitions for the reflection system
 * Enhanced with Feelings Wheel data structures
 */

// Categories of feeling words to help identify emotions in text
export type FeelingCategory = 
  'sad' | 'angry' | 'anxious' | 'happy' | 'confused' | 
  'relieved' | 'embarrassed' | 'overwhelmed' | 'lonely' | 'hopeful';

export type ConversationStage = 'initial' | 'early' | 'established';

// New type for developmental stages based on age groups
export type DevelopmentalStage = 
  'infant_toddler' |      // Ages 0-3
  'young_child' |         // Ages 4-7
  'middle_childhood' |    // Ages 8-12
  'adolescent' |          // Ages 13-18
  'young_adult' |         // Ages 19-25
  'adult';                // Ages 26+

// New type for the children's emotion wheel categories
export type ChildEmotionCategory =
  'happy' | 'mad' | 'sad' | 'scared' | 'excited' | 'tired' | 'worried' | 
  'loved' | 'confused' | 'silly' | 'hungry' | 'calm';

export type ReflectionPhrases = Record<FeelingCategory, string[]>;

export interface ReflectionPrinciple {
  purpose: string;
  approach: string;
  goal: string;
}

// Define the allowed concern types for consistency across the application
export type ConcernType = 'crisis' | 'medical' | 'mental-health' | 'eating-disorder' | 'substance-use' | 'tentative-harm' | null;

// New interface for feelings wheel data
export interface WheelFeelingData {
  detectedFeeling: string;   // The exact feeling word detected
  coreEmotion: string;       // The core emotion category from the wheel
  relatedFeelings: string[]; // Related feelings from the same section of the wheel
  intensity: number;         // How specific/nuanced the feeling is (1-3)
}

// New interface for child emotion wheel data
export interface ChildWheelEmotionData {
  detectedFeeling: string;   // The exact feeling word detected
  category: ChildEmotionCategory; // The category from the children's wheel
  relatedFeelings: string[]; // Related simple feelings
  color: string;            // Color associated with this emotion (for visual reference)
  simpleDescription?: string; // Child-friendly description of the emotion
}

// Enhanced interface to support rich, context-aware reflections
export interface ContextAwareReflection {
  feeling: FeelingCategory;
  context: string;
  reflection: string;
  specificDetails?: string; // Specific details mentioned by the user (e.g., "the Browns moving to Baltimore")
  relationshipContext?: string; // Relationship context if mentioned (e.g., "my father", "my team")
  timeContext?: string; // Temporal context if mentioned (e.g., "yesterday", "next week")
  locationContext?: string; // Location context if mentioned (e.g., "at work", "in Cleveland")
  userConcern?: string; // The primary concern expressed by the user
  developmentalStage?: DevelopmentalStage; // The developmental stage of the user
  wheelFeelingData?: WheelFeelingData; // Enhanced feelings wheel data if available
  childWheelData?: ChildWheelEmotionData; // Child-friendly emotion wheel data if applicable
}

// Interface for tracking personalized topics for better follow-up
export interface PersonalizedTopic {
  topic: string; // Main topic (e.g., "sports", "family", "work")
  specifics: string[]; // Specific items related to the topic (e.g., ["Browns", "football", "Baltimore"])
  emotionalSignificance: FeelingCategory[]; // Associated feelings with this topic
  mentionCount: number; // How many times this has been brought up
  lastMentioned: Date; // When this was last discussed
}
