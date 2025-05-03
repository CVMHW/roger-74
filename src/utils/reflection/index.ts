
/**
 * Public API for reflection utilities
 * With MULTI-MEMORY system integration
 */

import { ConcernType } from "./reflectionTypes";
import { detectDevelopmentalStage } from "./reflectionStrategies";
import { identifyEnhancedFeelings } from "./detectors/basicFeelingDetector";
import { generateReflectionResponse } from "./generators/reflectionResponseGenerator";
import { recordToMemory } from '../nlpProcessor';
import { addToFiveResponseMemory } from '../memory/fiveResponseMemory';

// Core reflection exports
export {
  detectDevelopmentalStage,
  identifyEnhancedFeelings,
  generateReflectionResponse
};

// Memory system integration helpers for reflection utilities
export const recordReflectionToAllMemorySystems = (
  userInput: string,
  reflection: string
) => {
  try {
    // Record to primary memory system
    recordToMemory(userInput, reflection);
    
    // Record to 5ResponseMemory backup system
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', reflection);
    
    return true;
  } catch (error) {
    console.error("Failed to record reflection to memory systems:", error);
    return false;
  }
};

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { ConcernType };
