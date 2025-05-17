
/**
 * Eating pattern detection types
 */

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high';

export interface EatingDisorderConcernResult {
  isEatingDisorderConcern: boolean;
  riskLevel: RiskLevel;
  matchedPhrases: string[];
  contextMarkers: string[];
  isLikelySmallTalk: boolean;
  recommendedApproach: 'general-support' | 'specialized-referral' | 'crisis-response';
  needsImmediate: boolean;
}

export interface FoodSmallTalkResult {
  isSmallTalk: boolean;
  isClevelandSpecific: boolean;
  topics: string[];
}

export type ResponseType = 'eating_disorder' | 'food_small_talk' | 'not_food_related';

export interface FoodRelatedMessageResult {
  responseType: ResponseType;
  riskLevel: RiskLevel;
  protocolSource?: 'executive' | 'specialized' | 'small_talk' | 'default' | 'safety_override'; 
  suggestedResponse: string;
}
