
/**
 * Enhanced Roger Memory System
 * 
 * Comprehensive multi-level memory architecture optimized for brief patient interactions (30s-5min)
 * Features:
 * 1. Short-term memory for recent conversation
 * 2. Working memory for active conversation context
 * 3. Long-term memory for persistent important details
 * 4. Patient profile memory for preferences and patterns
 * 5. Backup memory for system resilience
 * 6. Advanced hallucination prevention for early interactions
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
  initializeMemory,
  getConversationMessageCount,
  processResponse,
  updateMemoryConfig
} from './memoryController';

// Export the master integrated system
export { 
  MasterMemorySystem, 
  masterMemory 
} from './masterMemory';

// Re-export config
export { DEFAULT_MEMORY_CONFIG } from './config';

// Re-export hallucination prevention
export { preventHallucinations } from './hallucination/preventionV2';

// Re-export early conversation handling
export { isEarlyConversation } from './systems/earlyConversationHandler';

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
