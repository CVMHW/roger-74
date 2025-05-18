
/**
 * Hallucination Prevention System
 * 
 * This is the main entry point for the hallucination prevention system
 * which includes the RAG (Retrieval Augmented Generation) capabilities
 */

import { initializeRetrievalSystem } from './retrieval';
import { isUsingSimulatedEmbeddings, forceReinitializeEmbeddingModel } from './vectorEmbeddings';
import vectorDB from './vectorDatabase';

// Export all components
export * from './vectorEmbeddings';
export * from './vectorReranker';
export * from './retrieval';

// Initialize the RAG system
export const initializeRAGSystem = async (): Promise<boolean> => {
  try {
    console.log("🌟 Initializing RAG system...");
    
    // If using simulated embeddings, try to reinitialize the model
    if (isUsingSimulatedEmbeddings()) {
      console.log("Attempting to switch from simulated to real embeddings...");
      await forceReinitializeEmbeddingModel();
    }
    
    // Initialize the retrieval system
    const success = await initializeRetrievalSystem();
    
    // Get vector database stats
    const stats = vectorDB.stats();
    console.log(`Vector database stats: ${JSON.stringify(stats)}`);
    
    return success;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    return false;
  }
};

// Export the system initialization function
export default {
  initializeRAGSystem,
  isUsingSimulatedEmbeddings
};
