
/**
 * Retrieval Augmented Generation System - Main Entry Point
 * 
 * Advanced RAG system with hybrid search, reranking, and session-persistent vectors
 */

import { initializeVectorDatabase } from './dataLoader';
import { retrieveFactualGrounding, retrieveAugmentation, augmentResponseWithRetrieval, MemoryPiece } from './retrieval';
import { retrieveEnhanced, expandQuery, augmentResponseWithEnhancedRetrieval } from './enhancedRetrieval';
import { performHybridSearch } from './hybridSearch';
import { rerankResults, retrieveWithReranking, rerankWithCrossAttention } from './reranker';
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
  isEmbeddingSystemReady,
  getEmbeddingCacheStats
} from './vectorEmbeddings';
import { rerankDocumentsWithCrossEncoder } from './crossEncoder';

// Track initialization status
let isInitialized = false;
let isInitializing = false;
let initializationPromise: Promise<boolean> | null = null;

// Track vector reuse stats
let vectorsLoaded = 0;
let vectorsCreated = 0;
let initStartTime = 0;

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
  initStartTime = Date.now();
  
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
      
      // Function to load vectors for a collection with metrics
      const loadCollection = async (collectionName: string): Promise<boolean> => {
        try {
          return loadPersistedVectors(collectionName, (records) => {
            const collection = vectorDB.collection(collectionName);
            records.forEach(record => collection.insert(record));
            vectorsLoaded += records.length;
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
      const dbInitPromise = initializeVectorDatabase();
      
      // Wait for all loading operations to complete
      const [factsLoaded, knowledgeLoaded, userMsgLoaded, rogerRespLoaded] = await Promise.all(loadingPromises);
      
      console.log("Persisted vectors loaded:", { 
        factsLoaded, knowledgeLoaded, userMsgLoaded, rogerRespLoaded 
      });
      
      // Complete the vector database initialization
      const dbInitialized = await dbInitPromise;
      
      // Count new vectors created during initialization
      const countCollectionSize = (collectionName: string): number => {
        try {
          return vectorDB.collection(collectionName).size();
        } catch (e) {
          return 0;
        }
      };
      
      const totalVectors = 
        countCollectionSize(COLLECTIONS.FACTS) +
        countCollectionSize(COLLECTIONS.ROGER_KNOWLEDGE) +
        countCollectionSize(COLLECTIONS.USER_MESSAGES) +
        countCollectionSize(COLLECTIONS.ROGER_RESPONSES);
      
      // Estimate newly created vectors
      vectorsCreated = Math.max(0, totalVectors - vectorsLoaded);
      
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
      
      // Log stats
      const initTimeMs = Date.now() - initStartTime;
      console.log(`RAG System initialized in ${initTimeMs}ms:`, {
        vectorsLoaded,
        vectorsCreated,
        totalVectors,
        cachingEnabled: true,
        usingRealEmbeddings: !isUsingSimulatedEmbeddings()
      });
      
      isInitialized = true;
      isInitializing = false;
      initializationPromise = null;
      
      return !isUsingSimulatedEmbeddings();
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
 * Get RAG system stats for monitoring
 */
export const getRAGSystemStats = (): {
  initialized: boolean;
  usingRealEmbeddings: boolean;
  vectorsLoaded: number;
  vectorsCreated: number;
  vectorReuse: number;
  embeddingCache: ReturnType<typeof getEmbeddingCacheStats>;
  collectionSizes: Record<string, number>;
} => {
  // Calculate vector reuse percentage
  const vectorReuse = totalVectors() > 0 ? 
    Math.round((vectorsLoaded / totalVectors()) * 100) : 0;
    
  // Get collection sizes
  const collectionSizes: Record<string, number> = {};
  [
    COLLECTIONS.FACTS,
    COLLECTIONS.ROGER_KNOWLEDGE,
    COLLECTIONS.USER_MESSAGES,
    COLLECTIONS.ROGER_RESPONSES
  ].forEach(name => {
    try {
      collectionSizes[name] = vectorDB.collection(name).size();
    } catch (e) {
      collectionSizes[name] = 0;
    }
  });
  
  return {
    initialized: isInitialized,
    usingRealEmbeddings: !isUsingSimulatedEmbeddings(),
    vectorsLoaded,
    vectorsCreated,
    vectorReuse,
    embeddingCache: getEmbeddingCacheStats(),
    collectionSizes
  };
};

/**
 * Get total number of vectors in the system
 */
function totalVectors(): number {
  return vectorsLoaded + vectorsCreated;
}

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
  conversationHistory: string[] = []
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
    const expandedTopics = await generateExpandedQuery(query, expandQuery(query));
    
    // Use enhanced retrieval with hybrid search and reranking
    const retrievedContent = await retrieveEnhanced(query, expandedTopics, {
      limit: 5,
      rerank: true,
      conversationContext: conversationHistory,
      useQueryExpansion: true,
      useHybridSearch: true
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
 * Generate expanded query with advanced techniques
 * Re-export from enhancedRetrieval for convenience
 */
export const generateExpandedQuery = async (
  query: string,
  initialTopics: string[] = []
): Promise<string[]> => {
  // Import dynamically to avoid circular dependencies
  return expandQuery(query, initialTopics);
};

/**
 * Enhanced response augmentation with advanced RAG
 * Uses both retrieval quality improvements and better integration techniques
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
    
    // Apply sophisticated cross-encoder reranking
    const rerankedContent = await rerankDocumentsWithCrossEncoder(
      userInput, 
      retrievedContent,
      conversationHistory,
      { 
        topK: 3, 
        useContextualFeatures: true
      }
    );
    
    if (rerankedContent.length === 0) {
      return responseText;
    }
    
    // Augment the response with retrieved content using advanced techniques
    return augmentResponseWithEnhancedRetrieval(
      responseText,
      userInput,
      rerankedContent
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

// Initialize on import, but don't block and use a more delayed start
setTimeout(() => {
  initializeRAGSystem().catch(error => 
    console.error("Error initializing RAG system on import:", error)
  );
}, 3000); // Delay initialization slightly to improve page load performance
