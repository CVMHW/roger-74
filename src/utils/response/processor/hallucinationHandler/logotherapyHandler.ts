
/**
 * Logotherapy Hallucination Handler
 * 
 * Special handling for preventing hallucinations in logotherapy-related responses
 */

import { MemoryPiece } from '../../../../memory/memoryBank';

/**
 * Checks if a logotherapy response contains hallucinations
 */
export const checkLogotherapyHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[]
): boolean => {
  // Check for unsupported existential claims
  if (containsUnsupportedExistentialClaims(response)) {
    return true;
  }
  
  // Check for inappropriate meaning attributions
  if (containsInappropriateMeaningAttributions(response, userInput)) {
    return true;
  }
  
  // Check for hallucinatory life events
  if (containsHallucinatoryLifeEvents(response, conversationHistory)) {
    return true;
  }
  
  return false;
};

/**
 * Check for unsupported claims about life meaning or purpose
 */
const containsUnsupportedExistentialClaims = (response: string): boolean => {
  const unsupportedClaimPatterns = [
    /the meaning of (your|one's) life is/i,
    /your purpose is (clearly|obviously|definitely)/i,
    /you (should|must|need to) find meaning in/i,
    /the reason for your existence is/i
  ];
  
  return unsupportedClaimPatterns.some(pattern => pattern.test(response));
};

/**
 * Check for inappropriate attributions of meaning to user's experiences
 */
const containsInappropriateMeaningAttributions = (
  response: string, 
  userInput: string
): boolean => {
  // This happens when Roger assigns meaning to something without patient input
  const attributionPatterns = [
    /this (suffering|challenge|difficulty) means that/i,
    /the (meaning|purpose|significance) of (this|your) (situation|experience) is/i,
    /this happened (to you|in your life) (because|so that)/i
  ];
  
  // If user mentioned looking for meaning, attributions are more acceptable
  const userSeekingMeaning = /meaning|purpose|why.+happen|reason for/i.test(userInput);
  
  // If user is seeking meaning, be more permissive
  if (userSeekingMeaning) {
    return false;
  }
  
  return attributionPatterns.some(pattern => pattern.test(response));
};

/**
 * Check for hallucinatory life events in logotherapy context
 */
const containsHallucinatoryLifeEvents = (
  response: string,
  conversationHistory: string[]
): boolean => {
  // Extract specific life events mentioned in response
  const lifeEventPatterns = [
    /when you (experienced|went through|faced) ([^,.]+)/i,
    /your (past|previous) (experience|encounter) with ([^,.]+)/i,
    /during your ([^,.]+) (experience|journey|challenge)/i
  ];
  
  // Extract potential hallucinated events
  for (const pattern of lifeEventPatterns) {
    const matches = response.match(pattern);
    if (matches && matches.length > 2) {
      const potentialEvent = matches[2].toLowerCase().trim();
      
      // Skip very short events (less likely to be specific hallucinations)
      if (potentialEvent.length < 5) continue;
      
      // Check if this event is mentioned in conversation history
      const isEventInHistory = conversationHistory.some(msg => 
        msg.toLowerCase().includes(potentialEvent)
      );
      
      if (!isEventInHistory) {
        // Potential hallucination detected
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fix logotherapy hallucinations in a response
 */
export const fixLogotherapyHallucinations = (
  response: string,
  memories: MemoryPiece[]
): string => {
  let fixed = response;
  
  // Fix unsupported existential claims
  fixed = replaceUnsupportedExistentialClaims(fixed);
  
  // Fix inappropriate meaning attributions
  fixed = replaceInappropriateMeaningAttributions(fixed);
  
  // Fix hallucinatory life events
  fixed = replaceHallucinatoryLifeEvents(fixed, memories);
  
  return fixed;
};

/**
 * Replace unsupported existential claims
 */
const replaceUnsupportedExistentialClaims = (response: string): string => {
  let fixed = response;
  
  // Replace definitive meaning statements with reflective questions
  fixed = fixed.replace(
    /the meaning of (your|one's) life is ([^,.]+)/gi,
    "you might find it helpful to explore what meaning feels right for you"
  );
  
  fixed = fixed.replace(
    /your purpose is (clearly|obviously|definitely) ([^,.]+)/gi,
    "discovering your own sense of purpose is a personal journey"
  );
  
  fixed = fixed.replace(
    /you (should|must|need to) find meaning in ([^,.]+)/gi,
    "some people find it helpful to reflect on what brings meaning to their lives"
  );
  
  return fixed;
};

/**
 * Replace inappropriate meaning attributions
 */
const replaceInappropriateMeaningAttributions = (response: string): string => {
  let fixed = response;
  
  // Replace attributions with reflective questions
  fixed = fixed.replace(
    /this (suffering|challenge|difficulty) means that ([^,.]+)/gi,
    "I wonder what this $1 means to you"
  );
  
  fixed = fixed.replace(
    /the (meaning|purpose|significance) of (this|your) (situation|experience) is ([^,.]+)/gi,
    "what do you think the $1 of this $3 might be for you"
  );
  
  return fixed;
};

/**
 * Replace hallucinatory life events
 */
const replaceHallucinatoryLifeEvents = (response: string, memories: MemoryPiece[]): string => {
  let fixed = response;
  
  // For each potential life event pattern
  const lifeEventPatterns = [
    [/when you (experienced|went through|faced) ([^,.]+)/gi, "when people face challenges like this"],
    [/your (past|previous) (experience|encounter) with ([^,.]+)/gi, "past experiences"],
    [/during your ([^,.]+) (experience|journey|challenge)/gi, "during difficult times"]
  ];
  
  for (const [pattern, replacement] of lifeEventPatterns) {
    fixed = fixed.replace(pattern as RegExp, replacement as string);
  }
  
  return fixed;
};

// Export main functions
export default {
  checkLogotherapyHallucinations,
  fixLogotherapyHallucinations
};
