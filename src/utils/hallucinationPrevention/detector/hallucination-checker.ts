
/**
 * Hallucination checking and fixing functionality
 */

import { HallucinationCheck } from '../../../types/hallucinationPrevention';
import { detectHallucinations } from './hallucination-detector';
import { quickHallucinationCheck } from './quick-check';
import { calculateStringSimilarity } from './similarity-utils';

/**
 * Main function to check and fix hallucinations
 * Enhanced with handling for new detection methods
 */
export const checkAndFixHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): { 
  correctedResponse: string;
  wasHallucination: boolean;
  hallucinationDetails: HallucinationCheck | null;
} => {
  // Check if we need to run full hallucination detection
  // For efficiency, we only run detailed checks if we detect potential issues
  const quickCheck = quickHallucinationCheck(responseText, conversationHistory);
  
  // If quick check passes and it's not a new conversation, return original
  if (!quickCheck.potentialIssue && conversationHistory.length > 2) {
    return { 
      correctedResponse: responseText, 
      wasHallucination: false,
      hallucinationDetails: null
    };
  }
  
  // If this is a new conversation, be VERY cautious about memory claims
  const isNewConversation = conversationHistory.length <= 2;
  
  // Run full detection
  const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
  
  // In new conversations, be extra strict about hallucinations
  const hallucinationThreshold = isNewConversation ? 0.7 : 0.6;
  
  // CRITICAL: Detect and fix false memory references like "we've been focusing on"
  const falseContinuityPattern = /(?:we've been focusing on|we've been discussing|we've been talking about|as we discussed|we were discussing|we talked about earlier) (?:your|the|about|how|what|why)?\s*([a-zA-Z\s]+)/gi;
  
  if (falseContinuityPattern.test(responseText) && isNewConversation) {
    console.warn("FALSE CONTINUITY DETECTED: New conversation with false continuity claim");
    
    // Replace the false memory reference
    const correctedResponse = responseText.replace(
      falseContinuityPattern,
      "I hear you're dealing with $1"
    );
    
    return {
      correctedResponse,
      wasHallucination: true,
      hallucinationDetails: {
        content: responseText,
        confidenceScore: 0.2,
        hallucination: true,
        flags: [{
          type: 'false_continuity',
          severity: 'high',
          description: 'False continuity claim in new conversation'
        }]
      }
    };
  }
  
  if (hallucinationCheck.hallucination || 
      hallucinationCheck.confidenceScore < hallucinationThreshold ||
      (isNewConversation && /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(responseText))) {
    
    console.warn("HALLUCINATION DETECTED:", hallucinationCheck.flags);
    
    // Generate corrected response
    const correctedResponse = hallucinationCheck.corrections || responseText;
    
    // Final safety check for new conversations - remove ALL memory references
    let finalResponse = correctedResponse;
    if (isNewConversation) {
      finalResponse = finalResponse.replace(
        /(?:I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we've been focusing on) (?:that |how |about |your |having |feeling |experiencing |)([\w\s]+)/gi,
        "I hear you're dealing with $1"
      );
    }
    
    // Fix repeated sentences
    if (quickCheck.hasRepeatedSentences) {
      const sentences = finalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const uniqueSentences: string[] = [];
      
      // Keep only unique sentences
      for (const sentence of sentences) {
        if (!uniqueSentences.some(s => calculateStringSimilarity(s.toLowerCase(), sentence.toLowerCase()) > 0.7)) {
          uniqueSentences.push(sentence.trim());
        }
      }
      
      finalResponse = uniqueSentences.join(". ") + ".";
    }
    
    return {
      correctedResponse: finalResponse,
      wasHallucination: true,
      hallucinationDetails: hallucinationCheck
    };
  }
  
  return {
    correctedResponse: responseText,
    wasHallucination: false,
    hallucinationDetails: hallucinationCheck
  };
};
