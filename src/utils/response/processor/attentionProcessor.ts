
/**
 * Attention processing functionality
 * Handles multi-head attention and processing of attention results
 */

import { processWithMultiHeadAttention } from '../../memory/multiHeadAttention';

/**
 * Process attention results
 */
export const processAttentionResults = (
  userInput: string,
  attentionResults: any
): void => {
  // Process and utilize attention results
  // This is a placeholder for the actual implementation
  console.log("Processing attention results for input:", userInput.substring(0, 20));
};

/**
 * Process input through attention system and update memory
 */
export const processInputWithAttention = (
  userInput: string,
  conversationHistory: string[]
): any => {
  // CRITICAL: Process input through multi-head attention system
  const attentionResults = processWithMultiHeadAttention(userInput, conversationHistory);
  
  // Process attention results and update memory systems
  processAttentionResults(userInput, attentionResults);
  
  return attentionResults;
};
