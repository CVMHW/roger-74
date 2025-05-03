
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
      hallucinationResult.processedResponse || masterProcessed,
      undefined,
      undefined,
      0.8 // High importance for Roger's responses
    );
    
    return hallucinationResult.processedResponse || masterProcessed;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return response; // Return original response if enhancement fails
  }
};

// Add these missing functions that are imported in useResponseHooks.ts
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Record user message to memory system
    recordToMemorySystems(userInput);
  } catch (error) {
    console.error("Error recording user message to memory:", error);
  }
};

export const checkForResponseRepetition = (
  response: string,
  recentResponses: string[]
): boolean => {
  if (recentResponses.length === 0) return false;
  
  // Simple check for exact repetition
  if (recentResponses.includes(response)) return true;
  
  // Check for high similarity
  for (const prevResponse of recentResponses) {
    // Simple similarity check - if more than 80% of words match
    const responseWords = new Set(response.toLowerCase().split(/\s+/));
    const prevWords = new Set(prevResponse.toLowerCase().split(/\s+/));
    const intersection = [...responseWords].filter(word => prevWords.has(word));
    const similarity = intersection.length / Math.max(responseWords.size, prevWords.size);
    
    if (similarity > 0.8) return true;
  }
  
  return false;
};

export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice I may have been repeating myself. Let's approach this differently. What aspect of your situation feels most important to address right now?",
    "I want to make sure I'm being helpful. Could you tell me more specifically what you'd like to explore about this?",
    "I realize we might be covering similar ground. What's one thing about this situation that we haven't discussed yet?",
    "Let's shift our focus a bit. What would be most helpful for you to talk about at this moment?",
    "I'd like to understand your experience better. Could you share more about how this situation has been affecting you day to day?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};
