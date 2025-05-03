
/**
 * Core processor functionality
 * Contains the main processing logic without peripheral concerns
 * ENHANCED with personality variation as a UNIVERSAL LAW
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
import { fixDangerousRepetitionPatterns } from './hallucinationHandler/patternFixer';
import { isSeverityEqual } from './emergencyPathDetection/severityUtils'; 
import { SeverityLevel } from './emergencyPathDetection/types';
import { addResponseVariety, generateSpontaneousResponse } from '../personalityVariation';
import { detectConversationPatterns } from '../patternDetection';
import { getRandomPersonality } from '../spontaneityGenerator';

/**
 * Process response through master rules system - core implementation
 * Now with integrated emergency path detection and UNIVERSAL PERSONALITY VARIATION
 */
export const processResponseCore = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("MASTER RULES: Beginning response processing");
    
    // CRITICAL SAFETY OVERRIDE: First immediately check for the problematic patterns
    // This is a first-line safety check that runs before ANY other processing
    const { fixedResponse, hasRepetitionIssue } = fixDangerousRepetitionPatterns(response, userInput);
    
    if (hasRepetitionIssue) {
      console.log("CRITICAL: Dangerous repetition pattern detected and fixed in first-pass");
      // Replace the response with the fixed version for all further processing
      response = fixedResponse;
    }
    
    // Verify all systems are operational
    verifySystemsOperational();
    
    // Get previous responses for pattern detection
    const previousResponses: string[] = 
      conversationHistory.filter(msg => 
        !msg.startsWith("I'm") && 
        !userInput.includes(msg)
      ).slice(-3);
    
    // HIGHEST PRIORITY: Check for emergency path indicators before any processing
    // This serves as an early warning system for potential hallucinations
    const emergencyPathResult = detectEmergencyPath(response, userInput, conversationHistory, previousResponses);
    
    // If we detect a severe emergency pattern (like repeated phrases), intervene immediately
    if (emergencyPathResult.requiresImmediateIntervention || 
        isSeverityEqual(emergencyPathResult.severity, SeverityLevel.SEVERE)) {
      console.log("CRITICAL: Early emergency path detection triggered immediate intervention");
      response = applyEmergencyIntervention(response, emergencyPathResult, userInput);
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
    
    // NEW: Use conversation pattern detection to adjust spontaneity and variety levels
    const patternResults = detectConversationPatterns(hallucinationCheckedResponse, previousResponses, conversationHistory);
    
    // Determine spontaneity level based on pattern detection
    let spontaneityLevel = 65; // Default base level
    let creativityLevel = 60;   // Default base level
    
    // Increase spontaneity based on pattern detection results
    if (patternResults.isRepetitive) {
      console.log("PATTERN DETECTION: Repetitive patterns detected, increasing spontaneity");
      spontaneityLevel += 25; // Significant increase
      creativityLevel += 20;
    } else if (patternResults.repetitionScore > 0.5) {
      console.log("PATTERN DETECTION: Some repetition tendencies detected, moderately increasing spontaneity");
      spontaneityLevel += 15;
      creativityLevel += 10;
    }
    
    // Check if we're in a loop of similar responses
    const inSimilarResponseLoop = previousResponses.length >= 2 && 
      previousResponses.slice(0, 2).some(prev => 
        prev.includes("I notice I may have been repeating myself") || 
        prev.includes("I'd like to focus specifically on what you've shared")
      );
    
    // If we detect a loop of similar responses, use the spontaneous response generator
    // to create a completely fresh response that breaks the pattern
    if (inSimilarResponseLoop) {
      console.log("PATTERN INTERRUPT: Detecting loop of similar responses, generating spontaneous response");
      
      // Use the personality mode system for variety
      const personalityMode = getRandomPersonality();
      
      const spontaneousResponse = generateSpontaneousResponse(
        userInput, 
        previousResponses,
        90, // Very high spontaneity for pattern breaking
        85, // Very high creativity for pattern breaking
        personalityMode
      );
      
      // Record final spontaneous response to all memory systems
      recordToMemorySystems(
        spontaneousResponse, 
        attentionResults.emotionalContext,
        attentionResults.dominantTopics
      );
      
      return spontaneousResponse;
    }
    
    // UNIVERSAL LAW: ALWAYS APPLY PERSONALITY VARIATION TO EVERY RESPONSE
    // This is a core requirement to ensure spontaneity and variety
    let enhancedPersonalityResponse = addResponseVariety(
      hallucinationCheckedResponse,
      userInput,
      messageCount,
      spontaneityLevel,
      creativityLevel
    );
    
    // Final check for potential emergency path in the processed response
    const finalEmergencyPathResult = detectEmergencyPath(
      enhancedPersonalityResponse, 
      userInput, 
      conversationHistory,
      previousResponses
    );
    
    // If there's still an emergency path detected even after hallucination prevention,
    // apply one final intervention to ensure safety
    if (finalEmergencyPathResult.isEmergencyPath) {
      console.log("CRITICAL: Emergency path detected in final response, applying final intervention");
      const finalResponse = applyEmergencyIntervention(
        enhancedPersonalityResponse,
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
    
    // LAST-RESORT SAFETY CHECK for the problematic "It seems like you shared that" pattern
    // If it somehow survived all our processing, catch it here as a final backstop
    if (hasSharedThatPattern(enhancedPersonalityResponse)) {
      console.log("CRITICAL FINAL BACKSTOP: 'It seems like you shared that' pattern detected");
      
      // Use our emergency intervention as a last resort
      const emergencyResult = {
        isEmergencyPath: true,
        severity: SeverityLevel.SEVERE,
        flags: [{
          type: 'critical_shared_that_pattern',
          description: 'Critical "It seems like you shared that" pattern survived all processing',
          severity: SeverityLevel.SEVERE
        }],
        requiresImmediateIntervention: true
      };
      
      const safeResponse = applyEmergencyIntervention(
        enhancedPersonalityResponse, 
        emergencyResult,
        userInput
      );
      
      // Record final response to all memory systems
      recordToMemorySystems(
        safeResponse, 
        attentionResults.emotionalContext,
        attentionResults.dominantTopics
      );
      
      return safeResponse;
    }
    
    // Record final response to all memory systems
    recordToMemorySystems(
      enhancedPersonalityResponse, 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics
    );
    
    return enhancedPersonalityResponse;
  } catch (error) {
    if (error instanceof Error) {
      return handleResponseProcessingError(error, userInput, response);
    } else {
      console.error('Unknown error in response processing:', error);
      return `I remember what you've told me. ${response}`;
    }
  }
};
