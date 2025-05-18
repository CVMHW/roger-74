/**
 * Cross-Encoder Reranking System
 * 
 * Implements sophisticated reranking for improved RAG relevance using
 * multiple relevance signals beyond just vector similarity
 */

import { generateEmbedding, cosineSimilarity, isUsingSimulatedEmbeddings } from './vectorEmbeddings';
import { MemoryPiece } from './memoryTypes';

interface RerankerOptions {
  topK?: number;
  semanticWeight?: number;
  lexicalWeight?: number;
  recencyWeight?: number;
  importanceWeight?: number;
  requireMinimumScore?: boolean;
  minimumScore?: number;
  contextBoostFactor?: number;
  useCrossAttention?: boolean;
}

interface RerankedResult {
  content: string;
  finalScore: number;
  scores: {
    semantic: number;
    lexical: number;
    recency: number;
    importance: number;
    contextual?: number;
  };
  metadata?: any;
}

// Store recent queries for contextual reranking
const recentQueries: string[] = [];
const MAX_RECENT_QUERIES = 5;

// Add a query to recent queries
const addRecentQuery = (query: string) => {
  // Don't add duplicate adjacent queries
  if (recentQueries[0] !== query) {
    recentQueries.unshift(query);
    if (recentQueries.length > MAX_RECENT_QUERIES) {
      recentQueries.pop();
    }
  }
};

/**
 * Rerank search results using a cross-encoder approach with multiple signals
 */
export const rerankResults = async (
  query: string,
  results: MemoryPiece[],
  options: RerankerOptions = {}
): Promise<MemoryPiece[]> => {
  // Default options
  const {
    topK = 5,
    semanticWeight = 0.6,
    lexicalWeight = 0.2,
    recencyWeight = 0.1,
    importanceWeight = 0.1,
    requireMinimumScore = true,
    minimumScore = 0.3,
    contextBoostFactor = 1.2, // Boost for results matching conversation context
    useCrossAttention = true // Use cross-attention for pairwise scoring
  } = options;
  
  // Store this query for future context
  addRecentQuery(query);
  
  if (!results || results.length === 0) {
    return [];
  }
  
  try {
    // 1. Generate embeddings for query and conversation context
    const queryEmbedding = await generateEmbedding(query);
    
    // Generate embeddings for recent queries to represent conversation context
    const contextEmbeddings = useCrossAttention && recentQueries.length > 1 
      ? await Promise.all(recentQueries.slice(1).map(q => generateEmbedding(q)))
      : [];
      
    console.log(`Reranking ${results.length} results with ${recentQueries.length} context queries`);
    
    // 2. Calculate multiple relevance scores and combine them
    const scoredResults: RerankedResult[] = await Promise.all(
      results.map(async result => {
        // 2.1 Semantic similarity (most important)
        const contentEmbedding = await generateEmbedding(result.content);
        const semanticScore = cosineSimilarity(queryEmbedding, contentEmbedding);
        
        // 2.2 Lexical/keyword overlap
        const lexicalScore = calculateLexicalScore(query, result.content);
        
        // 2.3 Recency score (if timestamp available)
        const recencyScore = calculateRecencyScore(result.metadata?.timestamp || 0);
        
        // 2.4 Importance score (from metadata or default)
        const importanceScore = result.importance || result.metadata?.importance || 0.5;
        
        // 2.5 Contextual relevance to conversation history
        let contextualScore = 0;
        if (useCrossAttention && contextEmbeddings.length > 0) {
          // Calculate similarity with each context query
          const contextScores = contextEmbeddings.map(embedding => 
            cosineSimilarity(embedding, contentEmbedding)
          );
          
          // Use exponentially decaying weights for older queries
          const totalWeight = contextEmbeddings.length * (contextEmbeddings.length + 1) / 2;
          let weightedSum = 0;
          
          contextScores.forEach((score, index) => {
            const weight = (contextEmbeddings.length - index) / totalWeight;
            weightedSum += score * weight;
          });
          
          contextualScore = weightedSum;
        }
        
        // 2.6 Calculate final weighted score
        const baseScore = (
          semanticWeight * semanticScore +
          lexicalWeight * lexicalScore +
          recencyWeight * recencyScore +
          importanceWeight * importanceScore
        );
        
        // Apply context boost for results relevant to conversation history
        const contextBoost = useCrossAttention && contextualScore > 0.6 
          ? contextBoostFactor 
          : 1.0;
        
        const finalScore = baseScore * contextBoost;
        
        return {
          content: result.content,
          finalScore,
          scores: {
            semantic: semanticScore,
            lexical: lexicalScore,
            recency: recencyScore,
            importance: importanceScore,
            contextual: contextualScore
          },
          metadata: result.metadata
        };
      })
    );
    
    // 3. Filter by minimum score if required
    const filteredResults = requireMinimumScore
      ? scoredResults.filter(result => result.finalScore >= minimumScore)
      : scoredResults;
      
    // 4. Sort by final score and take top K
    const topResults = filteredResults
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, topK);
      
    // 5. Convert back to MemoryPiece format
    return topResults.map(result => ({
      content: result.content,
      role: 'system',
      importance: result.finalScore,
      metadata: {
        ...result.metadata,
        reranked: true,
        rerankerScores: result.scores
      }
    }));
    
  } catch (error) {
    console.error("Error in reranker:", error);
    
    // Return original results if reranking fails, sorted by importance
    return [...results]
      .sort((a, b) => (b.importance || 0) - (a.importance || 0))
      .slice(0, topK);
  }
};

