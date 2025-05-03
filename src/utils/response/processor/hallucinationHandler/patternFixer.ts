
/**
 * Pattern Fixer for Hallucination Handler
 * 
 * Fixes dangerous repetition patterns that might indicate hallucinations
 */

/**
 * Fixes dangerous repetition patterns in responses
 */
export const fixDangerousRepetitionPatterns = (response: string): string => {
  // Simple repetition detection and fixing
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // If we have multiple sentences, check for exact duplicates
  if (sentences.length > 1) {
    const uniqueSentences = Array.from(new Set(sentences));
    
    // If we found and removed duplicates, rejoin the sentences
    if (uniqueSentences.length < sentences.length) {
      return uniqueSentences.join(' ');
    }
  }
  
  return response;
};
