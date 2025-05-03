
/**
 * Memory Hallucination Handler
 * 
 * Specialized handler for memory-related hallucinations
 */

import { applyEarlyConversationRAG } from './earlyConversation';

/**
 * Handles memory-related hallucinations in responses
 */
export const handleMemoryHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  // Check if this is early in conversation
  const isEarlyConversation = conversationHistory.length < 3;
  
  // For early conversations, be extra cautious about memory claims
  if (isEarlyConversation) {
    return applyEarlyConversationRAG(response, userInput);
  }
  
  // For established conversations, just do basic checks
  if (response.includes("you mentioned") || response.includes("I remember")) {
    // Add hedging language
    return "From what I understand, " + response;
  }
  
  return response;
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
