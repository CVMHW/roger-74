
/**
 * Memory Enhancement
 * 
 * Enhances responses with memory awareness and context
 */

import { hasValidConversationHistory } from '../../memory/fiveResponseMemory';

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
    // Check if we actually have valid conversation history
    const hasValidHistory = hasValidConversationHistory();
    const isEarlyConversation = conversationHistory.length < 3;
    
    // For new conversations or early conversations, prevent memory references
    if (!hasValidHistory || isEarlyConversation) {
      console.log("MEMORY ENHANCEMENT: Preventing false memory references in new/early conversation");
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
    /as you (said|mentioned|noted)/i,
    /drawing from our previous conversation/i,
    /from our conversation/i
  ];
  
  return memoryPhrases.some(phrase => phrase.test(response));
};

/**
 * Remove memory references from early conversation responses
 */
const removeEarlyConversationMemoryReferences = (response: string): string => {
  let modified = response;
  
  console.log("MEMORY ENHANCEMENT: Removing false memory references");
  
  // Replace memory claims with present-focused language
  modified = modified
    .replace(/Drawing from our previous conversation,?\s*/gi, "")
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared")
    .replace(/I remember you mentioned about/gi, "you mentioned")
    .replace(/from our conversation/gi, "from what you're telling me");
  
  // Clean up any awkward sentence starts
  modified = modified
    .replace(/^,?\s*Emotional Regulation:/gi, "Emotional Regulation:")
    .replace(/^,?\s*/gi, "")
    .replace(/\s+/g, ' ')
    .trim();
  
  // If the response starts with a topic like "Emotional Regulation:" without context, add intro
  if (/^[A-Z][^.]*:\s*The ability/.test(modified)) {
    modified = "Let's talk about " + modified.toLowerCase();
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

/**
 * Enhance with memory bank integration
 * Used by the enhancer
 */
export const enhanceWithMemoryBank = (
  response: string,
  userInput: string,
  relevantMemories: any[] = [],
  conversationHistory: string[] = []
): string => {
  // If no relevant memories found, return original response
  if (!relevantMemories || relevantMemories.length === 0) {
    return response;
  }
  
  // Check if we already have memory references
  if (hasMemoryReference(response)) {
    return response;
  }
  
  // Get top memory
  const topMemory = relevantMemories[0];
  
  // Create a memory reference
  const memoryText = topMemory.content || "";
  const memoryPreview = memoryText.substring(0, 30) + (memoryText.length > 30 ? "..." : "");
  
  // Add a natural memory reference
  return `Based on what you've shared about ${memoryPreview}, ${response}`;
};

/**
 * Process attention results from multi-head attention system
 * Used by attentionProcessor
 */
export const processAttentionResults = (
  userInput: string,
  attentionResults: any
): void => {
  // Process and utilize attention results
  console.log("Processing attention results for input:", userInput.substring(0, 20));
};

/**
 * Verify memory utilization in response
 * Used by rule processing
 */
export const verifyMemoryUtilization = (
  userInput: string, 
  response: string, 
  conversationHistory: string[] = []
): boolean => {
  // Basic check - see if we have memory references when needed
  const needsMemoryReference = conversationHistory.length > 2 && userInput.length > 15;
  
  if (needsMemoryReference) {
    return hasMemoryReference(response) || response.includes("you're saying") || response.includes("you've shared");
  }
  
  return true;
};
