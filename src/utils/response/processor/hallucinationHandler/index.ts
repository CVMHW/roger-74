
/**
 * Hallucination Handler - Main Entry Point
 * 
 * Integrates the hallucination prevention system into the response
 * processing pipeline with enhanced detection capabilities.
 */

// Export the main functionality
export { handlePotentialHallucinations } from './core';

// Export specialized handlers
export { fixDangerousRepetitionPatterns } from './core';
export { handleMemoryHallucinations } from './core';
export { determinePreventionOptions } from './preventionOptions';

// Export special cases handlers
export { 
  handleHealthHallucination, 
  hasRepeatedContent, 
  fixRepeatedContent
} from './core';

// Re-export from submodules
export * from './utils';

// Export the early conversation functionality
export { fixFalseMemoryReferences } from './core';

// Export missing function for conversation stage handler
export { applyEarlyConversationRAG } from '../../earlyConversation';

// Export the emergency path detection system
export * from '../emergencyPathDetection';
