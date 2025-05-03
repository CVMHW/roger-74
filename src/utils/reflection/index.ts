
/**
 * Public API for reflection utilities
 * With MULTI-MEMORY system integration and TERTIARY SAFEGUARD
 */

import { ConcernType } from "./reflectionTypes";
import { detectDevelopmentalStage } from "./reflectionStrategies";
import { identifyEnhancedFeelings } from "./detectors/basicFeelingDetector";
import { generateReflectionResponse } from "./generators/reflectionResponseGenerator";
import { recordToMemory } from '../nlpProcessor';
import { addToFiveResponseMemory } from '../memory/fiveResponseMemory';
import { processThroughChatLogReview } from '../response/chatLogReviewer';

// Core reflection exports
export {
  detectDevelopmentalStage,
  identifyEnhancedFeelings,
  generateReflectionResponse
};

// Memory system integration helpers for reflection utilities
// Now with tertiary safeguard integration
export const recordReflectionToAllMemorySystems = (
  userInput: string,
  reflection: string,
  conversationHistory: string[] = []
) => {
  try {
    // Record to primary memory system
    recordToMemory(userInput, reflection);
    
    // Record to 5ResponseMemory backup system
    addToFiveResponseMemory('patient', userInput);
    addToFiveResponseMemory('roger', reflection);
    
    // Apply tertiary safeguard if conversation history is available
    if (conversationHistory && conversationHistory.length > 0) {
      // Process through chat log review to ensure continuity
      const enhancedReflection = processThroughChatLogReview(
        reflection,
        userInput,
        conversationHistory
      );
      
      // If the reflection was enhanced, update both memory systems
      if (enhancedReflection !== reflection) {
        recordToMemory(userInput, enhancedReflection);
        addToFiveResponseMemory('roger', enhancedReflection);
        
        return enhancedReflection;
      }
    }
    
    return reflection;
  } catch (error) {
    console.error("Failed to record reflection to memory systems:", error);
    return reflection;
  }
};

// Use 'export type' for re-exporting types when isolatedModules is enabled
export type { ConcernType };
