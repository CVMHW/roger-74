
/**
 * Response Enhancer
 * 
 * Applies enhancements to Roger's responses using the integrated memory
 * and hallucination prevention system
 */

import { processResponseThroughMasterRules } from './responseProcessor';
import { enhanceWithMemoryBank } from './processor/memoryEnhancement';
import { handlePotentialHallucinations } from './processor/hallucinationHandler';
import { recordToMemorySystems } from './processor/memorySystemHandler';
import { retrieveRelevantMemories } from '../memory/memoryBank';

/**
 * Enhance a response with memory integration and hallucination prevention
 */
export const enhanceResponse = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    // Get relevant memories from the memory bank
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    // First enhance with memory bank system
    const memoryEnhanced = enhanceWithMemoryBank(
      response,
      userInput,
      relevantMemories,
      conversationHistory
    );
    
    // Apply master rules through the integrated processor
    const masterProcessed = processResponseThroughMasterRules(
      memoryEnhanced,
      userInput,
      conversationHistory
    );
    
    // Check for potential hallucinations
    const hallucinationResult = handlePotentialHallucinations(
      masterProcessed,
      userInput,
      conversationHistory
    );
    
    // Record the final response to memory systems
    recordToMemorySystems(
      hallucinationResult.correctedResponse || masterProcessed,
      undefined,
      undefined,
      0.8 // High importance for Roger's responses
    );
    
    return hallucinationResult.correctedResponse || masterProcessed;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return response; // Return original response if enhancement fails
  }
};
