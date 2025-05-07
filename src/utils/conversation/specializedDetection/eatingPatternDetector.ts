/**
 * Eating Pattern Detector
 * 
 * Specialized system for differentiating between eating disorder concerns
 * and casual food-related small talk, with high sensitivity to potential ED signals.
 */

// Keywords and phrases associated with potential eating disorders
const eatingDisorderKeywords = [
  'fat', 'lose weight', 'diet', 'calories', 'burn', 'purge',
  'throw up', 'vomit', 'starve', 'binge', 'guilty', 'disgusting',
  'control', 'exercise', 'laxative', 'cleanse', 'clean eating',
  'restrict', 'hungry', 'thinner', 'skinny'
];

// Common eating disorder phrases to monitor (high sensitivity)
const eatingDisorderPhrases = [
  /I feel fat/i,
  /I need to lose weight/i,
  /I haven'?t eaten (all day|today|since)/i,
  /I ate too much/i,
  /scared of (gaining|weight)/i,
  /hate my body/i,
  /I'?m not (hungry|eating)/i,
  /burn (off|these|the) calories/i,
  /can'?t stop eating/i,
  /feel guilty (after|about|when) eat/i,
  /trying to be (healthier|skinnier|thinner)/i,
  /[Oo]n a diet/i,
  /cutting (out|down) (carbs|food|calories|sugar)/i,
  /(doing|on) a cleanse/i,
  /eat(ing)? clean/i,
  /can'?t control (myself|around food)/i,
  /ate the whole/i,
  /(so|too) full[,]? but (keep|still) eat/i,
  /out of control when I eat/i,
  /make myself (throw|vomit|purge)/i,
  /use laxatives/i,
  /exercise (excessively|too much|after eating)/i,
  /look disgusting/i,
  /[Ii]'?m too (big|fat|heavy)/i,
  /wish I was (thinner|smaller|skinnier)/i,
  /count(ing)? (calories|points|macros)/i,
  /skip(ping|ped) (meals|breakfast|lunch|dinner)/i,
  /food (rules|ritual|routine)/i,
  /weighing myself/i,
  /body (check|checking)/i
];

// Patterns indicating positive/neutral food small talk
const foodSmallTalkPatterns = [
  /love (food|eating|cooking|baking)/i,
  /favorite (food|meal|restaurant|dish|recipe)/i,
  /try(ing)? (a new|this) recipe/i,
  /cook(ing|ed) (dinner|lunch|breakfast)/i,
  /eat(ing)? out/i,
  /restaurant recommendation/i,
  /best place to eat/i,
  /food was (amazing|great|good|delicious)/i,
  /enjoy(ed)? (my meal|dinner|lunch|breakfast)/i,
  /what (should I|to) (eat|have|cook) for/i,
  /grocery shopping/i,
  /food (preference|allergy|sensitivity)/i,
  /vegetarian|vegan|pescatarian|omnivore/i,
  /gluten[- ]free|dairy[- ]free|nut[- ]free/i
];

// Context markers that increase concern level
const contextualRiskMarkers = [
  /always|every day|constantly|never/i, // Absolutist language
  /have to|need to|must|should/i,       // Rigid thinking
  /terrified|scared|afraid|anxious/i,   // Emotional distress
  /avoid|won't allow|can't have/i,      // Restriction language
  /obsess|fixate|think about|worry/i,   // Ruminative thoughts
  /punish|deserve|earn|reward/i,        // Punishment/earning mentality
  /failure|failed|messed up|bad/i,      // Self-criticism
  /weight (gain|loss|change)/i          // Direct weight focus
];

/**
 * Detects potential eating disorder concerns in user input
 * @param userInput User's message
 * @returns Assessment of eating disorder risk level and details
 */
