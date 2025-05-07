
/**
 * Detection functions for eating patterns
 */

import { 
  eatingDisorderKeywords, 
  eatingDisorderPhrases, 
  contextualRiskMarkers,
  foodSmallTalkPatterns,
  clevelandFoodContexts
} from './constants';
import { EatingDisorderConcernResult, FoodSmallTalkResult } from './types';

/**
 * Detects potential eating disorder concerns in user input
 * @param userInput User's message
 * @returns Assessment of eating disorder risk level and details
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderConcernResult => {
  const normalizedInput = userInput.toLowerCase();
  const matchedPhrases: string[] = [];
  const contextMarkers: string[] = [];
  
  // Check for eating disorder phrases
  let matchCount = 0;
  for (const pattern of eatingDisorderPhrases) {
    const matches = normalizedInput.match(pattern);
    if (matches && matches.length > 0) {
      matchedPhrases.push(matches[0]);
      matchCount++;
    }
  }
  
  // Check for keywords as additional signals
  for (const keyword of eatingDisorderKeywords) {
    if (new RegExp(`\\b${keyword}\\b`, 'i').test(normalizedInput)) {
      if (!matchedPhrases.includes(keyword)) {
        matchedPhrases.push(keyword);
      }
      matchCount += 0.5; // Keywords count as partial matches
    }
  }
  
  // Check for contextual risk markers
  for (const marker of contextualRiskMarkers) {
    const matches = normalizedInput.match(marker);
    if (matches && matches.length > 0) {
      contextMarkers.push(matches[0]);
      matchCount += 0.5; // Context markers increase risk but aren't definitive
    }
  }
  
  // Check if this is likely just food small talk, especially Cleveland-related
  const isGeneralFoodSmallTalk = foodSmallTalkPatterns.some(pattern => pattern.test(normalizedInput));
  const isClevelandFoodTalk = clevelandFoodContexts.some(pattern => pattern.test(normalizedInput));
  let isLikelySmallTalk = isGeneralFoodSmallTalk || isClevelandFoodTalk;
  
  // If there are ED phrases but also small talk patterns, resolve the ambiguity
  // Special handling for Cleveland food contexts - be more cautious about flagging these as concerns
  if (matchCount > 0 && isLikelySmallTalk) {
    if (isClevelandFoodTalk) {
      // For Cleveland food talk, require stronger evidence of ED concerns
      isLikelySmallTalk = matchCount < 2.5 || contextMarkers.length === 0;
    } else {
      // For general food small talk, use normal threshold
      isLikelySmallTalk = matchCount < 1.5 && contextMarkers.length === 0;
    }
  }
  
  // Determine risk level based on matches and context
  let riskLevel: 'none' | 'low' | 'moderate' | 'high' = 'none';
  if (matchCount >= 3 || (matchCount >= 1.5 && contextMarkers.length >= 2)) {
    riskLevel = 'high';
  } else if (matchCount >= 1.5 || (matchCount >= 1 && contextMarkers.length >= 1)) {
    riskLevel = 'moderate';
  } else if (matchCount > 0) {
    riskLevel = 'low';
  }
  
  // Cleveland food context adjustment - reduce risk level for Cleveland food talk
  // unless there's very strong evidence of an eating disorder
  if (isClevelandFoodTalk && riskLevel !== 'high' && contextMarkers.length < 3) {
    if (riskLevel === 'moderate') {
      riskLevel = 'low';
    } else if (riskLevel === 'low') {
      riskLevel = 'none';
    }
  }
  
  // If this is clearly small talk with minimal ED signals, reduce the risk level
  if (isLikelySmallTalk && riskLevel === 'low') {
    riskLevel = 'none';
  }
  
  return {
    isEatingDisorderConcern: riskLevel !== 'none',
    riskLevel,
    matchedPhrases,
    contextMarkers,
    isLikelySmallTalk
  };
};

/**
 * Detects if the user's input is primarily about food as small talk
 * with special handling for Cleveland food contexts
 * @param userInput User's message
 * @returns Whether the message is primarily food-related small talk
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  const normalizedInput = userInput.toLowerCase();
  const topics: string[] = [];
  
  let smallTalkMatchCount = 0;
  for (const pattern of foodSmallTalkPatterns) {
    const matches = normalizedInput.match(pattern);
    if (matches && matches.length > 0) {
      topics.push(matches[0]);
      smallTalkMatchCount++;
    }
  }
  
  // Check if this is Cleveland-specific food talk
  const isClevelandSpecific = clevelandFoodContexts.some(pattern => {
    const matches = normalizedInput.match(pattern);
    if (matches && matches.length > 0) {
      topics.push(matches[0]);
      smallTalkMatchCount += 0.5; // Cleveland food contexts boost small talk score
      return true;
    }
    return false;
  });
  
  // Check if there are any eating disorder concerns
  const { isEatingDisorderConcern, riskLevel } = detectEatingDisorderConcerns(userInput);
  
  // It's food small talk if it matches patterns and doesn't raise high-level ED concerns
  // For Cleveland food talk, we're even more lenient about classifying as small talk
  const isSmallTalk = smallTalkMatchCount > 0 && 
                      (!isEatingDisorderConcern || 
                       (isClevelandSpecific && riskLevel !== 'high'));
  
  return {
    isSmallTalk,
    topics,
    isClevelandSpecific
  };
};
