
/**
 * Core processor functionality
 * Contains the main processing logic without peripheral concerns
 */

import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';
import { processWithMultiHeadAttention } from '../../memory/multiHeadAttention';
import { addToFiveResponseMemory, verifyFiveResponseMemorySystem } from '../../memory/fiveResponseMemory';
import { addToMemoryBank } from '../../memory/memoryBank';
import { applyResponseRules } from './ruleProcessing';
import { handleResponseProcessingError } from './errorHandling';
import { enhanceWithMemoryBank, processAttentionResults } from './memoryEnhancement';
import { handlePotentialHallucinations, applyEarlyConversationRAG } from './hallucinationHandler';
import { getConversationMessageCount } from '../../memory/newConversationDetector';

/**
 * Process response through master rules system - core implementation
 */
export const processResponseCore = (
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
    
    // Get accurate message count from conversation detector
    const actualMessageCount = getConversationMessageCount();
    
    // For early conversations (first 1-2 messages), apply special RAG
    let processedResponse = memoryBankEnhancedResponse;
    if (actualMessageCount <= 2) {
      processedResponse = applyEarlyConversationRAG(
        processedResponse, 
        userInput
      );
    }
    
    // NEW: Apply comprehensive hallucination prevention system
    const { processedResponse: hallucinationCheckedResponse } = handlePotentialHallucinations(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // CRITICAL: Record final response to all memory systems
    addToMemoryBank(
      hallucinationCheckedResponse, 
      'roger', 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics,
      0.7 // Good importance for roger responses
    );
    addToFiveResponseMemory('roger', hallucinationCheckedResponse);
    
    return hallucinationCheckedResponse;
  } catch (error) {
    if (error instanceof Error) {
      return handleResponseProcessingError(error, userInput, response);
    } else {
      console.error('Unknown error in response processing:', error);
      return `I remember what you've told me. ${response}`;
    }
  }
};
