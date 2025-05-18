
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
  generateEmbedding,
  getEmbeddingSuccessRate
} from './embeddingModel';

// Export embedding generator functions
export {
  generateEmbeddings,
  findMostSimilar
} from './embeddingGenerator';

// Initialize the embedding model when this module is imported
import { initializeEmbeddingModel, isUsingSimulatedEmbeddings } from './embeddingModel';
import { preloadVectors } from '../persistentVectorStore';

// Track initialization state
let isInitializing = false;
let isInitialized = false;

// Create an async initialization function that exports status
export const initializeEmbeddingSystem = async (): Promise<boolean> => {
  // Prevent concurrent initialization
  if (isInitializing) {
    console.log("Embedding system initialization already in progress...");
    return false;
  }
  
  // Skip if already initialized
  if (isInitialized) {
    console.log("Embedding system already initialized");
    return true;
  }
  
  isInitializing = true;
  
  try {
    console.log("Initializing embedding system...");
    
    // Start preloading vectors in parallel with model initialization
    const preloadPromise = preloadVectors();
    
    // Initialize the embedding model
    await initializeEmbeddingModel();
    
    // Wait for preloading to finish
    await preloadPromise;
    
    const usingSimulation = isUsingSimulatedEmbeddings();
    console.log(`Embedding system initialized: ${usingSimulation ? 'Using simulation' : 'Using Hugging Face model'}`);
    
    isInitialized = true;
    isInitializing = false;
    
    return !usingSimulation;
  } catch (error) {
    console.error("Failed to initialize embedding system:", error);
    isInitializing = false;
    return false;
  }
};

// Function to check if the system is ready
export const isEmbeddingSystemReady = (): boolean => {
  return isInitialized && !isUsingSimulatedEmbeddings();
};

// Initialize on import, but don't block
setTimeout(() => {
  initializeEmbeddingSystem().catch(error => 
    console.error("Error initializing embedding system:", error)
  );
}, 2000); // Delay to let page fully load first
