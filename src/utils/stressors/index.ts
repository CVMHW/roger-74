
/**
 * Stressors Index
 * 
 * Central export point for all stressor-related functionality
 */

// Export from stressorTypes
export * from './stressorTypes';

// Export from stressorDetection
export {
  detectStressors,
  getPrimaryStressor,
  containsStressorKeywords
} from './stressorDetection';

// Export from stressorMemory
export * from './stressorMemory';

// Export from stressorData (renamed to avoid conflicts)
export {
  getAllStressors,
  getStressorById
} from './stressorData';

// Export from adultStressorData
export {
  getAllAdultStressors,
  getAdultStressorById,
  findRelatedAdultStressors
} from './adultStressorData';

// Export utility functions with renamed exports to avoid conflicts
export {
  findRelatedStressors as findStressorRelationships
} from './stressorDetection';

export {
  getStressorsByCategory as getStressorsByCategoryType 
} from './stressorDetection';
