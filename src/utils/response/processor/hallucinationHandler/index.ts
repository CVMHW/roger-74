
/**
 * Hallucination Handler - Main Entry Point
 * 
 * Integrates the hallucination prevention system into the response
 * processing pipeline with enhanced detection capabilities.
 */

// Export the main functionality
export { 
  handlePotentialHallucinations,
  handleMemoryHallucinations,
  fixDangerousRepetitionPatterns,
  handleHealthHallucination,
  fixFalseMemoryReferences,
  hasRepeatedContent,
  fixRepeatedContent
} from './core';

// Export specialized handlers
export { determinePreventionOptions } from './preventionOptions';

// Export special cases handlers
export * from './utils';

// Export the early conversation functionality
export * from '../earlyConversation';

// Export missing function for conversation stage handler
export { applyEarlyConversationRAG } from '../../earlyConversation';

// Export the emergency path detection system
export * from '../emergencyPathDetection';
