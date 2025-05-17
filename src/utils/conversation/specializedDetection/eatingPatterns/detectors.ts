
/**
 * Specialized detectors for eating disorder concerns and food small talk
 * Enhanced with executive control and hallucination prevention
 */

import { EatingDisorderConcernResult, FoodSmallTalkResult, RiskLevel } from './types';

/**
 * High-sensitivity detector for eating disorder concerns
 * with balanced detection to avoid misclassifying casual food talk
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderConcernResult => {
  // Normalize input for consistent detection
  const normalizedInput = userInput.toLowerCase().trim();
  
  // CRITICAL: First check specifically for binge eating or inability to stop eating
  // These are always high risk and should never be treated as small talk
  if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row/i.test(normalizedInput)) {
    return {
      isEatingDisorderConcern: true,
      riskLevel: 'high',
      matchedPhrases: ['compulsive eating', 'binge eating'],
      contextMarkers: ['distress'],
      isLikelySmallTalk: false,
      recommendedApproach: 'crisis-response',
      needsImmediate: true
    };
  }
  
  // CRITICAL: Check specifically for "not eating" concerns
  // These are always high risk and should never be treated as small talk
  if (/not eating|haven't (been )?eat(ing|en)|struggling not eating|can't eat|don't eat/i.test(normalizedInput)) {
    return {
      isEatingDisorderConcern: true,
      riskLevel: 'high',
      matchedPhrases: ['not eating', 'food restriction'],
      contextMarkers: ['distress'],
      isLikelySmallTalk: false,
      recommendedApproach: 'crisis-response',
      needsImmediate: true
    };
  }
  
  // Direct eating disorder phrases - highest priority
  const directEDPatterns = [
    /eating disorder|anorexia|bulimia|binge eating|eating issues|eating problems|purging|purge/i,
    /not eating|haven'?t eaten|can'?t eat|won'?t eat|refusing to eat|starving myself|starve myself/i,
    /restricting food|food restriction|avoiding food|skipping meals|fasting|diet/i
  ];
  
  // Body image concerns - high priority
  const bodyImagePatterns = [
    /body image|hate my body|feel fat|too fat|weight gain|lose weight|gaining weight/i,
    /overweight|underweight|body checking|measuring|weighing myself/i,
    /calories|counting calories|track(ing)? food|tracking calories|weight loss/i
  ];
  
  // Control and behavioral patterns - moderate priority
  const controlPatterns = [
    /control (my )?(food|eating|weight|intake)|food rules|food rituals/i,
    /exercise (too much|excessively|compulsively)|compensate|burning calories/i,
    /afraid of food|fear of food|fear of eating|guilty about eating|ashamed of eating/i
  ];
  
  // General distress signals that could be related - lower priority
  const distressPatterns = [
    /struggling (with|to) eat|hard to eat|difficult to eat|trouble eating/i,
    /(afraid|scared|worried) (of|about) (eating|food|weight|getting fat)/i,
    /food anxiety|meal anxiety|eating anxiety/i
  ];
  
  // Collect all matched phrases for analysis
  const matchedPhrases: string[] = [];
  let highestRiskLevel: RiskLevel = 'none';
  
  // Check direct ED patterns (highest risk)
  const directMatches = directEDPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
    
  if (directMatches.length > 0) {
    highestRiskLevel = 'high';
    matchedPhrases.push(...directMatches);
  }
  
  // Check body image patterns (high risk)
  const bodyMatches = bodyImagePatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
    
  if (bodyMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'high';
    matchedPhrases.push(...bodyMatches);
  }
  
  // Check control patterns (moderate risk)
  const controlMatches = controlPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
    
  if (controlMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'moderate';
    matchedPhrases.push(...controlMatches);
  }
  
  // Check distress patterns (low risk if alone, moderate with others)
  const distressMatches = distressPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
    
  if (distressMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'low';
    if (matchedPhrases.length > 0 && highestRiskLevel === 'low') highestRiskLevel = 'moderate';
    matchedPhrases.push(...distressMatches);
  }
  
  // Check for environmental context markers that might increase risk
  const contextPatterns = [
    /alone|lonely|isolated|no support|no help|no one understands/i,
    /depressed|anxious|stressed|overwhelmed|hopeless/i,
    /tried to stop|can'?t stop|getting worse|out of control/i,
    /long time|years|months|weeks|every day|constant/i
  ];
  
  const contextMarkers: string[] = contextPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
  
  // Determine if this might be just Cleveland food talk (false positive protection)
  // Using negative lookahead to prevent matching food talk with real concerns
  const isClevelandFoodTalk = /\b(cleveland food|ohio city|tremont|little italy)\b/i.test(normalizedInput) && 
                             !/(not|no) (eat|food)|struggling|hard|difficult|problem|issue|concern|disorder/i.test(normalizedInput);
  
  // Determine final result - if it's likely Cleveland food talk AND risk is low, mark as not a concern
  const isLikelySmallTalk = isClevelandFoodTalk && matchedPhrases.length < 2;
  
  // IMPORTANT: Override small talk classification if there's any evidence of distress
  // or if the risk level is high
  const isEatingDisorderConcern = (matchedPhrases.length > 0 && !isLikelySmallTalk) || 
                                highestRiskLevel === 'high' || 
                                contextMarkers.length > 0;
  
  // Determine appropriate approach based on risk level
  let recommendedApproach: 'general-support' | 'specialized-referral' | 'crisis-response' = 'general-support';
  if (highestRiskLevel === 'high') {
    recommendedApproach = 'crisis-response';
  } else if (highestRiskLevel === 'moderate') {
    recommendedApproach = 'specialized-referral';
  }
  
  // Determine if immediate attention is needed
  const needsImmediate = highestRiskLevel === 'high' || 
                       (highestRiskLevel === 'moderate' && contextMarkers.length >= 2);
  
  return {
    isEatingDisorderConcern,
    riskLevel: isEatingDisorderConcern ? highestRiskLevel : 'none',
    matchedPhrases,
    contextMarkers,
    isLikelySmallTalk,
    recommendedApproach,
    needsImmediate
  };
};

/**
 * Food small talk detector for differentiating normal food discussion
 * from eating disorder concerns
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  // Normalize the input
  const normalizedInput = userInput.toLowerCase().trim();
  
  // CRITICAL: First check specifically for binge eating or inability to stop eating
  // These are NEVER small talk and should be treated as eating disorder concerns
  if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row/i.test(normalizedInput)) {
    return {
      isSmallTalk: false,
      isClevelandSpecific: false,
      topics: []
    };
  }
  
  // CRITICAL: Check specifically for NOT eating concerns
  // These are NEVER small talk
  if (/not eating|haven'?t (been )?eat(ing|en)|struggling not eating|can'?t eat|don'?t eat/i.test(normalizedInput)) {
    return {
      isSmallTalk: false,
      isClevelandSpecific: false,
      topics: []
    };
  }
  
  // First check if this contains any eating disorder concerns
  // If it does, it's NOT small talk regardless of other content
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && edResult.riskLevel !== 'low') {
    // This is NOT small talk! It's a potential ED concern
    return {
      isSmallTalk: false,
      isClevelandSpecific: false,
      topics: []
    };
  }
  
  // Check for Cleveland-specific food contexts
  const clevelandFoodPatterns = [
    /west side market/i, /little italy/i, /tremont/i, /ohio city/i,
    /pierogi/i, /polish food/i, /corned beef/i, /slyman('s)?/i,
    /great lakes brewing/i, /mitchell's ice cream/i, /melt/i
  ];
  
  // Check for general food small talk
  const foodSmallTalkPatterns = [
    /restaurant|cafe|diner|eatery|bar|pub/i,
    /food scene|dining|cuisine|dishes|menu|chef/i,
    /eat(ing)? out|dinner|lunch|breakfast|brunch|meal/i,
    /cook(ing)?|recipe|bake|kitchen|ingredients/i,
    /favorite food|like to eat|enjoy eating/i
  ];
  
  // Check for Cleveland food mentions
  const clevelandMatches = clevelandFoodPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
    
  const isClevelandSpecific = clevelandMatches.length > 0;
  
  // Check for general food talk
  const generalFoodMatches = foodSmallTalkPatterns
    .filter(pattern => pattern.test(normalizedInput))
    .map(r => r.toString().replace(/\/.+\/i/, ''));
  
  // Collect food topics mentioned
  const topics: string[] = [...clevelandMatches, ...generalFoodMatches];
  
  // Determine if this is food small talk
  // IMPORTANT: Small talk should NEVER include messages about eating concerns!
  const isSmallTalk = topics.length > 0 && 
                    !/(not|no|can't|cant) (eat|food)|struggling|hard|difficult|problem|issue|concern|disorder|restrictive|too much|stop eating|binge/i.test(normalizedInput);
  
  return {
    isSmallTalk,
    isClevelandSpecific,
    topics
  };
};

export type { FoodSmallTalkResult };
