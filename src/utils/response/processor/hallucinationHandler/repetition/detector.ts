
/**
 * Main repetition detection functionality
 */

import { DetectionPattern, RepetitionDetectionResult } from './types';
import { dangerousPatterns, memoryPhrases } from './patterns';
import { 
  analyzeSentenceSimilarity, 
  analyzeNGramRepetition,
  analyzeMemoryReferences
} from './phraseAnalyzer';

/**
 * Detect if a response contains repeated phrases
 */
export const detectRepeatedPhrases = (responseText: string): boolean => {
  // Check for sentence similarity
  if (analyzeSentenceSimilarity(responseText)) {
    return true;
  }
  
  // Check for N-gram repetitions
  if (analyzeNGramRepetition(responseText)) {
    return true;
  }
  
  // Check for pattern matches
  for (const pattern of dangerousPatterns) {
    if (pattern.regex.test(responseText)) {
      console.log(`REPETITION DETECTED: Pattern matched: ${pattern.description}`);
      return true;
    }
  }
  
  // Check for repeated memory reference phrases
  if (analyzeMemoryReferences(responseText, memoryPhrases)) {
    return true;
  }
  
  return false;
};

/**
 * Get detailed repetition analysis
 */
export const analyzeRepetitionPatterns = (responseText: string): RepetitionDetectionResult => {
  const result: RepetitionDetectionResult = {
    hasRepetition: false,
    patterns: [],
    severity: 'low'
  };
  
  // Check for dangerous patterns
  for (const pattern of dangerousPatterns) {
    if (pattern.regex.test(responseText)) {
      result.hasRepetition = true;
      result.patterns.push(pattern.description);
      result.severity = 'high';
    }
  }
  
  // Check for N-gram repetitions
  if (analyzeNGramRepetition(responseText)) {
    result.hasRepetition = true;
    result.patterns.push('n-gram phrase repetition');
    result.severity = 'medium';
  }
  
  // Check for memory phrase repetition
  if (analyzeMemoryReferences(responseText, memoryPhrases)) {
    result.hasRepetition = true;
    result.patterns.push('multiple memory references');
    result.severity = result.severity === 'high' ? 'high' : 'medium';
  }
  
  return result;
};
