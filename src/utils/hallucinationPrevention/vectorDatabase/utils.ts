
/**
 * Vector Database Utilities
 * 
 * Utility functions for vector database operations
 */

import { VectorRecord } from './types';
import { cosineSimilarity } from '../vectorEmbeddings';

/**
 * Find nearest neighbors for a record
 */
export const findNearestNeighbors = (
  record: VectorRecord, 
  candidates: VectorRecord[], 
  limit: number
): VectorRecord[] => {
  return candidates
    .map(candidate => ({
      record: candidate,
      similarity: cosineSimilarity(record.embedding, candidate.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(result => result.record);
};
