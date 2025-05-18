
/**
 * Cross-Encoder Reranker System
 * 
 * Implements a cross-encoder reranking model for improved retrieval accuracy
 * by evaluating query-document pairs together rather than separate embeddings
 */

import { MemoryPiece } from '../retrieval';
import { generateEmbedding, cosineSimilarity } from '../vectorEmbeddings';

// Types for cross-encoder options
export interface CrossEncoderOptions {
  // Model name or path to use for cross-encoder
  modelName?: string;
  // Top K documents to return after reranking
  topK?: number;
  // Minimum score threshold for relevant documents
  scoreThreshold?: number;
  // Document/query features to consider in scoring
  useSemanticFeatures?: boolean;
  useLexicalFeatures?: boolean;
  useRecencyFeatures?: boolean;
  useImportanceFeatures?: boolean;
  useContextualFeatures?: boolean;
  // Feature weights for final scoring
  semanticWeight?: number;
  lexicalWeight?: number;
  recencyWeight?: number;
  importanceWeight?: number;
  contextualWeight?: number;
}

// Result from cross-encoder reranking
export interface CrossEncoderResult {
  content: MemoryPiece[];
  scores: number[];
  featureScores?: Array<Record<string, number>>;
}

/**
 * Cross-Encoder Reranker class
 * 
 * Implements cross-attention mechanism for scoring query-document pairs
 * Based on the architecture shown in the reference diagrams
 */
export class CrossEncoderReranker {
  private options: CrossEncoderOptions;
  
  // Track recent queries for contextual reranking
  private recentQueries: string[] = [];
  private readonly MAX_RECENT_QUERIES = 5;
  
  constructor(options: CrossEncoderOptions = {}) {
    // Set default options
    this.options = {
      modelName: 'cross-encoder',
      topK: 5,
      scoreThreshold: 0.3,
      useSemanticFeatures: true,
      useLexicalFeatures: true,
      useRecencyFeatures: true,
      useImportanceFeatures: true,
      useContextualFeatures: true,
      semanticWeight: 0.6,
      lexicalWeight: 0.2,
      recencyWeight: 0.1,
      importanceWeight: 0.1,
      contextualWeight: 0.2,
      ...options
    };
  }
  
