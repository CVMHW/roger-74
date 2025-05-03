
/**
 * Core hallucination handling functionality
 */

import { preventHallucinations } from '../../../hallucinationPrevention';
import { getConversationMessageCount } from '../../../memory/newConversationDetector';
import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../../../types/hallucinationPrevention';
import { fixDangerousRepetitionPatterns } from './patternFixer';
import { handleMemoryHallucinations } from './memoryHandler';
import { determinePreventionOptions } from './preventionOptions';
import { handleHealthHallucination, hasRepeatedContent, fixRepeatedContent } from './specialCases';

/**
 * Apply hallucination prevention to a response
 */
export const handlePotentialHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): {
  processedResponse: string;
  hallucinationData: HallucinationProcessResult | null;
} => {
  try {
    // First check for basic syntactic issues in the response
    if (!responseText || responseText.trim().length === 0) {
      return {
        processedResponse: "I'm here to listen. What's been going on for you?",
        hallucinationData: null
      };
    }
    
    // HIGHEST PRIORITY: Check for dangerous repetition patterns that need immediate fixing
    // Example: "I hear you're dealing with I hear you're dealing with"
    const { fixedResponse, hasRepetitionIssue } = fixDangerousRepetitionPatterns(responseText);
    
    // If we fixed repetition, return immediately
    if (hasRepetitionIssue) {
      console.log("CRITICAL: Fixed dangerous repetition pattern");
      return {
        processedResponse: fixedResponse,
        hallucinationData: {
          processedResponse: fixedResponse,
          wasRevised: true,
          reasoningApplied: false,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: 0.3,
          issueDetails: ["Fixed dangerous repetition pattern"]
        }
      };
    }
    
    // SECOND PRIORITY: Use the repetition handler to fix any other repeated content
    if (hasRepeatedContent(responseText)) {
      const correctedText = fixRepeatedContent(responseText);
      console.log("REPETITION FIXED: Using repetition handler");
      
      return {
        processedResponse: correctedText,
        hallucinationData: {
          processedResponse: correctedText,
          wasRevised: true,
          reasoningApplied: false,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: 0.4,
          issueDetails: ["Fixed repeated content"]
        }
      };
    }
    
    // THIRD PRIORITY: Check for specific health hallucination
    const healthHallucinationResult = handleHealthHallucination(responseText, conversationHistory);
    if (healthHallucinationResult.isHealthHallucination) {
      return {
        processedResponse: healthHallucinationResult.correctedResponse,
        hallucinationData: {
          processedResponse: healthHallucinationResult.correctedResponse,
          wasRevised: true,
          reasoningApplied: false,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: 0.4,
          issueDetails: ["Fixed health topic hallucination"]
        }
      };
    }
    
    // FOURTH PRIORITY: Handle memory reference hallucinations
    const memoryResult = handleMemoryHallucinations(responseText, conversationHistory);
    
    // For new conversations with memory references, always apply strict prevention
    if (memoryResult.requiresStrictPrevention) {
      console.log("CRITICAL: Memory references in new conversation detected, applying strict prevention");
      
      // Use very strict settings to ensure no false references
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.95,
        enableReasoning: true,
        enableRAG: false,
        enableTokenLevelDetection: true,
        enableNLIVerification: true,
        enableDetection: true,
        reasoningThreshold: 0.7,
        tokenThreshold: 0.8
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // FINAL CHECK: Determine prevention options based on response content and conversation context
    const { preventionOptions, requiresPrevention } = determinePreventionOptions(
      responseText, 
      conversationHistory
    );
    
    // Apply prevention if needed
    if (requiresPrevention) {
      const hallucinationResult = preventHallucinations(
        responseText, 
        userInput, 
        conversationHistory, 
        preventionOptions
      );
      
      if (hallucinationResult.wasRevised) {
        return {
          processedResponse: hallucinationResult.processedResponse,
          hallucinationData: hallucinationResult
        };
      }
    }
    
    // No hallucination issues detected, return original response
    return {
      processedResponse: responseText,
      hallucinationData: null
    };
    
  } catch (error) {
    console.error("Error in handlePotentialHallucinations:", error);
    
    // In case of error, return a safe fallback response
    return {
      processedResponse: "I'd like to hear more about what you're experiencing. Could you tell me more?",
      hallucinationData: null
    };
  }
};
