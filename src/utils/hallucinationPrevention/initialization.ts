
/**
 * Initialization functionality for hallucination prevention system
 */
import { initializeRetrievalSystem } from './retrieval';
import { setRAGInitialized } from './core';

/**
 * Initializes the RAG system
 * @returns Promise that resolves when initialization is complete
 */
export const initializeRAGSystem = async () => {
  try {
    console.log("Initializing RAG system...");
    
    // Call the retrieval system initialization
    await initializeRetrievalSystem();
    
    setRAGInitialized(true);
    console.log("RAG system initialized successfully");
    
    return true;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    return false;
  }
};
