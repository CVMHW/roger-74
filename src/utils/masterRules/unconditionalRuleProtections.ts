
/**
 * Unconditional Rule Protections
 * 
 * These rules MUST be followed in ALL Roger interactions without exception.
 * They are the foundation of the therapeutic relationship and cannot be overridden.
 */

// Re-export from core rules
export { 
  UNCONDITIONAL_RULES,
  getEarlyEngagementMandate,
  shouldPrioritizeCulturalAttunement 
} from './core/coreRules';

// Re-export from validation
export {
  validateUnconditionalRules,
  validatesSubclinicalConcerns
} from './validation/responseValidation';

// Re-export from topic detection
export {
  shouldPrioritizeSmallTalk,
  isSubclinicalConcern,
  isIntroduction,
  isSmallTalk,
  isPersonalSharing
} from './detection/topicDetection';

// Re-export from response generators
export {
  generateIntroductionResponse,
  generatePersonalSharingResponse
} from './generators/responseGenerators';

// Re-export from safety utilities
export {
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation
} from './safety/safetyUtils';
