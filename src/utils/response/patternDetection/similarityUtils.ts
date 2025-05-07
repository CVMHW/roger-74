
/**
 * Utilities for calculating text similarity
 */

/**
 * Calculate text similarity between two strings
 */
export const calculateSimilarity = (text1: string, text2: string): number => {
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matchCount = 0;
  
  for (const word1 of words1) {
    if (words2.includes(word1)) {
      matchCount++;
    }
  }
  
  // Calculate similarity ratio
  return words1.length > 0 ? matchCount / words1.length : 0;
};
