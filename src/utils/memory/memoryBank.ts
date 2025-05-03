
/**
 * Memory Bank
 * 
 * Central system for memory storage, retrieval and integration
 */

import { searchMemory } from './memoryController';
import { findClevelandMemories } from '../cleveland/clevelandMemory';
import { detectClevelandTopics } from '../cleveland/clevelandTopics';
import { findStressorMemories } from '../stressors/stressorMemory';
import { detectStressors } from '../stressors/stressorDetection';

/**
 * Retrieve relevant memories based on user input
 */
export const retrieveRelevantMemories = (userInput: string): string[] => {
  const memories: string[] = [];
  
  try {
    // First check for Cleveland-specific memories
    const clevelandTopics = detectClevelandTopics(userInput);
    if (clevelandTopics.length > 0) {
      const clevelandMemories = findClevelandMemories(userInput);
      memories.push(...clevelandMemories);
    }
    
    // Check for stressor-related memories
    const stressors = detectStressors(userInput);
    if (stressors.length > 0) {
      const stressorMemories = findStressorMemories(userInput);
      memories.push(...stressorMemories);
    }
    
    // Then check general memory system
    const memoryResults = searchMemory({
      keywords: extractKeywords(userInput),
      limit: 3
    });
    
    if (memoryResults && memoryResults.length > 0) {
      for (const item of memoryResults) {
        if (item.role === 'patient' && !memories.includes(item.content)) {
          memories.push(`You mentioned ${item.content.substring(0, 30)}...`);
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving relevant memories:", error);
  }
  
  return memories;
};

/**
 * Extract keywords for memory search
 */
const extractKeywords = (text: string): string[] => {
  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'have', 'what', 'when', 'where', 'would', 'could', 'should', 'about'].includes(word)
    );
};

// Re-export other memory functions used elsewhere
export { searchMemory } from './memoryController';

