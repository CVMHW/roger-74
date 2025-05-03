import { FeelingCategory } from './feelingCategories';

// Define the types of concerns that can be identified
export type ConcernType =
  | "wait_time"
  | "pre_session_anxiety"
  | "first_visit"
  | "payment_concerns"
  | "other";

// Define the developmental stages
export type DevelopmentalStage =
  | "child"
  | "teen"
  | "adult";

// Define the conversation stages
export type ConversationStage =
  | "initial"
  | "early"
  | "established"
  | "late"
  | "closing";

// Define the structure for patient memory
export interface PatientMemory {
  id: string;
  timestamp: Date;
  content: string;
  type: string;
  relevanceScore: number;
}

// Add the missing TraumaResponseAnalysis interface
export interface TraumaResponseAnalysis {
  severity: number;
  recommendedApproach: string;
  triggerWords?: string[];
  topics?: string[];
}

// Add the missing ContextAwareReflection interface
export interface ContextAwareReflection {
  context: string;
  reflection: string;
  examples: string[];
}

// Add the missing ChildEmotionCategory type
export type ChildEmotionCategory = "happy" | "sad" | "angry" | "scared" | "confused";

// Add the missing ChildWheelEmotionData interface
export interface ChildWheelEmotionData {
  category: ChildEmotionCategory;
  emotions: string[];
  descriptions: string[];
}

// Add the missing ReflectionPhrases interface
export interface ReflectionPhrases {
  opening: string[];
  feelings: string[];
  needs: string[];
  values: string[];
  thoughts: string[];
  experiences: string[];
  closing: string[];
}

// Add the missing ReflectionPrinciple interface
export interface ReflectionPrinciple {
  name: string;
  description: string;
  examples: string[];
  implementation: string[];
}

// Fix the re-exports to use 'export type'
export type { FeelingCategory };
export type { ConcernType };
export type { DevelopmentalStage };
export type { ConversationStage };
export type { PatientMemory };
