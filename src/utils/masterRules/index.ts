
/**
 * Master Rules System
 * 
 * Central export point for all master rules that govern Roger's behavior
 */

// Import from unconditionalRuleProtections
import {
  isIntroduction as isIntroductionUnconditional,
  isSmallTalk as isSmallTalkUnconditional,
  isPersonalSharing as isPersonalSharingUnconditional,
  generateIntroductionResponse as generateIntroductionResponseUnconditional,
  generatePersonalSharingResponse as generatePersonalSharingResponseUnconditional,
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation
} from './unconditionalRuleProtections';

// Re-export with distinct names to avoid conflicts
export {
  isIntroductionUnconditional as isIntroduction,
  isSmallTalkUnconditional as isSmallTalk,
  isPersonalSharingUnconditional as isPersonalSharing,
  generateIntroductionResponseUnconditional as generateIntroductionResponse,
  generatePersonalSharingResponseUnconditional as generatePersonalSharingResponse,
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation
};

// Export response approach selection system
export { selectResponseApproach, adjustApproachForConversationFlow } from '../response/processor/approachSelector';

// Export other rule systems
export * from './conversationRules';
export * from './clinicalProtections';
export * from './emotionalAttunementRules';
