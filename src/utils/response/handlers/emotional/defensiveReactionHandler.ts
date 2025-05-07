
/**
 * Defensive Reaction Handler
 * 
 * Detects and responds to defensive reactions patients may have
 * when mental health concerns are mentioned.
 */

import { generateDeescalationResponse } from '../../../../utils/responseUtils';

/**
 * Patterns that suggest a defensive reaction to mental health suggestions
 */
const defensiveReactionPatterns = [
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

/**
 * Checks if user message contains defensive reactions
 * @param userInput User message text
 * @returns True if defensive reaction detected
 */
const isDefensiveReaction = (userInput: string): boolean => {
  return defensiveReactionPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Creates an appropriate response to defensive reactions
 * @param userInput User message text
 * @returns Response text if defensive reaction detected, null otherwise
 */
export const createDefensiveReactionResponse = (userInput: string): string | null => {
  if (!isDefensiveReaction(userInput)) {
    return null;
  }

  // Tailor response based on specific patterns
  if (/not crazy/i.test(userInput)) {
    return "I would never suggest that you're 'crazy.' I believe in listening to your experiences without labels. What matters is how you're feeling and what would be helpful for you right now.";
  }
  
  if (/don'?t need (therapy|help)/i.test(userInput)) {
    return "You know yourself best, and I respect your perspective on what you need. I'm here to listen and support you in whatever way feels helpful to you.";
  }
  
  if (/stop (saying|telling|suggesting)/i.test(userInput)) {
    return "I apologize if anything I've said has felt presumptuous. I want to make sure I'm understanding you correctly. Could you tell me more about what's on your mind?";
  }
  
  if (/nothing('?s| is) wrong with me/i.test(userInput)) {
    return "I don't believe there's anything 'wrong' with you. Everyone faces challenges at times, and talking through experiences is just one way some people find helpful. What would be most useful for you right now?";
  }
  
  if (/offensive|insulting/i.test(userInput)) {
    return "I apologize for causing offense. That was not my intention at all. I value your perspective and want to understand better how I can support you in a way that feels respectful and helpful.";
  }
  
  // Default de-escalation response
  return generateDeescalationResponse(userInput);
};
