
/**
 * Memory System Handler
 * 
 * Connects the response processor to memory systems
 */

import { addMemory } from '../../memory/memoryController';
import { addToFiveResponseMemory } from '../../memory/fiveResponseMemory';

/**
 * Record content to all memory systems
 */
export const recordToMemorySystems = (
  content: string,
  context?: any,
  metadata?: any,
  importance: number = 0.5
): void => {
  try {
    // Record to primary memory system
    addMemory(content, 'roger', context, importance);
    
    // Record to legacy memory system for redundancy
    addToFiveResponseMemory('roger', content);
    
    // Log recording to memory systems
    console.log("MEMORY: Recorded response to memory systems");
    
  } catch (error) {
    // Log error but don't crash
    console.error("ERROR: Failed to record to memory systems", error);
  }
};