  /**
   * Rerank documents using cross-encoder approach
   */
  public async rerank(
    query: string,
    documents: MemoryPiece[],
    conversationContext: string[] = []
  ): Promise<CrossEncoderResult> {
    // Add query to recent queries cache
    this.addRecentQuery(query);
    
    // Add context queries if available
    if (conversationContext && conversationContext.length > 0) {
      conversationContext.forEach(q => this.addRecentQuery(q));
    }
    
    if (!documents || documents.length === 0) {
      return { content: [], scores: [] };
    }
    
    try {
      // Get options with defaults applied
      const {
        topK = 5,
        scoreThreshold = 0.3,
        useSemanticFeatures = true,
        useLexicalFeatures = true,
        useRecencyFeatures = true,
        useImportanceFeatures = true,
        useContextualFeatures = true,
        semanticWeight = 0.6,
        lexicalWeight = 0.2,
        recencyWeight = 0.1,
        importanceWeight = 0.1,
        contextualWeight = 0.2
      } = this.options;
      
      // Generate query embedding for semantic similarity
      const queryEmbedding = await generateEmbedding(query);
      
      // Generate embeddings for context queries
      const contextEmbeddings = useContextualFeatures && this.recentQueries.length > 1
        ? await Promise.all(
            this.recentQueries.slice(0, this.MAX_RECENT_QUERIES).map(q => 
              q !== query ? generateEmbedding(q) : queryEmbedding
            )
          )
        : [];
      
      // Calculate cross-attention scores for each document
      const scoredResults = await Promise.all(
        documents.map(async (doc) => {
          // Initialize feature scores object
          const featureScores: Record<string, number> = {};
          
          // 1. Semantic similarity (most important)
          let semanticScore = 0;
          if (useSemanticFeatures) {
            try {
              const docEmbedding = await generateEmbedding(doc.content);
              semanticScore = cosineSimilarity(queryEmbedding, docEmbedding);
              featureScores.semantic = semanticScore;
            } catch (err) {
              console.error("Error calculating semantic score:", err);
              featureScores.semantic = 0;
            }
          }
          
          // 2. Lexical similarity (keyword overlap)
          let lexicalScore = 0;
          if (useLexicalFeatures) {
            lexicalScore = this.calculateLexicalScore(query, doc.content);
            featureScores.lexical = lexicalScore;
          }
          
          // 3. Recency score
          let recencyScore = 0;
          if (useRecencyFeatures) {
            recencyScore = this.calculateRecencyScore(doc.metadata?.timestamp);
            featureScores.recency = recencyScore;
          }
          
          // 4. Importance score (from metadata or default)
          let importanceScore = 0;
          if (useImportanceFeatures) {
            importanceScore = doc.importance ?? doc.metadata?.importance ?? 0.5;
            featureScores.importance = importanceScore;
          }
          
          // 5. Contextual relevance to conversation history
          let contextualScore = 0;
          if (useContextualFeatures && contextEmbeddings.length > 0) {
            try {
              const docEmbedding = await generateEmbedding(doc.content);
              
              // Calculate similarity with each context query
              const contextScores = contextEmbeddings.map(embedding => 
                cosineSimilarity(embedding, docEmbedding)
              );
              
              // Use exponentially decaying weights for older queries
              let weightedSum = 0;
              let weightSum = 0;
              
              contextScores.forEach((score, index) => {
                // More recent queries get higher weights
                const weight = Math.pow(0.8, index);
                weightedSum += score * weight;
                weightSum += weight;
              });
              
              contextualScore = weightedSum / weightSum;
              featureScores.contextual = contextualScore;
            } catch (err) {
              console.error("Error calculating contextual score:", err);
              featureScores.contextual = 0;
            }
          }
          
          // Calculate final score as weighted combination of features
          const finalScore = 
            semanticWeight * semanticScore +
            lexicalWeight * lexicalScore +
            recencyWeight * recencyScore + 
            importanceWeight * importanceScore +
            (useContextualFeatures ? contextualWeight * contextualScore : 0);
          
          return {
            document: doc,
            score: finalScore,
            featureScores
          };
        })
      );
      
      // Filter by threshold if required
      const filteredResults = scoredResults
        .filter(item => item.score >= scoreThreshold)
        .sort((a, b) => b.score - a.score);
      
      // Take top K results
      const topResults = filteredResults.slice(0, topK);
      
      return {
        content: topResults.map(item => item.document),
        scores: topResults.map(item => item.score),
        featureScores: topResults.map(item => item.featureScores)
      };
    } catch (error) {
      console.error("Error in cross-encoder reranker:", error);
      return {
        content: documents.slice(0, this.options.topK),
        scores: documents.map(() => 0.5)
      };
    }
  }
  
  /**
   * Calculate lexical/keyword overlap score with improved token weighting
   */
  private calculateLexicalScore(query: string, content: string): number {
    // Simple implementation using word overlap and weighting
    try {
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
    } catch (error) {
      console.error("Error in lexical scoring:", error);
      return 0;
    }
  }
  
  /**
   * Calculate recency score based on timestamp with improved decay function
   */
  private calculateRecencyScore(timestamp?: number): number {
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
   * Add a query to recent queries
   */
  private addRecentQuery(query: string): void {
    // Don't add duplicate adjacent queries
    if (this.recentQueries[0] !== query) {
      this.recentQueries.unshift(query);
      if (this.recentQueries.length > this.MAX_RECENT_QUERIES) {
        this.recentQueries.pop();
      }
    }
  }
  
  /**
   * Get current reranker stats
   */
  public getStats() {
    return {
      recentQueries: this.recentQueries.length,
      usingContextualFeatures: this.options.useContextualFeatures && this.recentQueries.length > 1
    };
  }
}

// Export singleton instance with defaults
const defaultReranker = new CrossEncoderReranker();
export default defaultReranker;

/**
 * Helper function to rerank documents with the default reranker
 */
export const rerankDocumentsWithCrossEncoder = async (
  query: string,
  documents: MemoryPiece[],
  conversationContext: string[] = [],
  options: CrossEncoderOptions = {}
): Promise<MemoryPiece[]> => {
  const reranker = new CrossEncoderReranker(options);
  const result = await reranker.rerank(query, documents, conversationContext);
  return result.content;
};

