
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
import { detectEmergencyPath, applyEmergencyIntervention } from '../emergencyPathDetection';
import { SeverityLevel } from '../emergencyPathDetection/types';

/**
 * Apply hallucination prevention to a response with emergency path detection
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
    // HIGHEST PRIORITY: Emergency path detection - must come first
    const emergencyPathResult = detectEmergencyPath(responseText, userInput, conversationHistory);
    
    // If we're on an emergency path that requires immediate intervention, handle it immediately
    if (emergencyPathResult.isEmergencyPath && emergencyPathResult.requiresImmediateIntervention) {
      console.log("CRITICAL: Emergency path detected with severity:", emergencyPathResult.severity);
      console.log("Emergency flags:", emergencyPathResult.flags);
      
      const interventionResponse = applyEmergencyIntervention(
        responseText,
        emergencyPathResult,
        userInput
      );
      
      return {
        processedResponse: interventionResponse,
        hallucinationData: {
          processedResponse: interventionResponse,
          wasRevised: true,
          reasoningApplied: true,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: emergencyPathResult.severity === SeverityLevel.SEVERE ? 0.1 : 0.3,
          issueDetails: emergencyPathResult.flags.map(flag => flag.description)
        }
      };
    }
    
    // First check for basic syntactic issues in the response
    if (!responseText || responseText.trim().length === 0) {
      return {
        processedResponse: "I'm here to listen. What's been going on for you?",
        hallucinationData: null
      };
    }
    
    // SECOND PRIORITY: Check for dangerous repetition patterns that need immediate fixing
    // Example: "I hear you're dealing with I hear you're dealing with"
    const { fixedResponse, hasRepetitionIssue } = fixDangerousRepetitionPatterns(responseText, userInput);
    
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
    
    // THIRD PRIORITY: Use the repetition handler to fix any other repeated content
    if (hasRepeatedContent(responseText)) {
      const correctedText = fixRepeatedContent(responseText, userInput);
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
    
    // FOURTH PRIORITY: Check for specific health hallucination
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
    
    // FIFTH PRIORITY: Handle memory reference hallucinations
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
    
    // SIXTH PRIORITY: Apply non-immediate emergency path intervention if needed
    if (emergencyPathResult.isEmergencyPath) {
      console.log("Non-critical emergency path detected:", emergencyPathResult.severity);
      
      // Apply a more subtle intervention for non-critical cases
      const interventionResponse = applyEmergencyIntervention(
        responseText,
        emergencyPathResult,
        userInput
      );
      
      return {
        processedResponse: interventionResponse,
        hallucinationData: {
          processedResponse: interventionResponse,
          wasRevised: true,
          reasoningApplied: true,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: 0.6,
          issueDetails: emergencyPathResult.flags.map(flag => flag.description)
        }
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
