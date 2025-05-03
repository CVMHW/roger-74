
import { FeelingCategory } from './feelingCategories';

// Define the types of concerns that can be identified
export type ConcernType =
  | "wait_time"
  | "pre_session_anxiety"
  | "first_visit"
  | "payment_concerns"
  | "other"
  | "crisis"
  | "medical"
  | "mental-health"
  | "eating-disorder"
  | "substance-use"
  | "tentative-harm"
  | "mild-gambling"
  | "ptsd"
  | "ptsd-mild"
  | "trauma-response"
  | "pet-illness"
  | "weather-related"
  | "cultural-adjustment";

// Define the developmental stages
export type DevelopmentalStage =
  | "child"
  | "adolescent" 
  | "teen"
  | "adult"
  | "young-adult"
  | "older-adult"
  | "unknown"
  | "infant_toddler"
  | "young_child"
  | "middle_childhood"
  | "young_adult";

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

// TraumaResponseAnalysis interface with all needed properties
export interface TraumaResponseAnalysis {
  severity: number;
  recommendedApproach: string;
  triggerWords?: string[];
  topics?: string[];
  dominant4F?: {
    type: "freeze" | "fawn" | "fight" | "flight";
    intensity: string;
  };
  secondary4F?: {
    type: "freeze" | "fawn" | "fight" | "flight";
    intensity: string;
  };
  angerLevel?: string;
  hybrid?: boolean;
}

// ContextAwareReflection interface
export interface ContextAwareReflection {
  context: string;
  reflection: string;
  examples: string[];
  trigger: string[];
  response: string[];
}

// Child Emotion Category type
export type ChildEmotionCategory = 
  | "happy" | "sad" | "angry" | "scared" | "confused"
  | "excited" | "silly" | "calm" | "hungry" | "tired"
  | "worried" | "mad";

// ChildWheelEmotionData interface with required properties
export interface ChildWheelEmotionData {
  category: ChildEmotionCategory;
  emotions: string[];
  descriptions: string[];
  detectedFeeling?: string;
  color?: string;
  simpleDescription?: string;
  relatedFeelings?: string[];
}

// ReflectionPhrases interface
export interface ReflectionPhrases {
  opening: string[];
  feelings?: string[];
  needs?: string[];
  values?: string[];
  thoughts?: string[];
  experiences?: string[];
  closing: string[];
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

// ReflectionPrinciple interface
export interface ReflectionPrinciple {
  name: string;
  description: string;
  examples: string[];
  implementation: string[];
}

// Re-export FeelingCategory for backward compatibility
export type { FeelingCategory };
