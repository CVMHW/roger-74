
/**
 * Enhanced eating disorder detection system with specific pattern matching
 * to prevent false positives and ensure appropriate crisis detection
 */

// Import types
import { CrisisDetectionResult } from "../../../masterRules/emotionalAttunement/types";

// Define the detection result interface
export interface EatingDisorderDetectionResult {
  isEatingDisorderConcern: boolean;
  riskLevel: 'low' | 'moderate' | 'high';
  matchedPhrases: string[];
  recommendedApproach: 'general-support' | 'specialized-referral' | 'crisis-response';
  needsImmediate: boolean;
  contextMarkers: string[]; // Adding this missing property
  isLikelySmallTalk: boolean; // Adding this missing property
}

// High-risk patterns that indicate severe eating disorder concerns
const highRiskPatterns = [
  /starving (myself|to death)/i,
  /haven'?t eaten (in|for) \d+ days?/i,
  /purge|purging|throwing up (after|everything)/i,
  /(dangerously|critically) (underweight|thin)/i,
  /hospitalized for (anorexia|bulimia|eating)/i,
  /passing out from (hunger|not eating)/i,
  /heart (problems|palpitations|issues) from (eating|purging)/i,
  /suicidal (because of|from) (weight|body|eating)/i
];

// Moderate risk patterns that indicate concerning eating behaviors
const moderateRiskPatterns = [
  /anorexia|bulimia|binge eating disorder/i,
  /hate (my body|how I look|myself)/i,
  /obsessed with (calories|weight|food)/i,
  /(restricting|restricting calories|not eating)/i,
  /excessive exercise|over-exercise|compulsive exercise/i,
  /afraid (of gaining|to eat|of food)/i,
  /weight restoration|re-feeding/i,
  /eating disorder (thoughts|behaviors|symptoms)/i,
  /body dysmorphia|body image issues/i
];

// Mild risk or general eating concern patterns
const mildRiskPatterns = [
  /worried about (weight|eating)/i,
  /diet(ing)?(?! coke| pepsi| soda)/i,
  /weight (concerns|issues|problems)/i,
  /eating (issues|problems|concerns)/i,
  /food (anxiety|stress|worry)/i,
  /body image|body dissatisfaction/i
];

// Exclusion patterns to prevent false positives from casual food mentions
const exclusionPatterns = [
  /restaurant|dinner plans|recipe|cooking|favorite food|tasty|delicious/i,
  /grocery|shopping list|meal prep|lunch break|breakfast/i,
  /diet coke|diet pepsi|diet soda/i,
  /eat out|take out|delivery food/i,
  /food preferences/i
];

/**
 * Detects eating disorder concerns in user input with comprehensive pattern matching
 * to avoid false positives and correctly identify crisis situations
 * 
 * @param userInput The user's message
 * @returns Detection result with risk level and recommended approach
 */
export function detectEatingDisorderConcerns(userInput: string): EatingDisorderDetectionResult {
  // Default result
  const result: EatingDisorderDetectionResult = {
    isEatingDisorderConcern: false,
    riskLevel: 'low',
    matchedPhrases: [],
    recommendedApproach: 'general-support',
    needsImmediate: false,
    contextMarkers: [], // Initialize empty context markers
    isLikelySmallTalk: false // Initialize as not small talk
  };

  // Check for exclusion patterns first
  const hasExclusions = exclusionPatterns.some(pattern => pattern.test(userInput));
  
  // If this is casual food talk, return early
  if (hasExclusions && 
      !highRiskPatterns.some(pattern => pattern.test(userInput)) && 
      !moderateRiskPatterns.some(pattern => pattern.test(userInput)) &&
      !userInput.toLowerCase().includes('disorder')) {
    result.isLikelySmallTalk = true;
    return result;
  }

  // Check for high risk patterns (most serious)
  for (const pattern of highRiskPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      result.isEatingDisorderConcern = true;
      result.riskLevel = 'high';
      result.matchedPhrases.push(match[0]);
      result.recommendedApproach = 'crisis-response';
      result.needsImmediate = true;
      result.contextMarkers.push('high-risk-language');
    }
  }

  // Check for moderate risk patterns if no high risk was found
  if (result.riskLevel !== 'high') {
    for (const pattern of moderateRiskPatterns) {
      const match = userInput.match(pattern);
      if (match) {
        result.isEatingDisorderConcern = true;
        result.riskLevel = 'moderate';
        result.matchedPhrases.push(match[0]);
        result.recommendedApproach = 'specialized-referral';
        result.contextMarkers.push('moderate-risk-language');
      }
    }
  }

  // Check for mild risk patterns if no higher risks were found
  if (result.riskLevel === 'low' && !result.isEatingDisorderConcern) {
    for (const pattern of mildRiskPatterns) {
      const match = userInput.match(pattern);
      if (match) {
        result.isEatingDisorderConcern = true;
        result.matchedPhrases.push(match[0]);
        result.contextMarkers.push('mild-risk-language');
      }
    }
  }

  // Add context markers for direct mentions of eating disorders
  if (/eating disorder|anorexia|bulimia|binge eating/i.test(userInput)) {
    result.contextMarkers.push('explicit-ed-mention');
  }

  // Check if this might be casual food talk despite matches
  result.isLikelySmallTalk = hasExclusions && result.riskLevel === 'low';
  
  return result;
}

/**
 * Determines if a message is casual food small talk rather than a concerning pattern
 * 
 * @param userInput User's message
 * @returns Whether the message is about casual food enjoyment
 */
export function isFoodSmallTalk(userInput: string): FoodSmallTalkResult {
  const result: FoodSmallTalkResult = {
    isSmallTalk: false,
    isClevelandSpecific: false,
    topics: []
  };
  
  // Check if this is Cleveland-specific food context
  const clevelandFoodPatterns = [
    /west side market|little italy|tremont|ohio city/i,
    /pierogi|polish food|corned beef|slyman/i,
    /great lakes brewing|mitchell's ice cream|melt/i,
    /cleveland food scene|lakewood restaurants/i
  ];
  
  for (const pattern of clevelandFoodPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      result.isClevelandSpecific = true;
      result.topics.push(match[0]);
    }
  }
  
  // Check for general food small talk patterns
  const foodSmallTalkPatterns = [
    /(?<!eating disorder|purge|binge)(?:restaurant|dinner plans|recipe|cooking|favorite food)/i,
    /(?<!eating disorder|purge|binge)(?:grocery|shopping list|meal prep|lunch break|breakfast)/i,
    /(?<!eating disorder|purge|binge)(?:diet coke|diet pepsi|diet soda|eat out|take out|delivery food)/i,
    /(?<!eating disorder|purge|binge)(?:food preferences|delicious|tasty|yummy|flavor)/i
  ];
  
  for (const pattern of foodSmallTalkPatterns) {
    const match = userInput.match(pattern);
    if (match) {
      result.isSmallTalk = true;
      result.topics.push(match[0]);
    }
  }
  
  // If we have Cleveland-specific food mentions, it's likely food small talk
  if (result.isClevelandSpecific) {
    result.isSmallTalk = true;
  }
  
  // If we have explicit eating disorder mentions, it's not small talk
  if (/eating disorder|anorexia|bulimia|binge eating|purge|starve/i.test(userInput)) {
    result.isSmallTalk = false;
  }
  
  return result;
}

// Define the FoodSmallTalkResult interface
export interface FoodSmallTalkResult {
  isSmallTalk: boolean;
  isClevelandSpecific: boolean;
  topics: string[];
}
