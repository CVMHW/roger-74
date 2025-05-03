
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
export { handleHealthHallucination, hasRepeatedContent, fixRepeatedContent } from './specialCases';

// Re-export from submodules
export * from './utils';

// Export from previous implementations
export { applyEarlyConversationRAG } from './earlyConversation';
