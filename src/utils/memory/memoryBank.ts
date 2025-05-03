
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

// Define the MemoryPiece interface for use with multiHeadAttention
export interface MemoryPiece {
  content: string;
  role: 'patient' | 'roger';
  metadata?: any;
  timestamp?: number;
  importance?: number;
}

/**
 * Retrieve relevant memories based on user input
 */
export const retrieveRelevantMemories = (userInput: string, keywords?: string[]): MemoryPiece[] => {
  const memories: MemoryPiece[] = [];
  
  try {
    // First check for Cleveland-specific memories
    const clevelandTopics = detectClevelandTopics(userInput);
    if (clevelandTopics.length > 0) {
      const clevelandMemories = findClevelandMemories(userInput);
      clevelandMemories.forEach(memory => {
        memories.push({
          content: memory,
          role: 'roger',
          importance: 0.7
        });
      });
    }
    
    // Check for stressor-related memories
    const stressors = detectStressors(userInput);
    if (stressors.length > 0) {
      const stressorMemories = findStressorMemories(userInput);
      stressorMemories.forEach(memory => {
        memories.push({
          content: memory,
          role: 'roger',
          importance: 0.8
        });
      });
    }
    
    // Then check general memory system
    const searchKeywords = keywords || extractKeywords(userInput);
    const memoryResults = searchMemory({
      keywords: searchKeywords,
      limit: 3
    });
    
    if (memoryResults && memoryResults.length > 0) {
      for (const item of memoryResults) {
        if (item.role === 'patient') {
          memories.push({
            content: `You mentioned ${item.content.substring(0, 30)}...`,
            role: 'roger',
            metadata: item.metadata,
            importance: item.importance
          });
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving relevant memories:", error);
  }
  
  return memories;
};

/**
 * Add memory to the memory system
 * Used to store important information for future reference
 */
export const addMemory = (
  content: string, 
  role: 'patient' | 'roger', 
  context?: any, 
  importance: number = 0.5
): void => {
  try {
    // Use the memory controller's addMemory function (from import if available)
    // For now implementing a basic version
    console.log(`Adding memory: ${content} (${role})`);
    
    // We could store this in a local memory cache if needed
    const memoryItem = {
      content,
      role,
      metadata: context,
      timestamp: Date.now(),
      importance
    };
    
    // In a real implementation, this would be persisted
  } catch (error) {
    console.error("Error adding memory:", error);
  }
};

/**
 * Add memory to the memory bank
 * This function is for compatibility with older code
 */
export const addToMemoryBank = (content: string, role: 'patient' | 'roger', context?: any, importance: number = 0.5): void => {
  addMemory(content, role, context, importance);
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
