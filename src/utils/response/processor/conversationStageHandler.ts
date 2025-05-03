
/**
 * Conversation Stage Handler
 * 
 * Manages detection and handling of conversation stages
 */

import { getConversationMessageCount } from '../../memory/newConversationDetector';
import { applyEarlyConversationRAG } from './hallucinationHandler/earlyConversation';

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
