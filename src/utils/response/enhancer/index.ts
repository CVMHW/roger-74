
/**
 * Response Enhancer Index
 * 
 * Re-exports from the response enhancer system for simplified imports
 */

// Import from the new integrated system
import { enhanceResponse } from '../enhancer';
import { processResponseThroughMasterRules } from '../responseProcessor';
import { enhanceResponseWithMemory } from '../processor';

// Re-export the main functionality
export { enhanceResponse };
export { processResponseThroughMasterRules };
export { enhanceResponseWithMemory };

// Export type definitions
export * from '../processor/types';
