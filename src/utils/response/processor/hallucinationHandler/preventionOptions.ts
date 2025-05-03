
/**
 * Prevention options determination
 * 
 * Analyze content to configure appropriate hallucination prevention settings
 */

import { HallucinationPreventionOptions } from '../../../../types/hallucinationPrevention';
import { detectRepeatedPhrases } from './repetitionDetector';

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
    enableTokenLevelDetection: true
  };

  let requiresPrevention = false;
  
  // Track if we have a potential memory reference
  const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|we've been|you shared|as I recall/i.test(responseText);
  
  // For responses with potential repetition, apply special prevention focused on repetition
  if (detectRepeatedPhrases(responseText)) {
    console.log("REPETITION DETECTED: Applying specialized repetition correction");
    
    // Use options focused on repetition detection
    preventionOptions.detectionSensitivity = 0.95;
    preventionOptions.enableReasoning = true;
    preventionOptions.enableRAG = false;
    preventionOptions.enableTokenLevelDetection = true;
    preventionOptions.enableReranking = true;
    
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
