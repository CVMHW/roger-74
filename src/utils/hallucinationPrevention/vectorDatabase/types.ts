
/**
 * Vector Database Types
 */

/**
 * Vector record with ID, vector, and metadata
 */
export interface VectorRecord {
  id: string;
  vector?: number[]; // The actual vector embedding
  embedding?: number[]; // Alternative name for vector (for compatibility)
  text?: string;    // Optional text content
  metadata?: any;   // Any additional data associated with this vector
  timestamp?: number; // Optional timestamp
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

/**
 * Quick check result for hallucination detection
 */
export interface QuickCheckResult {
  isPotentialHallucination: boolean;
  confidence: number;
  reason?: string;
}
