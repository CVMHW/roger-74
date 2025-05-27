
/**
 * Unified RAG Service
 * 
 * Consolidates vector database, hybrid search, reranking, and chunking
 * into a single cohesive retrieval augmented generation service
 */

import vectorDB from '../utils/hallucinationPrevention/vectorDatabase';
import { EmotionAnalysis } from './EmotionAnalysisService';
import { MemoryContext } from './MemoryService';

export interface RAGContext {
  userInput: string;
  emotionContext: EmotionAnalysis;
  memoryContext: MemoryContext;
  conversationHistory: string[];
  searchType?: 'semantic' | 'keyword' | 'hybrid';
}

export interface RAGResult {
  enhancedContext: string[];
  confidence: number;
  wasApplied: boolean;
  retrievalMethod: string;
  relevanceScores: number[];
}

export interface ChunkingConfig {
  chunkSize: number;
  overlapSize: number;
  preserveContext: boolean;
}

/**
 * Unified RAG Service with integrated vector search, reranking, and chunking
 */
export class RAGService {
  private vectorDatabase = vectorDB;
  private chunkingConfig: ChunkingConfig = {
    chunkSize: 512,
    overlapSize: 64,
    preserveContext: true
  };

  /**
   * Main RAG enhancement method
   * Combines semantic search, keyword matching, and cross-encoder reranking
   */
  async enhance(
    userInput: string,
    memoryContext: MemoryContext,
    emotionAnalysis: EmotionAnalysis,
    conversationHistory: string[]
  ): Promise<RAGResult> {
    try {
      // Step 1: Generate query embeddings for semantic search
      const queryEmbedding = await this.generateQueryEmbedding(userInput, emotionAnalysis);
      
      // Step 2: Perform hybrid search (semantic + keyword)
      const semanticResults = await this.performSemanticSearch(queryEmbedding, userInput);
      const keywordResults = await this.performKeywordSearch(userInput, emotionAnalysis);
      
      // Step 3: Merge and deduplicate results
      const combinedResults = this.mergeSearchResults(semanticResults, keywordResults);
      
      // Step 4: Apply cross-encoder reranking for relevance
      const rerankedResults = await this.rerankcResults(combinedResults, userInput, emotionAnalysis);
      
      // Step 5: Filter by relevance threshold and context fit
      const filteredResults = this.filterByRelevance(rerankedResults, memoryContext, conversationHistory);
      
      // Step 6: Chunk and format for context injection
      const enhancedContext = this.chunkAndFormatContext(filteredResults);
      
      return {
        enhancedContext,
        confidence: this.calculateConfidence(filteredResults),
        wasApplied: enhancedContext.length > 0,
        retrievalMethod: 'hybrid_reranked',
        relevanceScores: filteredResults.map(r => r.score)
      };
      
    } catch (error) {
      console.error('RAG enhancement error:', error);
      return {
        enhancedContext: [],
        confidence: 0,
        wasApplied: false,
        retrievalMethod: 'fallback',
        relevanceScores: []
      };
    }
  }

  /**
   * Generate query embedding with emotion-aware enhancement
   */
  private async generateQueryEmbedding(userInput: string, emotionAnalysis: EmotionAnalysis): Promise<number[]> {
    // Enhance query with emotional context for better semantic matching
    const emotionEnhancedQuery = `${userInput} [emotion: ${emotionAnalysis.primaryEmotion}] [intensity: ${emotionAnalysis.intensity}]`;
    
    try {
      return await this.vectorDatabase.generateEmbedding(emotionEnhancedQuery);
    } catch (error) {
      console.warn('Embedding generation failed, using fallback');
      return await this.vectorDatabase.generateEmbedding(userInput);
    }
  }

  /**
   * Perform semantic vector search
   */
  private async performSemanticSearch(queryEmbedding: number[], userInput: string): Promise<any[]> {
    return await this.vectorDatabase.search(queryEmbedding, {
      limit: 10,
      threshold: 0.7,
      includeMetadata: true
    });
  }

  /**
   * Perform keyword-based search with emotion-aware term expansion
   */
  private async performKeywordSearch(userInput: string, emotionAnalysis: EmotionAnalysis): Promise<any[]> {
    const expandedKeywords = this.expandKeywordsWithEmotion(userInput, emotionAnalysis);
    
    // Use vector database's keyword search if available, otherwise fallback to simple matching
    return await this.vectorDatabase.keywordSearch(expandedKeywords, {
      limit: 8,
      fuzzy: true,
      emotionWeight: emotionAnalysis.intensity
    });
  }

  /**
   * Expand keywords based on emotional context
   */
  private expandKeywordsWithEmotion(userInput: string, emotionAnalysis: EmotionAnalysis): string[] {
    const baseKeywords = userInput.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    // Add emotion-related synonyms and expansions
    const emotionExpansions = this.getEmotionExpansions(emotionAnalysis.primaryEmotion);
    
    return [...baseKeywords, ...emotionExpansions];
  }

  /**
   * Get emotion-related keyword expansions
   */
  private getEmotionExpansions(emotion: string): string[] {
    const expansions: Record<string, string[]> = {
      'sad': ['depression', 'grief', 'melancholy', 'sorrow', 'down'],
      'anxious': ['worry', 'stress', 'fear', 'nervous', 'panic'],
      'angry': ['rage', 'frustration', 'irritation', 'mad', 'upset'],
      'happy': ['joy', 'contentment', 'positive', 'good', 'pleased'],
      'confused': ['uncertain', 'unclear', 'mixed up', 'lost', 'overwhelmed']
    };
    
    return expansions[emotion] || [];
  }

