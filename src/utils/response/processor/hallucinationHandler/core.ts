/**
 * Core hallucination handling functionality
 */

import { preventHallucinations } from '../../../memory/hallucination/preventionV2';
import { getConversationMessageCount } from '../../../memory/newConversationDetector';
import { 
  HallucinationPreventionOptions, 
  HallucinationProcessResult 
} from '../../../../types/hallucinationPrevention';
import { determinePreventionOptions } from './preventionOptions';
import { 
  detectEmergencyPath, 
  applyEmergencyIntervention 
} from '../emergencyPathDetection';
import { SeverityLevel } from '../emergencyPathDetection/types';

// Import necessary types and utilities
import { MemorySystemConfig } from '../../../memory/types';

// Define patternFixer function since we're using it
export const fixDangerousRepetitionPatterns = (
  responseText: string
): { fixedResponse: string; hasRepetitionIssue: boolean } => {
  // Check for common repetition patterns
  const repetitionPatterns = [
    {
      pattern: /(I hear (you'?re|you are) dealing with) I hear (you'?re|you are) dealing with/i,
      replacement: '$1'
    },
    {
      pattern: /(I remember (you|your|we)) I remember (you|your|we)/i,
      replacement: '$1'
    },
    {
      pattern: /(you (mentioned|said|told me)) you (mentioned|said|told me)/i,
      replacement: '$1'
    }
  ];
  
  let fixedResponse = responseText;
  let hasRepetitionIssue = false;
  
  // Apply repetition fixes
  for (const { pattern, replacement } of repetitionPatterns) {
    if (pattern.test(fixedResponse)) {
      fixedResponse = fixedResponse.replace(pattern, replacement);
      hasRepetitionIssue = true;
    }
  }
  
  return { fixedResponse, hasRepetitionIssue };
};

// Define functions we're using
export const hasRepeatedContent = (text: string): boolean => {
  // Simple check for repeated content
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      if (sentences[i] && sentences[j] && sentences[i].trim() === sentences[j].trim()) {
        return true;
      }
    }
  }
  return false;
};

export const fixRepeatedContent = (text: string): string => {
  // Split into sentences and keep only unique ones
  const sentences = text.split(/(?<=[.!?])\s+/);
  const uniqueSentences = Array.from(new Set(sentences));
  return uniqueSentences.join(' ');
};

export const handleHealthHallucination = (
  responseText: string,
  userInput: string
): { isHealthHallucination: boolean; correctedResponse: string } => {
  // Check for health topic hallucination
  const hasHealthTopic = /we've been focusing on health|dealing with health|focusing on health/i.test(responseText);
  const userMentionedHealth = /health|medical|doctor|sick|ill|wellness/i.test(userInput);
  
  if (hasHealthTopic && !userMentionedHealth) {
    const correctedResponse = responseText
      .replace(/we've been focusing on health/gi, "from what you've shared")
      .replace(/dealing with health/gi, "dealing with this situation")
      .replace(/focusing on health/gi, "focusing on this");
      
    return {
      isHealthHallucination: true,
      correctedResponse
    };
  }
  
  return {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
};

// Define handleMemoryHallucinations function since we're using it
export const handleMemoryHallucinations = (
  response: string,
  conversationHistory: string[] = []
): { requiresStrictPrevention: boolean; processedResponse: string } => {
  // Check if this is early in conversation
  const isEarlyConversation = conversationHistory.length < 3;
  
  // For early conversations, be extra cautious about memory claims
  if (isEarlyConversation && hasMemoryReference(response)) {
    return {
      requiresStrictPrevention: true,
      processedResponse: fixFalseMemoryReferences(response)
    };
  }
  
  // For established conversations, just do basic checks
  if (hasMemoryReference(response)) {
    // Add hedging language for memory claims
    return {
      requiresStrictPrevention: false,
      processedResponse: "From what I understand, " + response
    };
  }
  
  return {
    requiresStrictPrevention: false,
    processedResponse: response
  };
};

// Define helper functions for memory handling
const hasMemoryReference = (text: string): boolean => {
  return /you (mentioned|said|told me|indicated)|earlier you|previously you|we (discussed|talked about)|I remember|as you (mentioned|said|noted)|we've been/i.test(text);
};

export const fixFalseMemoryReferences = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me) that/gi, "it sounds like")
    .replace(/earlier you (mentioned|said|indicated)/gi, "you just shared")
    .replace(/as you mentioned/gi, "from what you're saying")
    .replace(/we (discussed|talked about)/gi, "regarding")
    .replace(/I remember you saying/gi, "I understand")
    .replace(/from our previous conversation/gi, "from what you've shared");
};

/**
 * Apply hallucination prevention to a response with emergency path detection
 */
export const handlePotentialHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
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
      const config: MemorySystemConfig = {
        shortTermMemoryCapacity: 10,
        workingMemoryCapacity: 5,
        longTermImportanceThreshold: 0.8,
        semanticSearchEnabled: false,
        hallucinationPreventionLevel: 'aggressive',
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
      const config: MemorySystemConfig = {
        shortTermMemoryCapacity: 10,
        workingMemoryCapacity: 5,
        longTermImportanceThreshold: 0.8,
        semanticSearchEnabled: false,
        hallucinationPreventionLevel: preventionResult.preventionOptions.detectionSensitivity > 0.8 ? 'high' : 'medium',
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
