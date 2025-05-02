
/**
 * Early Engagement Utilities
 * 
 * Specialized tools for creating engaging initial responses (messages 1-10)
 * when patients are waiting for their appointment with Eric.
 */

export * from './waitingRoomEngagement';
export * from './culturalConnector';
export * from './personalityUtilization';

/**
 * Demographic detection functions for tailoring early engagement
 */

/**
 * Detects if the user is likely a teenager based on language patterns
 */
export const isLikelyTeen = (userInput: string): boolean => {
  const teenPatterns = [
    /school|class|teacher|homework|grade|campus/i,
    /parent|mom|dad|brother|sister/i,
    /snapchat|tiktok|insta(gram)?|youtube/i,
    /bro|dude|literally|like|whatever|ugh|lol|omg/i
  ];
  
  // Count matches for teen patterns
  const matchCount = teenPatterns.filter(pattern => pattern.test(userInput)).length;
  return matchCount >= 1;
};

/**
 * Detects if the user is likely male based on language patterns
 * Note: Used only for adapting conversation style, not for assumptions
 */
export const isLikelyMale = (userInput: string): boolean => {
  // This is a simplified heuristic and should be used carefully
  const maleIndicators = [
    /\b(?:as a|i'?m a|being a) (?:man|guy|dude|father|husband|boyfriend|male)/i,
    /\bmy (?:wife|girlfriend|son|daughter)\b/i,
    /\b(?:beard|shave|prostate)\b/i
  ];
  
  return maleIndicators.some(pattern => pattern.test(userInput));
};

/**
 * Detects if the user likely has a blue-collar job or background
 * Used to tailor communication style appropriately
 */
export const isLikelyBlueCollar = (userInput: string): boolean => {
  const blueCollarPatterns = [
    /\b(?:factory|construction|trade|tools|manual|labor|site|shift|truck|machine|equipment|warehouse|foreman|contractor|union|safety|ppe|hazard|overtime|apprentice)\b/i,
    /\b(?:work with my hands|physical work|hard work|working class|blue collar)\b/i
  ];
  
  return blueCollarPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Checks if the user might benefit from simpler language based on their communication
 */
export const mightPreferSimpleLanguage = (userInput: string): boolean => {
  // Note: This is not about intelligence but about communication preferences
  const simpleLanguagePreferencePatterns = [
    /don'?t understand|confused by|what does that mean|too complicated|big words|explain simply/i,
    /speak (?:plain|simple|normal|english|clearly)/i
  ];
  
  return simpleLanguagePreferencePatterns.some(pattern => pattern.test(userInput));
};

/**
 * Returns an appropriate conversation style based on detected user characteristics
 */
export const getAppropriateConversationStyle = (
  userInput: string
): string => {
  if (isLikelyTeen(userInput)) {
    return "teen";
  } else if (isLikelyMale(userInput) && isLikelyBlueCollar(userInput)) {
    return "blue_collar_male";  
  } else if (isLikelyMale(userInput)) {
    return "male";
  } else if (isLikelyBlueCollar(userInput)) {
    return "blue_collar";
  } else if (mightPreferSimpleLanguage(userInput)) {
    return "simplified";
  }
  
  return "general";
};

/**
 * Explicit exports of the functions that were previously implicitly exported
 * from waitingRoomEngagement.ts to avoid naming conflicts
 */
export { identifyImmediateConcern as identifyEarlyEngagementConcern } from './waitingRoomEngagement';
export { generateImmediateConcernResponse as generateEarlyEngagementConcernResponse } from './waitingRoomEngagement';
