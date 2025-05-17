
/**
 * Types for the Eating Pattern Detection System
 */

// Risk level classification
export type RiskLevel = 'low' | 'medium' | 'high';

// Response type for food-related messages
export type FoodResponseType = 'casual' | 'eating_disorder' | 'general_concern' | 'neutral';

// Result from eating disorder concern detection
export interface EatingDisorderConcernResult {
  isEatingDisorderConcern: boolean;
  riskLevel: RiskLevel;
  needsImmediate: boolean;
  matchedPhrases: string[];
  contextMarkers?: string[];
}

// Result from food-related message processing
export interface FoodRelatedMessageResult {
  responseType: FoodResponseType;
  riskLevel: RiskLevel;
  needsSpecialist: boolean;
  suggestedResponse: string;
}
