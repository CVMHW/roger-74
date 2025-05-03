
/**
 * Hallucination Handler
 * 
 * Detects and corrects potential hallucinations in Roger's responses
 */

import { detectHallucinations } from '../../memory/hallucination/detectorV2';

/**
 * Checks and corrects potential hallucinations in a response
 */
export const handlePotentialHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): {
  processedResponse: string;
  hallucinationData: {
    wasDetected: boolean;
    confidence: number;
    reason?: string;
  }
} => {
  try {
    // Check for hallucinations in the response
    const hallucinationCheck = detectHallucinations(response, userInput, conversationHistory);
    
    // If hallucination detected, modify the response
    if (hallucinationCheck.isHallucination) {
      console.log(`HALLUCINATION DETECTED: ${hallucinationCheck.reason}`);
      
      // Apply fix based on hallucination type
      const corrected = fixHallucination(response, hallucinationCheck);
      
      return {
        processedResponse: corrected,
        hallucinationData: {
          wasDetected: true,
          confidence: hallucinationCheck.confidence,
          reason: hallucinationCheck.reason
        }
      };
    }
    
    // No hallucination detected, return original
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
    
  } catch (error) {
    console.error("Error in hallucination handler:", error);
    
    // Return original in case of error
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
  }
};

/**
 * Fix hallucinations based on detection result
 */
const fixHallucination = (
  response: string,
  hallucinationCheck: { 
    isHallucination: boolean; 
    confidence: number; 
    reason?: string 
  }
): string => {
  // Different strategies based on hallucination type
  if (hallucinationCheck.reason?.includes('memory reference')) {
    return fixMemoryReference(response);
  }
  
  if (hallucinationCheck.reason?.includes('repeated phrase')) {
    return fixRepeatedPhrases(response);
  }
  
  if (hallucinationCheck.reason?.includes('continuity')) {
    return fixContinuityClaim(response);
  }
  
  // Default fix for any other hallucination type
  return fixGeneralHallucination(response);
};

/**
 * Fix false memory references
 */
const fixMemoryReference = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me|indicated)/gi, "you're saying")
    .replace(/you've been (feeling|experiencing|dealing with)/gi, "you're")
    .replace(/as you (mentioned|said|noted|pointed out)/gi, "from what you're sharing")
    .replace(/earlier you (mentioned|said|talked about)/gi, "you just shared that")
    .replace(/I remember/gi, "I understand")
    .replace(/we (discussed|talked about)/gi, "you mentioned");
};

/**
 * Fix repeated phrases
 */
const fixRepeatedPhrases = (response: string): string => {
  // Split into sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // Find unique sentences (remove duplicates)
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Join back and return
  return uniqueSentences.join(' ');
};

/**
 * Fix false continuity claims
 */
const fixContinuityClaim = (response: string): string => {
  return response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
};

/**
 * Fix general hallucination
 */
const fixGeneralHallucination = (response: string): string => {
  return "Based on what you're sharing, " + response;
};
