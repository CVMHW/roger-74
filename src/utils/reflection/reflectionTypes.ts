
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

// Define the allowed concern types for consistency across the application
export type ConcernType = 'crisis' | 'medical' | 'mental-health' | 'eating-disorder' | 'substance-use' | 'tentative-harm' | null;

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
}

// Interface for tracking personalized topics for better follow-up
export interface PersonalizedTopic {
  topic: string; // Main topic (e.g., "sports", "family", "work")
  specifics: string[]; // Specific items related to the topic (e.g., ["Browns", "football", "Baltimore"])
  emotionalSignificance: FeelingCategory[]; // Associated feelings with this topic
  mentionCount: number; // How many times this has been brought up
  lastMentioned: Date; // When this was last discussed
}
