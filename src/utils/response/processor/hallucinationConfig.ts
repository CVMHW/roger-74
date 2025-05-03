
/**
 * Hallucination prevention configuration
 * Provides configuration for hallucination prevention based on conversation stage
 */

import { HallucinationPreventionOptions } from '../../../types/hallucinationPrevention';

/**
 * Get hallucination prevention options based on conversation stage
 */
export const getHallucinationOptions = (isEarlyConversation: boolean): HallucinationPreventionOptions => {
  // Using stronger hallucination prevention for early conversations
  if (isEarlyConversation) {
    return {
      detectionSensitivity: 0.9,    // Higher sensitivity for new conversations
      enableReasoning: true,
      enableRAG: false,             // Don't enhance with RAG in early conversations
      enableTokenLevelDetection: true,
      enableReranking: true,        // Use re-ranking for early conversations
      reasoningThreshold: 0.7       // Required threshold for reasoning
    };
  } 
  
  // Default options for established conversations
  return {
    detectionSensitivity: 0.7,
    enableReasoning: true,
    enableRAG: true,
    enableTokenLevelDetection: false,
    enableReranking: false,
    reasoningThreshold: 0.7
  };
};
