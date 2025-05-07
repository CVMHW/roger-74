
/**
 * This file imports and re-exports all specialized response handlers
 * for backward compatibility with existing imports
 */

import {
  createSadnessResponse,
  createDefensiveReactionResponse,
  createWeatherRelatedResponse,
  createTraumaResponseMessage,
  createMildGamblingResponse,
  createOhioContextResponse
} from './handlers';

// Export eating pattern handlers
import {
  handleEatingPatterns,
  enhanceEatingDisorderResponse,
  needsSpecializedEatingResponseHandling
} from './handlers/eatingPatternHandler';

export {
  createSadnessResponse,
  createDefensiveReactionResponse,
  createWeatherRelatedResponse,
  createTraumaResponseMessage,
  createMildGamblingResponse,
  createOhioContextResponse,
  // Export eating pattern handlers
  handleEatingPatterns,
  enhanceEatingDisorderResponse,
  needsSpecializedEatingResponseHandling
};
