
/**
 * Multi-Head Attention System
 * 
 * Uses attention mechanisms to retrieve the most relevant memories
 * for the current conversation context
 */

import { MemoryPiece } from './memoryBank';

/**
 * Retrieve memories using multi-head attention mechanisms
 */
export const retrieveWithMultiHeadAttention = (
  query: string,
  memories: MemoryPiece[]
): MemoryPiece[] => {
  try {
    // If no memories, return empty array
    if (!memories || memories.length === 0) {
      return [];
    }
    
    // Convert query to lowercase for matching
    const lowercaseQuery = query.toLowerCase();
    
    // Extract keywords from query
    const queryKeywords = extractKeywords(lowercaseQuery);
    
    // Calculate relevance score for each memory
    const scoredMemories = memories.map(memory => {
      // Convert memory content to lowercase
      const lowercaseMemory = memory.content.toLowerCase();
      
      // Calculate keyword match score
      const keywordMatchScore = calculateKeywordMatchScore(queryKeywords, lowercaseMemory);
      
      // Calculate semantic similarity (placeholder for more sophisticated implementation)
      const semanticSimilarityScore = calculateSimpleSemanticScore(lowercaseQuery, lowercaseMemory);
      
      // Calculate recency score if timestamp exists
      const recencyScore = memory.timestamp ? calculateRecencyScore(memory.timestamp) : 0.5;
      
      // Calculate importance score
      const importanceScore = memory.importance || 0.5;
      
      // Calculate final score (weighted average)
      const finalScore = (
        keywordMatchScore * 0.4 + 
        semanticSimilarityScore * 0.3 + 
        recencyScore * 0.15 + 
        importanceScore * 0.15
      );
      
      return {
        ...memory,
        score: finalScore
      };
    });
    
    // Sort memories by score in descending order
    const sortedMemories = scoredMemories
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .filter(memory => (memory.score || 0) > 0.2); // Filter out low-scoring memories
    
    // Return top memories
    return sortedMemories;
    
  } catch (error) {
    console.error("Error in multi-head attention:", error);
    return [];
  }
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text: string): string[] => {
  return text
    .split(/\W+/)
    .filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'have', 'what', 'when', 'where', 'would', 'could', 'should', 'about'].includes(word)
    );
};

/**
 * Calculate score based on keyword matches
 */
const calculateKeywordMatchScore = (queryKeywords: string[], memoryText: string): number => {
  // If no keywords, return low score
  if (queryKeywords.length === 0) {
    return 0.1;
  }
  
  // Count matching keywords
  const matchCount = queryKeywords.filter(keyword => 
    memoryText.includes(keyword)
  ).length;
  
  // Calculate and return score
  return matchCount / queryKeywords.length;
};

/**
 * Calculate simple semantic similarity score
 * (This is a placeholder for a more sophisticated implementation)
 */
const calculateSimpleSemanticScore = (query: string, memoryText: string): number => {
  // Very simple implementation - check for shared words
  const queryWords = new Set(query.split(/\W+/).filter(w => w.length > 3));
  const memoryWords = new Set(memoryText.split(/\W+/).filter(w => w.length > 3));
  
  // Calculate intersection
  const intersection = [...queryWords].filter(word => memoryWords.has(word));
  
  // Calculate union
  const union = new Set([...queryWords, ...memoryWords]);
  
  // Calculate Jaccard similarity
  return union.size > 0 ? intersection.length / union.size : 0;
};

/**
 * Calculate recency score - more recent memories get higher scores
 */
const calculateRecencyScore = (timestamp: number): number => {
  const now = Date.now();
  const ageInHours = (now - timestamp) / (1000 * 60 * 60);
  
  // Exponential decay - memories older than 24 hours get lower scores
  return Math.exp(-ageInHours / 24);
};

export default retrieveWithMultiHeadAttention;
