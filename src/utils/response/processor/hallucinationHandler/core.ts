
/**
 * Core hallucination handling functionality
 */

import { preventHallucinations } from '../../../hallucinationPrevention';
import { getConversationMessageCount } from '../../../memory/newConversationDetector';
import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../../../types/hallucinationPrevention';
import { detectRepeatedPhrases } from './repetitionDetector';

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
    // First check for dangerous repetition patterns like "I hear you're dealing with I hear you're dealing with"
    // and other common issues that must be fixed immediately
    const repetitionPatterns = [
      {
        pattern: /(I hear (you'?re|you are) dealing with) I hear (you'?re|you are) dealing with/i,
        replacement: '$1'
      },
      {
        pattern: /(I hear (you'?re|you are) dealing with) you may have indicated/i,
        replacement: '$1'
      },
      {
        pattern: /you may have indicated Just a/i,
        replacement: 'with a'
      },
      {
        pattern: /you may have indicated Just/i,
        replacement: 'with'
      },
      {
        pattern: /(I remember (you|your|we)) I remember (you|your|we)/i,
        replacement: '$1'
      },
      {
        pattern: /(you (mentioned|said|told me)) you (mentioned|said|told me)/i,
        replacement: '$1'
      },
      {
        pattern: /(I hear you're feeling) (I hear you're feeling)/i,
        replacement: '$1'
      },
      // New patterns to catch from recent issues
      {
        pattern: /dealing with you may have indicated/i,
        replacement: 'dealing with'
      }
    ];
    
    let fixedResponse = responseText;
    let hasRepetitionIssue = false;
    
    // Apply repetition fixes immediately
    for (const { pattern, replacement } of repetitionPatterns) {
      if (pattern.test(fixedResponse)) {
        console.warn("REPETITION DETECTED: Fixing repeated phrases");
        fixedResponse = fixedResponse.replace(pattern, replacement);
        hasRepetitionIssue = true;
      }
    }
    
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
    
    // Track if we have a potential memory reference
    const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|we've been|you shared|as I recall/i.test(responseText);
    
    // Get conversation message count
    const messageCount = getConversationMessageCount();
    const isNewConversation = messageCount < 3;
    
    // For new conversations with memory references, always apply strict prevention
    if (isNewConversation && containsMemoryReference) {
      console.log("CRITICAL: Memory references in new conversation detected, applying strict prevention");
      
      // Apply enhanced detection with high sensitivity and all methods enabled
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.95,
        enableReasoning: true,
        enableRAG: false, // Don't enhance with RAG in this case
        enableTokenLevelDetection: true,
        enableNLIVerification: true,
        tokenThreshold: 0.8
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // Check for the "health" hallucination specifically
    const healthHallucinationPattern = /dealing with health|focusing on health|talking about health/i;
    if (healthHallucinationPattern.test(responseText) && 
        !conversationHistory.some(msg => /health|medical|doctor|sick|ill|wellness/i.test(msg))) {
      
      console.log("SPECIFIC HEALTH HALLUCINATION DETECTED: Fixing directly");
      
      // Direct fix for the health hallucination
      const correctedResponse = responseText.replace(
        healthHallucinationPattern,
        "dealing with this situation"
      );
      
      return {
        processedResponse: correctedResponse,
        hallucinationData: {
          processedResponse: correctedResponse,
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
    
    // Check for "you may have indicated" phrases - these often lead to confusion
    const indicatedPattern = /you may have indicated/i;
    if (indicatedPattern.test(responseText)) {
      console.log("DETECTED 'you may have indicated' PATTERN: Fixing directly");
      
      // Direct fix for this phrasing issue
      const correctedResponse = responseText.replace(
        indicatedPattern,
        "about"
      );
      
      return {
        processedResponse: correctedResponse,
        hallucinationData: {
          processedResponse: correctedResponse,
          wasRevised: true,
          reasoningApplied: false,
          detectionApplied: true,
          ragApplied: false,
          processingTime: 0,
          confidence: 0.4,
          issueDetails: ["Fixed confusing phrasing"]
        }
      };
    }
    
    // For responses with potential repetition, apply special prevention focused on repetition
    if (detectRepeatedPhrases(responseText)) {
      console.log("REPETITION DETECTED: Applying specialized repetition correction");
      
      // Use options focused on repetition detection
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, {
        detectionSensitivity: 0.9,
        enableReasoning: false,
        enableRAG: false,
        enableTokenLevelDetection: false,
        enableReranking: true
      });
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For regular conversations, apply standard prevention
    // but only if response contains memory references
    if (containsMemoryReference) {
      const options: HallucinationPreventionOptions = {
        enableReasoning: true,
        enableRAG: true,
        enableDetection: true,
        detectionSensitivity: 0.75,
        reasoningThreshold: 0.7,
        enableTokenLevelDetection: true
      };
      
      const hallucinationResult = preventHallucinations(responseText, userInput, conversationHistory, options);
      
      return {
        processedResponse: hallucinationResult.processedResponse,
        hallucinationData: hallucinationResult
      };
    }
    
    // For responses with no memory references, still do a basic check
    // but with lower sensitivity to avoid unnecessary changes
    const basicCheck = preventHallucinations(responseText, userInput, conversationHistory, {
      enableReasoning: false,
      enableRAG: false,
      enableDetection: true,
      detectionSensitivity: 0.5,
      enableTokenLevelDetection: false
    });
    
    if (basicCheck.wasRevised) {
      return {
        processedResponse: basicCheck.processedResponse,
        hallucinationData: basicCheck
      };
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
