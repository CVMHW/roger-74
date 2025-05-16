
/**
 * Specialized detectors for eating disorder concerns and food small talk
 */

import { EatingDisorderConcernResult, FoodSmallTalkResult, RiskLevel } from './types';

/**
 * High-sensitivity detector for eating disorder concerns
 * with balanced detection to avoid misclassifying casual food talk
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderConcernResult => {
  // Normalize input for consistent detection
  const normalizedInput = userInput.toLowerCase().trim();
  
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
  const directMatches = directEDPatterns.filter(pattern => pattern.test(normalizedInput));
  if (directMatches.length > 0) {
    highestRiskLevel = 'high';
    matchedPhrases.push(...directMatches.map(r => r.toString()));
  }
  
  // Check body image patterns (high risk)
  const bodyMatches = bodyImagePatterns.filter(pattern => pattern.test(normalizedInput));
  if (bodyMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'high';
    matchedPhrases.push(...bodyMatches.map(r => r.toString()));
  }
  
  // Check control patterns (moderate risk)
  const controlMatches = controlPatterns.filter(pattern => pattern.test(normalizedInput));
  if (controlMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'moderate';
    matchedPhrases.push(...controlMatches.map(r => r.toString()));
  }
  
  // Check distress patterns (low risk if alone, moderate with others)
  const distressMatches = distressPatterns.filter(pattern => pattern.test(normalizedInput));
  if (distressMatches.length > 0) {
    if (highestRiskLevel === 'none') highestRiskLevel = 'low';
    if (matchedPhrases.length > 0 && highestRiskLevel === 'low') highestRiskLevel = 'moderate';
    matchedPhrases.push(...distressMatches.map(r => r.toString()));
  }
  
  // Check for environmental context markers that might increase risk
  const contextMarkers = [
    /alone|lonely|isolated|no support|no help|no one understands/i,
    /depressed|anxious|stressed|overwhelmed|hopeless/i,
    /tried to stop|can'?t stop|getting worse|out of control/i,
    /long time|years|months|weeks|every day|constant/i
  ].filter(pattern => pattern.test(normalizedInput));
  
  // Check specifically for "not eating" or similar strong indicators
  if (/not eating|haven'?t (been )?eat(ing|en)|struggling not eating|can'?t eat|don'?t eat/i.test(normalizedInput)) {
    highestRiskLevel = 'high';
    matchedPhrases.push('not eating');
  }
  
  // Determine if this might be just Cleveland food talk (false positive protection)
  // Using negative lookahead to prevent matching food talk with real concerns
  const isClevelandFoodTalk = /\b(cleveland food|ohio city|tremont|little italy)\b/i.test(normalizedInput) && 
                              !/(not|no) (eat|food)|struggling|hard|difficult|problem|issue|concern|disorder/i.test(normalizedInput);
  
  // Determine final result - if it's likely Cleveland food talk AND risk is low, mark as not a concern
  const isLikelySmallTalk = isClevelandFoodTalk && matchedPhrases.length < 2;
  const isEatingDisorderConcern = (matchedPhrases.length > 0 && !isLikelySmallTalk) || highestRiskLevel === 'high';
  
  return {
    isEatingDisorderConcern,
    riskLevel: isEatingDisorderConcern ? highestRiskLevel : 'none',
    matchedPhrases,
    contextMarkers,
    isLikelySmallTalk
  };
};

/**
 * Food small talk detector for differentiating normal food discussion
 * from eating disorder concerns
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  // Normalize the input
  const normalizedInput = userInput.toLowerCase().trim();
  
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
  
  // Check for explicit mentions of struggling or not eating
  // These should NEVER be treated as small talk!
  if (/not eating|haven'?t (been )?eat(ing|en)|struggling not eating|can'?t eat|don'?t eat/i.test(normalizedInput)) {
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
  const clevelandMatches = clevelandFoodPatterns.filter(pattern => pattern.test(normalizedInput));
  const isClevelandSpecific = clevelandMatches.length > 0;
  
  // Check for general food talk
  const generalFoodMatches = foodSmallTalkPatterns.filter(pattern => pattern.test(normalizedInput));
  
  // Collect food topics mentioned
  const topics: string[] = [
    ...clevelandMatches.map(r => r.toString().replace(/\/.+\/i/, '')),
    ...generalFoodMatches.map(r => r.toString().replace(/\/.+\/i/, ''))
  ];
  
  // Determine if this is food small talk
  // IMPORTANT: Small talk should NEVER include messages about not eating or eating struggles!
  const isSmallTalk = topics.length > 0 && 
                      !/(not|no) (eat|food)|struggling|hard|difficult|problem|issue|concern|disorder|restrictive/i.test(normalizedInput);
  
  return {
    isSmallTalk,
    isClevelandSpecific,
    topics
  };
};

export type { FoodSmallTalkResult };
