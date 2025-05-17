
/**
 * Vector Reranker System
 * 
 * Implements cross-encoder reranking for improved RAG retrieval
 * using the bi-encoder + cross-encoder pattern shown in the examples
 */

import { retrieveFactualGrounding, MemoryPiece } from './retrieval';

/**
 * Types for ranking results
 */
interface RankedResult {
  content: string;
  score: number;
  originalIndex: number;
}

/**
 * RerankerSettings interface for configuration
 */
interface RerankerSettings {
  topK: number;
  threshold: number;
  requireMinimumScore?: boolean;
  minimumScore?: number;
}

/**
 * Rerank retrieved content with simulated cross-encoder scores
 * 
 * In a production environment, this would use an actual cross-encoder model
 * to compute relevance scores between the query and each document
 */
export const rerankWithSimulatedCrossEncoder = (
  query: string,
  retrievedMemories: MemoryPiece[],
  settings: RerankerSettings = { topK: 3, threshold: 0.6 }
): MemoryPiece[] => {
  // Default settings
  const { topK, threshold, requireMinimumScore = false, minimumScore = 0.5 } = settings;
  
  if (!retrievedMemories || retrievedMemories.length === 0) {
    return [];
  }
  
  // For simulation, we'll use a simple relevance heuristic
  const rankedResults: RankedResult[] = retrievedMemories.map((memory, index) => {
    // Simulate cross-encoder scoring by checking for keyword matches
    // In a real implementation, this would use a language model
    const queryTerms = query.toLowerCase().split(/\W+/).filter(term => term.length > 3);
    const contentLower = memory.content.toLowerCase();
    
    let score = 0;
    for (const term of queryTerms) {
      if (contentLower.includes(term)) {
        // Award points for exact matches
        score += 0.2;
        
        // Award more points for phrase matches
        if (contentLower.includes(queryTerms.join(" "))) {
          score += 0.3;
        }
      }
    }
    
    // Adjust score by memory importance
    score = Math.min(score * (1 + memory.importance), 1.0);
    
    return {
      content: memory.content,
      score,
      originalIndex: index
    };
  });
  
  // Sort by score descending
  const sortedResults = rankedResults.sort((a, b) => b.score - a.score);
  
  // Filter by threshold if required
  const filteredResults = requireMinimumScore 
    ? sortedResults.filter(result => result.score >= minimumScore)
    : sortedResults;
  
  // Take top K results
  const topResults = filteredResults.slice(0, topK);
  
  // Map back to original objects
  return topResults.map(result => retrievedMemories[result.originalIndex]);
};

/**
 * Improve RAG retrieval with bi-encoder + cross-encoder pattern
 */
export const retrieveAndRerankMemories = (
  query: string,
  topics: string[],
  limit: number = 5
): MemoryPiece[] => {
  try {
    // 1. Initial retrieval using bi-encoder (vector similarity)
    const retrievedMemories = retrieveFactualGrounding(topics, limit * 2);
    
    // 2. Reranking with cross-encoder (more precise but computationally expensive)
    const rerankedMemories = rerankWithSimulatedCrossEncoder(query, retrievedMemories, {
      topK: limit,
      threshold: 0.6,
      requireMinimumScore: true,
      minimumScore: 0.2
    });
    
    return rerankedMemories;
  } catch (error) {
    console.error("Error in retrieveAndRerankMemories:", error);
    return [];
  }
};

/**
 * Extract topics from a user query for better retrieval
 */
export const extractTopics = (query: string): string[] => {
  // Remove common stop words
  const stopWords = [
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", 
    "you", "your", "yours", "yourself", "yourselves", 
    "he", "him", "his", "himself", "she", "her", "hers", "herself", 
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves", 
    "what", "which", "who", "whom", "this", "that", "these", "those", 
    "am", "is", "are", "was", "were", "be", "been", "being", 
    "have", "has", "had", "having", "do", "does", "did", "doing", 
    "a", "an", "the", "and", "but", "if", "or", "because", "as", 
    "until", "while", "of", "at", "by", "for", "with", "about", "against", 
    "between", "into", "through", "during", "before", "after", "above", 
    "below", "to", "from", "up", "down", "in", "out", "on", "off", 
    "over", "under", "again", "further", "then", "once", "here", "there", 
    "when", "where", "why", "how", "all", "any", "both", "each", "few", 
    "more", "most", "other", "some", "such", "no", "nor", "not", "only", 
    "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", 
    "just", "don", "should", "now"
  ];
  
  // Extract words longer than 3 chars that aren't stop words
  const words = query.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Extract 2-word phrases (bigrams) for better topic matching
  const phrases = [];
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
  }
  
  // Combine individual words and phrases, removing duplicates
  const allTopics = [...words, ...phrases];
  const uniqueTopics = [...new Set(allTopics)];
  
  // Return top 5 topics
  return uniqueTopics.slice(0, 5);
};

/**
 * Enhanced augment response with reranking
 */
export const augmentResponseWithReranking = (
  response: string,
  userInput: string,
): string => {
  try {
    // Extract topics from user input
    const topics = extractTopics(userInput);
    
    // Retrieve and rerank memories
    const rerankedMemories = retrieveAndRerankMemories(userInput, topics, 3);
    
    // If no good matches found, return original response
    if (rerankedMemories.length === 0) {
      return response;
    }
    
    // Use the top memory to augment the response
    const topMemory = rerankedMemories[0].content;
    
    // Avoid duplication if response already contains memory
    if (response.includes(topMemory)) {
      return response;
    }
    
    // Integrate memory naturally
    if (response.length < 100) {
      // For short responses, simply prepend
      return `${topMemory} ${response}`;
    } else {
      // For longer responses, insert at a natural point
      const sentences = response.split(/(?<=[.!?])\s+/);
      const insertPoint = Math.floor(sentences.length / 3);
      
      return [
        ...sentences.slice(0, insertPoint),
        topMemory,
        ...sentences.slice(insertPoint)
      ].join(' ');
    }
  } catch (error) {
    console.error("Error augmenting response with reranking:", error);
    return response;
  }
};
