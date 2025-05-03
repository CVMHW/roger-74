
/**
 * Core processor functionality
 * Contains the main processing logic without peripheral concerns
 */

import { applyResponseRules } from './ruleProcessing';
import { handleResponseProcessingError } from './errorHandling';
import { enhanceWithMemoryBank } from './memoryEnhancement';
import { handlePotentialHallucinations } from './hallucinationHandler';
import { verifySystemsOperational } from './validation';
import { processInputWithAttention } from './attentionProcessor';
import { determineConversationStage, applyConversationStageProcessing } from './conversationStageHandler';
import { getHallucinationOptions } from './hallucinationConfig';
import { recordToMemorySystems } from './memorySystemHandler';

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
    
    // Verify all systems are operational
    verifySystemsOperational();
    
    // Process through attention system
    const attentionResults = processInputWithAttention(userInput, conversationHistory);
    
    // Apply all response rules
    const reviewedResponse = applyResponseRules(response, userInput, messageCount, conversationHistory);
    
    // NEW: Apply MemoryBank enhancement for deeper personalization
    const memoryBankEnhancedResponse = enhanceWithMemoryBank(
      reviewedResponse,
      userInput,
      attentionResults.relevantMemories || [],
      conversationHistory
    );
    
    // Get conversation stage information
    const { isEarlyConversation } = determineConversationStage();
    
    // Apply stage-specific processing
    let processedResponse = applyConversationStageProcessing(
      memoryBankEnhancedResponse,
      userInput,
      isEarlyConversation
    );
    
    // Get appropriate hallucination prevention options
    const hallucinationOptions = getHallucinationOptions(isEarlyConversation);
    
    // Apply comprehensive hallucination prevention system
    const { processedResponse: hallucinationCheckedResponse } = handlePotentialHallucinations(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Record final response to all memory systems
    recordToMemorySystems(
      hallucinationCheckedResponse, 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics
    );
    
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
