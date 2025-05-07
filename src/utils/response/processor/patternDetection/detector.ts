
/**
 * Main pattern detection functionality
 */

import { PatternDetectionResult } from './types';
import { repetitivePatterns } from './patterns';
import { calculateAdvancedSimilarity } from './similarityUtils';
import { detectFormulaicBeginnings } from './formulaicDetector';
import { fixRepetitivePattern, generateVariation } from './fixUtils';

/**
 * Detect repetitive patterns in responses
 * Now with enhanced logarithmic similarity detection
 */
export const detectPatterns = (
  currentResponse: string,
  previousResponses: string[] = []
): PatternDetectionResult => {
  // Initialize result
  const result: PatternDetectionResult = {
    isRepetitive: false,
    repetitionScore: 0,
    enhancedResponse: undefined
  };
  
  // If we don't have any previous responses, there can't be repetition
  if (!previousResponses || previousResponses.length === 0) {
    return result;
  }
  
  // Check current response for repetitive patterns
  for (const pattern of repetitivePatterns) {
    if (pattern.regex.test(currentResponse)) {
      // Apply exponential penalty for repetitive phrases using log function
      // log2(2) = 1, log2(4) = 2, log2(8) = 3, making penalties increasingly severe
      result.repetitionScore += Math.log2(4) * 0.5;
      
      // Generate an enhanced version that fixes the repetition
      if (!result.enhancedResponse) {
        result.enhancedResponse = fixRepetitivePattern(currentResponse, pattern.regex);
      }
    }
  }
  
  // Check for formulaic beginnings with advanced similarity detection
  const formulaicBeginnings = detectFormulaicBeginnings(currentResponse);
  if (formulaicBeginnings.hasFormulaicBeginning) {
    // Apply logarithmic penalty
    result.repetitionScore += Math.log2(formulaicBeginnings.count + 1) * 0.4;
    
    // Set enhanced response if we found a way to improve it
    if (formulaicBeginnings.enhancedResponse) {
      result.enhancedResponse = formulaicBeginnings.enhancedResponse;
    }
  }
  
  // Check if the current response is too similar to any previous responses
  // Using logarithmic similarity scoring for more natural results
  let highestSimilarity = 0;
  let mostSimilarResponse = '';
  
  for (const prevResponse of previousResponses) {
    const similarity = calculateAdvancedSimilarity(currentResponse, prevResponse);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarResponse = prevResponse;
    }
  }
  
  // Apply logarithmic penalty based on similarity score
  // As similarity approaches 1, penalty increases dramatically
  if (highestSimilarity > 0.7) { // High similarity threshold
    result.repetitionScore += Math.log2(1 + highestSimilarity * 5) * 0.8;
    
    // If we haven't already enhanced the response, create a varied alternative
    if (!result.enhancedResponse && mostSimilarResponse) {
      result.enhancedResponse = generateVariation(currentResponse, mostSimilarResponse);
    }
  }
  
  // Set isRepetitive flag if repetition score is high enough
  if (result.repetitionScore >= 1.0) {
    result.isRepetitive = true;
  }
  
  return result;
};
