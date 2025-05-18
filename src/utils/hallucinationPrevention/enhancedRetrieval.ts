
/**
 * Enhanced Retrieval System
 * 
 * Integrates advanced RAG features:
 * - Hybrid search (vector + keyword)
 * - Cross-encoder reranking
 * - Session-persistent vector store
 */

import { 
  retrieveFactualGrounding, 
  MemoryPiece 
} from './retrieval';
import { 
  performHybridSearch 
} from './hybridSearch';
import { 
  rerankResults,
  retrieveWithReranking
} from './reranker';
import { 
  generateEmbedding, 
  cosineSimilarity 
} from './vectorEmbeddings';
import { COLLECTIONS } from './dataLoader/types';

/**
 * Enhanced retrieval with hybrid search and reranking
 */
export const retrieveEnhanced = async (
  query: string,
  topics: string[],
  options: {
    limit?: number;
    collections?: string[];
    rerank?: boolean;
  } = {}
): Promise<MemoryPiece[]> => {
  const { 
    limit = 5, 
    collections = [COLLECTIONS.FACTS, COLLECTIONS.ROGER_KNOWLEDGE],
    rerank = true
  } = options;
  
  try {
    // Expand query with topics for better recall
    const expandedQuery = `${query} ${topics.join(" ")}`;
    
    // 1. Perform hybrid search to get candidates
    const hybridResults = await performHybridSearch(expandedQuery, collections, { 
      limit: limit * 3, // Get more candidates for reranking
      vectorWeight: 0.7,
      keywordWeight: 0.3
    });
    
    // 2. Perform vector reranking if enabled and we have results
    if (rerank && hybridResults.length > 0) {
      return await rerankResults(query, hybridResults, { 
        topK: limit,
        semanticWeight: 0.6,
        lexicalWeight: 0.2,
        recencyWeight: 0.1,
        importanceWeight: 0.1
      });
    }
    
    // Return hybrid results directly if reranking is disabled or no results
    return hybridResults.slice(0, limit);
    
  } catch (error) {
    console.error("Error in enhanced retrieval:", error);
    
    // Fallback to standard retrieval
    return retrieveFactualGrounding(topics, limit);
  }
};

/**
 * Extract topics and entities for query expansion
 */
export const expandQuery = (query: string): string[] => {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
    "by", "about", "as", "of", "is", "are", "am", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "can", "could", "will",
    "would", "should", "shall", "may", "might", "must", "i", "you", "he", "she",
    "it", "we", "they", "me", "him", "her", "us", "them", "this", "that", "these",
    "those", "my", "your", "his", "its", "our", "their", "mine", "yours", "hers",
    "ours", "theirs"
  ]);
  
  // Extract significant terms (non-stopwords longer than 3 chars)
  const terms = query.toLowerCase()
    .split(/\W+/)
    .filter(term => term.length > 3 && !stopWords.has(term));
  
  // Extract 2-word and 3-word phrases
  const phrases: string[] = [];
  const words = query.toLowerCase().split(/\W+/);
  
  // Generate 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i+1].length > 2) {
      phrases.push(`${words[i]} ${words[i+1]}`);
    }
  }
  
  // Generate 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i+1].length > 2 && words[i+2].length > 2) {
      phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
  }
  
  // Combine terms and phrases, removing duplicates
  return Array.from(new Set([...terms, ...phrases]));
};

/**
 * Natural language integration of retrieved content into responses
 */
export const augmentResponseWithEnhancedRetrieval = async (
  response: string,
  userInput: string,
  retrievedContent: MemoryPiece[]
): Promise<string> => {
  // If no content retrieved, return original response
  if (!retrievedContent || retrievedContent.length === 0) {
    return response;
  }
  
  try {
    // Get the top memory
    const topMemory = retrievedContent[0].content;
    
    // Skip if response already contains this content
    if (response.includes(topMemory)) {
      return response;
    }
    
    // Generate embedding for the memory to find best insertion point
    const memoryEmbedding = await generateEmbedding(topMemory);
    
    // Split response into sentences for natural insertion
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    // Find the best sentence to attach the memory to
    let bestSentenceIndex = 0;
    let bestScore = -1;
    
    try {
      for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length < 15) continue; // Skip short sentences
        
        const sentenceEmbedding = await generateEmbedding(sentences[i]);
        const similarity = cosineSimilarity(memoryEmbedding, sentenceEmbedding);
        
        if (similarity > bestScore) {
          bestScore = similarity;
          bestSentenceIndex = i;
        }
      }
    } catch (error) {
      // Use a default position if embedding fails
      bestSentenceIndex = Math.floor(sentences.length / 3);
    }
    
    // Create natural transition phrases based on content
    let transitionPhrase = "Based on our conversation, ";
    
    // More specific transitions based on content
    if (topMemory.toLowerCase().includes("feel") || topMemory.toLowerCase().includes("emotion")) {
      transitionPhrase = "Connecting with your feelings, ";
    } else if (topMemory.toLowerCase().includes("think") || topMemory.toLowerCase().includes("thought")) {
      transitionPhrase = "Building on your thoughts, ";
    } else if (topMemory.toLowerCase().includes("situation") || topMemory.toLowerCase().includes("experience")) {
      transitionPhrase = "Regarding your situation, ";
    } else if (topMemory.toLowerCase().includes("problem") || topMemory.toLowerCase().includes("issue")) {
      transitionPhrase = "About the challenge you mentioned, ";
    }
    
    // Insert the memory with natural transition
    const enhancedResponse = [
      ...sentences.slice(0, bestSentenceIndex + 1),
      `${transitionPhrase}${topMemory}`,
      ...sentences.slice(bestSentenceIndex + 1)
    ].join(' ');
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error augmenting response:", error);
    return response;
  }
};
