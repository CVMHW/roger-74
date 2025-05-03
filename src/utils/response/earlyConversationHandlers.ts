import {
  generateSmallTalkResponse,
  isLikelyChild,
  isLikelyNewcomer
} from '../conversation/smallTalk';

import {
  generateCulturalConnectionPrompt,
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric
} from '../conversation/earlyEngagement/culturalConnector';

// Import these from smallTalk directly to avoid issues
import { 
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  identifyImmediateConcern,
  generateImmediateConcernResponse
} from '../conversation/smallTalk';

/**
 * Early Conversation Handlers
 * 
 * This module provides utility functions for handling early conversations,
 * including small talk, cultural connections, and immediate concerns.
 */

/**
 * Generates an appropriate response for early conversations
 */
export const generateEarlyConversationResponse = (
  userInput: string,
  messageCount: number
): string => {
  // Prioritize immediate concerns
  const immediateConcern = identifyImmediateConcern(userInput);
  if (immediateConcern) {
    return generateImmediateConcernResponse(userInput, immediateConcern);
  }
  
  // Check if we should use waiting room engagement
  // if (shouldUseWaitingRoomEngagement(userInput, messageCount)) {
  //   return generateWaitingRoomEngagement(messageCount, userInput);
  // }
  
  // Generate small talk response
  const smallTalkResponse = generateSmallTalkResponse(userInput, messageCount);
  if (smallTalkResponse) {
    return smallTalkResponse;
  }
  
  // Generate cultural connection prompt
  if (messageCount <= 5) {
    const culturalConnectionPrompt = generateCulturalConnectionPrompt();
    if (culturalConnectionPrompt) {
      return culturalConnectionPrompt;
    }
  }
  
  // Default response
  return "I'm here to chat while you wait. How are you feeling today?";
};

export default {
  generateEarlyConversationResponse
};
