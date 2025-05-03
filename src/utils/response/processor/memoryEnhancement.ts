
/**
 * Memory Enhancement
 * 
 * Enhances responses with memory awareness and context
 */

/**
 * Enhance a response with memory awareness
 */
export const enhanceResponseWithMemory = ({
  response,
  userInput,
  conversationHistory = []
}: {
  response: string;
  userInput: string;
  conversationHistory?: string[];
}): string => {
  try {
    // Basic checks for early conversation issues
    const isEarlyConversation = conversationHistory.length < 3;
    
    if (isEarlyConversation) {
      // For early conversation, remove any claims about past discussions
      return removeEarlyConversationMemoryReferences(response);
    }
    
    // Check for memory references that might be inaccurate
    if (hasMemoryReference(response)) {
      // Add hedging language for memory references
      return addHedgingForMemoryReferences(response);
    }
    
    // No issues detected, return original
    return response;
    
  } catch (error) {
    console.error("Error enhancing response with memory:", error);
    return response;
  }
};

/**
 * Check if response contains memory references
 */
const hasMemoryReference = (response: string): boolean => {
  const memoryPhrases = [
    /you (mentioned|said|told me)/i,
    /earlier you/i,
    /previously you/i,
    /you've been telling me/i,
    /we (discussed|talked about)/i,
    /I remember/i,
    /as you (said|mentioned|noted)/i
  ];
  
  return memoryPhrases.some(phrase => phrase.test(response));
};

/**
 * Remove memory references from early conversation responses
 */
const removeEarlyConversationMemoryReferences = (response: string): string => {
  let modified = response;
  
  // Replace memory claims with present-focused language
  modified = modified
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared");
  
  // If we've made changes, ensure the response flows naturally
  if (modified !== response) {
    // Clean up any awkward transitions that might have been created
    modified = modified
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  return modified;
};

/**
 * Add hedging language for memory references
 */
const addHedgingForMemoryReferences = (response: string): string => {
  // If the response already starts with hedging language, return as-is
  if (/^(It seems|From what I understand|If I'm understanding correctly|It sounds like)/i.test(response)) {
    return response;
  }
  
  // Add hedging prefix based on response content
  if (response.includes("you mentioned") || response.includes("you said")) {
    return "From what I understand, " + response;
  }
  
  if (response.includes("we discussed") || response.includes("we talked about")) {
    return "Based on our conversation, " + response;
  }
  
  if (response.includes("I remember")) {
    return "It sounds like " + response.replace(/I remember/i, "you've shared");
  }
  
  // For other memory references, add general hedging
  return "It seems that " + response;
};
