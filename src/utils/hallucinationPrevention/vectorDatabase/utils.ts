
/**
 * Vector Database Utilities
 */

/**
 * Calculate cosine similarity between two vectors
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same dimensions");
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Calculate Euclidean distance between two vectors
 * Lower values mean more similar
 */
export const euclideanDistance = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same dimensions");
  }
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
};

/**
 * Convert Euclidean distance to similarity score
 * Higher values mean more similar
 */
export const euclideanSimilarity = (a: number[], b: number[]): number => {
  const distance = euclideanDistance(a, b);
  // Convert distance to similarity (1 when identical, approaching 0 as distance increases)
  return 1 / (1 + distance);
};

/**
 * Type for vector with metadata
 */
type VectorWithMetadata<T> = {
  vector: number[];
  record: T;
};

/**
 * Find nearest neighbors using specified similarity function
 */
export const findNearestNeighbors = <T>(
  queryVector: number[],
  vectorsWithMetadata: VectorWithMetadata<T>[],
  limit: number = 5,
  similarityFunction: (a: number[], b: number[]) => number = cosineSimilarity
): Array<{ record: T; similarity: number }> => {
  const similarities = vectorsWithMetadata.map(item => ({
    record: item.record,
    similarity: similarityFunction(queryVector, item.vector)
  }));
  
  // Sort by similarity (higher is better)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return top results
  return similarities.slice(0, limit);
};
