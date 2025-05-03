
/**
 * Conversation Stage Handler
 * 
 * Manages detection and handling of conversation stages
 */

import { getConversationMessageCount } from '../../memory/newConversationDetector';

/**
 * Determine the current conversation stage
 */
export const determineConversationStage = (): {
  isEarlyConversation: boolean;
  messageCount: number;
  stage: 'initial' | 'developing' | 'established';
} => {
  // Get message count from memory system
  const messageCount = getConversationMessageCount();
  
  // Determine conversation stage based on message count
  const isEarlyConversation = messageCount < 3;
  let stage: 'initial' | 'developing' | 'established' = 'initial';
  
  if (messageCount >= 10) {
    stage = 'established';
  } else if (messageCount >= 3) {
    stage = 'developing';
  }
  
  return { isEarlyConversation, messageCount, stage };
};

/**
 * Apply conversation stage specific processing
 */
export const applyConversationStageProcessing = (
  response: string,
  userInput: string,
  isEarlyConversation: boolean
): string => {
  // Apply early conversation processing if needed
  if (isEarlyConversation) {
    return applyEarlyConversationRAG(response, userInput);
  }
  
  // For established conversations, no special processing needed
  return response;
};

/**
 * Apply early conversation RAG (Retrieval Augmented Generation) 
 * for use in early parts of conversation
 */
export const applyEarlyConversationRAG = (
  response: string,
  userInput: string
): string => {
  // In early conversation, we want to be very cautious about making claims
  // This is a simplified version - in production this would use actual RAG
  
  // Remove any claims of prior knowledge
  let enhancedResponse = response
    .replace(/as you (mentioned|said|noted|shared)/gi, "from what you're sharing")
    .replace(/you (said|mentioned|told me|indicated) earlier/gi, "you're saying");
    
  // Add hedging language if not present
  if (!/(From what I understand|It sounds like|I hear that|Based on what you|From what you shared)/i.test(enhancedResponse)) {
    enhancedResponse = "From what you've shared, " + enhancedResponse;
  }
  
  return enhancedResponse;
};
