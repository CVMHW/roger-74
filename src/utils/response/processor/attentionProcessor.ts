
/**
 * Attention processing functionality
 * Handles multi-head attention and processing of attention results
 */

import { processWithMultiHeadAttention } from '../../memory/multiHeadAttention';
import { processAttentionResults } from './memoryEnhancement';

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
