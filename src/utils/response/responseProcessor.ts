
/**
 * Response Processor - Master Integration
 * 
 * Unified system that integrates all memory and hallucination prevention systems
 * for optimized, brief patient interactions (30s-5min)
 * 
 * This is the main entry point for all response processing functionality,
 * ensuring consistent application of memory rules and hallucination prevention.
 */

// Export the unified response processing system
export { 
  processCompleteResponse as processResponseThroughMasterRules,
  enhanceResponseWithMemory
} from './processor';

// Re-export integrated hallucination prevention
export { preventHallucinations } from '../memory/hallucination/preventionV2';

// Re-export memory utilities for direct access
export { 
  addMemory, 
  searchMemory,
  resetMemory,
  getMemoryStatus,
  processResponse 
} from '../memory/memoryController';

// Re-export legacy systems for backward compatibility
export { 
  getFiveResponseMemory, 
  addToFiveResponseMemory 
} from '../memory/fiveResponseMemory';
