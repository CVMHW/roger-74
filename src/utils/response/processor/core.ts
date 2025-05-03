
/**
 * Core processor functionality
 * Contains the main processing logic without peripheral concerns
 */

import { applyResponseRules } from './ruleProcessing';
import { handleResponseProcessingError } from './errorHandling';
import { enhanceWithMemoryBank } from './memoryEnhancement';
import { handlePotentialHallucinations } from './hallucinationHandler';
import { detectEmergencyPath, applyEmergencyIntervention, detectPatternedResponses } from './emergencyPathDetection';
import { verifySystemsOperational } from './validation';
import { processInputWithAttention } from './attentionProcessor';
import { determineConversationStage, applyConversationStageProcessing } from './conversationStageHandler';
import { getHallucinationOptions } from './hallucinationConfig';
import { recordToMemorySystems } from './memorySystemHandler';
import { hasSharedThatPattern } from './hallucinationHandler/specialCases';

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
    
    // NEW: First immediately check for the problematic "It seems like you shared that" pattern
    // This pattern is causing significant issues in Roger's responses
    if (hasSharedThatPattern(response)) {
      console.log("CRITICAL: Detected 'It seems like you shared that' pattern - replacing immediately");
      // Extract the content that was "shared"
      const match = response.match(/It seems like you shared that ([^.]+)\./i);
      
      if (match && match[1]) {
        const supposedShared = match[1].toLowerCase();
        const actualUserInput = userInput.toLowerCase();
        
        // Check if what was supposedly shared is actually in the user input
        if (actualUserInput.includes(supposedShared)) {
          // It's accurate, just rephrase it
          response = response.replace(
            /It seems like you shared that ([^.]+)\./i,
            `I understand you're talking about $1.`
          );
        } else {
          // It's not accurate, use a generic acknowledgment
          response = response.replace(
            /It seems like you shared that ([^.]+)\./i,
            "Thanks for sharing your experience."
          );
        }
      }
    }
    
    // Verify all systems are operational
    verifySystemsOperational();
    
    // Get previous responses for pattern detection (empty for now)
    // In a real implementation, this would come from conversation history
    const previousResponses: string[] = 
      conversationHistory.filter(msg => 
        !msg.startsWith("I'm") && 
        !userInput.includes(msg)
      ).slice(-3);
    
    // HIGHEST PRIORITY: Check for emergency path indicators before any processing
    // This serves as an early warning system for potential hallucinations
    const emergencyPathResult = detectEmergencyPath(response, userInput, conversationHistory, previousResponses);
    
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
      conversationHistory,
      previousResponses
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
