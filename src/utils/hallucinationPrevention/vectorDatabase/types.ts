
/**
 * Vector Database Types
 */

export interface VectorRecord {
  id: string;
  vector: number[];
  text: string;
  metadata: Record<string, any>;
  timestamp?: number;
}

export interface VectorIndex {
  dimensions: number;
  records: Map<string, VectorRecord>;
}

export interface SimilaritySearchOptions {
  limit?: number;
  threshold?: number;
  scoreThreshold?: number;
  filter?: (record: VectorRecord) => boolean;
}

export interface SearchResult {
  record: VectorRecord;
  score: number;
}
