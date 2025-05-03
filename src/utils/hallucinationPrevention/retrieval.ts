
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

/**
 * Retrieve augmentation for RAG improvement
 */
export const retrieveAugmentation = (
  userInput: string,
  conversationHistory: string[] = []
): {
  retrievedContent: string[];
  confidence: number;
} => {
  try {
    // Extract potential topics from user input
    const topics = userInput
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 5);
    
    // Get factual memories
    const factualMemories = retrieveFactualGrounding(topics);
    
    // Extract content from memories
    const retrievedContent = factualMemories.map(memory => memory.content);
    
    // Calculate confidence based on memory count and relevance
    const confidence = Math.min(0.8, factualMemories.length * 0.2);
    
    return {
      retrievedContent,
      confidence
    };
  } catch (error) {
    console.error("Error retrieving augmentation:", error);
    return { retrievedContent: [], confidence: 0 };
  }
};

/**
 * Augment response with retrieved content
 */
export const augmentResponseWithRetrieval = (
  response: string,
  retrievalResult: {
    retrievedContent: string[];
    confidence: number;
  }
): string => {
  // If no content or low confidence, return original
  if (retrievalResult.retrievedContent.length === 0 || retrievalResult.confidence < 0.2) {
    return response;
  }
  
  try {
    // For now, just prepend the first retrieved memory
    const memory = retrievalResult.retrievedContent[0];
    
    if (!memory) return response;
    
    // Avoid duplication if response already contains memory
    if (response.includes(memory)) {
      return response;
    }
    
    // Integrate memory naturally
    if (response.length < 100) {
      // For short responses, simply prepend
      return `${memory} ${response}`;
    } else {
      // For longer responses, insert at a natural point
      const sentences = response.split(/(?<=[.!?])\s+/);
      const insertPoint = Math.floor(sentences.length / 3);
      
      return [
        ...sentences.slice(0, insertPoint),
        memory,
        ...sentences.slice(insertPoint)
      ].join(' ');
    }
  } catch (error) {
    console.error("Error augmenting response with retrieval:", error);
    return response;
  }
};

// Export all retrieval functions
export default {
  retrieveFactualGrounding,
  retrievePatientPhrasing,
  hasTopicBeenDiscussed,
  retrieveSimilarResponses,
  getPatientSentiment,
  retrieveAugmentation,
  augmentResponseWithRetrieval
};
