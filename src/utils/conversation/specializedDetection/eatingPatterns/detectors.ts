
/**
 * Specialized detection system for eating disorder concerns
 */

// Import the common types
import { RiskLevel } from './types';

// Define the result interface for eating disorder detection
export interface EatingDisorderDetectionResult {
  isEatingDisorderConcern: boolean;
  riskLevel: RiskLevel;
  needsImmediate: boolean;
  matchedPhrases: string[];
  contextMarkers?: string[];
  isLikelySmallTalk?: boolean;
}

// Define the result interface for food small talk detection
export interface FoodSmallTalkResult {
  isFoodSmallTalk: boolean;
  confidence: number;
  context?: string;
}

// Regular expressions for eating disorder detection
const ED_PHRASES = [
  /starv(e|ing|ation)/i,
  /not (eat|eating)/i,
  /haven'?t (eat|eaten|had food)/i,
  /skip(ping|ped)? meals/i,
  /avoid(ing)? food/i,
  /binge/i,
  /purg(e|ing)/i,
  /(over|under)weight/i,
  /body (image|dysmorphia)/i,
  /too (fat|skinny|heavy|thin)/i,
  /diet(ing)?/i,
  /anorexia/i,
  /bulimia/i,
  /eat(ing)? disorder/i,
  /calories?/i,
  /purge/i,
  /throwing up/i,
];

// Context phrases indicating emotional distress about food
const CONTEXT_MARKERS = [
  /fear/i,
  /worried/i,
  /anxious/i,
  /stressed?/i,
  /obsess(ed|ion|ing)/i,
  /can'?t stop (think|thinking)/i,
  /hate/i,
  /ashamed/i,
  /guilty/i,
  /control/i,
  /avoid/i,
];

// Food-related small talk phrases
const FOOD_SMALL_TALK = [
  /like to eat/i,
  /favorite food/i,
  /good restaurant/i,
  /cook/i,
  /recipe/i,
  /delicious/i,
  /taste/i,
];

/**
 * Detects potential eating disorder concerns in user messages
 * @param text - User message to analyze
 * @returns Detection result with risk assessment
 */
export const detectEatingDisorderConcerns = (text: string): EatingDisorderDetectionResult => {
  // Default result
  const result: EatingDisorderDetectionResult = {
    isEatingDisorderConcern: false,
    riskLevel: 'low',
    needsImmediate: false,
    matchedPhrases: [],
    contextMarkers: [],
    isLikelySmallTalk: false
  };

  // Match phrases
  for (const pattern of ED_PHRASES) {
    const match = text.match(pattern);
    if (match) {
      result.matchedPhrases.push(match[0]);
    }
  }

  // No matches found
  if (result.matchedPhrases.length === 0) {
    return result;
  }

  // Check for context markers
  for (const marker of CONTEXT_MARKERS) {
    const match = text.match(marker);
    if (match && result.contextMarkers) {
      result.contextMarkers.push(match[0]);
    }
  }

  // Check for small talk context 
  for (const smallTalk of FOOD_SMALL_TALK) {
    if (smallTalk.test(text)) {
      result.isLikelySmallTalk = true;
      break;
    }
  }

  // Determine risk level
  if (result.matchedPhrases.length >= 3) {
    result.riskLevel = 'high';
    result.isEatingDisorderConcern = true;
  } else if (result.matchedPhrases.length >= 1 && result.contextMarkers && result.contextMarkers.length >= 1) {
    result.riskLevel = 'medium';
    result.isEatingDisorderConcern = true;
  } else if (result.matchedPhrases.length >= 1) {
    // At least one match but no distress markers and possible small talk
    if (result.isLikelySmallTalk) {
      result.riskLevel = 'low';
      result.isEatingDisorderConcern = false;
    } else {
      result.riskLevel = 'low';
      result.isEatingDisorderConcern = true;
    }
  }

  // Check for immediate risk phrases
  if (
    /not eaten (in|for) (\d+|a|an|several) (day|week|month)/i.test(text) ||
    /starving (myself|to death)/i.test(text) ||
    /kill(ing)? myself/i.test(text) ||
    /throwing up (all|every)/i.test(text)
  ) {
    result.needsImmediate = true;
    result.riskLevel = 'high';
  }

  return result;
};

/**
 * Determines if a message is casual food-related small talk 
 * rather than a potential concern
 */
export const isFoodSmallTalk = (text: string): FoodSmallTalkResult => {
  const result: FoodSmallTalkResult = {
    isFoodSmallTalk: false,
    confidence: 0
  };

  let smallTalkMatches = 0;
  for (const pattern of FOOD_SMALL_TALK) {
    if (pattern.test(text)) {
      smallTalkMatches++;
    }
  }

  // Check for casual food discussion patterns
  if (
    /what's your favorite/i.test(text) || 
    /do you like/i.test(text) ||
    /recommend/i.test(text) ||
    smallTalkMatches >= 1
  ) {
    result.isFoodSmallTalk = true;
    result.confidence = Math.min(0.3 + (smallTalkMatches * 0.2), 0.9);
    
    if (/restaurant|place to eat|food/i.test(text)) {
      result.context = 'restaurant';
      result.confidence += 0.1;
    } else if (/cook|recipe|make/i.test(text)) {
      result.context = 'cooking';
      result.confidence += 0.1;
    }
  }

  return result;
};
