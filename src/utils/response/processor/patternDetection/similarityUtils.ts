
/**
 * Utilities for calculating text similarity
 */

/**
 * Calculate advanced similarity between two texts using a logarithmic approach
 * for more natural similarity detection
 */
export const calculateAdvancedSimilarity = (text1: string, text2: string): number => {
  // Basic length check as optimization
  if (Math.abs(text1.length - text2.length) > text1.length * 0.5) {
    return 0;
  }
  
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Skip common function words to focus on content
  const skipWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'of', 'for', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'can', 'could', 'will', 'would', 'should', 'may',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that'
  ]);
  
  // Filter out common words
  const contentWords1 = words1.filter(w => !skipWords.has(w) && w.length > 2);
  const contentWords2 = words2.filter(w => !skipWords.has(w) && w.length > 2);
  
  // Count matching words with logarithmic weighting
  let matchScore = 0;
  const uniqueWords1 = new Set(contentWords1);
  
  for (const word of uniqueWords1) {
    if (contentWords2.includes(word)) {
      // Words that appear in both texts contribute to similarity
      // Use log function to make each additional match worth less
      matchScore += 1 / Math.log2(contentWords2.filter(w => w === word).length + 2);
    }
  }
  
  // Calculate similarity ratio with logarithmic normalization
  const maxPossibleScore = Math.min(uniqueWords1.size, new Set(contentWords2).size);
  return maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0;
};
