
/**
 * Token-level analysis for detailed hallucination detection
 */

/**
 * Generates token-level analysis of potential hallucinations
 * 
 * @param text Text to analyze
 * @returns Token-level analysis report
 */
export const generateTokenLevelAnalysis = (text: string): any => {
  // Simple implementation - could be expanded with more sophisticated analysis
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  const analysis = {
    sentenceCount: sentences.length,
    averageSentenceLength: text.length / Math.max(1, sentences.length),
    suspiciousSentences: [] as {sentence: string, reason: string}[]
  };
  
  // Check for potential issues in each sentence
  sentences.forEach(sentence => {
    // Check for unusual repetition
    if (/(I hear|It sounds like|you mentioned|you said).*(I hear|It sounds like|you mentioned|you said)/i.test(sentence)) {
      analysis.suspiciousSentences.push({
        sentence,
        reason: 'Contains repeated phrases'
      });
    }
    
    // Check for very short sentences (potential truncation)
    if (sentence.length < 10 && sentence.length > 0) {
      analysis.suspiciousSentences.push({
        sentence,
        reason: 'Unusually short sentence'
      });
    }
  });
  
  return analysis;
};
