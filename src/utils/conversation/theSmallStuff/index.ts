
/**
 * theSmallStuff: Everyday Frustrations and Small Talk
 * 
 * This module focuses on detecting and responding to minor, everyday
 * frustrations and engaging in appropriate small talk.
 * 
 * It helps Roger build rapport by acknowledging the "little things"
 * and engaging in light conversation.
 */

// Export everyday frustration utilities
export { 
  detectEverydayFrustration,
  generateEverydayFrustrationResponse 
} from './everydayFrustrationHandler';

// Export small talk utilities
export {
  detectSmallTalkCategory,
  generateSmallTalkResponse,
  generateSmallTalkTransition
} from './smallTalkHandler';

// Export communication style detection utilities
export {
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle
} from './communicationStyleDetection';

// Export early conversation and rapport building utilities
export {
  enhanceRapportInEarlyConversation,
  generateFirstMessageResponse
} from './earlyConversationHandler';

// Export immediate concern handling utilities
export {
  identifyImmediateConcern,
  generateImmediateConcernResponse
} from './immediateConcrernHandler';
