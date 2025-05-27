
/**
 * Vector Database Implementation
 */
import { VectorRecord, SimilaritySearchOptions } from './vectorDatabase/types';
import { VectorDatabase } from './vectorDatabase/vectorDatabase';
import { VectorCollection } from './vectorDatabase/vectorCollection';

// Create a singleton instance of the vector database
const vectorDB = new VectorDatabase();

// Enable indexing for better performance with larger collections
vectorDB.enableIndexing(16);

// Export the singleton instance
export default vectorDB;
