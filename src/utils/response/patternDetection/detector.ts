
/**
 * Main pattern detection functionality
 */

import { PatternDetectionResult } from './types';
import { getSentenceStructure, calculateStructureSimilarity } from './sentenceAnalyzer';
import { extractQuestions } from './questionExtractor';
import { calculateSimilarity } from './similarityUtils';

/**
 * Detects patterns in conversation that might indicate repetition or staleness
 */
export const detectConversationPatterns = (
  currentResponse: string,
  previousResponses: string[] = [],
  userMessages: string[] = []
): PatternDetectionResult => {
  const result: PatternDetectionResult = {
    isRepetitive: false,
    detectedPatterns: [],
    repetitionScore: 0,
    recommendations: {
      increaseSpontaneity: false,
      changeApproach: false,
      forcePerspectiveShift: false
    }
  };
  
  // If we don't have enough history, return default result
  if (previousResponses.length === 0) {
    return result;
  }
  
  // Check for common repetitive phrases
  const repetitivePatterns = [
    {
      regex: /I notice I may have been repeating myself/i,
      pattern: 'meta-acknowledgment',
      weight: 1.0
    },
    {
      regex: /It seems like you shared that/i,
      pattern: 'generic-acknowledgment',
      weight: 1.0
    },
    {
      regex: /I'd like to focus specifically on/i,
      pattern: 'redirection-attempt',
      weight: 0.8
    },
    {
      regex: /I hear you('re| are) feeling/i,
      pattern: 'feeling-reflection',
      weight: 0.7
    },
    {
      regex: /would you like to tell me more about/i,
      pattern: 'generic-prompt',
      weight: 0.6
    },
    {
      regex: /that sounds (difficult|challenging|hard)/i,
      pattern: 'generic-empathy',
      weight: 0.5
    }
  ];
  
  // Check current response for these patterns
  for (const pattern of repetitivePatterns) {
    if (pattern.regex.test(currentResponse)) {
      result.detectedPatterns.push(pattern.pattern);
      result.repetitionScore += pattern.weight;
    }
  }
  
  // Now check if these patterns were also in previous responses
  for (const pattern of repetitivePatterns) {
    for (const prevResponse of previousResponses) {
      if (pattern.regex.test(prevResponse) && pattern.regex.test(currentResponse)) {
        // Double the weight for repeated patterns
        result.repetitionScore += pattern.weight;
        if (!result.detectedPatterns.includes(`repeated-${pattern.pattern}`)) {
          result.detectedPatterns.push(`repeated-${pattern.pattern}`);
        }
      }
    }
  }
  
  // Check for sentence structure repetition
  const currentStructure = getSentenceStructure(currentResponse);
  const previousStructures = previousResponses.map(getSentenceStructure);
  
  for (let i = 0; i < previousStructures.length; i++) {
    const similarity = calculateStructureSimilarity(currentStructure, previousStructures[i]);
    if (similarity > 0.6) { // Threshold for similar structure
      result.repetitionScore += 0.5;
      result.detectedPatterns.push('similar-sentence-structure');
      break;
    }
  }
  
  // Check for question repetition
  const currentQuestions = extractQuestions(currentResponse);
  
  for (const prevResponse of previousResponses) {
    const prevQuestions = extractQuestions(prevResponse);
    
    for (const currentQ of currentQuestions) {
      for (const prevQ of prevQuestions) {
        if (calculateSimilarity(currentQ, prevQ) > 0.7) { // Threshold for similar questions
          result.repetitionScore += 0.8;
          result.detectedPatterns.push('repeated-question');
          break;
        }
      }
    }
  }
  
  // Set final result based on repetition score
  if (result.repetitionScore >= 1.0) {
    result.isRepetitive = true;
    
    // Set recommendations based on score
    result.recommendations = {
      increaseSpontaneity: true,
      changeApproach: result.repetitionScore >= 1.5,
      forcePerspectiveShift: result.repetitionScore >= 2.0
    };
  }
  
  return result;
};
