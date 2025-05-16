
/**
 * Eating Pattern Detection System
 * 
 * Specialized system for differentiating between eating disorder concerns
 * and casual food-related small talk, with high sensitivity to potential ED signals.
 */

// Export detector functions
export { 
  detectEatingDisorderConcerns, 
  isFoodSmallTalk,
} from './detectors';

// Export type from detectors
export type { FoodSmallTalkResult } from './detectors';

// Export response generators
export { 
  generateEatingDisorderResponse, 
  generateFoodSmallTalkResponse 
} from './responseGenerators';

// Export processor
export { processFoodRelatedMessage } from './processor';

// Export types
export type { 
  RiskLevel,
  EatingDisorderConcernResult,
  FoodRelatedMessageResult
} from './types';

