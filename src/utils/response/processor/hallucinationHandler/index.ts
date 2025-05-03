
/**
 * Hallucination Handler - Main Entry Point
 * 
 * Integrates the hallucination prevention system into the response
 * processing pipeline with enhanced detection capabilities.
 */

// Export the main functionality
export { handlePotentialHallucinations } from './core';

// Export specialized handlers
export { fixDangerousRepetitionPatterns } from './patternFixer';
export { handleMemoryHallucinations } from './memoryHandler';
export { determinePreventionOptions } from './preventionOptions';

// Export special cases handlers
export { 
  handleHealthHallucination, 
  hasRepeatedContent, 
  fixRepeatedContent,
  hasSharedThatPattern 
} from './specialCases';

// Re-export from submodules
export * from './utils';

// Export the early conversation functionality
export { fixFalseMemoryReferences } from './memoryHandler';
export { applyEarlyConversationRAG } from './earlyConversation';

// Export the emergency path detection system
export * from '../emergencyPathDetection';
