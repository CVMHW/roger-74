
/**
 * Vector Embeddings System
 * 
 * Main exports for vector embeddings functionality
 */

// Export types
export type { EmbeddingResult, SimilarityResult } from './types';

// Export utility functions
export { cosineSimilarity, simpleHash } from './utils';

// Export device detection
export { detectBestAvailableDevice } from './deviceDetection';

// Export simulated embeddings
export { generateSimulatedEmbedding } from './simulatedEmbeddings';

// Export embedding model functions
export { 
  initializeEmbeddingModel,
  forceReinitializeEmbeddingModel,
  isUsingSimulatedEmbeddings,
  generateEmbedding
} from './embeddingModel';

// Export embedding generator functions
export {
  generateEmbeddings,
  findMostSimilar
} from './embeddingGenerator';

// Initialize the embedding model when this module is imported
import { initializeEmbeddingModel, isUsingSimulatedEmbeddings } from './embeddingModel';

// Initialize on import
initializeEmbeddingModel().then(() => {
  console.log(`Embedding system status: ${isUsingSimulatedEmbeddings() ? 'Using simulation' : 'Using Hugging Face model'}`);
}).catch(error => 
  console.error("Error initializing embedding model on import:", error)
);
