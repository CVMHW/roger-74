
/**
 * Pattern Detection Module for Response Processor
 * 
 * Detects patterns in responses to prevent repetition and enhance variety
 */

/**
 * Detect repetitive patterns in responses
 */
export const detectPatterns = (
  currentResponse: string,
  previousResponses: string[] = []
): {
  isRepetitive: boolean;
  repetitionScore: number;
} => {
  // Initialize result
  const result = {
    isRepetitive: false,
    repetitionScore: 0
  };
  
  // If we don't have any previous responses, there can't be repetition
  if (!previousResponses || previousResponses.length === 0) {
    return result;
  }
  
  // Common repetitive phrases that might indicate patterns
  const repetitivePatterns = [
    /I notice I may have been repeating myself/i,
    /It seems like you shared that/i,
    /I'd like to focus specifically on/i,
    /I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i,
    /Would you like to tell me more\? Would you like to tell me more\?/i
  ];
  
  // Check current response for these patterns
  for (const pattern of repetitivePatterns) {
    if (pattern.test(currentResponse)) {
      result.repetitionScore += 0.5;
    }
  }
  
  // Check if the current response is too similar to any previous responses
  for (const prevResponse of previousResponses) {
    const similarity = calculateSimilarity(currentResponse, prevResponse);
    if (similarity > 0.7) { // High similarity threshold
      result.repetitionScore += 0.8;
    }
  }
  
  // Set isRepetitive flag if repetition score is high enough
  if (result.repetitionScore >= 1.0) {
    result.isRepetitive = true;
  }
  
  return result;
};

/**
 * Calculate simple text similarity between two strings
 */
const calculateSimilarity = (text1: string, text2: string): number => {
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
