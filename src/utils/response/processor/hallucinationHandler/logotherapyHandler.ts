
/**
 * Logotherapy-specific hallucination handling
 * 
 * Ensures that logotherapy-based responses maintain accuracy
 * and avoid false meaning attributions or fabricated memories
 */

import { UNIVERSAL_LAW_MEANING_PURPOSE } from '../../../masterRules/universalLaws';
import { getMeaningfulMemories } from '../../../memory/memoryBank';

/**
 * Check for common logotherapy-related hallucinations
 */
export const checkLogotherapyHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): {
  hasHallucination: boolean;
  correctedResponse?: string;
} => {
  console.log("LOGOTHERAPY HALLUCINATION CHECK: Enforcing", UNIVERSAL_LAW_MEANING_PURPOSE.name);
  
  // Check for false claims about patient values
  const falseValuesClaim = /your values (are|include|seem to be) (truth|honesty|integrity|family|connection|achievement|peace|wisdom|power|security|tradition|stimulation|hedonism|benevolence|universalism|self-direction|conformity)/i;
  
  // Check for false claims about patient meaning sources
  const falseMeaningSourceClaim = /your (main source|primary source|central source) of meaning (is|seems to be|appears to be) (work|family|creativity|spirituality|service|knowledge|relationships|self-improvement|nature)/i;
  
  // Check for fabricated meaningful experiences
  const fabricatedExperienceClaim = /you (mentioned|shared|talked about|described) (a meaningful|an important|a significant) experience (with|about|involving) (your|a) (mentor|parent|friend|teacher|partner|child|colleague)/i;
  
  // Detect hallucinations
  const hasValueHallucination = falseValuesClaim.test(responseText);
  const hasMeaningSourceHallucination = falseMeaningSourceClaim.test(responseText);
  const hasExperienceHallucination = fabricatedExperienceClaim.test(responseText);
  
  // Get actual meaningful memories from the memory system
  const meaningfulMemories = getMeaningfulMemories(userInput, 3);
  
  // If we have hallucinations, correct them
  if (hasValueHallucination || hasMeaningSourceHallucination || hasExperienceHallucination) {
    console.log("LOGOTHERAPY HALLUCINATION DETECTED: Correcting response");
    
    let correctedResponse = responseText;
    
    // Replace false values claims with Socratic questions
    if (hasValueHallucination) {
      correctedResponse = responseText.replace(
        falseValuesClaim,
        "I'm curious about what values are most important to you"
      );
    }
    
    // Replace false meaning source claims with exploration
    if (hasMeaningSourceHallucination) {
      correctedResponse = correctedResponse.replace(
        falseMeaningSourceClaim,
        "I wonder what sources of meaning are most significant in your life"
      );
    }
    
    // Replace fabricated experiences with genuine inquiry
    if (hasExperienceHallucination) {
      correctedResponse = correctedResponse.replace(
        fabricatedExperienceClaim,
        "I'd be interested in hearing about experiences that have felt meaningful to you"
      );
    }
    
    // If we have actual meaningful memories, incorporate them
    if (meaningfulMemories.length > 0) {
      const memory = meaningfulMemories[0];
      correctedResponse += ` Based on what you've shared, ${memory.content.substring(0, 50)}... seems important to you.`;
    }
    
    return {
      hasHallucination: true,
      correctedResponse
    };
  }
  
  return { hasHallucination: false };
};

/**
 * Get meaningful memories from the MemoryBank
 * Placeholder function - in a real implementation, this would query the memory system
 */
export const getMeaningfulMemories = (userInput: string, count: number = 3): any[] => {
  // This would normally connect to the memory system
  // For now, return an empty array as a placeholder
  return [];
};
