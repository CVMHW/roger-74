
/**
 * Core hallucination handling functionality - Refactored for maintainability
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
    // First apply pattern fixes to address dangerous repetition patterns
    const { fixedResponse, hasRepetitionIssue } = fixDangerousRepetitionPatterns(responseText);
    
    // If we fixed repetition, return immediately
    if (hasRepetitionIssue) {
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
    
    // Use the repetition handler to fix any other repeated content
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
    
    // Check for specific health hallucination
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
    
    // Handle memory reference hallucinations
    const memoryResult = handleMemoryHallucinations(responseText, conversationHistory);
    
    // For new conversations with memory references, always apply strict prevention
    if (memoryResult.requiresStrictPrevention) {
      console.log("CRITICAL: Memory references in new conversation detected, applying strict prevention");
      
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.95,
        enableReasoning: true,
        enableRAG: false,
        enableTokenLevelDetection: true,
        enableNLIVerification: true,
        tokenThreshold: 0.8
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // Determine prevention options based on response content and conversation context
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
    
    // No hallucination issues detected
    return {
      processedResponse: responseText,
      hallucinationData: null
    };
    
  } catch (error) {
    console.error("Error in handlePotentialHallucinations:", error);
    
    // In case of error, return the original response
    return {
      processedResponse: responseText,
      hallucinationData: null
    };
  }
};
