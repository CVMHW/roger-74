
/**
 * Vector Embeddings Utilities
 * 
 * Helper functions for vector embeddings
 */

/**
 * Simple hash function for strings
 */
export const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Calculate cosine similarity between two embeddings
 */
export const cosineSimilarity = (embedding1: number[], embedding2: number[]): number => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return 0;
  }
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  const magnitudeProduct = magnitude1 * magnitude2;
  
  // Guard against division by zero
  if (magnitudeProduct === 0) {
    return 0;
  }
  
  return dotProduct / magnitudeProduct;
};
