
/**
 * Retrieval Augmented Generation System - Main Entry Point
 * 
 * Advanced RAG system with hybrid search, reranking, and session-persistent vectors
 */

import { initializeVectorDatabase } from './dataLoader';
import { retrieveFactualGrounding, retrieveAugmentation, augmentResponseWithRetrieval, MemoryPiece } from './retrieval';
import { retrieveEnhanced, expandQuery, augmentResponseWithEnhancedRetrieval } from './enhancedRetrieval';
import { performHybridSearch } from './hybridSearch';
import { rerankResults } from './reranker';
import { 
  persistVectors, 
  loadPersistedVectors, 
  getPersistedVectors, 
  hasRecentPersistedVectors, 
  preloadVectors 
} from './persistentVectorStore';
import vectorDB from './vectorDatabase';
import { COLLECTIONS } from './dataLoader/types';
import { 
  isUsingSimulatedEmbeddings, 
  forceReinitializeEmbeddingModel, 
  initializeEmbeddingSystem,
  isEmbeddingSystemReady
} from './vectorEmbeddings';

// Track initialization status
let isInitialized = false;
let isInitializing = false;
let initializationPromise: Promise<boolean> | null = null;

/**
 * Initialize the RAG system
 * Enhanced with better persistence handling and parallel loading
 */
export const initializeRAGSystem = async (): Promise<boolean> => {
  // Return existing promise if initialization is in progress
  if (initializationPromise) {
    return initializationPromise;
  }
  
  // Skip if already initialized
  if (isInitialized) {
    console.log("RAG System already initialized");
    return true;
  }
  
  isInitializing = true;
  
  // Create a new initialization promise
  initializationPromise = (async () => {
    try {
      console.log("Initializing RAG System...");
      
      // First try to reinitialize the embedding model with real embeddings
      if (isUsingSimulatedEmbeddings()) {
        console.log("Currently using simulated embeddings, attempting to reinitialize...");
        await forceReinitializeEmbeddingModel();
      }
      
      // Try to load persisted vectors first
      console.log("Loading persisted vectors...");
      
      // Check if we have recent persisted vectors
      const hasRecent = await hasRecentPersistedVectors();
      
      // Load vectors from persistent storage with proper error handling
      const loadCollection = async (collectionName: string): Promise<boolean> => {
        try {
          return loadPersistedVectors(collectionName, (records) => {
            const collection = vectorDB.collection(collectionName);
            records.forEach(record => collection.insert(record));
            console.log(`Inserted ${records.length} records into ${collectionName} from persistence`);
          });
        } catch (error) {
          console.error(`Error loading collection ${collectionName}:`, error);
          return false;
        }
      };
      
      // Start the loading in parallel for better performance
      const loadingPromises = [
        loadCollection(COLLECTIONS.FACTS),
        loadCollection(COLLECTIONS.ROGER_KNOWLEDGE),
        loadCollection(COLLECTIONS.USER_MESSAGES),
        loadCollection(COLLECTIONS.ROGER_RESPONSES)
      ];
      
      // Also start the vector database initialization in parallel
      // This will load fresh data if needed
      const dbInitPromise = initializeVectorDatabase();
      
      // Wait for all loading operations to complete
      const [factsLoaded, knowledgeLoaded, userMsgLoaded, rogerRespLoaded] = await Promise.all(loadingPromises);
      
      console.log("Persisted vectors loaded:", { 
        factsLoaded, knowledgeLoaded, userMsgLoaded, rogerRespLoaded 
      });
      
      // Complete the vector database initialization
      const dbInitialized = await dbInitPromise;
      
      // Initialize embedding system if not already done
      await initializeEmbeddingSystem();
      
      // Persist all vectors from database to localStorage
      await Promise.all([
        COLLECTIONS.FACTS,
        COLLECTIONS.ROGER_KNOWLEDGE,
        COLLECTIONS.USER_MESSAGES,
        COLLECTIONS.ROGER_RESPONSES
      ].map(async (collectionName) => {
        try {
          const collection = vectorDB.collection(collectionName);
          if (collection.size() > 0) {
            persistVectors(collectionName, collection.getAll());
          }
        } catch (error) {
          console.error(`Error persisting collection ${collectionName}:`, error);
        }
      }));
      
      isInitialized = true;
      isInitializing = false;
      initializationPromise = null;
      
      console.log("RAG System initialization complete");
      return true;
    } catch (error) {
      console.error("Error initializing RAG system:", error);
      isInitializing = false;
      initializationPromise = null;
      return false;
    }
  })();
  
  return initializationPromise;
};

/**
 * Check if RAG system is ready for high-quality embeddings
 */
export const isRAGSystemReady = (): boolean => {
  return isInitialized && isEmbeddingSystemReady();
};

/**
 * Enhanced retrieval with hybrid search and reranking
 */
export const retrieveRelevantContent = async (
  query: string,
  userHistory: string[] = []
): Promise<{
  content: MemoryPiece[];
  expandedTopics: string[];
}> => {
  try {
    // Initialize if needed
    if (!isInitialized) {
      await initializeRAGSystem();
    }
    
    // Extract and expand topics from query
    const expandedTopics = expandQuery(query);
    
    // Use enhanced retrieval with hybrid search and reranking
    const retrievedContent = await retrieveEnhanced(query, expandedTopics, {
      limit: 5,
      rerank: true
    });
    
    return {
      content: retrievedContent,
      expandedTopics
    };
  } catch (error) {
    console.error("Error in retrieveRelevantContent:", error);
    
    // Fallback to basic retrieval
    const topics = query.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3);
      
    return {
      content: retrieveFactualGrounding(topics, 3),
      expandedTopics: topics
    };
  }
};

/**
 * Enhanced response augmentation with advanced RAG
 */
export const enhanceResponseWithRAG = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): Promise<string> => {
  try {
    // Retrieve relevant content using enhanced RAG
    const { content: retrievedContent } = await retrieveRelevantContent(userInput, conversationHistory);
    
    if (retrievedContent.length === 0) {
      return responseText;
    }
    
    // Augment the response with retrieved content
    return augmentResponseWithEnhancedRetrieval(
      responseText,
      userInput,
      retrievedContent
    );
  } catch (error) {
    console.error("Error enhancing response with RAG:", error);
    return responseText;
  }
};

// Re-export key components for external use
export {
  retrieveFactualGrounding,
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  performHybridSearch,
  rerankResults
};

// Export memory piece type
export type { MemoryPiece } from './retrieval';

// Initialize on import, but don't block
setTimeout(() => {
  initializeRAGSystem().catch(error => 
    console.error("Error initializing RAG system on import:", error)
  );
}, 3000); // Delay initialization slightly to improve page load performance
