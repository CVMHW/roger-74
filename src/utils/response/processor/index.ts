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
    if (situationInfo && situationInfo.isFrustration) { // Fix: Check isFrustration instead of isEverydaySituation
      // For everyday situations, use specialized handling
      const everydayResponse = generateEverydayFrustrationResponse(situationInfo, userInput); // Fix: Add the missing userInput parameter
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
    
    // 10. Final check for redundant phrases - NEW ANTI-REPETITION FILTER
    processedResponse = eliminateRedundantPhrases(processedResponse);
    
    // Record final response to memory systems
    recordToMemorySystems(processedResponse, undefined, undefined, 0.8);
    
    return processedResponse;
    
  } catch (error) {
    console.error("RESPONSE PROCESSOR: Error in processing", error);
    
    // Fallback: Return original response
    return responseText;
  }
};

/**
 * NEW: Advanced repetition elimination system using computational linguistics
 * Eliminates redundant phrases and similar greetings that cause Roger to sound robotic
 */
const eliminateRedundantPhrases = (response: string): string => {
  let processedResponse = response;
  
  // List of common repetitive prefixes to detect and eliminate duplicates
  const commonPhrases = [
    "Based on what you're sharing",
    "From what you've shared",
    "I hear what you're sharing",
    "I understand that",
    "It sounds like",
    "I hear you're feeling",
    "I notice that you're",
    "You mentioned that"
  ];
  
  // Check for multiple occurrences of the same phrase
  for (const phrase of commonPhrases) {
    // Count occurrences
    const regex = new RegExp(phrase, 'gi');
    const matches = processedResponse.match(regex);
    
    if (matches && matches.length > 1) {
      // Keep only the first occurrence
      let firstOccurrence = true;
      processedResponse = processedResponse.replace(regex, (match) => {
        if (firstOccurrence) {
          firstOccurrence = false;
          return match;
        }
        return ""; // Remove subsequent occurrences
      });
    }
  }
  
  // Check for patterns like "Based on X, Based on X" or "I hear X, I hear X"
  const repetitionPatterns = [
    /(Based on[^,.!?]+),\s*(Based on)/gi,
    /(From what[^,.!?]+),\s*(From what)/gi,
    /(I hear[^,.!?]+),\s*(I hear)/gi,
    /(It sounds like[^,.!?]+),\s*(It sounds like)/gi
  ];
  
  for (const pattern of repetitionPatterns) {
    processedResponse = processedResponse.replace(pattern, '$1'); // Keep only first phrase
  }
  
  // Replace adjacent duplicate phrases (with no separator between them)
  processedResponse = processedResponse.replace(/(Based on what you're sharing)\s*\1/gi, '$1');
  processedResponse = processedResponse.replace(/(From what you've shared)\s*\1/gi, '$1');
  processedResponse = processedResponse.replace(/(I hear what you're sharing)\s*\1/gi, '$1');
  
  // Trim extra spaces that might be left after removing phrases
  processedResponse = processedResponse.replace(/\s{2,}/g, ' ').trim();
  
  // Add final sentence if response became too short after removing repetitions
  if (processedResponse.length < 20) {
    processedResponse += " What would be most helpful to discuss right now?";
  }
  
  return processedResponse;
};

// Export for backward compatibility
export const processResponseThroughMasterRules = processCompleteResponse;

// Re-export important components for direct access
export { recordToMemorySystems } from './memorySystemHandler';
export { enhanceResponseWithMemory } from './memoryEnhancement';
export { applyResponseRules } from './ruleProcessing';
