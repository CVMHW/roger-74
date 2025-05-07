
/**
 * Conversation Stage Processing
 * 
 * Handles early conversation specific processing
 */

import { applyEarlyConversationRAG } from '../earlyConversation';

/**
 * Process early conversation responses
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @returns Processed early conversation response
 */
export function processEarlyConversation(
  responseText: string, 
  userInput: string
): string {
  try {
    return applyEarlyConversationRAG(responseText, userInput);
  } catch (error) {
    console.error("Error in processEarlyConversation:", error);
  }
  
  return responseText;
}
