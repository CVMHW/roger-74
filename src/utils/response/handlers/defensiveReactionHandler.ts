
/**
 * Handler for defensive reactions
 */

import { detectDefensivePatterns } from '../patternDetection';
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

export default {
  handleDefensiveReaction
};
