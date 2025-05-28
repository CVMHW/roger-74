/**
 * Unified RAG Integrator
 * 
 * Integrates all RAG components with proper memory layer synchronization
 */

import { advancedVectorDB } from '../core/AdvancedVectorDatabase';
import { semanticChunker } from '../utils/chunking/SemanticChunker';
import { unifiedMemoryProcessor } from '../memory/UnifiedMemoryProcessor';
import { educationalMemorySystem } from '../memory/EducationalMemorySystem';
import { accessControlSystem } from '../security/AccessControlSystem';
import { userFeedbackSystem } from '../feedback/UserFeedbackSystem';
import { ragEvaluationFramework } from '../evaluation/RAGEvaluationFramework';

export interface UnifiedRAGContext {
  userInput: string;
  conversationHistory: string[];
  sessionId?: string;
  emotionalContext?: any;
  memoryContext?: any;
  clientPreferences?: any;
}

export interface UnifiedRAGResult {
  enhancedResponse: string;
  confidence: number;
  retrievalResults: any[];
  memoryIntegration: {
    layersUsed: string[];
    memoriesRetrieved: number;
    newMemoriesStored: number;
  };
  chunkingStrategy: string;
  rerankingApplied: boolean;
  evaluationMetrics: any;
  systemsEngaged: string[];
}

export class UnifiedRAGIntegrator {
  /**
   * Main unified RAG processing pipeline
   */
  async processUnifiedRAG(
    originalResponse: string,
    context: UnifiedRAGContext
  ): Promise<UnifiedRAGResult> {
    const startTime = Date.now();
    const systemsEngaged: string[] = [];
    
    try {
      console.log("🔄 UNIFIED RAG: Starting integrated processing pipeline");

      // Step 1: Semantic Chunking Integration
      const chunkingResult = await semanticChunker.chunkText(
        context.userInput,
        { emotionalContext: context.emotionalContext }
      );
      systemsEngaged.push('semantic-chunker');

      // Step 2: Unified Memory Retrieval
      const memoryResults = await unifiedMemoryProcessor.retrieveMemories(
        context.userInput,
        context.emotionalContext,
        context.sessionId,
        10
      );
      systemsEngaged.push('unified-memory');

      // Step 3: Advanced Vector Search with Memory Enhancement
      const searchQuery = this.enhanceQueryWithMemory(
        context.userInput,
        memoryResults,
        chunkingResult.chunks
      );

      const vectorResults = await advancedVectorDB.advancedSearch(
        await this.generateEnhancedEmbedding(searchQuery, context),
        {
          limit: 15,
          threshold: 0.6,
          metadataFilters: context.sessionId ? { sessionId: context.sessionId } : {},
          useIndex: true,
          exactSearch: false
        }
      );
      systemsEngaged.push('advanced-vector-search');

      // Step 4: Educational Memory Integration
      const educationalContext = await educationalMemorySystem.getAdaptiveLearningContext(
        context.sessionId || 'global',
        context.userInput
      );
      systemsEngaged.push('educational-memory');

      // Step 5: Advanced Reranking with Memory Signals
      const rerankedResults = await this.advancedReranking(
        vectorResults,
        context,
        memoryResults,
        educationalContext
      );
      systemsEngaged.push('advanced-reranking');

      // Step 6: Context Integration and Response Enhancement
      const enhancedResponse = await this.integrateContextAndEnhance(
        originalResponse,
        rerankedResults,
        memoryResults,
        educationalContext,
        context
      );
      systemsEngaged.push('context-integration');

      // Step 7: Store New Memories
      await this.storeProcessingMemories(
        context,
        enhancedResponse,
        rerankedResults
      );

      // Step 8: Evaluation and Feedback Integration
      const evaluationMetrics = await ragEvaluationFramework.evaluateResponse({
        query: context.userInput,
        retrievedDocuments: rerankedResults.map(r => r.record.text),
        generatedResponse: enhancedResponse,
        groundTruth: originalResponse,
        context: { conversationHistory: context.conversationHistory }
      });
      systemsEngaged.push('evaluation-framework');

      // Step 9: Feedback System Integration
      if (evaluationMetrics.overallScore < 0.7) {
        await userFeedbackSystem.submitFeedback(
          context.sessionId || 'system',
          context.sessionId || 'system',
          {
            type: 'suggestion',
            content: `Low RAG performance detected: ${evaluationMetrics.overallScore}`,
            severity: 'medium',
            category: 'rag-performance'
          }
        );
      }
      systemsEngaged.push('feedback-integration');

      const result: UnifiedRAGResult = {
        enhancedResponse,
        confidence: evaluationMetrics.overallScore,
        retrievalResults: rerankedResults,
        memoryIntegration: {
          layersUsed: this.extractMemoryLayers(memoryResults),
          memoriesRetrieved: memoryResults.length,
          newMemoriesStored: 2 // User input + enhanced response
        },
        chunkingStrategy: chunkingResult.strategy,
        rerankingApplied: true,
        evaluationMetrics,
        systemsEngaged
      };

      console.log(`🔄 UNIFIED RAG: Complete. ${systemsEngaged.length} systems engaged in ${Date.now() - startTime}ms`);
      return result;

    } catch (error) {
      console.error('🔄 UNIFIED RAG: Processing error:', error);
      
      // Fallback with minimal enhancement
      return {
        enhancedResponse: originalResponse,
        confidence: 0.3,
        retrievalResults: [],
        memoryIntegration: {
          layersUsed: [],
          memoriesRetrieved: 0,
          newMemoriesStored: 0
        },
        chunkingStrategy: 'fallback',
        rerankingApplied: false,
        evaluationMetrics: { overallScore: 0.3 },
        systemsEngaged: ['error-fallback']
      };
    }
  }

