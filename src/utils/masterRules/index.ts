
/**
 * Master Rules System
 * 
 * Central export point for all master rules that govern Roger's behavior
 */

// Export unconditional rule protections
export {
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation,
} from './unconditionalRuleProtections';

// Re-export with explicit naming to resolve ambiguity
import {
  isIntroduction as isIntroductionUnconditional,
  isSmallTalk as isSmallTalkUnconditional,
  isPersonalSharing as isPersonalSharingUnconditional,
  generateIntroductionResponse as generateIntroductionResponseUnconditional,
  generatePersonalSharingResponse as generatePersonalSharingResponseUnconditional
} from './unconditionalRuleProtections';

// Re-export with distinct names
export {
  isIntroductionUnconditional as isIntroduction,
  isSmallTalkUnconditional as isSmallTalk,
  isPersonalSharingUnconditional as isPersonalSharing,
  generateIntroductionResponseUnconditional as generateIntroductionResponse,
  generatePersonalSharingResponseUnconditional as generatePersonalSharingResponse
};

// Export other rule systems
export * from './conversationRules';
export * from './clinicalProtections';
export * from './emotionalAttunementRules';
