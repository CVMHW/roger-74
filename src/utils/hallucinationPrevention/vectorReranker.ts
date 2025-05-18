
/**
 * Vector Reranker System
 * 
 * Implements cross-encoder reranking for improved RAG retrieval
 * using proper vector embeddings and similarity calculations
 */

import { retrieveFactualGrounding, MemoryPiece } from './retrieval';
import { 
  generateEmbedding, 
  cosineSimilarity, 
  findMostSimilar 
} from './vectorEmbeddings';

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
 * Rerank retrieved content with actual vector similarity
 */
export const rerankWithVectorSimilarity = async (
  query: string,
  retrievedMemories: MemoryPiece[],
  settings: RerankerSettings = { topK: 3, threshold: 0.6 }
): Promise<MemoryPiece[]> => {
  // Default settings
  const { topK, threshold, requireMinimumScore = false, minimumScore = 0.5 } = settings;
  
  if (!retrievedMemories || retrievedMemories.length === 0) {
    return [];
  }
  
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Calculate similarity for each memory
    const rankedResults: RankedResult[] = await Promise.all(
      retrievedMemories.map(async (memory, index) => {
        // Generate embedding for memory content
        const memoryEmbedding = await generateEmbedding(memory.content);
        
        // Calculate cosine similarity
        let score = cosineSimilarity(queryEmbedding, memoryEmbedding);
        
        // Apply importance as a multiplier (capped at 1.0)
        score = Math.min(score * (1 + (memory.importance || 0.5)), 1.0);
        
        return {
          content: memory.content,
          score,
          originalIndex: index
        };
      })
    );
    
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
    
  } catch (error) {
    console.error("Error in vector reranking:", error);
    
    // Fallback to simple keyword matching if vector similarity fails
    return fallbackRanking(query, retrievedMemories, settings);
  }
};

/**
 * Fallback ranking function using keyword matching
 * Used when vector similarity fails
 */
const fallbackRanking = (
  query: string,
  retrievedMemories: MemoryPiece[],
  settings: RerankerSettings
): MemoryPiece[] => {
  const { topK } = settings;
  
  // Extract important terms from query (words longer than 3 chars)
  const queryTerms = query.toLowerCase()
    .split(/\W+/)
    .filter(term => term.length > 3);
  
  // Rank based on keyword matches
  const rankedResults: RankedResult[] = retrievedMemories.map((memory, index) => {
    const contentLower = memory.content.toLowerCase();
    
    let score = 0;
    for (const term of queryTerms) {
      if (contentLower.includes(term)) {
        score += 0.2;
        
        if (contentLower.includes(queryTerms.join(" "))) {
          score += 0.3;
        }
      }
    }
    
    // Adjust score by memory importance
    score = Math.min(score * (1 + (memory.importance || 0.5)), 1.0);
    
    return {
      content: memory.content,
      score,
      originalIndex: index
    };
  });
  
  // Sort by score descending
  const sortedResults = rankedResults.sort((a, b) => b.score - a.score);
  
  // Take top K results
  const topResults = sortedResults.slice(0, topK);
  
  // Map back to original objects
  return topResults.map(result => retrievedMemories[result.originalIndex]);
};

/**
 * Improve RAG retrieval with vector embeddings + reranking
 */
export const retrieveAndRerankMemories = async (
  query: string,
  topics: string[],
  limit: number = 5
): Promise<MemoryPiece[]> => {
  try {
    // 1. Initial retrieval using topics
    const retrievedMemories = retrieveFactualGrounding(topics, limit * 2);
    
    // 2. Reranking with vector similarity
    const rerankedMemories = await rerankWithVectorSimilarity(query, retrievedMemories, {
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
 * Enhanced with better stopword filtering and phrase detection
 */
export const extractTopics = (query: string): string[] => {
  // Expanded stop words list
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
    "just", "don", "should", "now", "also", "get", "got", "like", "make",
    "way", "even", "well", "back", "much", "many", "would", "could", "one"
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
  
  // Extract 3-word phrases (trigrams) for even better matches
  for (let i = 0; i < words.length - 2; i++) {
    phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  
  // Combine individual words and phrases, removing duplicates
  const allTopics = [...words, ...phrases];
  const uniqueTopics = [...new Set(allTopics)];
  
  // Return top 7 topics (increased from 5)
  return uniqueTopics.slice(0, 7);
};

/**
 * Enhanced augment response with semantically integrated content
 */
export const augmentResponseWithReranking = async (
  response: string,
  userInput: string,
): Promise<string> => {
  try {
    // Extract topics from user input
    const topics = extractTopics(userInput);
    
    // Retrieve and rerank memories
    const rerankedMemories = await retrieveAndRerankMemories(userInput, topics, 3);
    
    // If no good matches found, return original response
    if (rerankedMemories.length === 0) {
      return response;
    }
    
    // Get the top memory
    const topMemory = rerankedMemories[0].content;
    
    // Avoid duplication if response already contains memory
    if (response.includes(topMemory)) {
      return response;
    }
    
    // Split response into sentences for better integration
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    // Find the most semantically relevant point to insert the memory
    let bestSentenceIndex = 0;
    let highestSimilarity = -1;
    
    try {
      // Find the sentence most similar to the memory
      const memoryEmbedding = await generateEmbedding(topMemory);
      
      for (let i = 0; i < sentences.length; i++) {
        if (sentences[i].length < 10) continue; // Skip very short sentences
        
        const sentenceEmbedding = await generateEmbedding(sentences[i]);
        const similarity = cosineSimilarity(memoryEmbedding, sentenceEmbedding);
        
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestSentenceIndex = i;
        }
      }
    } catch (error) {
      // If similarity calculation fails, use a default insertion point
      bestSentenceIndex = Math.floor(sentences.length / 3);
    }
    
    // Create a natural transition phrase based on the memory content
    let transitionPhrase = "Relating to what you've shared, ";
    
    if (topMemory.includes("feel") || topMemory.includes("feeling")) {
      transitionPhrase = "Connecting with your feelings, ";
    } else if (topMemory.includes("think") || topMemory.includes("thought")) {
      transitionPhrase = "Building on your thoughts, ";
    } else if (topMemory.includes("want") || topMemory.includes("need")) {
      transitionPhrase = "Addressing what you're looking for, ";
    }
    
    // Insert the memory with the transition phrase
    const enhancedResponse = [
      ...sentences.slice(0, bestSentenceIndex),
      `${transitionPhrase}${topMemory}`,
      ...sentences.slice(bestSentenceIndex)
    ].join(' ');
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error augmenting response with reranking:", error);
    return response;
  }
};
