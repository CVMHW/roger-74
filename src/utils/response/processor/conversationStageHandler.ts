
/**
 * Conversation stage handling functionality
 * Manages early vs established conversation processing
 */

import { getConversationMessageCount } from '../../memory/newConversationDetector';

/**
 * Apply early conversation RAG
 */
export const applyEarlyConversationRAG = (
  response: string,
  userInput: string
): string => {
  // Remove any false continuity claims
  let modified = response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
  
  // Add hedging language for early conversations
  if (!modified.startsWith("It sounds like") && !modified.startsWith("I understand")) {
    modified = "Based on what you're sharing, " + modified;
  }
  
  return modified;
};

/**
 * Apply special handling for early conversation stages
 */
export const applyConversationStageProcessing = (
  processedResponse: string,
  userInput: string,
  isEarlyConversation: boolean
): string => {
  // For early conversations (first 1-2 messages), apply special RAG
  if (isEarlyConversation) {
    return applyEarlyConversationRAG(
      processedResponse, 
      userInput
    );
  }
  
  return processedResponse;
};

/**
 * Determine if the conversation is in early stage
 */
export const determineConversationStage = (): {
  isEarlyConversation: boolean;
  messageCount: number;
} => {
  // Get accurate message count from conversation detector
  const actualMessageCount = getConversationMessageCount();
  
  // CRITICAL: Check for early conversation - be extra careful with memory references
  const isEarlyConversation = actualMessageCount <= 2;
  
  return {
    isEarlyConversation,
    messageCount: actualMessageCount
  };
};
