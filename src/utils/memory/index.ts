
/**
 * Roger Memory System
 * 
 * A comprehensive multi-level memory architecture that provides:
 * 1. Short-term memory for recent conversation
 * 2. Working memory for active conversation context
 * 3. Long-term memory for persistent important details
 * 4. Patient profile memory for preferences and patterns
 * 5. Backup memory for system resilience
 * 
 * This file re-exports the public API for the memory system.
 */

// Re-export the main controller
export {
  addMemory,
  searchMemory,
  getMemoryStatus,
  resetMemory,
  isNewConversation,
  initializeMemory
} from './memoryController';

// Re-export legacy systems for backward compatibility
export { 
  getFiveResponseMemory, 
  addToFiveResponseMemory, 
  resetFiveResponseMemory 
} from './fiveResponseMemory';

// Export types
export * from './types';

// Initialize memory controller when this module is imported
import { initializeMemory } from './memoryController';
initializeMemory();
