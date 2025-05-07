
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
import { 
  checkEmotionMisidentification, 
  fixEmotionMisidentification, 
  addHumanTouch, 
  detectEverydaySituation,
  generateEverydayFrustrationResponse
} from './emotionHandler';

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
    
    // Check for everyday situations first - HIGH PRIORITY
    const situationInfo = detectEverydaySituation(userInput);
    if (situationInfo && situationInfo.isEverydaySituation) {
      // For everyday situations, use specialized handling
      const everydayResponse = generateEverydayFrustrationResponse(situationInfo);
      if (everydayResponse) {
        console.log("Using everyday situation response");
        return everydayResponse;
      }
    }
    
    // 1. First apply core processing (universal rules)
    let processedResponse = processCore(responseText, userInput, messageCount, conversationHistory);
    
    // 2. Check and fix emotion misidentification - Make this a TOP PRIORITY
    if (checkEmotionMisidentification(processedResponse, userInput)) {
      processedResponse = fixEmotionMisidentification(processedResponse, userInput);
      console.log("Fixed emotion misidentification");
    }
    
    // 3. Add human touches to make Roger more natural and less robotic
    processedResponse = addHumanTouch(processedResponse, userInput);
    
    // 4. Apply logotherapy integration based on approach strength
    if (approach.logotherapyStrength > 0.2) {
      processedResponse = handleLogotherapyIntegration(
        processedResponse, 
        userInput, 
        conversationHistory
      );
    }
    
    // 5. Apply memory enhancement
    processedResponse = enhanceResponseWithMemory({
      response: processedResponse,
      userInput,
      conversationHistory
    });
    
    // 6. Enhance with stressor awareness if applicable
    processedResponse = enhanceWithStressorAwareness(
      processedResponse,
      userInput
    );
    
    // 7. Apply conversation stage processing (special handling for early conversations)
    processedResponse = applyConversationStageProcessing(
      processedResponse, 
      userInput,
      isEarlyConversation
    );
    
    // 8. Apply hallucination prevention as final safety
    processedResponse = processResponse(processedResponse, userInput, conversationHistory);
    
    // 9. Apply grammar correction with user input for length adjustment
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
