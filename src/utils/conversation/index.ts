
/**
 * Conversation Utilities
 * 
 * Central export point for all conversation-related utilities
 */

export * from './clientCenteredApproach';
export * from './collaborativeResponseGenerator';
export * from './collaborativeSupportPrinciples';
export * from './contextAware';
export * from './cvmhwInfo';
export * from './cvmhwResponseGenerator';

// Import and re-export from theSmallStuff
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

// Re-export theSmallStuff functions explicitly to avoid name conflicts
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

// Import and export smallTalk functions correctly
import {
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts
} from './smallTalk';

export {
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts
};

// Export specific functions from earlyEngagement
import {
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  shouldUseWaitingRoomEngagement,
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateWaitingRoomEngagement
} from './smallTalk';

export {
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  shouldUseWaitingRoomEngagement,
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateWaitingRoomEngagement
};

// Export culturalConnector functions explicitly from their source file
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

// Export everything else from smallTalkUtils directly
export * from './smallTalkUtils';
