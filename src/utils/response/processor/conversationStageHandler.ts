
/**
 * Conversation stage handling functionality
 * Manages early vs established conversation processing
 */

import { getConversationMessageCount } from '../../memory/newConversationDetector';
import { applyEarlyConversationRAG } from './hallucinationHandler';

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
