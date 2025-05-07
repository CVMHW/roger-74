
/**
 * Response Processor
 * 
 * Unified system for processing responses through all handlers
 */

// Import required subsystems
import { correctGrammar } from './grammarCorrection';
import { validateResponseQuality } from './validation';
import { enhanceWithMemoryBank } from './memoryEnhancement';
import { enhanceWithStressorAwareness } from './stressorEnhancement';
import { applyEarlyConversationRAG } from '../earlyConversation';
import { applyResponseRules } from './ruleProcessing';

// Import emergencyPathDetection module
import * as emergencyModule from './emergencyPathDetection';
const handleEmergencyDetection = emergencyModule.handleIntervention || emergencyModule.handleEmergencyPath || function(responseText: string, userInput: string) { return responseText; };

// Import emotionHandler module
import * as emotionModule from './emotionHandler';
const handleMisidentifiedEmotions = emotionModule.handleMisidentifiedEmotions || function(responseText: string, userInput: string) { return responseText; };

// Import hallucinationHandler module
import { handlePotentialHallucinations } from './hallucinationHandler';

// Import approachSelector module
import * as approachModule from './approachSelector';
const processMultipleApproaches = approachModule.processMultipleApproaches || function(responseText: string, userInput: string, conversationHistory: string[] = []) { return responseText; };

// Import logotherapyIntegration module
import * as logotherapyModule from './logotherapyIntegration';
const integrateLogotherapy = logotherapyModule.integrateLogotherapy || function(responseText: string, userInput: string, conversationHistory: string[] = []) { return responseText; };

// Import repetitionPrevention module
import * as repetitionModule from './repetitionPrevention';
const detectPatternRepetition = repetitionModule.detectPatternRepetition || function(responseText: string, conversationHistory: string[] = []) { return { text: responseText, wasModified: false }; };

// Import memorySystemHandler module
import * as memoryModule from './memorySystemHandler';
const processWithMemorySystem = memoryModule.processWithMemorySystem || function(responseText: string, userInput: string, conversationHistory: string[] = []) { return responseText; };

// Import responseRiskAssessment module
import * as riskModule from './responseRiskAssessment';
const detectResponseRisks = riskModule.detectResponseRisks || function(responseText: string, userInput: string) { return { hasRisks: false, safeResponse: responseText }; };

// Unified interface for response processing
export interface ProcessedResponse {
  text: string;
  wasModified: boolean;
  reason?: string;
}

/**
 * Process a complete response through all our enhancement systems
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
    
    // Store modification reason if needed
    let modificationReason = '';
    
    // 1. First apply early conversation handling if applicable
    if (conversationHistory.length <= 3) {
      processedResponse = applyEarlyConversationRAG(
        processedResponse,
        userInput
      );
    }
    
    // 2. Apply emergency detection and handling
    processedResponse = handleEmergencyDetection(
      processedResponse,
      userInput
    );
    
    // 3. Check for misidentified emotions
    processedResponse = handleMisidentifiedEmotions(
      processedResponse,
      userInput
    );
    
    // 4. Apply multiple therapeutic approaches
    processedResponse = processMultipleApproaches(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 5. Integrate logotherapy when appropriate
    processedResponse = integrateLogotherapy(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 6. Enhance with memory
    processedResponse = enhanceWithMemoryBank(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 7. Detect and prevent repetition patterns
    const repetitionResult = detectPatternRepetition(
      processedResponse,
      conversationHistory
    );
    
    if (repetitionResult.wasModified) {
      processedResponse = repetitionResult.text;
      modificationReason = 'Repetition prevented';
    }
    
    // 8. Process with memory system
    processedResponse = processWithMemorySystem(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 9. Apply hallucination prevention as final safety
    const hallucinationResult = handlePotentialHallucinations(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // Extract the processed response from the result object
    if (hallucinationResult && typeof hallucinationResult === 'object' && 'processedResponse' in hallucinationResult) {
      processedResponse = hallucinationResult.processedResponse;
    }
    
    // 10. Apply grammar correction with user input for length adjustment
    processedResponse = correctGrammar(processedResponse, userInput);
    
    // 11. Apply universal rules
    processedResponse = applyResponseRules(processedResponse, userInput);
    
    // 12. Final risk assessment
    const riskResult = detectResponseRisks(processedResponse, userInput);
    if (riskResult.hasRisks) {
      // Modify response if risks detected
      processedResponse = riskResult.safeResponse;
    }
    
    // 13. Enhance with stressor awareness if applicable
    processedResponse = enhanceWithStressorAwareness(
      processedResponse,
      userInput,
      conversationHistory
    );
    
    // 14. Final validation of quality
    const validationResult = validateResponseQuality(
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

// Re-export core processor functions
export { enhanceWithMemoryBank } from './memoryEnhancement';
export { handlePotentialHallucinations } from './hallucinationHandler';
export { applyEarlyConversationRAG } from '../earlyConversation';
