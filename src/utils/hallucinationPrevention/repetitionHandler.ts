
/**
 * Repetition detection and fixing
 */

/**
 * Check if response contains repeated content
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for common repetition patterns
  const repetitionPatterns = [
    /(I hear|It sounds like) you('re| are) .{3,30}(I hear|It sounds like) you('re| are)/i,
    /(you mentioned|you said|you told me) .{3,30}(you mentioned|you said|you told me)/i,
    /(I understand|I recognize) that you're .{3,30}(I understand|I recognize) that you're/i,
    /you('re| are) feeling .{3,30}you('re| are) feeling/i,
    /(thank you for|I appreciate) .{3,30}(thank you for|I appreciate)/i
  ];
  
  // Check for any pattern match
  return repetitionPatterns.some(pattern => pattern.test(responseText));
};

/**
 * Fix repeated content in response
 */
export const fixRepeatedContent = (responseText: string): string => {
  let fixedResponse = responseText;
  
  // Fix common repetition patterns
  const repetitionPatterns = [
    {
      pattern: /(I hear|It sounds like) you('re| are) (.{3,30})(I hear|It sounds like) you('re| are)/i,
      replacement: '$1 you$2 $3'
    },
    {
      pattern: /(you mentioned|you said|you told me) (.{3,30})(you mentioned|you said|you told me)/i,
      replacement: '$1 $2'
    },
    {
      pattern: /(I understand|I recognize) that you're (.{3,30})(I understand|I recognize) that you're/i,
      replacement: '$1 that you\'re $2'
    },
    {
      pattern: /you('re| are) feeling (.{3,30})you('re| are) feeling/i,
      replacement: 'you$1 feeling $2'
    },
    {
      pattern: /(thank you for|I appreciate) (.{3,30})(thank you for|I appreciate)/i,
      replacement: '$1 $2'
    }
  ];
  
  // Apply each pattern replacement
  for (const {pattern, replacement} of repetitionPatterns) {
    fixedResponse = fixedResponse.replace(pattern, replacement);
  }
  
  // Clean up any resulting artifacts
  fixedResponse = fixedResponse
    .replace(/\s{2,}/g, ' ')
    .replace(/\. \./g, '.')
    .replace(/,\s*\./g, '.')
    .replace(/,\s*,/g, ',');
  
  return fixedResponse;
};

/**
 * Generate a fallback response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I hear what you're sharing. Can you tell me more about how you're feeling about this?",
    "That sounds meaningful. What aspects of this are most important for you to talk about?", 
    "Thank you for telling me this. What would be most helpful to focus on right now?",
    "I appreciate you sharing that with me. What parts of this have been most difficult?"
  ];
  
  // Select a recovery response pseudo-randomly
  const index = Math.floor(Date.now() % recoveryResponses.length);
  return recoveryResponses[index];
};
