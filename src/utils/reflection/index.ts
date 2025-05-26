
/**
 * Main export for reflection utilities
 * Centralized exports to avoid naming conflicts
 */

// Export core types from reflectionTypes (primary source)
export type { 
  ConcernType, 
  ConversationStage, 
  DevelopmentalStage,
  TraumaResponseAnalysis,
  ReflectionPhrases,
  ReflectionPrinciple,
  SeverityLevel,
  FeelingCategory
} from './reflectionTypes';

// Export specialized types that don't conflict
export type { 
  PatientMemory,
  ContextAwareReflection,
  ChildEmotionCategory,
  ChildWheelEmotionData
} from './core/types';

// Export functions and utilities
export { 
  identifyFeelings,
  identifyEnhancedFeelings,
  detectAgeAppropriateEmotions,
  extractContextualElements,
  recordToMemory,
  getAllMemory,
  getContextualMemory
} from './feelingDetection';

// Export feeling categories data
export { 
  FEELING_WORDS,
  feelingCategories
} from './core/feelingCategories';

// Export other utilities
export * from './generators/reflectionResponseGenerator';
export * from './principles/reflectionPrinciples';
export * from './reflectionStrategies';
