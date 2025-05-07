
/**
 * Analyzer for detecting phrase repetition in responses
 */

import { calculateSimilarity } from '../utils';

/**
 * Analyze sentences for similarity and repetition
 */
export const analyzeSentenceSimilarity = (responseText: string): boolean => {
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 2) return false;
  
  // Check for similar consecutive sentences
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentSentence = sentences[i].trim().toLowerCase();
    const nextSentence = sentences[i + 1].trim().toLowerCase();
    
    const similarity = calculateSimilarity(currentSentence, nextSentence);
    if (similarity > 0.7) {
      console.log("REPETITION DETECTED: High similarity between consecutive sentences");
      return true;
    }
  }
  
  return false;
};

/**
 * Analyze N-grams for repeated phrases
 */
export const analyzeNGramRepetition = (responseText: string): boolean => {
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  // Check for 3-gram, 4-gram, 5-gram repetitions
  for (const n of [3, 4, 5]) {
    if (words.length < n) continue;
    
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ');
      phrases[phrase] = (phrases[phrase] || 0) + 1;
      
      if (phrases[phrase] > 1 && phrase.length > 10) {
        console.log("REPETITION DETECTED: Repeated n-gram phrase:", phrase);
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Analyze memory reference phrases
 */
export const analyzeMemoryReferences = (responseText: string, memoryPhrases: string[]): boolean => {
  let memoryPhraseCount = 0;
  
  for (const phrase of memoryPhrases) {
    const regex = new RegExp(phrase, 'gi');
    const matches = responseText.match(regex) || [];
    memoryPhraseCount += matches.length;
    
    if (matches.length > 1) {
      console.log("REPETITION DETECTED: Multiple memory phrases:", phrase);
      return true;
    }
  }
  
  return memoryPhraseCount > 2;
};
