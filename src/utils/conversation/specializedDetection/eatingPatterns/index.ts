
/**
 * Eating Pattern Detection System
 * 
 * Specialized system for differentiating between eating disorder concerns
 * and casual food-related small talk, with high sensitivity to potential ED signals.
 */

// Export detector functions
export { 
  detectEatingDisorderConcerns, 
  isFoodSmallTalk
} from './detectors';

// Export types
export type { 
  EatingDisorderDetectionResult,
  FoodSmallTalkResult
} from './detectors';

// Export processor
export { 
  processFoodRelatedMessage,
  type FoodProcessingResult
} from './processor';

// Export common types
export type { 
  RiskLevel,
  FoodResponseType,
  EatingDisorderConcernResult,
  FoodRelatedMessageResult
} from './types';
