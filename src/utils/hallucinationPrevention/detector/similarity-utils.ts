
/**
 * Similarity utilities for hallucination detection
 */

/**
 * Calculate string similarity using a hybrid approach
 */
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Quick length check
  if (Math.abs(str1.length - str2.length) > 0.5 * Math.max(str1.length, str2.length)) {
    return 0;
  }
  
  // For very short strings, use exact match
  if (str1.length < 5 || str2.length < 5) {
    return str1.toLowerCase() === str2.toLowerCase() ? 1 : 0;
  }
  
  // Tokenize and calculate word overlap
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 2 && words2.includes(word)) {
      matchCount++;
    }
  }
  
  // Calculate similarity score
  return matchCount / Math.max(words1.length, words2.length);
};

/**
 * Find the common prefix of two strings
 */
export const commonPrefix = (str1: string, str2: string): string => {
  let i = 0;
  const maxLen = Math.min(str1.length, str2.length);
  
  while (i < maxLen && str1[i] === str2[i]) {
    i++;
  }
  
  return str1.substring(0, i);
};

/**
 * Check if word is a common function word to filter out
 */
export const isCommonWord = (word: string): boolean => {
  const commonWords = ["the", "a", "an", "in", "on", "at", "for", "to", "with", "by", "and", "or", "but",
    "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", 
    "will", "would", "can", "could", "may", "might", "must", "should", "i", "you", "he", "she", "it",
    "we", "they", "me", "him", "her", "us", "them"];
  
  return commonWords.includes(word.toLowerCase());
};
