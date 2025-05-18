
/**
 * Vector Database Index
 * 
 * Main exports for vector database functionality
 */

// Export types
export type { VectorRecord, VectorIndex, SimilaritySearchOptions } from './types';

// Export classes
export { VectorDatabase } from './vectorDatabase';
export { VectorCollection } from './vectorCollection';

// Export utilities
export { findNearestNeighbors } from './utils';

// Create and export a singleton instance of the vector database
import { VectorDatabase } from './vectorDatabase';
const vectorDB = new VectorDatabase();

// Enable indexing for better performance with larger collections
vectorDB.enableIndexing = function(dimensions = 16) {
  console.log(`Enabling vector indexing with ${dimensions} dimensions`);
  // This is a placeholder for actual indexing implementation
  // In a real implementation, this would set up indexes for faster vector search
  return true;
};

// Export default instance
export default vectorDB;
