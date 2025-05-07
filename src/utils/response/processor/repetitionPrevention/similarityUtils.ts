
/**
 * String similarity utilities for repetition detection
 */

import { calculateStringSimilarity, commonPrefix, isCommonWord } from '../../../hallucinationPrevention/detector/similarity-utils';

/**
 * Compute N-Gram similarities using computational linguistics
 */
export function computeNGramSimilarities(text: string): {
  highSimilarityFound: boolean;
  segments: string[];
} {
  const words = text.split(/\s+/);
  const result = {
    highSimilarityFound: false,
    segments: [] as string[]
  };
  
  // Skip short texts
  if (words.length < 8) {
    return result;
  }
  
  // Extract 4-grams (groups of 4 consecutive words)
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - 4; i++) {
    ngrams.push(words.slice(i, i + 4).join(' '));
  }
  
  // Check for similar n-grams
  const uniqueNgrams = new Set<string>();
  const segments = new Set<string>();
  
  for (let i = 0; i < ngrams.length; i++) {
    const ngram = ngrams[i].toLowerCase();
    
    // Skip common phrases and very short n-grams
    if (ngram.length < 12 || isCommonPhrase(ngram)) {
      continue;
    }
    
    // Check if we've seen a similar n-gram before
    let foundSimilar = false;
    for (const existingNgram of uniqueNgrams) {
      const similarity = calculateStringSimilarity(ngram, existingNgram);
      
      if (similarity > 0.7) {
        foundSimilar = true;
        result.highSimilarityFound = true;
        
        // Extract the larger context for both n-grams
        const contextStart = Math.max(0, i - 2);
        const contextEnd = Math.min(words.length, i + 6);
        const context = words.slice(contextStart, contextEnd).join(' ');
        
        segments.add(context);
        break;
      }
    }
    
    if (!foundSimilar) {
      uniqueNgrams.add(ngram);
    }
  }
  
  result.segments = Array.from(segments);
  return result;
}

/**
 * Check if a phrase is very common and should be ignored in repetition detection
 */
export function isCommonPhrase(phrase: string): boolean {
  const commonPhrases = [
    'would you like to',
    'tell me more about',
    'i understand that you',
    'i hear what you',
    'you mentioned that you',
    'it sounds like you',
    'i think that',
    'it seems that'
  ];
  
  return commonPhrases.some(common => phrase.includes(common));
}
