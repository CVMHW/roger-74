
/**
 * Memory utilities for logotherapy integration
 */

/**
 * Verify if memory is being properly utilized in responses
 */
export const verifyLogotherapyMemoryUtilization = (
  userInput: string,
  response: string,
  conversationHistory: string[] = []
): boolean => {
  // Check for memory-related phrases in the response
  const memoryPhrases = [
    "I remember",
    "you mentioned",
    "you said",
    "you told me",
    "you shared",
    "earlier you",
    "previously you",
    "as you noted",
    "as you expressed"
  ];

  return memoryPhrases.some(phrase => response.toLowerCase().includes(phrase.toLowerCase()));
};
