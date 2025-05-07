
/**
 * Pattern Detection Module for Response Processor
 * 
 * Detects patterns in responses to prevent repetition and enhance variety
 * ENHANCED with logarithmic pattern detection for more natural responses
 */

// Export main functionality
export { detectPatterns } from './detector';

// Export utility functions
export { calculateAdvancedSimilarity } from './similarityUtils';
export { detectFormulaicBeginnings } from './formulaicDetector';
export { fixRepetitivePattern, generateVariation } from './fixUtils';

// Export types
export type { PatternDetectionResult, FormulaicBeginningResult } from './types';

// Export patterns for reuse
export { repetitivePatterns, formulaicPhrases } from './patterns';
