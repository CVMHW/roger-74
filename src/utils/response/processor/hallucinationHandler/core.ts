
/**
 * Core hallucination handling functionality
 */

import { preventHallucinations } from '../../../memory/hallucination/preventionV2';
import { getConversationMessageCount } from '../../../memory/newConversationDetector';
import { 
  HallucinationPreventionOptions, 
  HallucinationProcessResult 
} from '../../../../types/hallucinationPrevention';
import { fixDangerousRepetitionPatterns } from './patternFixer';
import { handleMemoryHallucinations } from './memoryHandler';
import { determinePreventionOptions } from './preventionOptions';
import { 
  handleHealthHallucination, 
  hasRepeatedContent, 
  fixRepeatedContent 
} from './specialCases';
import { 
  detectEmergencyPath, 
  applyEmergencyIntervention 
} from '../emergencyPathDetection';
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
    const emergencyPathResult = detectEmergencyPath(responseText, userInput);
    
    // If we're on an emergency path that requires immediate intervention, handle it immediately
    if (emergencyPathResult.isEmergencyPath && emergencyPathResult.requiresImmediateIntervention) {
      console.log("CRITICAL: Emergency path detected with severity:", emergencyPathResult.severity);
      console.log("Emergency flags:", emergencyPathResult.flags);
      
      const interventionResponse = applyEmergencyIntervention(
        responseText,
        emergencyPathResult
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
    const repetitionResult = fixDangerousRepetitionPatterns(responseText);
    
    // If we fixed repetition, return immediately
    if (repetitionResult.hasRepetitionIssue) {
      console.log("CRITICAL: Fixed dangerous repetition pattern");
      return {
        processedResponse: repetitionResult.fixedResponse,
        hallucinationData: {
          processedResponse: repetitionResult.fixedResponse,
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
    
    // FOURTH PRIORITY: Check for specific health hallucination
    const healthResult = handleHealthHallucination(responseText, userInput);
    if (healthResult.isHealthHallucination) {
      return {
        processedResponse: healthResult.correctedResponse,
        hallucinationData: {
          processedResponse: healthResult.correctedResponse,
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
      
      // Map options to the config format expected by preventHallucinations
      const config = {
        shortTermMemoryCapacity: 10,
        workingMemoryCapacity: 5,
        longTermImportanceThreshold: 0.8,
        semanticSearchEnabled: false,
        hallucinationPreventionLevel: 'aggressive' as 'aggressive',
        newSessionThresholdMs: 1800000, // 30 minutes
        shortTermExpiryMs: 900000 // 15 minutes
      };
      
      const result = preventHallucinations(responseText, userInput, conversationHistory, config);
      
      return {
        processedResponse: result.text,
        hallucinationData: {
          processedResponse: result.text,
          wasRevised: result.wasModified,
          reasoningApplied: true,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: result.confidence,
          issueDetails: ["Memory references in early conversation"]
        }
      };
    }
    
    // SIXTH PRIORITY: Apply non-immediate emergency path intervention if needed
    if (emergencyPathResult.isEmergencyPath) {
      console.log("Non-critical emergency path detected:", emergencyPathResult.severity);
      
      // Apply a more subtle intervention for non-critical cases
      const interventionResponse = applyEmergencyIntervention(
        responseText,
        emergencyPathResult
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
    const preventionResult = determinePreventionOptions(
      responseText, 
      conversationHistory
    );
    
    // Apply prevention if needed
    if (preventionResult.requiresPrevention) {
      // Map options to the config format expected by preventHallucinations
      const config = {
        shortTermMemoryCapacity: 10,
        workingMemoryCapacity: 5,
        longTermImportanceThreshold: 0.8,
        semanticSearchEnabled: false,
        hallucinationPreventionLevel: preventionResult.preventionOptions.detectionSensitivity > 0.8 ? 'high' as 'high' : 'medium' as 'medium',
        newSessionThresholdMs: 1800000, // 30 minutes
        shortTermExpiryMs: 900000 // 15 minutes
      };
      
      const result = preventHallucinations(
        responseText, 
        userInput, 
        conversationHistory, 
        config
      );
      
      if (result.wasModified) {
        return {
          processedResponse: result.text,
          hallucinationData: {
            processedResponse: result.text,
            wasRevised: true,
            reasoningApplied: true,
            detectionApplied: true,
            ragApplied: false,
            processingTime: 0,
            confidence: result.confidence,
            issueDetails: ["Applied hallucination prevention"]
          }
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
