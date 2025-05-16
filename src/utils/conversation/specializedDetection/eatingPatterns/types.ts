
/**
 * Type definitions for eating patterns detection system
 */

// Risk level for eating disorder concerns
export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';

// Result from eating disorder concern detection
export interface EatingDisorderConcernResult {
  isEatingDisorderConcern: boolean;
  riskLevel: RiskLevel;
  matchedPhrases: string[];
  recommendedApproach: 'general-support' | 'specialized-referral' | 'crisis-response';
  needsImmediate: boolean;
  contextMarkers: string[];
  isLikelySmallTalk: boolean;
}

// Result from food small talk detection
export interface FoodSmallTalkResult {
  isSmallTalk: boolean;
  isClevelandSpecific: boolean;
  topics: string[];
}

// Combined result for food-related message processing
export interface FoodRelatedMessageResult {
  responseType: 'eating_disorder' | 'food_small_talk' | 'not_food_related';
  riskLevel: RiskLevel;
  suggestedResponse: string;
}
