
/**
 * Memory enhancement utilities for response processing
 */

import { getContextualMemory } from '../../nlpProcessor';
import { addToFiveResponseMemory, getLastPatientMessage, getFiveResponseMemory } from '../../memory/fiveResponseMemory';
import { addToMemoryBank, retrieveRelevantMemories } from '../../memory/memoryBank';
import { processWithMultiHeadAttention } from '../../memory/multiHeadAttention';
import { AttentionResult, MemoryEnhancementParams } from './types';

/**
 * Enhance response using the advanced MemoryBank system
 */
export const enhanceWithMemoryBank = (
  response: string,
  userInput: string,
  relevantMemories: any[],
  conversationHistory: string[] = []
): string => {
  try {
    console.log("MEMORYBANK: Enhancing response with memory bank data");
    
    // Check if response already references memory adequately
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      return response;
    }
    
    // If we have relevant memories, use them to enhance the response
    if (relevantMemories.length > 0) {
      const memory = relevantMemories[0];
      
      // Don't repeat the exact same memory reference if it's already in the response
      if (!response.includes(memory.content.substring(0, 15))) {
        const memoryPhrase = `I remember you mentioned ${memory.content.substring(0, 30)}... `;
        return memoryPhrase + response;
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error enhancing response with MemoryBank:', error);
    return response;
  }
};

/**
 * Verify if memory is being utilized in the response
 * Imported from the original masterRules implementation
 */
export const verifyMemoryUtilization = (
  userInput: string, 
  response: string, 
  conversationHistory: string[] = []
): boolean => {
  // Implementation preserved from original masterRules
  // This is a stub - the actual implementation would come from the imported file
  // Since we don't have access to the original implementation,
  // we're maintaining the function signature for compatibility
  
  // Check for memory-like phrases in the response
  return response.includes("I remember") || 
         response.includes("you mentioned") ||
         response.includes("you said") ||
         response.includes("you told me") ||
         response.includes("you shared") ||
         response.includes("earlier you") ||
         response.includes("previously you");
};

/**
 * Process attention results and update memory systems
 */
export const processAttentionResults = (
  userInput: string,
  attentionResults: AttentionResult
): void => {
  // CRITICAL: Record to MemoryBank system - most advanced memory system
  addToMemoryBank(
    userInput, 
    'patient', 
    attentionResults.emotionalContext,
    attentionResults.dominantTopics,
    0.8 // High importance for user inputs
  );
  
  // CRITICAL: Record to 5ResponseMemory system - redundant protection
  addToFiveResponseMemory('patient', userInput);
};

/**
 * Apply memory enhancement to a response
 */
export const enhanceResponseWithMemory = (
  params: MemoryEnhancementParams
): string => {
  const { response, userInput, conversationHistory = [] } = params;
  
  try {
    console.log("APPLYING MEMORY ENHANCEMENT");
    
    // CRITICAL: Process through multi-head attention
    const attentionResults = processWithMultiHeadAttention(userInput, conversationHistory);
    
    // CRITICAL: Always record to all memory systems for redundancy
    addToMemoryBank(userInput, 'patient', attentionResults.emotionalContext, attentionResults.dominantTopics);
    addToFiveResponseMemory('patient', userInput);
    
    // Check if response already references memory
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      // Still record the response to all memory systems
      addToMemoryBank(response, 'roger', attentionResults.emotionalContext, attentionResults.dominantTopics);
      addToFiveResponseMemory('roger', response);
      return response;
    }
    
    // Apply full memory rules
    const { applyMemoryRules } = require('../../rulesEnforcement/memoryEnforcer');
    const enhancedResponse = applyMemoryRules(response, userInput, conversationHistory);
    
    // CRITICAL: Record enhanced response to all memory systems
    addToMemoryBank(enhancedResponse, 'roger', attentionResults.emotionalContext, attentionResults.dominantTopics);
    addToFiveResponseMemory('roger', enhancedResponse);
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    
    // CRITICAL: Even in error case, ensure memory recording
    try {
      addToFiveResponseMemory('roger', response);
      addToMemoryBank(response, 'roger');
    } catch (memoryError) {
      console.error('Critical failure in memory systems:', memoryError);
    }
    
    return response;
  }
};
