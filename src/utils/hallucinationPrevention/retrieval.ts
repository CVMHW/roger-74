
/**
 * Hallucination Prevention Retrieval
 * 
 * This module provides functions for retrieving relevant information
 * with enhanced chunking and vector search capabilities.
 */

import { searchMemory } from '../memory/memoryController';
import { findMostSimilar } from './vectorEmbeddings';

// Export the MemoryPiece interface for use in other modules
export interface MemoryPiece {
  content: string;
  role: string;
  metadata?: any;
  importance: number;
  chunks?: string[];
}

/**
 * Create chunks from content for more granular retrieval
 */
const createChunks = (content: string, maxChunkLength: number = 100): string[] => {
  // Simple chunking by sentences
  const sentences = content.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed max length, start a new chunk
    if (currentChunk.length + sentence.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

/**
 * Retrieve facts from memory to ground responses with chunking
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
    
    // Convert to MemoryPiece objects with chunking
    return memories.map(memory => {
      // Create chunks for longer content
      const chunks = memory.content.length > 150 ? 
        createChunks(memory.content) : 
        [memory.content];
      
      return {
        content: memory.content,
        role: memory.role,
        metadata: memory.metadata,
        importance: memory.importance || 0.5,
        chunks
      };
    });
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};

/**
 * Retrieve patient's exact phrasing on topics with semantic search
 */
export const retrievePatientPhrasing = async (
  query: string,
  limit: number = 2
): Promise<string[]> => {
  try {
    // First get all patient memories
    const memories = searchMemory({
      role: 'patient',
      limit: 10 // Get more than we need for semantic filtering
    });
    
    // Extract contents
    const contents = memories.map(memory => memory.content);
    
    // Use semantic search to find most relevant
    const mostSimilar = await findMostSimilar(query, contents, limit);
    
    // Return the most semantically similar phrases
    return mostSimilar.map(result => result.text);
  } catch (error) {
    console.error("Error retrieving patient phrasing:", error);
    
    // Fallback to basic keyword search
    const topics = query.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
      
    const memories = searchMemory({
      keywords: topics,
      role: 'patient',
      limit
    });
    
    return memories.map(memory => memory.content);
  }
};

/**
 * Check if a topic has been mentioned before using semantic search
 */
export const hasTopicBeenDiscussed = async (topic: string): Promise<boolean> => {
  try {
    // Get all memories
    const memories = searchMemory({
      limit: 15
    });
    
    // Extract contents
    const contents = memories.map(memory => memory.content);
    
    // Use semantic search to find most relevant
    const mostSimilar = await findMostSimilar(topic, contents, 1);
    
    // Check if the similarity score is high enough
    return mostSimilar.length > 0 && mostSimilar[0].score > 0.7;
  } catch (error) {
    console.error("Error checking topic discussion history:", error);
    
    // Fallback to basic keyword search
    const memories = searchMemory({
      keywords: [topic],
      limit: 1
    });
    
    return memories.length > 0;
  }
};

/**
 * Retrieve Roger's previous responses on similar topics with semantic search
 */
export const retrieveSimilarResponses = async (
  query: string,
  limit: number = 2
): Promise<string[]> => {
  try {
    // First get Roger's memories
    const memories = searchMemory({
      role: 'roger',
      limit: 10 // Get more than we need for semantic filtering
    });
    
    // Extract contents
    const contents = memories.map(memory => memory.content);
    
    // Use semantic search to find most relevant
    const mostSimilar = await findMostSimilar(query, contents, limit);
    
    // Return the most semantically similar responses
    return mostSimilar.map(result => result.text);
  } catch (error) {
    console.error("Error retrieving similar responses:", error);
    
    // Fallback to basic keyword search
    const topics = query.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
      
    const memories = searchMemory({
      keywords: topics,
      role: 'roger',
      limit
    });
    
    return memories.map(memory => memory.content);
  }
};

/**
 * Get patient sentiment on topics using semantic search
 */
export const getPatientSentiment = async (query: string): Promise<Record<string, string>> => {
  const sentiments: Record<string, string> = {};
  
  try {
    // Get patient memories
    const memories = await retrievePatientPhrasing(query, 5);
    
    // Simple sentiment detection
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    for (const memory of memories) {
      const content = memory.toLowerCase();
      
      // Check for positive emotions
      if (/\b(good|great|like|love|happy|enjoy|excited|glad|pleased|hopeful)\b/i.test(content)) {
        positive++;
      }
      
      // Check for negative emotions
      if (/\b(bad|hate|dislike|awful|terrible|sad|angry|upset|worried|anxious|depressed|stressed)\b/i.test(content)) {
        negative++;
      }
      
      // Check for neutral statements
      if (!/\b(good|great|like|love|happy|enjoy|excited|glad|pleased|hopeful|bad|hate|dislike|awful|terrible|sad|angry|upset|worried|anxious|depressed|stressed)\b/i.test(content)) {
        neutral++;
      }
    }
    
    // Determine overall sentiment
    if (positive > negative && positive > neutral) {
      sentiments['overall'] = 'positive';
    } else if (negative > positive && negative > neutral) {
      sentiments['overall'] = 'negative';
    } else {
      sentiments['overall'] = 'neutral';
    }
    
    // Check for specific emotions
    if (/\b(depress(ed|ion)|hopeless|meaningless|empty)\b/i.test(query)) {
      sentiments['depression'] = 'detected';
    }
    
    if (/\b(anxi(ous|ety)|worry|worried|nervous|panic|stress(ed)?)\b/i.test(query)) {
      sentiments['anxiety'] = 'detected';
    }
    
    if (/\b(angry|anger|mad|furious|irritated|frustrated)\b/i.test(query)) {
      sentiments['anger'] = 'detected';
    }
    
  } catch (error) {
    console.error("Error determining patient sentiment:", error);
    sentiments['overall'] = 'unknown';
  }
  
  return sentiments;
};

/**
 * Retrieve augmentation for RAG improvement with semantic search
 */
export const retrieveAugmentation = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<{
  retrievedContent: string[];
  confidence: number;
}> => {
  try {
    // Extract potential topics from user input
    const topics = userInput
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3)
      .slice(0, 7);
    
    // Get all memories
    const memories = searchMemory({
      limit: 20 // Get more memories than needed for semantic filtering
    });
    
    // Extract content from memories
    const allContent = memories.map(memory => memory.content);
    
    // Use semantic search to find most relevant content
    const mostSimilar = await findMostSimilar(userInput, allContent, 3);
    
    // Extract content
    const retrievedContent = mostSimilar.map(result => result.text);
    
    // Calculate confidence based on similarity scores
    const avgSimilarity = mostSimilar.reduce((sum, item) => sum + item.score, 0) / 
                          (mostSimilar.length || 1);
    const confidence = Math.min(0.9, avgSimilarity);
    
    return {
      retrievedContent,
      confidence
    };
  } catch (error) {
    console.error("Error retrieving augmentation:", error);
    
    // Fallback to basic retrieval
    const factualMemories = retrieveFactualGrounding(
      userInput.toLowerCase().split(/\W+/).filter(word => word.length > 3).slice(0, 5)
    );
    
    return { 
      retrievedContent: factualMemories.map(memory => memory.content),
      confidence: factualMemories.length > 0 ? 0.5 : 0
    };
  }
};

/**
 * Augment response with retrieved content using semantic integration
 */
export const augmentResponseWithRetrieval = async (
  response: string,
  retrievalResult: {
    retrievedContent: string[];
    confidence: number;
  }
): Promise<string> => {
  // If no content or low confidence, return original
  if (retrievalResult.retrievedContent.length === 0 || retrievalResult.confidence < 0.2) {
    return response;
  }
  
  try {
    // For now, just use the first retrieved memory
    const memory = retrievalResult.retrievedContent[0];
    
    if (!memory) return response;
    
    // Avoid duplication if response already contains memory
    if (response.includes(memory)) {
      return response;
    }
    
    // Find best semantic integration point using findMostSimilar
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    // Skip integration for very short responses
    if (sentences.length <= 2 || response.length < 100) {
      // For short responses, simply prepend with a natural transition
      return `Based on our conversation, ${memory} ${response}`;
    }
    
    // For longer responses, find best place to insert
    // TODO: For real implementation, use vector similarity to find best insertion point
    const insertPoint = Math.floor(sentences.length / 3);
    
    // Create natural integration
    return [
      ...sentences.slice(0, insertPoint),
      `As I recall, ${memory}`,
      ...sentences.slice(insertPoint)
    ].join(' ');
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
