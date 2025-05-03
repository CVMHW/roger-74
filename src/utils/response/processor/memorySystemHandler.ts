
/**
 * Memory system handling functionality
 * Manages recording responses to memory systems
 */

import { addToFiveResponseMemory } from '../../memory/fiveResponseMemory';
import { addToMemoryBank } from '../../memory/memoryBank';

/**
 * Record final response to all memory systems
 */
export const recordToMemorySystems = (
  response: string,
  emotionalContext?: any,
  dominantTopics?: string[],
  importance: number = 0.7
): void => {
  // CRITICAL: Record final response to all memory systems
  addToMemoryBank(
    response, 
    'roger', 
    emotionalContext,
    dominantTopics,
    importance // Good importance for roger responses
  );
  
  addToFiveResponseMemory('roger', response);
};
