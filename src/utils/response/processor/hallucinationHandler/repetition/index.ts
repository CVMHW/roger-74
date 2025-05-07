
/**
 * Repetition detection system for hallucination handler
 * 
 * Provides functionality to detect and analyze repetitive patterns
 * in conversational responses
 */

// Export the main detector functions
export { detectRepeatedPhrases, analyzeRepetitionPatterns } from './detector';

// Export types for external use
export type { RepetitionDetectionResult } from './types';

// Export pattern collections
export { dangerousPatterns, memoryPhrases } from './patterns';

// Export analyzer functions
export { 
  analyzeSentenceSimilarity,
  analyzeNGramRepetition,
  analyzeMemoryReferences
} from './phraseAnalyzer';
