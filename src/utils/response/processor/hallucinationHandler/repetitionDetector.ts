
/**
 * Repetition detection functionality
 */

import { calculateSimilarity } from './utils';

/**
 * Detect if a response contains repeated phrases
 */
export const detectRepeatedPhrases = (responseText: string): boolean => {
  // Check for exact phrase repetition
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 2) return false;
  
  // Check for similar consecutive sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentSentence = sentences[i].trim().toLowerCase();
    const nextSentence = sentences[i + 1].trim().toLowerCase();
    
    // Compare sentences for similarity
    const similarity = calculateSimilarity(currentSentence, nextSentence);
    if (similarity > 0.7) {
      return true;
    }
  }
  
  // Check for common phrases that repeat
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  // Check for 3-gram, 4-gram, 5-gram repetitions
  for (const n of [3, 4, 5]) {
    if (words.length < n) continue;
    
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      phrases[phrase] = (phrases[phrase] || 0) + 1;
      
      if (phrases[phrase] > 1 && phrase.length > 10) {
        return true;
      }
    }
  }
  
  // Check for specific dangerous repetition patterns
  const dangerousPatterns = [
    /I hear (you'?re|you are) dealing with I hear/i,
    /you may have indicated Just/i,
    /dealing with you may have indicated/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(responseText)) {
      return true;
    }
  }
  
  // Check for repeated memory reference phrases
  const memoryPhrases = ["I remember", "you mentioned", "you told me", "you said", "we discussed"];
  let memoryPhraseCount = 0;
  
  for (const phrase of memoryPhrases) {
    const regex = new RegExp(phrase, 'gi');
    const matches = responseText.match(regex) || [];
    memoryPhraseCount += matches.length;
  }
  
  return memoryPhraseCount > 2;
};
