
/**
 * Memory enforcement core functionality
 */

import { getContextualMemory } from '../../nlpProcessor';
import { retrieveRelevantMemories } from '../../memory/memoryBank';
import { enhanceWithTopicMemory, enhanceWithRelevantMemory, enhanceWithRapport } from './enhancer';

/**
 * Enforce memory utilization in responses
 * Ensures Roger demonstrates understanding of the patient's concerns
 * and integrates past conversation details into new responses.
 */
export const applyMemoryRules = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): string => {
  try {
    console.log("MEMORY ENFORCER: Applying memory rules to response");
    
    // UNCONDITIONAL RULE: Always use contextual memory
    const memory = getContextualMemory(userInput);
    
    // If we have dominant topics or emotions, enhance the response
    if (memory.dominantTopics.length > 0 || memory.dominantEmotion !== 'neutral') {
      return enhanceWithTopicMemory(
        responseText,
        memory.dominantTopics.length > 0 ? memory.dominantTopics[0] : '',
        memory.dominantEmotion
      );
    }
    
    // UNCONDITIONAL RULE: Always check for relevant memories
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    if (relevantMemories.length > 0) {
      return enhanceWithRelevantMemory(responseText, userInput, relevantMemories);
    }
    
    // UNCONDITIONAL RULE: Enhance response with memory integration
    return enhanceWithRapport(responseText, userInput, conversationHistory);
    
  } catch (error) {
    console.error('Error applying memory rules:', error);
    return responseText;
  }
};
