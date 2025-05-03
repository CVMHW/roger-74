
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

// Export the new early conversation functionality
export { fixFalseMemoryReferences } from './memoryHandler';

// Create a separate function for early conversation RAG
export const applyEarlyConversationRAG = (
  response: string,
  userInput: string
): string => {
  // Remove any false continuity claims
  let modified = response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
  
  // Add hedging language for early conversations
  if (!modified.startsWith("It sounds like") && !modified.startsWith("I understand")) {
    modified = "Based on what you're sharing, " + modified;
  }
  
  return modified;
};

// Export the emergency path detection system
export * from '../emergencyPathDetection';
