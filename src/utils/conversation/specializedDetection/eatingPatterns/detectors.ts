
/**
 * Detectors for eating patterns
 */

import {
  eatingDisorderKeywords,
  eatingDisorderPhrases,
  foodSmallTalkPatterns,
  clevelandFoodContexts,
  contextualRiskMarkers
} from './constants';
import { EatingDisorderConcernResult, FoodSmallTalkResult } from './types';

/**
 * Detects potential eating disorder concerns in user input with high sensitivity
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderConcernResult => {
  const lowerInput = userInput.toLowerCase();
  const result: EatingDisorderConcernResult = {
    isEatingDisorderConcern: false,
    riskLevel: 'none',
    matchedPhrases: [],
    contextMarkers: [],
    isLikelySmallTalk: false
  };
  
  // Check for direct mentions of eating disorders
  for (const keyword of eatingDisorderKeywords) {
    if (lowerInput.includes(keyword)) {
      result.matchedPhrases.push(keyword);
    }
  }
  
  // Check for specific phrases that indicate eating disorders
  for (const phrase of eatingDisorderPhrases) {
    const match = lowerInput.match(phrase);
    if (match) {
      result.matchedPhrases.push(match[0]);
    }
  }
  
  // Check for contextual risk markers
  for (const marker of contextualRiskMarkers) {
    const match = lowerInput.match(marker);
    if (match) {
      result.contextMarkers.push(match[0]);
    }
  }
  
  // If just one simple food mention, likely small talk
  const isSimpleFoodTalk = foodSmallTalkPatterns.some(pattern => pattern.test(lowerInput));
  
  // If Cleveland food context, might be small talk about local food
  const isClevelandFoodContext = clevelandFoodContexts.some(context => 
    lowerInput.includes(context.toLowerCase())
  );
  
  // Direct mention of eating disorders - highest priority detection
  if (
    lowerInput.includes('eating disorder') ||
    lowerInput.includes('anorexia') ||
    lowerInput.includes('bulimia') ||
    lowerInput.includes('binge eating')
  ) {
    result.isEatingDisorderConcern = true;
    result.riskLevel = 'high';
  }
  // Check for serious concerns with multiple indicators
  else if (result.matchedPhrases.length >= 2 || result.contextMarkers.length >= 2) {
    result.isEatingDisorderConcern = true;
    result.riskLevel = 'high';
  } 
  // Check for moderate concerns
  else if (result.matchedPhrases.length === 1 && result.contextMarkers.length >= 1) {
    result.isEatingDisorderConcern = true;
    result.riskLevel = 'moderate';
  }
  // Check for low risk concerns
  else if (result.matchedPhrases.length === 1 || result.contextMarkers.length === 1) {
    // Distinguish from Cleveland food talk
    if (!isClevelandFoodContext) {
      result.isEatingDisorderConcern = true;
      result.riskLevel = 'low';
    }
  }
  
  // If both Cleveland food context and very minimal indicators, might be small talk
  if (isClevelandFoodContext && result.matchedPhrases.length <= 1 && result.contextMarkers.length === 0) {
    result.isLikelySmallTalk = true;
  }
  
  // If just general food talk with no concerns
  if (isSimpleFoodTalk && result.matchedPhrases.length === 0 && result.contextMarkers.length === 0) {
    result.isLikelySmallTalk = true;
  }
  
  return result;
};

/**
 * Determines if message is just food small talk rather than a concern
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  const lowerInput = userInput.toLowerCase();
  const result: FoodSmallTalkResult = {
    isSmallTalk: false,
    topics: [],
    isClevelandSpecific: false
  };
  
  // Check for food small talk patterns
  for (const pattern of foodSmallTalkPatterns) {
    const match = lowerInput.match(pattern);
    if (match) {
      result.isSmallTalk = true;
      result.topics.push(match[0]);
    }
  }
  
  // Check for Cleveland-specific food contexts
  for (const context of clevelandFoodContexts) {
    if (lowerInput.includes(context.toLowerCase())) {
      result.isClevelandSpecific = true;
      result.topics.push(context);
    }
  }
  
  // If no explicit eating disorder concerns and has food talk, it's likely small talk
  const hasExplicitConcerns = eatingDisorderPhrases.some(phrase => phrase.test(lowerInput));
  if (!hasExplicitConcerns && (result.topics.length > 0 || result.isClevelandSpecific)) {
    result.isSmallTalk = true;
  }
  
  return result;
};
