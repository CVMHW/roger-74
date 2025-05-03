
/**
 * Hallucination Handler - Main Entry Point
 * 
 * Integrates the hallucination prevention system into the response
 * processing pipeline with enhanced detection capabilities.
 */

// Export the main functionality
export { handlePotentialHallucinations } from '../hallucinationHandler';

// Export specialized handlers
export { fixDangerousRepetitionPatterns } from './patternFixer';
export { handleMemoryHallucinations } from './memoryHandler';
export { determinePreventionOptions } from './preventionOptions';
export { handleHealthHallucination, hasRepeatedContent, fixRepeatedContent } from './specialCases';

// Re-export from submodules
export * from './utils';

// Export the new early conversation functionality
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

// Export the new memory hallucination handler
export const handleMemoryHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  // Check if this is early in conversation
  const isEarlyConversation = conversationHistory.length < 3;
  
  // For early conversations, be extra cautious about memory claims
  if (isEarlyConversation) {
    return applyEarlyConversationRAG(response, userInput);
  }
  
  // For established conversations, just do basic checks
  if (response.includes("you mentioned") || response.includes("I remember")) {
    // Add hedging language
    return "From what I understand, " + response;
  }
  
  return response;
};

// Export from previous implementations
export { applyEarlyConversationRAG } from './earlyConversation';

// Export the new emergency path detection system
export * from '../emergencyPathDetection';
