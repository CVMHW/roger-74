
/**
 * Hallucination Prevention Retrieval
 * 
 * This module provides functions for retrieving relevant information
 * with vector-based search capabilities.
 */

import { generateEmbedding, isUsingSimulatedEmbeddings, forceReinitializeEmbeddingModel } from './vectorEmbeddings';
import vectorDB, { VectorRecord } from './vectorDatabase';
import { COLLECTIONS, initializeVectorDatabase, addUserMessage, addRogerResponse } from './dataLoader';
import { v4 as uuidv4 } from 'uuid';

// Export the MemoryPiece interface for use in other modules
export interface MemoryPiece {
  content: string;
  role: string;
  metadata?: any;
  importance: number;
  chunks?: string[];
}

/**
 * Create chunks from content for more granular retrieval
 */
const createChunks = (content: string, maxChunkLength: number = 100): string[] => {
  // Simple chunking by sentences
  const sentences = content.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed max length, start a new chunk
    if (currentChunk.length + sentence.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};

/**
 * Initialize the retrieval system
 */
export const initializeRetrievalSystem = async (): Promise<boolean> => {
  // First ensure we have real embeddings if possible
  if (isUsingSimulatedEmbeddings()) {
    console.log("⚠️ Using simulated embeddings, attempting to reinitialize...");
    await forceReinitializeEmbeddingModel();
  }
  
  // Initialize the vector database
  return await initializeVectorDatabase();
};

/**
 * Retrieve facts from vector database to ground responses
 */
export const retrieveFactualGrounding = (
  topics: string[],
  limit: number = 3
): MemoryPiece[] => {
  try {
    const results: MemoryPiece[] = [];
    
    // First try vector search
    const factsCollection = vectorDB.collection(COLLECTIONS.FACTS);
    const rogerCollection = vectorDB.collection(COLLECTIONS.ROGER_KNOWLEDGE);
    
    // If collections are empty, initialize the database
    if (factsCollection.size() === 0 || rogerCollection.size() === 0) {
      console.log("Vector collections are empty, initializing...");
      // We'll continue with the search anyway, but trigger initialization
      initializeVectorDatabase().catch(error => console.error("Error initializing database:", error));
    }
    
    // Search using all topics
    for (const topic of topics) {
      if (topic.trim().length < 3) continue;
      
      // Generate embedding for the topic
      generateEmbedding(topic).then(async (embedding) => {
        try {
          // Search in facts collection
          const factResults = factsCollection.findSimilar(embedding, { 
            limit: Math.ceil(limit / 2),
            scoreThreshold: 0.65
          });
          
          // Search in Roger knowledge collection
          const knowledgeResults = rogerCollection.findSimilar(embedding, { 
            limit: Math.ceil(limit / 2),
            scoreThreshold: 0.65
          });
          
          // Process and add results
          [...factResults, ...knowledgeResults].forEach(result => {
            // Create chunks for longer content
            const chunks = result.record.text.length > 150 ? 
              createChunks(result.record.text) : 
              [result.record.text];
            
            results.push({
              content: result.record.text,
              role: 'system',
              metadata: { ...result.record.metadata, score: result.score },
              importance: (result.record.metadata?.importance || 0.5) * result.score,
              chunks
            });
          });
        } catch (error) {
          console.error("Error in vector search for topic:", topic, error);
        }
      }).catch(error => console.error("Error generating embedding for topic:", topic, error));
    }
    
    // Return what we found so far (vector search will continue asynchronously)
    return results;
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};

/**
 * Retrieve patient's exact phrasing on topics with semantic search
 */
export const retrievePatientPhrasing = async (
  query: string,
  limit: number = 2
): Promise<string[]> => {
  try {
    // Generate embedding for query
    const embedding = await generateEmbedding(query);
    
    // Search in user messages collection
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const results = userCollection.findSimilar(embedding, { 
      limit,
      scoreThreshold: 0.6
    });
    
    // Return the texts of matching records
    return results.map(result => result.record.text);
  } catch (error) {
    console.error("Error retrieving patient phrasing:", error);
    return [];
  }
};

/**
 * Check if a topic has been mentioned before using semantic search
 */
export const hasTopicBeenDiscussed = async (topic: string): Promise<boolean> => {
  try {
    // Generate embedding for topic
    const embedding = await generateEmbedding(topic);
    
    // Search in user and Roger collections
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const rogerCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    // Check user messages
    const userResults = userCollection.findSimilar(embedding, { 
      limit: 1,
      scoreThreshold: 0.75
    });
    
    // Check Roger responses
    const rogerResults = rogerCollection.findSimilar(embedding, { 
      limit: 1,
      scoreThreshold: 0.75
    });
    
    // Return true if we found matching results in either collection
    return userResults.length > 0 || rogerResults.length > 0;
  } catch (error) {
    console.error("Error checking topic discussion history:", error);
    return false;
  }
};

/**
 * Retrieve Roger's previous responses on similar topics with semantic search
 */
export const retrieveSimilarResponses = async (
  query: string,
  limit: number = 2
): Promise<string[]> => {
  try {
    // Generate embedding for query
    const embedding = await generateEmbedding(query);
    
    // Search in Roger responses collection
    const rogerCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    const results = rogerCollection.findSimilar(embedding, { 
      limit,
      scoreThreshold: 0.65
    });
    
    // Return the texts of matching records
    return results.map(result => result.record.text);
  } catch (error) {
    console.error("Error retrieving similar responses:", error);
    return [];
  }
};

/**
 * Get patient sentiment on topics using semantic search
 */
export const getPatientSentiment = async (query: string): Promise<Record<string, string>> => {
  const sentiments: Record<string, string> = {
    overall: 'neutral',
    depression: 'not_detected',
    anxiety: 'not_detected',
    anger: 'not_detected'
  };
  
  try {
    // Get recent patient messages
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const allUserMessages = userCollection.getAll();
    
    // Sort by timestamp (most recent first) and take the last 5
    const recentMessages = allUserMessages
      .sort((a, b) => (b.metadata?.timestamp || 0) - (a.metadata?.timestamp || 0))
      .slice(0, 5)
      .map(record => record.text);
    
    // Add current query to the list
    const allMessages = [query, ...recentMessages];
    
    // Simple sentiment detection
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    
    for (const message of allMessages) {
      const content = message.toLowerCase();
      
      // Check for positive emotions
      if (/\b(good|great|like|love|happy|enjoy|excited|glad|pleased|hopeful)\b/i.test(content)) {
        positive++;
      }
      
      // Check for negative emotions
      if (/\b(bad|hate|dislike|awful|terrible|sad|angry|upset|worried|anxious|depressed|stressed)\b/i.test(content)) {
        negative++;
      }
      
      // Check for neutral statements
      if (!/\b(good|great|like|love|happy|enjoy|excited|glad|pleased|hopeful|bad|hate|dislike|awful|terrible|sad|angry|upset|worried|anxious|depressed|stressed)\b/i.test(content)) {
        neutral++;
      }
    }
    
    // Determine overall sentiment
    if (positive > negative && positive > neutral) {
      sentiments['overall'] = 'positive';
    } else if (negative > positive && negative > neutral) {
      sentiments['overall'] = 'negative';
    } else {
      sentiments['overall'] = 'neutral';
    }
    
    // Check for specific emotions in the current query
    if (/\b(depress(ed|ion)|hopeless|meaningless|empty)\b/i.test(query)) {
      sentiments['depression'] = 'detected';
    }
    
    if (/\b(anxi(ous|ety)|worry|worried|nervous|panic|stress(ed)?)\b/i.test(query)) {
      sentiments['anxiety'] = 'detected';
    }
    
    if (/\b(angry|anger|mad|furious|irritated|frustrated)\b/i.test(query)) {
      sentiments['anger'] = 'detected';
    }
    
  } catch (error) {
    console.error("Error determining patient sentiment:", error);
    sentiments['overall'] = 'unknown';
  }
  
  return sentiments;
};

/**
 * Retrieve augmentation for RAG improvement with semantic search
 */
export const retrieveAugmentation = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<{
  retrievedContent: string[];
  confidence: number;
}> => {
  try {
    // Generate embedding for user input
    const embedding = await generateEmbedding(userInput);
    
    // Search across all collections for relevant content
    const searchCollections = [
      COLLECTIONS.ROGER_KNOWLEDGE,
      COLLECTIONS.FACTS,
      COLLECTIONS.ROGER_RESPONSES
    ];
    
    let results: { record: VectorRecord; score: number }[] = [];
    
    for (const collectionName of searchCollections) {
      const collection = vectorDB.collection(collectionName);
      
      const collectionResults = collection.findSimilar(embedding, {
        limit: 3,
        scoreThreshold: 0.65
      });
      
      results = [...results, ...collectionResults];
    }
    
    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Take top results
    const topResults = results.slice(0, 3);
    
    // Extract content
    const retrievedContent = topResults.map(result => result.record.text);
    
    // Calculate confidence based on similarity scores
    const avgSimilarity = topResults.reduce((sum, item) => sum + item.score, 0) / 
                          (topResults.length || 1);
    
    const confidence = Math.min(0.9, avgSimilarity);
    
    return {
      retrievedContent,
      confidence
    };
  } catch (error) {
    console.error("Error retrieving augmentation:", error);
    
    return { 
      retrievedContent: [],
      confidence: 0
    };
  }
};

/**
 * Augment response with retrieved content using semantic integration
 */
export const augmentResponseWithRetrieval = async (
  response: string,
  retrievalResult: {
    retrievedContent: string[];
    confidence: number;
  }
): Promise<string> => {
  // If no content or low confidence, return original
  if (retrievalResult.retrievedContent.length === 0 || retrievalResult.confidence < 0.2) {
    return response;
  }
  
  try {
    // For now, just use the first retrieved memory
    const memory = retrievalResult.retrievedContent[0];
    
    if (!memory) return response;
    
    // Avoid duplication if response already contains memory
    if (response.includes(memory)) {
      return response;
    }
    
    // Generate embeddings for better integration point detection
    const memoryEmbedding = await generateEmbedding(memory);
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    // Skip integration for very short responses
    if (sentences.length <= 2 || response.length < 100) {
      // For short responses, simply prepend with a natural transition
      return `Based on our conversation, ${memory} ${response}`;
    }
    
    // For longer responses, find best place to insert
    let bestSentenceIndex = Math.floor(sentences.length / 3); // Default
    let highestSimilarity = -1;
    
    try {
      // Find the sentence most similar to the memory
      for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length < 10) continue; // Skip very short sentences
        
        const sentenceEmbedding = await generateEmbedding(sentences[i]);
        
        // Calculate similarity using cosine similarity
        let dotProduct = 0;
        let mag1 = 0;
        let mag2 = 0;
        
        for (let j = 0; j < memoryEmbedding.length; j++) {
          dotProduct += memoryEmbedding[j] * sentenceEmbedding[j];
          mag1 += memoryEmbedding[j] * memoryEmbedding[j];
          mag2 += sentenceEmbedding[j] * sentenceEmbedding[j];
        }
        
        const similarity = dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2) || 1);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestSentenceIndex = i;
        }
      }
    } catch (error) {
      console.error("Error finding best insertion point:", error);
      // Continue with default insertion point
    }
    
    // Create natural transition phrases based on content
    let transitionPhrase = "Based on what we've discussed, ";
    
    if (memory.toLowerCase().includes("feeling") || memory.toLowerCase().includes("emotion")) {
      transitionPhrase = "Connecting with your feelings, ";
    } else if (memory.toLowerCase().includes("think") || memory.toLowerCase().includes("thought")) {
      transitionPhrase = "Building on your thoughts, ";
    } else if (memory.toLowerCase().includes("situation") || memory.toLowerCase().includes("experience")) {
      transitionPhrase = "Considering your situation, ";
    }
    
    // Insert the memory with the transition phrase
    const enhancedResponse = [
      ...sentences.slice(0, bestSentenceIndex),
      `${transitionPhrase}${memory}`,
      ...sentences.slice(bestSentenceIndex)
    ].join(' ');
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error augmenting response with retrieval:", error);
    return response;
  }
};

/**
 * Add a conversation exchange to the vector database
 */
export const addConversationExchange = async (
  userMessage: string,
  rogerResponse: string
): Promise<void> => {
  try {
    // Add user message to vector DB
    await addUserMessage(userMessage);
    
    // Add Roger response to vector DB
    await addRogerResponse(rogerResponse);
  } catch (error) {
    console.error("Error adding conversation exchange to vector database:", error);
  }
};

// Export all retrieval functions
export default {
  initializeRetrievalSystem,
  retrieveFactualGrounding,
  retrievePatientPhrasing,
  hasTopicBeenDiscussed,
  retrieveSimilarResponses,
  getPatientSentiment,
  retrieveAugmentation,
  augmentResponseWithRetrieval,
  addConversationExchange
};
