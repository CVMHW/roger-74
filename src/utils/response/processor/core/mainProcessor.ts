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
import { 
  verifyResponseMathematically,
  shouldPreventResponse,
  generateFallbackResponse,
  VerificationResult 
} from '../strictVerification';

/**
 * Process a complete response through all enhancement systems
 * with strict mathematical verification
 * 
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
    console.log("PROCESSOR: Starting enhanced mathematical response processing");
    
    // Extract previous responses for verification
    const previousResponses = conversationHistory.filter((_, i) => i % 2 === 1);
    
    // Step 1: Initial strict mathematical verification
    const initialVerification = verifyResponseMathematically(
      responseText, 
      userInput, 
      conversationHistory,
      previousResponses
    );
    
    console.log("VERIFICATION: Initial verification result", {
      confidence: initialVerification.confidenceScore.toFixed(2),
      issues: initialVerification.detectedIssues,
      action: initialVerification.suggestedAction
    });
    
    // Check if response should be immediately prevented
    if (shouldPreventResponse(initialVerification)) {
      console.warn("CRITICAL: Response prevented by mathematical verification");
      return generateFallbackResponse(userInput);
    }
    
    // Start with the original response
    let processedResponse = responseText;
    
    // Step 2: Apply early conversation handling if applicable
    if (conversationHistory.length <= 3) {
      processedResponse = processEarlyConversation(
        processedResponse,
        userInput
      );
    }
    
    // Step 3: Apply emergency detection and handling
    processedResponse = processEmergency(
      processedResponse,
      userInput
    );
    
    // Step 4: Check for misidentified emotions
    processedResponse = processEmotions(
      processedResponse,
      userInput
    );
    
    // Step 5: Apply multiple therapeutic approaches
    processedResponse = processApproaches(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Step 6: Integrate logotherapy when appropriate
    processedResponse = processLogotherapy(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Step 7: Enhance with memory
    processedResponse = processMemory(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Step 8: Detect and prevent repetition patterns
    const repetitionResult = processRepetition(
      processedResponse,
      conversationHistory
    );
    
    if (repetitionResult.wasModified) {
      processedResponse = repetitionResult.text;
    }
    
    // Step 9: Apply hallucination prevention as final safety
    const hallucinationResult = processRisks(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Extract the processed response from the result object
    if (hallucinationResult && typeof hallucinationResult === 'object' && 'processedResponse' in hallucinationResult) {
      processedResponse = hallucinationResult.processedResponse;
    }
    
    // Step 10: Apply grammar correction with user input for length adjustment
    processedResponse = correctGrammar(processedResponse, userInput);
    
    // Step 11: Apply universal rules
    processedResponse = applyResponseRules(processedResponse, userInput);
    
    // Step 12: Enhance with stressor awareness if applicable
    processedResponse = processStressors(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Step 13: Final validation of quality
    const validationResult = validateResponse(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    if (!validationResult.isValid) {
      console.error("Response validation failed:", validationResult.reason);
      // Use fallback for invalid response
      return generateFallbackResponse(userInput);
    }
    
    // Step 14: Final strict mathematical verification
    const finalVerification = verifyResponseMathematically(
      processedResponse, 
      userInput, 
      conversationHistory,
      previousResponses
    );
    
    console.log("VERIFICATION: Final verification result", {
      confidence: finalVerification.confidenceScore.toFixed(2),
      issues: finalVerification.detectedIssues,
      action: finalVerification.suggestedAction
    });
    
    // If final verification fails, use a simpler response
    if (shouldPreventResponse(finalVerification)) {
      console.warn("CRITICAL: Enhanced response prevented by mathematical verification");
      return generateFallbackResponse(userInput);
    }
    
    // If verification suggests rollback but not full prevention, simplify the response
    if (finalVerification.shouldRollback) {
      console.warn("ROLLBACK: Simplifying response due to verification concerns");
      return simplifyResponse(processedResponse);
    }
    
    return processedResponse;
    
  } catch (error) {
    console.error("Error in processCompleteResponse:", error);
    // Return safe fallback
    return "I'm here to listen and support you. Could you tell me more about what's going on?";
  }
}

/**
 * Simplify a response that failed verification but doesn't need full prevention
 */
function simplifyResponse(response: string): string {
  // Split into sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // Keep only the first 1-2 sentences if response is long
  if (sentences.length > 3) {
    return sentences.slice(0, 2).join(' ') + 
      " I'd like to understand more about what you're experiencing. Could you share more about that?";
  }
  
  // For shorter responses, just add a clarifying question
  return response + " Would you mind sharing more about your experience so I can better understand?";
}
