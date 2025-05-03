
/**
 * Repetition detection and handling
 * 
 * Identifies and fixes repeated content in responses
 */

/**
 * Check if response has repeated content that needs fixing
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for exactly repeated sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Need at least 3 sentences to check for repetition patterns
  if (sentences.length < 3) {
    return false;
  }
  
  // Look for exact repetitions
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateSimilarity(sentences[i], sentences[j]);
      if (similarity > 0.85) {
        return true;
      }
    }
  }
  
  // Check for repeated phrases
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  for (let i = 0; i <= words.length - 4; i++) {
    const phrase = words.slice(i, i + 4).join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
    
    // If we find the same 4-word phrase repeated, it's a sign of repetition
    if (phrases[phrase] > 1 && phrase.length > 10) {
      return true;
    }
  }
  
  return false;
};

/**
 * Fix repeated content by keeping only unique sentences
 */
export const fixRepeatedContent = (responseText: string, userInput: string = ''): string => {
  // Split into sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Keep only sentences that aren't too similar to previous ones
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    let isDuplicate = false;
    
    for (const existingSentence of uniqueSentences) {
      const similarity = calculateSimilarity(sentence, existingSentence);
      if (similarity > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence.trim());
    }
  }
  
  // Recombine the unique sentences
  return uniqueSentences.join(". ") + ".";
};

/**
 * Calculate similarity between two text strings
 */
export const calculateSimilarity = (str1: string, str2: string): number => {
  // Check length first
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap for basic similarity
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};
