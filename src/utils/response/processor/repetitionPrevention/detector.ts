
/**
 * Repetition detection functionality
 */

import { computeNGramSimilarities } from './similarityUtils';
import { RepetitionDetectionResult } from './types';

/**
 * Detect if response has harmful repetitive patterns
 */
export const detectHarmfulRepetitions = (responseText: string): RepetitionDetectionResult => {
  // Initialize result
  const result = {
    hasRepetition: false,
    repetitionType: '',
    repetitionScore: 0,
    segments: [] as string[]
  };
  
  // Split into sentences for analysis
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  
  // 1. Check for exact duplicate sentences
  const uniqueSentences = new Set(sentences);
  if (uniqueSentences.size < sentences.length) {
    result.hasRepetition = true;
    result.repetitionType = 'duplicate_sentences';
    result.repetitionScore = 1.0; // Highest severity
    result.segments = Array.from(uniqueSentences); // Keep only unique sentences
  }
  
  // 2. Check for repeated phrases with mathematical similarity
  // Use overlapping n-grams (3-5 words) to detect phrase repetitions
  const ngramSimilarities = computeNGramSimilarities(responseText);
  if (ngramSimilarities.highSimilarityFound) {
    result.hasRepetition = true;
    result.repetitionType = 'similar_phrases';
    result.repetitionScore = Math.max(result.repetitionScore, 0.8);
    result.segments = ngramSimilarities.segments;
  }
  
  // 3. Check for "stutter patterns" - immediate repetition of words/phrases
  const stutterRegex = /(\b\w+\b)(\s+\1\b){1,}/g;
  if (stutterRegex.test(responseText)) {
    result.hasRepetition = true;
    result.repetitionType = 'stutter';
    result.repetitionScore = Math.max(result.repetitionScore, 0.9);
  }
  
  // 4. Check for formulaic repetition like "Based on X... Based on X"
  const formulaicPhrases = [
    /Based on what (you('re| are)|you've been) (sharing|saying)/i,
    /From what you('ve| have) shared/i,
    /I hear (what|that) you('re| are) (sharing|saying)/i,
    /It sounds like you('re| are)/i
  ];
  
  let formulaicCount = 0;
  for (const pattern of formulaicPhrases) {
    const matches = responseText.match(pattern);
    if (matches && matches.length > 1) {
      formulaicCount += matches.length - 1;
      result.hasRepetition = true;
      result.repetitionType += ' formulaic';
      result.repetitionScore = Math.max(result.repetitionScore, 0.95);
    }
  }
  
  return result;
};
