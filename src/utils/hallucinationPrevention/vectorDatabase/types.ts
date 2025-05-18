
/**
 * Vector Database Types
 */

/**
 * Vector record with ID, vector, and metadata
 */
export interface VectorRecord {
  id: string;
  vector: number[]; // The actual vector embedding
  metadata?: any;   // Any additional data associated with this vector
}

/**
 * Simple index structure for vectors
 */
export interface VectorIndex {
  vectors: number[][];
  ids: string[];
}

/**
 * Options for similarity search
 */
export interface SimilaritySearchOptions {
  similarityFunction?: (a: number[], b: number[]) => number;
  filter?: (record: VectorRecord) => boolean;
}
