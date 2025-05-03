
/**
 * Error handling utilities for response processor
 */

import { addToFiveResponseMemory, getLastPatientMessage } from '../../memory/fiveResponseMemory';
import { addToMemoryBank, retrieveRelevantMemories } from '../../memory/memoryBank';
import { getContextualMemory } from '../../nlpProcessor';

/**
 * Handle errors in response processing
 * Ensures memory systems are still updated and returns a graceful fallback
 */
export const handleResponseProcessingError = (
  error: Error,
  userInput: string,
  response: string
): string => {
  console.error('Error in processing response through master rules:', error);
  
  // UNCONDITIONAL RULE: Even on error, record to ALL memory systems
  try {
    // Primary memory system
    const { enforceMemoryRule } = require('../../masterRules/unconditionalRuleProtections');
    enforceMemoryRule(userInput, response);
    
    // CRITICAL: Use 5ResponseMemory as backup even in error case
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', response);
    
    // CRITICAL: Use MemoryBank as backup even in error case
    addToMemoryBank(userInput, 'patient');
    addToMemoryBank(response, 'roger');
  } catch (memoryError) {
    console.error('Failed to enforce memory rule during error recovery:', memoryError);
  }
  
  return generateErrorRecoveryResponse(userInput, response);
};

/**
 * Generate a response that attempts to recover from an error
 * Uses triple-redundant memory systems
 */
const generateErrorRecoveryResponse = (userInput: string, response: string): string => {
  try {
    // Try to get memory from most advanced system first (MemoryBank)
    const relevantMemories = retrieveRelevantMemories(userInput);
    if (relevantMemories.length > 0) {
      return `I remember what you said about "${relevantMemories[0].content.substring(0, 20)}..." ${response}`;
    }
    
    // Try to get memory from 5ResponseMemory system next
    const lastPatientMessage = getLastPatientMessage();
    if (lastPatientMessage) {
      return `I remember what you said about "${lastPatientMessage.substring(0, 20)}..." ${response}`;
    }
    
    // Fallback to primary memory system
    const memory = getContextualMemory(userInput);
    if (memory.dominantTopics && memory.dominantTopics.length > 0) {
      return `I remember what you've shared about ${memory.dominantTopics[0]}. ${response}`;
    }
    
    // Ultimate fallback if all systems fail to provide context
    return `I remember what you've told me. ${response}`;
  } catch (finalError) {
    console.error('Critical failure in error recovery:', finalError);
    // Return original response with basic memory reference if all else fails
    return `I remember what you've told me. ${response}`;
  }
};
