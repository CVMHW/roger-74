
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

// Enable indexing by default for large collections
vectorDB.enableIndexing(16);

export default vectorDB;
