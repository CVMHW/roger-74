
/**
 * Utility functions for hallucination detection and correction
 */

/**
 * Calculate similarity between two text strings
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  // Check length first
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap for basic similarity
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

/**
 * Helper: Check if word is a common function word to filter out
 */
export const isCommonWord = (word: string): boolean => {
  const commonWords = ["the", "a", "an", "in", "on", "at", "for", "to", "with", "by", "and", "or", "but",
    "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", 
    "will", "would", "can", "could", "may", "might", "must", "should", "i", "you", "he", "she", "it",
    "we", "they", "me", "him", "her", "us", "them"];
  
  return commonWords.includes(word.toLowerCase());
};
