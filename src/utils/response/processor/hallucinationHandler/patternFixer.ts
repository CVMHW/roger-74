
/**
 * Pattern Fixer for Hallucination Handler
 * 
 * Fixes dangerous repetition patterns that might indicate hallucinations
 */

/**
 * Fixes dangerous repetition patterns in responses
 */
export const fixDangerousRepetitionPatterns = (
  response: string,
  userInput: string
): { fixedResponse: string; hasRepetitionIssue: boolean } => {
  // Simple repetition detection and fixing
  const sentences = response.split(/(?<=[.!?])\s+/);
  let hasRepetitionIssue = false;
  
  // If we have multiple sentences, check for exact duplicates
  if (sentences.length > 1) {
    const uniqueSentences = Array.from(new Set(sentences));
    
    // If we found and removed duplicates, rejoin the sentences
    if (uniqueSentences.length < sentences.length) {
      hasRepetitionIssue = true;
      return { 
        fixedResponse: uniqueSentences.join(' '),
        hasRepetitionIssue: true
      };
    }
  }
  
  // Check for dangerous repetition patterns
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i
  ];
  
  let fixedResponse = response;
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(fixedResponse)) {
      fixedResponse = fixedResponse.replace(pattern, (match) => {
        hasRepetitionIssue = true;
        // Get the first part of the repetitive pattern
        const parts = match.split(/\s+/);
        const firstHalf = parts.slice(0, parts.length / 2).join(' ');
        return firstHalf;
      });
    }
  }
  
  return {
    fixedResponse,
    hasRepetitionIssue
  };
};
