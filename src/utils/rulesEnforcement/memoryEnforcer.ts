
// Add this line at the top of the file if it doesn't exist
const MEMORY_STORAGE = { data: [] };

/**
 * Memory Enforcer
 * 
 * Applies rules to enhance memory utilization in responses.
 * This ensures Roger demonstrates understanding of the patient's concerns
 * and integrates past conversation details into new responses.
 */

import { getContextualMemory } from '../nlpProcessor';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { enhanceResponseWithRapport } from '../response/responseIntegration';

/**
 * Enforce memory utilization in responses
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
      const topicPhrase = memory.dominantTopics.length > 0 
        ? `talking about ${memory.dominantTopics[0]}`
        : 'sharing your thoughts';
      
      const emotionPhrase = memory.dominantEmotion !== 'neutral'
        ? `feeling ${memory.dominantEmotion}`
        : 'having these experiences';
      
      const memoryEnhancedResponse = `I remember you ${topicPhrase} and ${emotionPhrase}. ${responseText}`;
      return memoryEnhancedResponse;
    }
    
    // UNCONDITIONAL RULE: Always check for relevant memories
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    if (relevantMemories.length > 0) {
      // Use most relevant memory for response enhancement
      const topMemory = relevantMemories[0];
      
      // Enhance response based on memory content
      const memoryEnhancedResponse = `I remember you mentioned ${topMemory.content.substring(0, 30)}... ${responseText}`;
      return memoryEnhancedResponse;
    }
    
    // UNCONDITIONAL RULE: Enhance response with memory integration
    const enhancedResponse = enhanceResponseWithRapport(responseText, userInput, 0, conversationHistory);
    return enhancedResponse;
    
  } catch (error) {
    console.error('Error applying memory rules:', error);
    return responseText;
  }
};

// Add a helper function to manipulate the memory storage
export const addToMemoryStorage = (item: any) => {
  if (MEMORY_STORAGE && MEMORY_STORAGE.data) {
    MEMORY_STORAGE.data.push(item);
  }
};

// Add a helper function to retrieve from memory storage
export const getFromMemoryStorage = () => {
  return MEMORY_STORAGE && MEMORY_STORAGE.data ? MEMORY_STORAGE.data : [];
};

export default {
  applyMemoryRules,
  addToMemoryStorage,
  getFromMemoryStorage
};
