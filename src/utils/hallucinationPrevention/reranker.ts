
/**
 * Cross-Encoder Reranking System
 * 
 * Implements sophisticated reranking for improved RAG relevance using
 * multiple relevance signals beyond just vector similarity
 */

import { generateEmbedding, cosineSimilarity } from './vectorEmbeddings';
import { MemoryPiece } from './retrieval';

interface RerankerOptions {
  topK?: number;
  semanticWeight?: number;
  lexicalWeight?: number;
  recencyWeight?: number;
  importanceWeight?: number;
  requireMinimumScore?: boolean;
  minimumScore?: number;
}

interface RerankedResult {
  content: string;
  finalScore: number;
  scores: {
    semantic: number;
    lexical: number;
    recency: number;
    importance: number;
  };
  metadata?: any;
}

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
    minimumScore = 0.3
  } = options;
  
  if (!results || results.length === 0) {
    return [];
  }
  
  try {
    // 1. Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
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
        
        // 2.5 Calculate final weighted score
        const finalScore = (
          semanticWeight * semanticScore +
          lexicalWeight * lexicalScore +
          recencyWeight * recencyScore +
          importanceWeight * importanceScore
        );
        
        return {
          content: result.content,
          finalScore,
          scores: {
            semantic: semanticScore,
            lexical: lexicalScore,
            recency: recencyScore,
            importance: importanceScore
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
 * Calculate lexical/keyword overlap score
 */
function calculateLexicalScore(query: string, content: string): number {
  // Tokenize query and content
  const queryTerms = new Set(
    query.toLowerCase()
      .split(/\W+/)
      .filter(term => term.length > 2)
  );
  
  const contentTerms = content.toLowerCase().split(/\W+/);
  
  // Count matching terms
  let matchCount = 0;
  for (const term of contentTerms) {
    if (queryTerms.has(term)) {
      matchCount++;
    }
  }
  
  // Calculate overlap ratio
  const queryTermCount = queryTerms.size;
  if (queryTermCount === 0) return 0;
  
  // Normalize to 0-1 range, with diminishing returns after finding all query terms
  return Math.min(1.0, matchCount / queryTermCount);
}

/**
 * Calculate recency score based on timestamp
 */
function calculateRecencyScore(timestamp: number): number {
  if (!timestamp) return 0.5; // Default middle score if no timestamp
  
  const now = Date.now();
  const ageInHours = (now - timestamp) / (1000 * 60 * 60);
  
  // Exponential decay function - very recent items score high
  // Items from ~24 hours ago score ~0.5
  // Items from a week ago or more score ~0
  return Math.exp(-0.03 * ageInHours);
}

/**
 * Combination of hybrid search and reranking for optimal retrieval
 */
export const retrieveWithReranking = async (
  query: string,
  initialResults: MemoryPiece[],
  options: {
    topK?: number;
    shouldRerank?: boolean;
  } = {}
): Promise<MemoryPiece[]> => {
  const { topK = 5, shouldRerank = true } = options;
  
  try {
    // If reranking is disabled, just sort by importance
    if (!shouldRerank) {
      return [...initialResults]
        .sort((a, b) => (b.importance || 0) - (a.importance || 0))
        .slice(0, topK);
    }
    
    // Perform reranking
    return rerankResults(query, initialResults, { topK });
  } catch (error) {
    console.error("Error in retrieveWithReranking:", error);
    // Fall back to original results
    return initialResults.slice(0, topK);
  }
};
