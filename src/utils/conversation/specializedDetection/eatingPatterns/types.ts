
/**
 * Type definitions for eating pattern detection
 */

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';

export interface EatingDisorderConcernResult {
  isEatingDisorderConcern: boolean;
  riskLevel: RiskLevel;
  matchedPhrases: string[];
  contextMarkers: string[];
  isLikelySmallTalk: boolean;
}

export interface FoodSmallTalkResult {
  isSmallTalk: boolean;
  topics: string[];
  isClevelandSpecific: boolean;
}

export interface FoodRelatedMessageResult {
  responseType: 'eating_disorder' | 'food_small_talk' | 'not_food_related';
  riskLevel: RiskLevel;
  suggestedResponse: string;
}
