
/**
 * Memory Hallucination Handler
 * 
 * Specialized handler for memory-related hallucinations
 */

/**
 * Handles memory-related hallucinations in responses
 */
export const handleMemoryHallucinations = (
  response: string,
  conversationHistory: string[] = []
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  // Check if this is early in conversation
  const isEarlyConversation = conversationHistory.length < 3;
  
  // For early conversations, be extra cautious about memory claims
  if (isEarlyConversation && hasMemoryReference(response)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: fixFalseMemoryReferences(response)
    };
  }
  
  // For established conversations, just do basic checks
  if (hasMemoryReference(response)) {
    // Add hedging language for memory claims
    return {
      requiresStrictPrevention: false,
      processedResponse: "From what I understand, " + response
    };
  }
  
  return {
    requiresStrictPrevention: false,
    processedResponse: response
  };
};

/**
 * Check if response contains memory references
 */
const hasMemoryReference = (text: string): boolean => {
  return /you (mentioned|said|told me|indicated)|earlier you|previously you|we (discussed|talked about)|I remember|as you (mentioned|said|noted)|we've been/i.test(text);
};

/**
 * Fixes false memory references in responses
 */
export const fixFalseMemoryReferences = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared");
};
