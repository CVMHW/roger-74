
/**
 * Special case handling for hallucinations
 * 
 * Handles specific types of hallucinations like health topics and repetition
 */

import { fixRepeatedContent as fixRepeatedContentOriginal, hasRepeatedContent as hasRepeatedContentOriginal } from '../../../hallucinationPrevention/repetitionHandler';

/**
 * Re-export repetition handling functionality
 */
export const hasRepeatedContent = hasRepeatedContentOriginal;
export const fixRepeatedContent = fixRepeatedContentOriginal;

/**
 * Handle the specific "health" hallucination
 */
export const handleHealthHallucination = (
  responseText: string,
  conversationHistory: string[]
): {
  isHealthHallucination: boolean;
  correctedResponse: string;
} => {
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
      isHealthHallucination: true,
      correctedResponse
    };
  }
  
  return {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
};
