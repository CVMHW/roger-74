
/**
 * Hallucination Handler Utilities
 * 
 * Common utility functions for hallucination detection and prevention
 */

/**
 * Detect common memory reference patterns that might indicate hallucinations
 */
export const detectMemoryReferencePatterns = (text: string): boolean => {
  // Common patterns that might indicate false memory references
  const patterns = [
    /you (mentioned|said|told me) (earlier|before|previously)/i,
    /as we discussed (earlier|before|previously)/i,
    /in our (previous|last|earlier) (conversation|session|discussion)/i,
    /continuing (from|with) where we left off/i,
    /when we last spoke/i,
    /as I (said|mentioned|noted) (earlier|before|previously)/i
  ];
  
  return patterns.some(pattern => pattern.test(text));
};

/**
 * Determine if this is likely a continuous conversation
 */
export const isContinuousConversation = (
  conversationHistory: string[]
): boolean => {
  // Simple method - just check if we have enough history
  return conversationHistory && conversationHistory.length > 3;
};

/**
 * Add hedging language to potentially hallucinated content
 */
export const addHedging = (text: string): string => {
  // Only add hedging if not already present
  if (/^(It seems|From what I understand|If I'm understanding correctly|Based on|It sounds like)/i.test(text)) {
    return text;
  }
  
  return "From what I understand, " + text;
};
