
/**
 * Types for emotional attunement system
 */

export interface EmotionInfo {
  hasEmotion: boolean;
  primaryEmotion: string | null;
  intensity: "low" | "medium" | "high" | null;
  isImplicit: boolean;
  isMixed?: boolean;
  secondaryEmotions?: string[];
}

export interface EmotionalResponse {
  response: string;
  acknowledgment: string;
  validation: string;
}

export interface EmotionalDetectionResult {
  hasEmotionalContent: boolean;
  primaryEmotion: string | null;
  secondaryEmotions?: string[];
  intensity: string | null;
  context?: string;
  source?: string;
}

export interface EverydaySituation {
  pattern: RegExp;
  type: string;
  needsSupport?: boolean;
}

export interface EverydaySituationInfo {
  isEverydaySituation: boolean;
  situationType: string | null;
  practicalSupportNeeded: boolean;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  type: CrisisType | null;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  requiresImmediate: boolean;
  matchedPhrases?: string[];
}

export type CrisisType = 
  | 'suicide' 
  | 'homicide' 
  | 'self-harm' 
  | 'psychosis' 
  | 'schizophrenia'
  | 'delusion' 
  | 'hallucination'
  | 'mania'
  | 'dissociation'
  | 'acute_trauma'
  | 'general_crisis';

export interface CrisisProtocol {
  type: CrisisType;
  responseTemplate: string;
  resourceLinks: string[];
  immediateAction: boolean;
}
