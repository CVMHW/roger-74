
/**
 * Hallucination Prevention Retrieval
 * 
 * This module provides functions for retrieving relevant information
 * to prevent hallucinations in Roger's responses.
 */

import { searchMemory } from '../memory/memoryController';
import { MemoryPiece } from '../memory/memoryBank';

/**
 * Retrieve facts from memory to ground responses
 */
export const retrieveFactualGrounding = (
  topics: string[],
  limit: number = 3
): MemoryPiece[] => {
  try {
    // Search memory for relevant facts
    const memories = searchMemory({
      keywords: topics,
      limit
    });
    
    // Convert to correctly typed memories
    return memories.map(memory => ({
      content: memory.content,
      role: memory.role,
      metadata: memory.metadata,
      importance: memory.importance || 0.5
    }));
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};

/**
 * Retrieve patient's exact phrasing on topics
 */
export const retrievePatientPhrasing = (
  topics: string[],
  limit: number = 2
): string[] => {
  try {
    // Search for patient memories
    const memories = searchMemory({
      keywords: topics,
      role: 'patient',
      limit
    });
    
    // Extract exact phrases
    return memories.map(memory => memory.content);
  } catch (error) {
    console.error("Error retrieving patient phrasing:", error);
    return [];
  }
};

/**
 * Check if a topic has been mentioned before
 */
export const hasTopicBeenDiscussed = (topic: string): boolean => {
  try {
    const memories = searchMemory({
      keywords: [topic],
      limit: 1
    });
    
    return memories.length > 0;
  } catch (error) {
    console.error("Error checking topic discussion history:", error);
    return false;
  }
};

/**
 * Retrieve Roger's previous responses on similar topics
 */
export const retrieveSimilarResponses = (
  topics: string[],
  limit: number = 2
): string[] => {
  try {
    // Search for Roger's memories
    const memories = searchMemory({
      keywords: topics,
      role: 'roger',
      limit
    });
    
    // Extract responses
    return memories.map(memory => memory.content);
  } catch (error) {
    console.error("Error retrieving similar responses:", error);
    return [];
  }
};

/**
 * Get patient sentiment on topics
 */
export const getPatientSentiment = (topics: string[]): Record<string, string> => {
  const sentiments: Record<string, string> = {};
  
  try {
    // For each topic, try to determine sentiment
    for (const topic of topics) {
      const memories = searchMemory({
        keywords: [topic],
        role: 'patient',
        limit: 3
      });
      
      // Simple sentiment detection (would be more sophisticated in practice)
      let positive = 0;
      let negative = 0;
      
      for (const memory of memories) {
        const content = memory.content.toLowerCase();
        
        // Simple word counting
        if (/good|great|like|love|happy|enjoy/i.test(content)) {
          positive++;
        }
        
        if (/bad|hate|dislike|awful|terrible|sad|angry/i.test(content)) {
          negative++;
        }
      }
      
      // Determine sentiment
      if (positive > negative) {
        sentiments[topic] = 'positive';
      } else if (negative > positive) {
        sentiments[topic] = 'negative';
      } else {
        sentiments[topic] = 'neutral';
      }
    }
  } catch (error) {
    console.error("Error determining patient sentiment:", error);
  }
  
  return sentiments;
};

// Export all retrieval functions
export default {
  retrieveFactualGrounding,
  retrievePatientPhrasing,
  hasTopicBeenDiscussed,
  retrieveSimilarResponses,
  getPatientSentiment
};
