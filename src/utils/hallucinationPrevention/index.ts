
/**
 * Hallucination Prevention System
 * 
 * This is the main entry point for the hallucination prevention system
 * which includes the RAG (Retrieval Augmented Generation) capabilities
 */

import { initializeRetrievalSystem } from './retrieval';
import { isUsingSimulatedEmbeddings, forceReinitializeEmbeddingModel, detectBestAvailableDevice } from './vectorEmbeddings';
import vectorDB from './vectorDatabase';

// Export all components
export * from './vectorEmbeddings';
export * from './vectorReranker';
export * from './retrieval';

/**
 * Get system diagnostics information
 */
export const getRAGSystemDiagnostics = async (): Promise<{
  usingSimulation: boolean;
  device: string;
  vectorStats: any;
  modelStatus: string;
}> => {
  const usingSimulation = isUsingSimulatedEmbeddings();
  const device = await detectBestAvailableDevice();
  const vectorStats = vectorDB.stats();
  
  return {
    usingSimulation,
    device,
    vectorStats,
    modelStatus: usingSimulation ? 'simulation' : 'huggingface'
  };
};

// Initialize the RAG system
export const initializeRAGSystem = async (): Promise<boolean> => {
  try {
    console.log("🌟 Initializing RAG system...");
    
    // Check device capabilities
    const device = await detectBestAvailableDevice();
    console.log(`🖥️ Using device: ${device} for RAG system`);
    
    // If using simulated embeddings, try to reinitialize the model
    if (isUsingSimulatedEmbeddings()) {
      console.log("Attempting to switch from simulated to real embeddings...");
      await forceReinitializeEmbeddingModel();
    }
    
    // Track memory usage if available
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log(`📊 Memory usage: ${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))}MB`);
    }
    
    // Initialize the retrieval system
    const success = await initializeRetrievalSystem();
    
    // Get vector database stats
    const stats = vectorDB.stats();
    console.log(`Vector database stats: ${JSON.stringify(stats)}`);
    
    // Report final status
    console.log(`RAG system initialized - Using real embeddings: ${!isUsingSimulatedEmbeddings()}`);
    
    return success;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    return false;
  }
};

// Export the system initialization function
export default {
  initializeRAGSystem,
  isUsingSimulatedEmbeddings,
  getRAGSystemDiagnostics
};
