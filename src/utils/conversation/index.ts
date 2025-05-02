
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

// Import the functions we need from theSmallStuff
import {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle,
  generateFirstMessageResponse,
  enhanceRapportInEarlyConversation,
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateSmallTalkTransition
} from './theSmallStuff';

// Re-export theSmallStuff functions explicitly to avoid name conflicts
export {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle,
  generateFirstMessageResponse,
  enhanceRapportInEarlyConversation,
  identifyImmediateConcern as identifySmallStuffConcern,
  generateImmediateConcernResponse as generateSmallStuffConcernResponse,
  generateSmallTalkTransition
};

// Export smallTalk with explicit naming to avoid conflicts
export { 
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts
} from './smallTalk';

// Export specific functions from earlyEngagement to avoid conflicts
export {
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  shouldUseWaitingRoomEngagement,
  // Re-export with original names from waitingRoomEngagement
  identifyImmediateConcern,
  generateImmediateConcernResponse,
  generateWaitingRoomEngagement
} from './earlyEngagement';

// Export culturalConnector functions explicitly from their source file
export { 
  generateCulturalConnectionPrompt,
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric 
} from './earlyEngagement/culturalConnector';

// Export everything else from smallTalkUtils directly
export * from './smallTalkUtils';
