
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

// Import from theSmallStuff module
import {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle,
  generateFirstMessageResponse,
  enhanceRapportInEarlyConversation,
  identifyImmediateConcern as identifySmallStuffConcern,
  generateImmediateConcernResponse as generateSmallStuffConcernResponse,
  generateSmallTalkTransition
} from './theSmallStuff';

// Re-export theSmallStuff functions
export {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle,
  generateFirstMessageResponse,
  enhanceRapportInEarlyConversation,
  identifySmallStuffConcern,
  generateSmallStuffConcernResponse,
  generateSmallTalkTransition
};

// Import from smallTalk module and re-export explicitly
import {
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

// Export smallTalkUtils directly
export * from './smallTalkUtils';

