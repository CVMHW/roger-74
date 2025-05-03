
/**
 * Conversation Utilities
 * 
 * Central export point for all conversation-related utilities
 */

// Direct exports from main modules
export * from './clientCenteredApproach';
export * from './collaborativeResponseGenerator';
export * from './collaborativeSupportPrinciples';
export * from './contextAware';
export * from './cvmhwInfo';
export * from './cvmhwResponseGenerator';

// Import directly from smallTalkUtils
export * from './smallTalkUtils';

// Import and re-export from smallTalk
import {
  generateSmallTalkResponse,
  isEnhancedSmallTalk,
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts,
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  shouldUseWaitingRoomEngagement,
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateWaitingRoomEngagement,
  isWaitingRoomRelated,
  generateWaitingRoomResponse,
  shouldUseSmallTalk
} from './smallTalk';

// Re-export smallTalk functions
export {
  generateSmallTalkResponse,
  isEnhancedSmallTalk,
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts,
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  shouldUseWaitingRoomEngagement,
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateWaitingRoomEngagement,
  isWaitingRoomRelated,
  generateWaitingRoomResponse,
  shouldUseSmallTalk
};

// Import and export culturalConnector functions
import { 
  generateCulturalConnectionPrompt,
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric 
} from './earlyEngagement/culturalConnector';

export {
  generateCulturalConnectionPrompt,
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric 
};
