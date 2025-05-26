
import { FeelingCategory } from '../reflectionTypes';

// Re-export from main types to avoid conflicts
export type { 
  ConcernType, 
  ConversationStage, 
  DevelopmentalStage,
  TraumaResponseAnalysis,
  ReflectionPhrases,
  ReflectionPrinciple,
  FeelingCategory
} from '../reflectionTypes';

// Define the structure for patient memory
export interface PatientMemory {
  id: string;
  timestamp: Date;
  content: string;
  type: string;
  relevanceScore: number;
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
