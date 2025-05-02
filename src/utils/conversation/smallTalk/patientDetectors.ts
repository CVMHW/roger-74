
/**
 * Patient type detector utilities
 * 
 * Functions to detect different types of patients based on their messages,
 * allowing for more tailored communication approaches.
 */

/**
 * Detects if the user is likely a child based on their message
 */
export const isLikelyChild = (userInput: string): boolean => {
  // Import the child detection function from ohioContextManager
  // for consistency across the application
  try {
    const { detectChildPatient } = require('../../conversationEnhancement/ohioContextManager');
    return detectChildPatient(userInput);
  } catch (e) {
    // Fallback if import fails
    const childlikePatterns = [
      /my mom|my dad/i,
      /school|homework|teacher/i,
      /play|game|toy/i,
      /\bcool\b|\bawesome\b|\bfun\b/i,
      /cartoon|pokemon|minecraft|fortnite|roblox/i
    ];
    return childlikePatterns.some(pattern => pattern.test(userInput));
  }
};

/**
 * Detects if the user is likely a newcomer based on their message
 */
export const isLikelyNewcomer = (userInput: string): boolean => {
  // Import the newcomer detection function from ohioContextManager
  // for consistency across the application
  try {
    const { detectNewcomerPatient } = require('../../conversationEnhancement/ohioContextManager');
    return detectNewcomerPatient(userInput);
  } catch (e) {
    // Fallback if import fails
    const newcomerPatterns = [
      /new (to|in) (cleveland|ohio|america|usa|united states)/i,
      /moved (here|to cleveland|to ohio|to america)/i,
      /refugee|immigrant|newcomer/i,
      /learning english|english class|esl/i
    ];
    return newcomerPatterns.some(pattern => pattern.test(userInput));
  }
};
