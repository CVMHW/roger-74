
/**
 * Response Integration
 * 
 * Combines multiple response enhancement systems
 */

import { retrieveRelevantMemories, MemoryPiece } from '../memory/memoryBank';
import { detectClevelandTopics } from '../cleveland/clevelandTopics';
import { enhanceResponseWithClevelandPerspective } from '../cleveland/clevelandResponses';
import { detectStressors } from '../stressors/stressorDetection';
import { enhanceWithStressorAwareness } from './processor/stressorEnhancement';

/**
 * Integrate multiple response enhancement systems
 */
export const integrateResponseEnhancements = (
  baseResponse: string,
  userInput: string,
  options: {
    enhanceCleveland?: boolean;
    enhanceStressors?: boolean;
    enhanceWithMemory?: boolean;
  } = {}
): string {
  let enhancedResponse = baseResponse;
  
  try {
    const {
      enhanceCleveland = true,
      enhanceStressors = true,
      enhanceWithMemory = true
    } = options;
    
    // Enhance with Cleveland perspective if needed
    if (enhanceCleveland) {
      const clevelandTopics = detectClevelandTopics(userInput);
      if (clevelandTopics.length > 0) {
        enhancedResponse = enhanceResponseWithClevelandPerspective(
          enhancedResponse, 
          userInput,
          clevelandTopics
        );
      }
    }
    
    // Enhance with stressor awareness if needed
    if (enhanceStressors) {
      const stressors = detectStressors(userInput);
      if (stressors.length > 0) {
        enhancedResponse = enhanceWithStressorAwareness(
          enhancedResponse,
          userInput
        );
      }
    }
    
    // Enhance with memory if needed
    if (enhanceWithMemory) {
      enhancedResponse = enhanceWithMemoryReferences(
        enhancedResponse,
        userInput
      );
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error integrating response enhancements:", error);
    return baseResponse;
  }
};

/**
 * Enhance response with memory references
 */
const enhanceWithMemoryReferences = (
  response: string,
  userInput: string
): string => {
  try {
    // Skip if response already has memory markers
    if (hasMemoryMarkers(response)) {
      return response;
    }
    
    // Get relevant memories
    const memories = retrieveRelevantMemories(userInput);
    
    // If no relevant memories, return original
    if (memories.length === 0) {
      return response;
    }
    
    // Get highest importance memory
    const significantMemory = getSafeMemory(memories);
    
    // If no safe memory found, return original
    if (!significantMemory) {
      return response;
    }
    
    // For very short responses, add memory at end
    if (response.length < 100) {
      return `${response} ${significantMemory}`;
    }
    
    // For longer responses, insert memory in middle
    const sentences = response.split(/(?<=[.!?])\s+/);
    if (sentences.length > 2) {
      const insertPoint = Math.floor(sentences.length / 2);
      return [
        ...sentences.slice(0, insertPoint),
        significantMemory,
        ...sentences.slice(insertPoint)
      ].join(' ');
    }
    
    // Fallback to append
    return `${response} ${significantMemory}`;
  } catch (error) {
    console.error("Error enhancing with memory references:", error);
    return response;
  }
};

/**
 * Get a safe memory to include
 */
const getSafeMemory = (memories: MemoryPiece[]): string | null => {
  if (memories.length === 0) return null;
  
  // Return the first memory with content
  for (const memory of memories) {
    if (typeof memory.content === 'string' && memory.content.trim().length > 0) {
      return memory.content;
    }
  }
  
  return null;
};

/**
 * Check if response already has memory markers
 */
const hasMemoryMarkers = (response: string): boolean => {
  const memoryMarkers = [
    /you mentioned/i,
    /you told me/i,
    /you shared/i,
    /previously you said/i,
    /earlier you noted/i,
    /I remember you/i
  ];
  
  return memoryMarkers.some(marker => marker.test(response));
};

/**
 * Enhance small talk response
 */
export const enhanceSmallTalkResponse = (
  response: string,
  userInput: string
): string => {
  try {
    // Check for Cleveland-specific content
    const clevelandTopics = detectClevelandTopics(userInput);
    
    // If Cleveland content, enhance with Cleveland perspective
    if (clevelandTopics.length > 0) {
      return enhanceResponseWithClevelandPerspective(
        response,
        userInput,
        clevelandTopics,
        true // Force include for small talk
      );
    }
    
    // Check for stressor content
    const stressors = detectStressors(userInput);
    
    // If stressor content, enhance with stressor awareness
    if (stressors.length > 0) {
      return enhanceWithStressorAwareness(response, userInput);
    }
    
    // For general small talk, use memory enhancement
    return enhanceWithMemoryReferences(response, userInput);
  } catch (error) {
    console.error("Error enhancing small talk response:", error);
    return response;
  }
};

// Export all enhancement functions
export default {
  integrateResponseEnhancements,
  enhanceSmallTalkResponse
};
