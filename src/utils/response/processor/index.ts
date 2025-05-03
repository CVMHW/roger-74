
/**
 * Response Processor - Main Module
 * 
 * Processes responses through the MasterRules system before final delivery
 * UNCONDITIONAL: Ensures memory usage in all responses
 */

import { processResponseCore } from './core';

/**
 * Process any response through the MasterRules system
 * @param response Initial response
 * @param userInput Original user input
 * @param messageCount Current message count
 * @param conversationHistory Array of recent conversation messages
 * @returns Processed response conforming to all MasterRules
 */
export const processResponseThroughMasterRules = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  return processResponseCore(response, userInput, messageCount, conversationHistory);
};

// Re-export enhanceResponseWithMemory for direct usage
export { enhanceResponseWithMemory } from './memoryEnhancement';
