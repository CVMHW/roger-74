
/**
 * Hallucination Prevention Options
 * 
 * Configures hallucination prevention options based on context
 */

import { HallucinationPreventionOptions } from '../../../../types/hallucinationPrevention';

/**
 * Determine appropriate hallucination prevention options
 * based on conversation context
 */
export const determinePreventionOptions = (
  response: string,
  conversationHistory: string[]
): { preventionOptions: HallucinationPreventionOptions; requiresPrevention: boolean } => {
  // Default prevention options
  const preventionOptions: HallucinationPreventionOptions = {
    enableReasoning: true,
    enableRAG: true,
    enableDetection: true,
    reasoningThreshold: 0.7,
    detectionSensitivity: 0.7,
    enableTokenLevelDetection: true,
    tokenThreshold: 0.6,
    enableReranking: false,
    enableNLIVerification: false
  };
  
  // Detect common hallucination triggers in the response
  const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(response);
  const containsEarlyReference = /last time|previous session|we've been|we discussed|as I mentioned earlier/i.test(response);
  
  // Early conversation requires more aggressive prevention
  const isEarlyConversation = conversationHistory.length < 3;
  let requiresPrevention = false;
  
  if (isEarlyConversation) {
    preventionOptions.enableRAG = true;
    preventionOptions.detectionSensitivity = 0.85;
    preventionOptions.enableTokenLevelDetection = true;
    preventionOptions.tokenThreshold = 0.7;
    requiresPrevention = true;
  }
  
  // Adjust options for high-risk responses
  if (containsMemoryReference) {
    preventionOptions.detectionSensitivity = 0.85;
    preventionOptions.enableReranking = true;
    requiresPrevention = true;
  }
  
  // Extra precautions for early conversation references
  if (containsEarlyReference && isEarlyConversation) {
    preventionOptions.detectionSensitivity = 0.95;
    preventionOptions.enableTokenLevelDetection = true;
    preventionOptions.enableNLIVerification = true;
    requiresPrevention = true;
  }
  
  return { preventionOptions, requiresPrevention };
};
