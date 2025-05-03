
/**
 * Core processor functionality
 * Contains the main processing logic without peripheral concerns
 */

import { applyResponseRules } from './ruleProcessing';
import { handleResponseProcessingError } from './errorHandling';
import { enhanceWithMemoryBank } from './memoryEnhancement';
import { handlePotentialHallucinations } from './hallucinationHandler';
import { detectEmergencyPath, applyEmergencyIntervention } from './emergencyPathDetection';
import { verifySystemsOperational } from './validation';
import { processInputWithAttention } from './attentionProcessor';
import { determineConversationStage, applyConversationStageProcessing } from './conversationStageHandler';
import { getHallucinationOptions } from './hallucinationConfig';
import { recordToMemorySystems } from './memorySystemHandler';

/**
 * Process response through master rules system - core implementation
 * Now with integrated emergency path detection
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
    
    // HIGHEST PRIORITY: Check for emergency path indicators before any processing
    // This serves as an early warning system for potential hallucinations
    const emergencyPathResult = detectEmergencyPath(response, userInput, conversationHistory);
    
    // If we detect a severe emergency pattern (like repeated phrases), intervene immediately
    if (emergencyPathResult.requiresImmediateIntervention) {
      console.log("CRITICAL: Early emergency path detection triggered immediate intervention");
      return applyEmergencyIntervention(response, emergencyPathResult, userInput);
    }
    
    // Process through attention system
    const attentionResults = processInputWithAttention(userInput, conversationHistory);
    
    // Apply all response rules
    const reviewedResponse = applyResponseRules(response, userInput, messageCount, conversationHistory);
    
    // Apply MemoryBank enhancement for deeper personalization
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
    
    // Final check for potential emergency path in the processed response
    const finalEmergencyPathResult = detectEmergencyPath(
      hallucinationCheckedResponse, 
      userInput, 
      conversationHistory
    );
    
    // If there's still an emergency path detected even after hallucination prevention,
    // apply one final intervention to ensure safety
    if (finalEmergencyPathResult.isEmergencyPath) {
      console.log("CRITICAL: Emergency path detected in final response, applying final intervention");
      const finalResponse = applyEmergencyIntervention(
        hallucinationCheckedResponse,
        finalEmergencyPathResult,
        userInput
      );
      
      // Record final response to all memory systems
      recordToMemorySystems(
        finalResponse, 
        attentionResults.emotionalContext,
        attentionResults.dominantTopics
      );
      
      return finalResponse;
    }
    
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
