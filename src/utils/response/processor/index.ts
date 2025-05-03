
/**
 * Response Processor
 * 
 * Central module for processing responses before sending to the user
 * Integrates memory, hallucination prevention, and logotherapy
 */

import { processResponse } from '../../memory/memoryController';
import { applyUnconditionalRules } from '../responseIntegration';
import { processCore } from './core';
import { applyConversationStageProcessing, determineConversationStage } from './conversationStageHandler';
import { enhanceResponseWithMemory } from './memoryEnhancement';
import { recordToMemorySystems } from './memorySystemHandler';
import { handleLogotherapyIntegration } from './logotherapy/integrationHandler';
import { handleMemoryHallucinations } from './hallucinationHandler';

/**
 * Process a response through all enhancement systems
 */
export const processCompleteResponse = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("RESPONSE PROCESSOR: Starting complete response processing");
    
    // Get conversation stage
    const { isEarlyConversation, messageCount } = determineConversationStage();
    
    // 1. First apply core processing (universal rules)
    let processedResponse = processCore(responseText, userInput, messageCount, conversationHistory);
    
    // 2. Apply logotherapy integration for meaning-centered responses
    processedResponse = handleLogotherapyIntegration(processedResponse, userInput, conversationHistory);
    
    // 3. Apply memory enhancement
    processedResponse = enhanceResponseWithMemory({
      response: processedResponse,
      userInput,
      conversationHistory
    });
    
    // 4. Apply conversation stage processing (special handling for early conversations)
    processedResponse = applyConversationStageProcessing(
      processedResponse, 
      userInput,
      isEarlyConversation
    );
    
    // 5. Apply hallucination prevention as final safety
    processedResponse = processResponse(processedResponse, userInput, conversationHistory);
    
    // Record final response to memory systems
    recordToMemorySystems(processedResponse, undefined, undefined, 0.8);
    
    return processedResponse;
    
  } catch (error) {
    console.error("RESPONSE PROCESSOR: Error in processing", error);
    
    // Fallback: Ensure we at least apply basic rules in case of error
    try {
      const simpleProcessed = applyUnconditionalRules(responseText, userInput, 0);
      return simpleProcessed;
    } catch (nestedError) {
      console.error("RESPONSE PROCESSOR: Critical failure in fallback processing", nestedError);
      return responseText;
    }
  }
};

// Export for backward compatibility
export const processResponseThroughMasterRules = processCompleteResponse;

// Re-export important components for direct access
export { recordToMemorySystems } from './memorySystemHandler';
export { enhanceResponseWithMemory } from './memoryEnhancement';
export { applyResponseRules } from './ruleProcessing';