  /**
   * Enhance query with memory context
   */
  private enhanceQueryWithMemory(
    userInput: string,
    memoryResults: any[],
    chunks: any[]
  ): string {
    const memoryContext = memoryResults
      .slice(0, 3)
      .map(m => m.record.text)
      .join(' ');
    
    const chunkContext = chunks
      .slice(0, 2)
      .map(c => c.content)
      .join(' ');

    return `${userInput} [memory_context: ${memoryContext}] [chunk_context: ${chunkContext}]`;
  }

  /**
   * Generate enhanced embeddings with context
   */
  private async generateEnhancedEmbedding(
    query: string,
    context: UnifiedRAGContext
  ): Promise<number[]> {
    const enhancedQuery = `${query} [session: ${context.sessionId}] [emotion: ${context.emotionalContext?.primaryEmotion}]`;
    
    const collection = advancedVectorDB.collection('enhanced_queries');
    return await collection.generateEmbedding(enhancedQuery);
  }

  /**
   * Advanced reranking with multiple signals
   */
  private async advancedReranking(
    vectorResults: any[],
    context: UnifiedRAGContext,
    memoryResults: any[],
    educationalContext: any
  ): Promise<any[]> {
    return vectorResults.map(result => {
      let score = result.score;
      
      // Memory alignment boost
      const memoryAlignment = this.calculateMemoryAlignment(result, memoryResults);
      score += memoryAlignment * 0.2;
      
      // Educational relevance boost
      const educationalRelevance = this.calculateEducationalRelevance(result, educationalContext);
      score += educationalRelevance * 0.15;
      
      // Emotional context boost
      if (context.emotionalContext) {
        const emotionalAlignment = this.calculateEmotionalAlignment(result, context.emotionalContext);
        score += emotionalAlignment * 0.1;
      }
      
      // Recency boost
      const recencyBoost = this.calculateRecencyBoost(result);
      score += recencyBoost * 0.05;
      
      return {
        ...result,
        originalScore: result.score,
        enhancedScore: score,
        scoreComponents: {
          vector: result.score,
          memory: memoryAlignment,
          educational: educationalRelevance,
          emotional: context.emotionalContext ? this.calculateEmotionalAlignment(result, context.emotionalContext) : 0,
          recency: recencyBoost
        }
      };
    }).sort((a, b) => b.enhancedScore - a.enhancedScore);
  }

