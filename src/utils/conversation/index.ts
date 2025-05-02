
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

// Re-export theSmallStuff functions explicitly to avoid name conflicts
export {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle,
  generateFirstMessageResponse,
  enhanceRapportInEarlyConversation,
  // Rename these to avoid conflicts
  identifyImmediateConcern as identifySmallStuffConcern,
  generateImmediateConcernResponse as generateSmallStuffConcernResponse,
  generateSmallTalkTransition
} from './theSmallStuff';

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
  // Rename these to avoid conflicts with ones from theSmallStuff
  identifyEarlyEngagementConcern,
  generateEarlyEngagementConcernResponse,
  generateWaitingRoomEngagement
} from './earlyEngagement';

// Export culturalConnector functions explicitly
export { generateCulturalConnectionPrompt } from './earlyEngagement/culturalConnector';
export { incorporateRogerPersonality } from './earlyEngagement/culturalConnector';
export { generateConnectionStatement } from './earlyEngagement/culturalConnector';
export { generateTransitionToEric } from './earlyEngagement/culturalConnector';

// Export everything else from smallTalkUtils directly
export * from './smallTalkUtils';
