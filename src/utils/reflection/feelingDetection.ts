
/**
 * Main export file for feeling detection utilities
 * Re-exports functionality from specialized modules
 */

import { FeelingCategory, DevelopmentalStage } from './reflectionTypes';
import { EnhancedFeelingResult, identifyEnhancedFeelings, identifyFeelings } from './detectors/basicFeelingDetector';
import { detectAgeAppropriateEmotions } from './detectors/ageAppropriateDetector';
import { extractContextualElements } from './detectors/contextExtractor';

// Re-export the primary types and functions
export { 
  identifyFeelings,
  identifyEnhancedFeelings,
  detectAgeAppropriateEmotions,
  extractContextualElements
};

// Re-export the types
export type { EnhancedFeelingResult };
