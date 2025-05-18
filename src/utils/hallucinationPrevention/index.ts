
/**
 * Hallucination Prevention System
 * 
 * Main entry point for the RAG system that connects all components
 */

// Export vector database components
export * from './vectorDatabase';
export * from './dataLoader';
export * from './retrieval';

// Export integration components
export * from './integration';

// Import necessary components
import { initializeRAGIntegration } from './integration';
import { generateEmbedding, forceReinitializeEmbeddingModel } from './vectorEmbeddings';
import { integrateKnowledgeIntoResponse } from './integration';

// Connection status
let isInitialized = false;

/**
 * Initialize the RAG system
 */
export const initializeRAGSystem = async (): Promise<boolean> => {
  try {
    console.log("🔄 Initializing RAG system...");
    
    // First, try to initialize the embedding model
    try {
      await forceReinitializeEmbeddingModel();
    } catch (modelError) {
      console.warn("⚠️ Could not initialize embedding model:", modelError);
      console.log("⚠️ Will use simulated embeddings as fallback");
    }
    
    // Initialize the vector database and integrations
    const success = await initializeRAGIntegration();
    
    if (success) {
      console.log("✅ RAG system initialized successfully");
      isInitialized = true;
    } else {
      console.error("❌ Failed to initialize RAG system");
      isInitialized = false;
    }
    
    return success;
  } catch (error) {
    console.error("❌ Error initializing RAG system:", error);
    isInitialized = false;
    return false;
  }
};

/**
 * Check if RAG system is initialized
 */
export const isRAGSystemInitialized = (): boolean => {
  return isInitialized;
};

/**
 * Process text through the RAG system to enhance response
 */
export const processResponse = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = conversationHistory.length
): Promise<string> => {
  try {
    // Try to initialize if not already done
    if (!isInitialized) {
      try {
        await initializeRAGSystem();
      } catch (error) {
        console.error("Error initializing RAG system:", error);
      }
    }
    
    // Process the response through knowledge integration
    return await integrateKnowledgeIntoResponse(
      responseText,
      userInput,
      messageCount,
      conversationHistory
    );
  } catch (error) {
    console.error("Error processing response through RAG:", error);
    return responseText;
  }
};

/**
 * Create a standalone vector embedding for text
 */
export const createEmbedding = async (text: string): Promise<number[]> => {
  return await generateEmbedding(text);
};

// Default export
export default {
  initializeRAGSystem,
  isRAGSystemInitialized,
  processResponse,
  createEmbedding
};
