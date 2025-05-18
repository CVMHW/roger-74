
/**
 * Vector Embeddings System
 * 
 * Main exports for vector embeddings functionality
 */

// Export types
export type { 
  EmbeddingResult, 
  SimilarityResult,
  EmbeddingConfig,
  BatchEmbeddingOptions,
  EmbeddingGenerationOptions,
  DeviceType,
  HuggingFaceProgressCallback,
  PipelineOptions
} from './types';

// Export utility functions
export { cosineSimilarity, simpleHash } from './utils';

// Export device detection
export { detectBestAvailableDevice, getAvailableMemory } from './deviceDetection';

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

// Create an async initialization function that exports status
export const initializeEmbeddingSystem = async (): Promise<boolean> => {
  try {
    await initializeEmbeddingModel();
    const usingSimulation = isUsingSimulatedEmbeddings();
    console.log(`Embedding system initialized: ${usingSimulation ? 'Using simulation' : 'Using Hugging Face model'}`);
    return !usingSimulation;
  } catch (error) {
    console.error("Failed to initialize embedding system:", error);
    return false;
  }
};

// Initialize on import, but don't block
initializeEmbeddingSystem().catch(error => 
  console.error("Error initializing embedding model on import:", error)
);
