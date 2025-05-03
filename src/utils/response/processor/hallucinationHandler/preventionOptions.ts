
/**
 * Prevention options determination
 * 
 * Analyze content to configure appropriate hallucination prevention settings
 */

import { HallucinationPreventionOptions } from '../../../../types/hallucinationPrevention';

/**
 * Determine appropriate prevention options based on content
 */
export const determinePreventionOptions = (
  responseText: string,
  conversationHistory: string[]
): {
  preventionOptions: HallucinationPreventionOptions;
  requiresPrevention: boolean;
} => {
  // Default prevention options
  const preventionOptions: HallucinationPreventionOptions = {
    enableReasoning: false,
    enableRAG: false,
    enableDetection: true,
    detectionSensitivity: 0.65,
    enableTokenLevelDetection: true,
    reasoningThreshold: 0.7 // Required property
  };

  let requiresPrevention = false;
  
  // Track if we have a potential memory reference
  const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|we've been|you shared|as I recall/i.test(responseText);
  
  // Check for repeated phrases which are a strong signal for hallucination
  const repeatedPhrases = detectRepeatedPhrases(responseText);
  
  // For responses with potential repetition, apply special prevention focused on repetition
  if (repeatedPhrases) {
    console.log("REPETITION DETECTED: Applying specialized repetition correction");
    
    // Use options focused on repetition detection
    preventionOptions.detectionSensitivity = 0.95;
    preventionOptions.enableReasoning = true;
    preventionOptions.enableRAG = false;
    preventionOptions.enableTokenLevelDetection = true;
    preventionOptions.enableReranking = true;
    preventionOptions.reasoningThreshold = 0.8; // Adjusted for repetition cases
    
    requiresPrevention = true;
    return { preventionOptions, requiresPrevention };
  }
  
  // For regular conversations with memory references, apply standard prevention
  if (containsMemoryReference) {
    preventionOptions.enableReasoning = true;
    preventionOptions.enableRAG = true;
    preventionOptions.enableDetection = true;
    preventionOptions.detectionSensitivity = 0.8;
    preventionOptions.reasoningThreshold = 0.7;
    preventionOptions.enableTokenLevelDetection = true;
    
    requiresPrevention = true;
    return { preventionOptions, requiresPrevention };
  }
  
  // For basic check with low sensitivity
  requiresPrevention = true;
  return { preventionOptions, requiresPrevention };
};

/**
 * Detect repeated phrases in a response
 */
export const detectRepeatedPhrases = (text: string): boolean => {
  // Common repetition patterns that indicate hallucination
  const patterns = [
    /I hear you're dealing with.*I hear you're dealing with/i,
    /you mentioned.*you mentioned/i,
    /I understand.*I understand/i,
    /you said.*you said/i,
    /you told me.*you told me/i,
    /you're feeling.*you're feeling/i,
    /you may have indicated.*you may have indicated/i,
    /I hear.*I hear/i
  ];
  
  // Check for any matching pattern
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  // Check for general repetition of phrases
  const phrases = text.match(/\b(\w+\s+\w+\s+\w+)\b/g) || [];
  const phraseCounts: Record<string, number> = {};
  
  for (const phrase of phrases) {
    const normalized = phrase.toLowerCase();
    phraseCounts[normalized] = (phraseCounts[normalized] || 0) + 1;
    
    // If any 3-word phrase appears more than once, it's likely repetition
    if (phraseCounts[normalized] > 1) {
      return true;
    }
  }
  
  return false;
};
