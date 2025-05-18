
/**
 * Utility functions for vector embeddings
 */

/**
 * Calculate cosine similarity between two vectors
 */
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  try {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      console.error("Invalid vectors for cosine similarity calculation");
      return 0;
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  } catch (error) {
    console.error("Error calculating cosine similarity:", error);
    return 0;
  }
};

/**
 * Generate a simple hash from a string
 * Used to create ID for results
 */
export const simpleHash = (text: string): number => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