/**
 * Calculate lexical/keyword overlap score with improved token weighting
 */
function calculateLexicalScore(query: string, content: string): number {
  // Tokenize query and content
  const queryTerms = new Set(
    query.toLowerCase()
      .split(/\W+/)
      .filter(term => term.length > 2)
  );
  
  const contentTerms = content.toLowerCase().split(/\W+/);
  
  // Skip stop words and very short words
  const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'is', 'are', 'was', 'were']);
  const filteredContentTerms = contentTerms.filter(term => term.length > 2 && !stopWords.has(term));
  
  // Calculate term weights - longer terms and rarer terms get higher weights
  const termWeights = new Map<string, number>();
  queryTerms.forEach(term => {
    // Base weight based on length
    let weight = 0.5 + (term.length / 20);
    
    // Boost rare/important words
    if (term.length >= 8) weight *= 1.5;
    
    termWeights.set(term, weight);
  });
  
  // Count weighted matching terms
  let weightedMatchScore = 0;
  for (const term of filteredContentTerms) {
    if (queryTerms.has(term)) {
      weightedMatchScore += termWeights.get(term) || 1.0;
    }
  }
  
  // Calculate total possible weight
  let totalPossibleWeight = 0;
  termWeights.forEach(weight => totalPossibleWeight += weight);
  
  // Normalize to 0-1 range
  return totalPossibleWeight > 0 ? Math.min(1.0, weightedMatchScore / totalPossibleWeight) : 0;
}

/**
 * Calculate recency score based on timestamp with improved decay function
 */
function calculateRecencyScore(timestamp: number): number {
  if (!timestamp) return 0.5; // Default middle score if no timestamp
  
  const now = Date.now();
  const ageInHours = (now - timestamp) / (1000 * 60 * 60);
  
  // More sophisticated decay function:
  // - Very recent items (< 1 hour): score > 0.9
  // - Items from ~24 hours ago: score ~0.5
  // - Items from a week ago: score ~0.2
  // - Items over a month old: score < 0.1
  
  // Use sigmoid-like function for smoother decay
  return 1 / (1 + Math.pow(ageInHours / 24, 1.5));
}

/**
 * Enhanced two-stage reranking with cross-attention
 */
export const rerankWithCrossAttention = async (
  query: string,
  results: MemoryPiece[],
  options: {
    firstStageLimit?: number;
    finalLimit?: number;
    contextQueries?: string[];
  } = {}
): Promise<MemoryPiece[]> => {
  const {
    firstStageLimit = 20,
    finalLimit = 5,
    contextQueries = []
  } = options;
  
  try {
    // Add context queries to recent queries for better context awareness
    contextQueries.forEach(q => addRecentQuery(q));
    
    // First stage: basic semantic similarity ranking
    const firstStageResults = await rerankResults(query, results, {
      topK: firstStageLimit,
      semanticWeight: 0.8,
      lexicalWeight: 0.2,
      useCrossAttention: false // Skip cross-attention in first pass for speed
    });
    
    // Second stage: enhanced reranking with cross-attention and contextual boost
    return rerankResults(query, firstStageResults, {
      topK: finalLimit,
      semanticWeight: 0.5,
      lexicalWeight: 0.2,
      recencyWeight: 0.1,
      importanceWeight: 0.2,
      contextBoostFactor: 1.5,
      useCrossAttention: true
    });
  } catch (error) {
    console.error("Error in cross-attention reranking:", error);
    // Fallback to basic reranking
    return rerankResults(query, results, { topK: finalLimit });
  }
};

/**
 * Combination of hybrid search and reranking for optimal retrieval
 */
export const retrieveWithReranking = async (
  query: string,
  initialResults: MemoryPiece[],
  options: {
    topK?: number;
    shouldRerank?: boolean;
    conversationContext?: string[];
  } = {}
): Promise<MemoryPiece[]> => {
  const { 
    topK = 5, 
    shouldRerank = true,
    conversationContext = []
  } = options;
  
  try {
    // If reranking is disabled, just sort by importance
    if (!shouldRerank) {
      return [...initialResults]
        .sort((a, b) => (b.importance || 0) - (a.importance || 0))
        .slice(0, topK);
    }
    
    // Use enhanced cross-attention reranking for best results
    return rerankWithCrossAttention(query, initialResults, {
      finalLimit: topK,
      contextQueries: conversationContext
    });
  } catch (error) {
    console.error("Error in retrieveWithReranking:", error);
    // Fall back to original results
    return initialResults.slice(0, topK);
  }
};

// Export reranker stats
export const getRerankerStats = () => {
  return {
    recentQueries: recentQueries.length,
    usingCrossAttention: recentQueries.length > 1
  };
};