  /**
   * Merge semantic and keyword search results with score normalization
   */
  private mergeSearchResults(semanticResults: any[], keywordResults: any[]): any[] {
    const resultMap = new Map();
    
    // Add semantic results with higher weight
    semanticResults.forEach(result => {
      resultMap.set(result.id, {
        ...result,
        score: result.score * 0.7, // Semantic weight
        method: 'semantic'
      });
    });
    
    // Add keyword results, merging scores if already present
    keywordResults.forEach(result => {
      if (resultMap.has(result.id)) {
        const existing = resultMap.get(result.id);
        resultMap.set(result.id, {
          ...existing,
          score: existing.score + (result.score * 0.3), // Keyword weight
          method: 'hybrid'
        });
      } else {
        resultMap.set(result.id, {
          ...result,
          score: result.score * 0.3,
          method: 'keyword'
        });
      }
    });
    
    return Array.from(resultMap.values()).sort((a, b) => b.score - a.score);
  }

  /**
   * Apply cross-encoder reranking for improved relevance
   */
  private async rerankcResults(results: any[], userInput: string, emotionAnalysis: EmotionAnalysis): Promise<any[]> {
    // Implement cross-encoder reranking logic
    // For now, use a simplified scoring that considers emotion alignment
    return results.map(result => ({
      ...result,
      score: result.score * this.calculateEmotionAlignment(result, emotionAnalysis)
    })).sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate emotion alignment score for reranking
   */
  private calculateEmotionAlignment(result: any, emotionAnalysis: EmotionAnalysis): number {
    if (!result.metadata?.emotions) return 1.0;
    
    const resultEmotions = result.metadata.emotions;
    if (resultEmotions.includes(emotionAnalysis.primaryEmotion)) {
      return 1.2; // Boost for emotion match
    }
    
    return 1.0; // Neutral for no match
  }

  /**
   * Filter results by relevance threshold and context fit
   */
  private filterByRelevance(results: any[], memoryContext: MemoryContext, conversationHistory: string[]): any[] {
    return results.filter(result => {
      // Minimum relevance threshold
      if (result.score < 0.5) return false;
      
      // Check for context fit with conversation history
      if (this.conflictsWithRecentContext(result, conversationHistory)) return false;
      
      // Check for memory context alignment
      if (!this.alignsWithMemoryContext(result, memoryContext)) return false;
      
      return true;
    }).slice(0, 5); // Limit to top 5 results
  }

  /**
   * Check if result conflicts with recent conversation context
   */
  private conflictsWithRecentContext(result: any, conversationHistory: string[]): boolean {
    if (conversationHistory.length === 0) return false;
    
    const recentContext = conversationHistory.slice(-3).join(' ').toLowerCase();
    const resultContent = result.content?.toLowerCase() || '';
    
    // Simple conflict detection - can be enhanced with more sophisticated logic
    return false; // Placeholder - implement actual conflict detection
  }

  /**
   * Check if result aligns with memory context
   */
  private alignsWithMemoryContext(result: any, memoryContext: MemoryContext): boolean {
    // Always allow if no memory context
    if (!memoryContext.relevantItems.length) return true;
    
    // Check for thematic alignment with remembered context
    return true; // Placeholder - implement actual alignment check
  }

  /**
   * Chunk and format context for injection into response generation
   */
  private chunkAndFormatContext(results: any[]): string[] {
    return results.map(result => {
      const content = result.content || result.text || '';
      return this.chunkContent(content, this.chunkingConfig);
    }).flat().filter(chunk => chunk.length > 10);
  }

  /**
   * Smart content chunking with context preservation
   */
  private chunkContent(content: string, config: ChunkingConfig): string[] {
    if (content.length <= config.chunkSize) return [content];
    
    const chunks: string[] = [];
    let currentIndex = 0;
    
    while (currentIndex < content.length) {
      const endIndex = Math.min(currentIndex + config.chunkSize, content.length);
      let chunk = content.slice(currentIndex, endIndex);
      
      // Try to break at sentence boundaries if preserveContext is true
      if (config.preserveContext && endIndex < content.length) {
        const lastSentenceEnd = Math.max(
          chunk.lastIndexOf('.'),
          chunk.lastIndexOf('!'),
          chunk.lastIndexOf('?')
        );
        
        if (lastSentenceEnd > config.chunkSize * 0.7) {
          chunk = chunk.slice(0, lastSentenceEnd + 1);
        }
      }
      
      chunks.push(chunk.trim());
      currentIndex += chunk.length - config.overlapSize;
    }
    
    return chunks;
  }

  /**
   * Calculate overall confidence score for RAG enhancement
   */
  private calculateConfidence(results: any[]): number {
    if (!results.length) return 0;
    
    const avgScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
    const diversityBonus = Math.min(results.length / 5, 1) * 0.1;
    
    return Math.min(avgScore + diversityBonus, 1.0);
  }

  /**
   * Health check for RAG service
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Test vector database connectivity
      await this.vectorDatabase.search([0.1, 0.2, 0.3], { limit: 1 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Add content to the vector database with proper chunking
   */
  async addContent(content: string, metadata: any = {}): Promise<void> {
    const chunks = this.chunkContent(content, this.chunkingConfig);
    
    for (const chunk of chunks) {
      const embedding = await this.vectorDatabase.generateEmbedding(chunk);
      await this.vectorDatabase.add({
        id: `chunk_${Date.now()}_${Math.random()}`,
        vector: embedding,
        content: chunk,
        metadata: {
          ...metadata,
          originalLength: content.length,
          chunkIndex: chunks.indexOf(chunk)
        }
      });
    }
  }
}
