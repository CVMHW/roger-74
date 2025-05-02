
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
export * from './earlyEngagement';
export * from './generalResponses';
// Export smallTalk with explicit naming to avoid conflicts
export { 
  isLikelyChild,
  isLikelyNewcomer,
  detectSocialOverstimulation,
  smallTalkTopics,
  conversationStarters,
  turnTakingPrompts
} from './smallTalk';
// Export everything else from smallTalkUtils directly
export * from './smallTalkUtils';
export * from './theSmallStuff';
