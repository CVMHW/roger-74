
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
import { persistVectors, loadPersistedVectors, getPersistedVectors } from './persistentVectorStore';
import vectorDB from './vectorDatabase';
import { COLLECTIONS } from './dataLoader/types';
import { isUsingSimulatedEmbeddings, forceReinitializeEmbeddingModel } from './vectorEmbeddings';

// Track initialization status
let isInitialized = false;
let isInitializing = false;

/**
 * Initialize the RAG system
 */
export const initializeRAGSystem = async (): Promise<boolean> => {
  // Prevent concurrent initialization
  if (isInitializing) {
    console.log("RAG System initialization already in progress...");
    return false;
  }
  
  // Skip if already initialized
  if (isInitialized) {
    console.log("RAG System already initialized");
    return true;
  }
  
  isInitializing = true;
  
  try {
    console.log("Initializing RAG System...");
    
    // First try to reinitialize the embedding model with real embeddings
    if (isUsingSimulatedEmbeddings()) {
      console.log("Currently using simulated embeddings, attempting to reinitialize...");
      await forceReinitializeEmbeddingModel();
    }
    
    // Try to load persisted vectors first
    console.log("Loading persisted vectors...");
    
    const factsLoaded = loadPersistedVectors(COLLECTIONS.FACTS, (records) => {
      const collection = vectorDB.collection(COLLECTIONS.FACTS);
      records.forEach(record => collection.insert(record));
    });
    
    const knowledgeLoaded = loadPersistedVectors(COLLECTIONS.ROGER_KNOWLEDGE, (records) => {
      const collection = vectorDB.collection(COLLECTIONS.ROGER_KNOWLEDGE);
      records.forEach(record => collection.insert(record));
    });
    
    const userMsgLoaded = loadPersistedVectors(COLLECTIONS.USER_MESSAGES, (records) => {
      const collection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
      records.forEach(record => collection.insert(record));
    });
    
    const rogerRespLoaded = loadPersistedVectors(COLLECTIONS.ROGER_RESPONSES, (records) => {
      const collection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
      records.forEach(record => collection.insert(record));
    });
    
    console.log("Persisted vectors loaded:", { 
      factsLoaded, knowledgeLoaded, userMsgLoaded, rogerRespLoaded 
    });
    
    // Initialize vector database with fresh data
    const dbInitialized = await initializeVectorDatabase();
    
    // Persist all vectors from database to localStorage
    for (const collectionName of [
      COLLECTIONS.FACTS,
      COLLECTIONS.ROGER_KNOWLEDGE,
      COLLECTIONS.USER_MESSAGES,
      COLLECTIONS.ROGER_RESPONSES
    ]) {
      const collection = vectorDB.collection(collectionName);
      if (collection.size() > 0) {
        persistVectors(collectionName, collection.getAll());
      }
    }
    
    isInitialized = true;
    isInitializing = false;
    
    console.log("RAG System initialization complete");
    return true;
  } catch (error) {
    console.error("Error initializing RAG system:", error);
    isInitializing = false;
    return false;
  }
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

// Initialize on import
initializeRAGSystem().catch(error => 
  console.error("Error initializing RAG system on import:", error)
);
