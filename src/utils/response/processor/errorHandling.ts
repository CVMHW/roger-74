
/**
 * Error handling for response processor
 */

import { addMemory } from '../../memory/memoryBank';

/**
 * Adds error to memory for future correction
 */
export const recordErrorToMemory = (
  errorType: string,
  errorContext: any,
  userInput: string
): void => {
  try {
    // Create error record
    const errorRecord = {
      type: errorType,
      timestamp: Date.now(),
      context: errorContext,
      userInput
    };
    
    // Store in memory system with high importance
    addMemory(
      `ERROR: ${errorType} occurred during response processing`,
      'roger',
      { errorInfo: errorRecord },
      0.9
    );
    
    console.error(`Response processor error recorded: ${errorType}`, errorContext);
  } catch (e) {
    // If even error recording fails, just log to console
    console.error("Failed to record error to memory:", e);
  }
};

/**
 * Checks past memory for similar errors
 */
export const checkErrorHistory = (errorType: string): boolean => {
  // Implementation would depend on memory system
  // Just a placeholder for now
  return false;
};

/**
 * Get error-correction strategies from memory
 */
export const retrieveErrorCorrectionStrategies = (
  errorType: string,
  errorContext: any
): string[] => {
  // Implementation would vary based on the actual error correction system
  // Just a placeholder for now
  return [
    "Try alternative phrasing",
    "Focus on reflection instead of advice",
    "Use simpler language",
    "Break response into shorter sentences"
  ];
};

/**
 * Process errors in recent responses
 */
export const analyzeRecentResponseErrors = (
  recentMemories: any[]
): string[] => {
  const errorPatterns: string[] = [];
  
  // Look for error patterns in recent responses
  for (const memory of recentMemories) {
    if (memory.role === 'roger' && memory.metadata?.errorInfo) {
      const errorType = memory.metadata.errorInfo.type;
      
      // If content exists and is a string
      if (memory.content && typeof memory.content === 'string' && 
          memory.content.includes("ERROR")) {
        errorPatterns.push(errorType);
      }
    }
  }
  
  return errorPatterns;
};

export default {
  recordErrorToMemory,
  checkErrorHistory,
  retrieveErrorCorrectionStrategies,
  analyzeRecentResponseErrors
};
