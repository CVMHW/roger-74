
/**
 * Vector Database Types
 * 
 * Type definitions for vector database
 */

// Define the vector database types
export interface VectorRecord {
  id: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
  timestamp: number;
}

// Advanced Vector Index structure
export interface VectorIndex {
  [key: string]: {
    records: VectorRecord[];
    // HNSW-inspired indexing structure for approximate nearest neighbor search
    spatialIndex?: {
      // Map of record IDs to their nearest neighbors (for fast lookup)
      neighbors: Map<string, string[]>;
      // List of entry points for efficient traversal
      entryPoints: string[];
      // Maximum number of connections per node
      maxConnections: number;
    }
  }
}

// Search options interface
export interface SimilaritySearchOptions {
  limit?: number; 
  scoreThreshold?: number;
  filter?: (record: VectorRecord) => boolean;
  useIndex?: boolean;
}