  /**
   * Integrate context and enhance response
   */
  private async integrateContextAndEnhance(
    originalResponse: string,
    retrievalResults: any[],
    memoryResults: any[],
    educationalContext: any,
    context: UnifiedRAGContext
  ): Promise<string> {
    let enhanced = originalResponse;
    
    // Integrate relevant memories
    const relevantMemories = memoryResults.slice(0, 2);
    if (relevantMemories.length > 0) {
      const memoryInsight = relevantMemories[0].record.text;
      if (!enhanced.toLowerCase().includes(memoryInsight.toLowerCase().substring(0, 20))) {
        enhanced = `Drawing from our previous conversation, ${memoryInsight}. ${enhanced}`;
      }
    }
    
    // Integrate educational context
    if (educationalContext.relevantConcepts && educationalContext.relevantConcepts.length > 0) {
      const concept = educationalContext.relevantConcepts[0];
      if (!enhanced.toLowerCase().includes(concept.toLowerCase())) {
        enhanced += ` This relates to the concept of ${concept}, which might be helpful to explore further.`;
      }
    }
    
    // Integrate retrieval results
    const topRetrieval = retrievalResults[0];
    if (topRetrieval && topRetrieval.enhancedScore > 0.8) {
      const retrievedInsight = topRetrieval.record.text.substring(0, 100);
      if (!enhanced.includes(retrievedInsight.substring(0, 30))) {
        enhanced += ` Research suggests: ${retrievedInsight}`;
      }
    }
    
    return enhanced;
  }

  /**
   * Store processing memories
   */
  private async storeProcessingMemories(
    context: UnifiedRAGContext,
    enhancedResponse: string,
    retrievalResults: any[]
  ): Promise<void> {
    // Store user input with high importance
    await unifiedMemoryProcessor.addMemory(
      context.userInput,
      'patient',
      {
        emotionalContext: context.emotionalContext,
        conversationTurn: context.conversationHistory.length,
        retrievalResultsCount: retrievalResults.length
      },
      0.8,
      context.sessionId
    );
    
    // Store enhanced response
    await unifiedMemoryProcessor.addMemory(
      enhancedResponse,
      'roger',
      {
        originalResponse: context.userInput,
        enhancementApplied: true,
        systemsUsed: retrievalResults.length
      },
      0.7,
      context.sessionId
    );
  }

  /**
   * Helper methods for scoring
   */
  private calculateMemoryAlignment(result: any, memoryResults: any[]): number {
    if (memoryResults.length === 0) return 0;
    
    const resultText = result.record.text.toLowerCase();
    let maxAlignment = 0;
    
    for (const memory of memoryResults.slice(0, 3)) {
      const memoryText = memory.record.text.toLowerCase();
      const commonWords = resultText.split(' ').filter(word => 
        word.length > 3 && memoryText.includes(word)
      ).length;
      
      const alignment = commonWords / Math.max(resultText.split(' ').length, memoryText.split(' ').length);
      maxAlignment = Math.max(maxAlignment, alignment);
    }
    
    return maxAlignment;
  }

  private calculateEducationalRelevance(result: any, educationalContext: any): number {
    if (!educationalContext.relevantConcepts) return 0;
    
    const resultText = result.record.text.toLowerCase();
    let relevance = 0;
    
    for (const concept of educationalContext.relevantConcepts) {
      if (resultText.includes(concept.toLowerCase())) {
        relevance += 0.3;
      }
    }
    
    return Math.min(relevance, 1.0);
  }

  private calculateEmotionalAlignment(result: any, emotionalContext: any): number {
    if (!emotionalContext.primaryEmotion) return 0;
    
    const resultText = result.record.text.toLowerCase();
    const emotion = emotionalContext.primaryEmotion.toLowerCase();
    
    return resultText.includes(emotion) ? 0.5 : 0;
  }

  private calculateRecencyBoost(result: any): number {
    const timestamp = result.record.metadata?.timestamp || 0;
    const age = Date.now() - timestamp;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return Math.max(0, 1 - (age / (7 * dayInMs))); // 7-day decay
  }

  private extractMemoryLayers(memoryResults: any[]): string[] {
    const layers = new Set<string>();
    memoryResults.forEach(result => {
      if (result.record.metadata?.layer) {
        layers.add(result.record.metadata.layer);
      }
    });
    return Array.from(layers);
  }
}

export const unifiedRAGIntegrator = new UnifiedRAGIntegrator();
