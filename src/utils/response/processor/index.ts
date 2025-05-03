
/**
 * Response Processor - Main Module
 * 
 * Processes responses through the MasterRules system before final delivery
 * UNCONDITIONAL: Ensures memory usage in all responses
 */

import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';
import { processWithMultiHeadAttention } from '../../memory/multiHeadAttention';
import { addToFiveResponseMemory, verifyFiveResponseMemorySystem } from '../../memory/fiveResponseMemory';
import { addToMemoryBank } from '../../memory/memoryBank';
import { applyResponseRules } from './ruleProcessing';
import { handleResponseProcessingError } from './errorHandling';
import { enhanceWithMemoryBank, processAttentionResults } from './memoryEnhancement';

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
  try {
    console.log("MASTER RULES: Beginning response processing");
    
    // CRITICAL: First verify that all memory systems are operational
    const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
    if (!fiveResponseMemoryOperational) {
      console.error("CRITICAL: 5ResponseMemory system failure detected");
    }
    
    // MANDATORY: Check all system rules first
    checkAllRules();
    
    // CRITICAL: Process input through multi-head attention system
    const attentionResults = processWithMultiHeadAttention(userInput, conversationHistory);
    
    // Process attention results and update memory systems
    processAttentionResults(userInput, attentionResults);
    
    // Apply all response rules
    const reviewedResponse = applyResponseRules(response, userInput, messageCount, conversationHistory);
    
    // NEW: Apply MemoryBank enhancement for deeper personalization
    const memoryBankEnhancedResponse = enhanceWithMemoryBank(
      reviewedResponse,
      userInput,
      attentionResults.relevantMemories || [],
      conversationHistory
    );
    
    // CRITICAL: Record final response to all memory systems
    addToMemoryBank(
      memoryBankEnhancedResponse, 
      'roger', 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics,
      0.7 // Good importance for roger responses
    );
    addToFiveResponseMemory('roger', memoryBankEnhancedResponse);
    
    return memoryBankEnhancedResponse;
  } catch (error) {
    if (error instanceof Error) {
      return handleResponseProcessingError(error, userInput, response);
    } else {
      console.error('Unknown error in response processing:', error);
      return `I remember what you've told me. ${response}`;
    }
  }
};

// Re-export enhanceResponseWithMemory for direct usage
export { enhanceResponseWithMemory } from './memoryEnhancement';
