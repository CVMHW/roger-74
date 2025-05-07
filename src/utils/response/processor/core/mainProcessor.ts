
/**
 * Main Response Processor
 * 
 * Central module that orchestrates all response processing steps
 */

// Import processing modules
import { processEarlyConversation } from '../conversationStage';
import { processEmergency } from '../emergency';
import { processEmotions } from '../emotions';
import { processApproaches } from '../approaches';
import { processLogotherapy } from '../logotherapy';
import { processMemory } from '../memory';
import { processRepetition } from '../repetition';
import { processRisks } from '../risks';
import { processStressors } from '../stressors';
import { validateResponse } from '../validation';
import { correctGrammar } from '../grammarCorrection';
import { applyResponseRules } from '../ruleProcessing';

/**
 * Process a complete response through all enhancement systems
 * @param responseText Original response text
 * @param userInput User's input that triggered the response
 * @param conversationHistory Array of previous messages
 * @returns Enhanced response text
 */
export function processCompleteResponse(
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string {
  try {
    // Start with the original response
    let processedResponse = responseText;
    
    // 1. First apply early conversation handling if applicable
    if (conversationHistory.length <= 3) {
      processedResponse = processEarlyConversation(
        processedResponse,
        userInput
      );
    }
    
    // 2. Apply emergency detection and handling
    processedResponse = processEmergency(
      processedResponse,
      userInput
    );
    
    // 3. Check for misidentified emotions
    processedResponse = processEmotions(
      processedResponse,
      userInput
    );
    
    // 4. Apply multiple therapeutic approaches
    processedResponse = processApproaches(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 5. Integrate logotherapy when appropriate
    processedResponse = processLogotherapy(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 6. Enhance with memory
    processedResponse = processMemory(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 7. Detect and prevent repetition patterns
    const repetitionResult = processRepetition(
      processedResponse,
      conversationHistory
    );
    
    if (repetitionResult.wasModified) {
      processedResponse = repetitionResult.text;
    }
    
    // 8. Apply hallucination prevention as final safety
    const hallucinationResult = processRisks(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Extract the processed response from the result object
    if (hallucinationResult && typeof hallucinationResult === 'object' && 'processedResponse' in hallucinationResult) {
      processedResponse = hallucinationResult.processedResponse;
    }
    
    // 9. Apply grammar correction with user input for length adjustment
    processedResponse = correctGrammar(processedResponse, userInput);
    
    // 10. Apply universal rules
    processedResponse = applyResponseRules(processedResponse, userInput);
    
    // 11. Enhance with stressor awareness if applicable
    processedResponse = processStressors(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 12. Final validation of quality
    const validationResult = validateResponse(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    if (!validationResult.isValid) {
      console.error("Response validation failed:", validationResult.reason);
      // Use fallback for invalid response
      processedResponse = "I understand you're going through something important. Could you share more about what's on your mind?";
    }
    
    return processedResponse;
    
  } catch (error) {
    console.error("Error in processCompleteResponse:", error);
    // Return safe fallback
    return "I'm here to listen and support you. Could you tell me more about what's going on?";
  }
}
