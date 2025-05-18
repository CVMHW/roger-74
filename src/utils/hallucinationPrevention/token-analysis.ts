
/**
 * Token analysis utilities for hallucination detection
 */

/**
 * Analyze token patterns in text
 */
export const analyzeTokenPatterns = (text: string): any => {
  // Simplified token analysis implementation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  
  return {
    sentenceCount: sentences.length,
    wordCount: words.length,
    averageSentenceLength: words.length / Math.max(1, sentences.length),
    hasRepeatedPhrases: checkForRepeatedPhrases(text)
  };
};

/**
 * Check for repeated phrases in text
 */
const checkForRepeatedPhrases = (text: string): boolean => {
  // Get all phrases of 3+ words
  const phrases = extractPhrases(text, 3);
  
  // Check for duplicates
  for (let i = 0; i < phrases.length; i++) {
    for (let j = i + 1; j < phrases.length; j++) {
      if (phrases[i].toLowerCase() === phrases[j].toLowerCase()) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Extract phrases of specific word count
 */
const extractPhrases = (text: string, minWordCount: number): string[] => {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const phrases: string[] = [];
  
  for (let i = 0; i <= words.length - minWordCount; i++) {
    const phrase = words.slice(i, i + minWordCount).join(' ');
    phrases.push(phrase);
  }
  
  return phrases;
};

/**
 * Calculate statistical properties of text
 */
export const calculateTextStats = (text: string): any => {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chars = text.replace(/\s+/g, '').length;
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    charCount: chars,
    averageWordLength: chars / Math.max(1, words.length),
    averageSentenceLength: words.length / Math.max(1, sentences.length)
  };
};
