
/**
 * Memory Response Processing
 * 
 * Handles integration of memory enhancements into responses
 */

import { enhanceWithMemoryBank } from './memoryEnhancement';

/**
 * Enhances responses with memory integration
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @param conversationHistory Previous conversation for context
 * @returns Memory-enhanced response text
 */
export function processMemory(
  responseText: string, 
  userInput: string, 
  conversationHistory: string[] = []
): string {
  try {
    return enhanceWithMemoryBank(responseText, userInput, conversationHistory);
  } catch (error) {
    console.error("Error in processMemory:", error);
  }
  
  return responseText;
}
