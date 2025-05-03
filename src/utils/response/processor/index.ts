
/**
 * Response Processor
 * 
 * Central module for processing responses before sending to the user
 * Integrates memory, hallucination prevention, and logotherapy
 */

import { processResponse } from '../../memory/memoryController';
import { processCore } from './core';
import { applyConversationStageProcessing, determineConversationStage } from './conversationStageHandler';
import { enhanceResponseWithMemory } from './memoryEnhancement';
import { recordToMemorySystems } from './memorySystemHandler';
import { handleLogotherapyIntegration } from './logotherapy/integrationHandler';
import { handlePotentialHallucinations } from './hallucinationHandler';
import { correctGrammar } from './grammarCorrection';
import { selectResponseApproach, adjustApproachForConversationFlow } from './approachSelector';
import { enhanceWithStressorAwareness } from './stressorEnhancement';

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
    
    // Select appropriate response approach based on content and context
    const initialApproach = selectResponseApproach(userInput, conversationHistory);
    const approach = adjustApproachForConversationFlow(initialApproach, conversationHistory, messageCount);
    
    console.log("Using approach:", approach);
    
    // 1. First apply core processing (universal rules)
    let processedResponse = processCore(responseText, userInput, messageCount, conversationHistory);
    
    // 2. Apply logotherapy integration based on approach strength
    if (approach.logotherapyStrength > 0.2) {
      processedResponse = handleLogotherapyIntegration(
        processedResponse, 
        userInput, 
        conversationHistory
      );
    }
    
    // 3. Apply memory enhancement
    processedResponse = enhanceResponseWithMemory({
      response: processedResponse,
      userInput,
      conversationHistory
    });
    
    // 4. NEW: Enhance with stressor awareness if applicable
    processedResponse = enhanceWithStressorAwareness(
      processedResponse,
      userInput
    );
    
    // 5. Apply conversation stage processing (special handling for early conversations)
    processedResponse = applyConversationStageProcessing(
      processedResponse, 
      userInput,
      isEarlyConversation
    );
    
    // 6. Apply hallucination prevention as final safety
    processedResponse = processResponse(processedResponse, userInput, conversationHistory);
    
    // 7. Apply grammar correction with user input for length adjustment
    processedResponse = correctGrammar(processedResponse, userInput);
    
    // Record final response to memory systems
    recordToMemorySystems(processedResponse, undefined, undefined, 0.8);
    
    return processedResponse;
    
  } catch (error) {
    console.error("RESPONSE PROCESSOR: Error in processing", error);
    
    // Fallback: Return original response
    return responseText;
  }
};

// Export for backward compatibility
export const processResponseThroughMasterRules = processCompleteResponse;

// Re-export important components for direct access
export { recordToMemorySystems } from './memorySystemHandler';
export { enhanceResponseWithMemory } from './memoryEnhancement';
export { applyResponseRules } from './ruleProcessing';