export const detectEatingDisorderConcerns = (userInput: string): {
  isEatingDisorderConcern: boolean;
  riskLevel: 'none' | 'low' | 'moderate' | 'high';
  matchedPhrases: string[];
  contextMarkers: string[];
  isLikelySmallTalk: boolean;
} => {
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
  
  // Check if this is likely just food small talk
  let isLikelySmallTalk = foodSmallTalkPatterns.some(pattern => pattern.test(normalizedInput));
  
  // If there are ED phrases but also small talk patterns, resolve the ambiguity
  // by looking at the overall emotional tone and context
  if (matchCount > 0 && isLikelySmallTalk) {
    // If there are multiple ED signals or context markers, it's not just small talk
    isLikelySmallTalk = matchCount < 1.5 && contextMarkers.length === 0;
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
 * @param userInput User's message
 * @returns Whether the message is primarily food-related small talk
 */
export const isFoodSmallTalk = (userInput: string): {
  isSmallTalk: boolean;
  topics: string[];
} => {
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
  
  // Check if there are any eating disorder concerns
  const { isEatingDisorderConcern } = detectEatingDisorderConcerns(userInput);
  
  // It's food small talk if it matches patterns and doesn't raise ED concerns
  const isSmallTalk = smallTalkMatchCount > 0 && !isEatingDisorderConcern;
  
  return {
    isSmallTalk,
    topics
  };
};

/**
 * Generate an appropriate response for an eating disorder concern
 * based on the detected risk level
 */
export const generateEatingDisorderResponse = (
  userInput: string,
  detectionResult: ReturnType<typeof detectEatingDisorderConcerns>
): string => {
  const { riskLevel, matchedPhrases } = detectionResult;
  
  if (riskLevel === 'high') {
    return "I notice you're talking about food and body image in a way that sounds distressing. These feelings can be really difficult to navigate alone. Would it help to talk about what support might be helpful for you right now?";
  } else if (riskLevel === 'moderate') {
    return "It sounds like you might be having some complicated feelings about food or body image. Those feelings are common, but they can also be challenging. What kind of support would be most helpful for you right now?";
  } else if (riskLevel === 'low') {
    return "I hear you mentioning some thoughts about food and eating. How have these thoughts been affecting you lately?";
  }
  
  // Fallback for unexpected cases
  return "I'm here to listen about whatever is on your mind, including thoughts about food and eating. What would be most helpful to focus on right now?";
};

/**
 * Generate a food small talk response that's appropriate and supportive
 */
export const generateFoodSmallTalkResponse = (
  userInput: string,
  smallTalkResult: ReturnType<typeof isFoodSmallTalk>
): string => {
  const { topics } = smallTalkResult;
  
  if (topics.length > 0) {
    // Check for specific food topics to personalize response
    if (/cook(ing|ed)|recipe|bak(ing|ed)/i.test(topics.join(' '))) {
      return "Cooking and sharing food can be such a meaningful way to connect. What kinds of things do you enjoy preparing?";
    } else if (/restaurant|eat out|dining/i.test(topics.join(' '))) {
      return "Going to restaurants can be a nice break and chance to try different foods. What types of places do you enjoy visiting?";
    } else if (/favorite|best|love/i.test(topics.join(' '))) {
      return "Food preferences can tell us a lot about ourselves and what we enjoy in life. What else brings you that kind of enjoyment?";
    }
  }
  
  // Default food small talk response
  return "Food is something we all share in common, though we each have our own relationship with it. What other everyday things have been on your mind lately?";
};

/**
 * Main function to process food-related messages and determine appropriate response type
 */
export const processFoodRelatedMessage = (userInput: string): {
  responseType: 'eating_disorder' | 'food_small_talk' | 'not_food_related';
  riskLevel: 'none' | 'low' | 'moderate' | 'high';
  suggestedResponse: string;
} => {
  // First check if this is an eating disorder concern
  const edResult = detectEatingDisorderConcerns(userInput);
  
  if (edResult.isEatingDisorderConcern) {
    return {
      responseType: 'eating_disorder',
      riskLevel: edResult.riskLevel,
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // If not an ED concern, check if it's food small talk
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  if (smallTalkResult.isSmallTalk) {
    return {
      responseType: 'food_small_talk',
      riskLevel: 'none',
      suggestedResponse: generateFoodSmallTalkResponse(userInput, smallTalkResult)
    };
  }
  
  // Otherwise, it's not primarily food-related
  return {
    responseType: 'not_food_related',
    riskLevel: 'none',
    suggestedResponse: ''
  };
};

export default {
  detectEatingDisorderConcerns,
  isFoodSmallTalk,
  processFoodRelatedMessage,
  generateEatingDisorderResponse,
  generateFoodSmallTalkResponse
};
