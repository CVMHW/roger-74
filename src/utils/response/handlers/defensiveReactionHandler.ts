
/**
 * Handler for defensive reactions
 */

// Create our own pattern detection logic since it doesn't exist in the other file
const defensivePatterns = [
  /I('?m| am) not crazy/i,
  /I don'?t need (therapy|help|a therapist|medication|meds)/i,
  /stop (saying|telling me|suggesting) I('?m| am|'?ve| have) (mental|crazy|ill)/i,
  /nothing('?s| is) wrong with me/i,
  /don'?t (psychoanalyze|diagnose) me/i,
  /I('?m| am) fine/i,
  /not everything is (mental health|a disorder|depression|anxiety)/i,
  /you('?re| are) (making|being|getting) (me angry|annoying|pushy)/i,
  /that('?s| is) (offensive|insulting)/i,
  /stop (pushing|insisting)/i
];

// Create our own detection function
const detectDefensivePatterns = (userInput: string): string[] => {
  const matches: string[] = [];
  defensivePatterns.forEach(pattern => {
    if (pattern.test(userInput)) {
      matches.push(pattern.toString());
    }
  });
  return matches;
};

import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles defensive reactions from users
 */
export const handleDefensiveReaction = (
  userInput: string,
  conversationHistory: string[]
): string | null => {
  // Detect defensive patterns in the user's message
  const defensePatterns = detectDefensivePatterns(userInput);
  
  if (defensePatterns.length > 0) {
    // Handle defensive reactions with appropriate responses
    return generateDefensiveReactionResponse(userInput, defensePatterns);
  }
  
  return null;
};

/**
 * Generate appropriate responses to defensive reactions
 */
const generateDefensiveReactionResponse = (
  userInput: string, 
  defensivePatterns: string[]
): string => {
  // If the user feels judged or criticized
  if (defensivePatterns.some(pattern => /judge|judging|criticized|attacking/i.test(pattern))) {
    return "I appreciate you letting me know how my response came across. That wasn't my intention, and I value your feedback. I'm here to understand and support you, not to judge.";
  }
  
  // If the user feels misunderstood
  if (defensivePatterns.some(pattern => /misunderstood|didn't understand|not listening/i.test(pattern))) {
    return "I can see I've misunderstood something important. I'd like to better understand your perspective. Could you help me see what I missed?";
  }
  
  // Generic defensive reaction response
  return "I notice there might be some tension in our conversation. That's completely understandable. I'm here to support you, and I'm open to shifting our conversation in whatever way would be most helpful for you.";
};

// Create a function for de-escalation since it was missing
const generateDeescalationResponse = (userInput: string): string => {
  return "I appreciate your honesty. Let's take a step back. I'm here to support you in whatever way is most helpful, and I want to make sure I understand your perspective correctly.";
};

export default {
  handleDefensiveReaction
};
