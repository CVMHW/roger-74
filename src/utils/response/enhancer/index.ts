
/**
 * Response Enhancer Index
 * 
 * Re-exports from the response enhancer system for simplified imports
 */

// Import from the new integrated system
import { enhanceResponse } from '../enhancer';
import { processResponseThroughMasterRules } from '../responseProcessor';
import { enhanceWithMemoryBank as enhanceWithMemory } from '../processor/memoryEnhancement'; 

// Re-export the main functionality
export { enhanceResponse };
export { processResponseThroughMasterRules };
export { enhanceWithMemory };

// Export type definitions
export * from '../processor/types';
