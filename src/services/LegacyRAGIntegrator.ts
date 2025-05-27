
/**
 * Legacy RAG Integrator
 * 
 * Integrates older RAG models with the new unified system
 * Maintains backward compatibility while leveraging new capabilities
 */

import { RAGService } from './RAGService';
import { retrieveAugmentation, augmentResponseWithRetrieval } from '../utils/hallucinationPrevention/retrieval';
import { enhanceResponseWithRAG } from '../utils/hallucinationPrevention/ragEnhancement';
import { retrieveEnhanced } from '../utils/hallucinationPrevention/enhancedRetrieval';
import { processUnifiedRAGPipeline } from '../utils/rogerianNervousSystem/pipeline/ragPipelineIntegrator';
import vectorDB from '../utils/hallucinationPrevention/vectorDatabase';

export interface LegacyRAGConfig {
  useVectorDatabase: boolean;
  useReranking: boolean;
  useChunking: boolean;
  useHybridSearch: boolean;
  preserveLegacyBehavior: boolean;
  clientPriorityLevel: 'standard' | 'enhanced' | 'enterprise';
}

export interface RAGIntegrationResult {
  enhancedResponse: string;
  retrievalMethod: string;
  confidence: number;
  systemsUsed: string[];
  legacyCompatible: boolean;
}

/**
 * Legacy RAG Integrator Service
 * Bridges old and new RAG implementations
 */
export class LegacyRAGIntegrator {
  private ragService: RAGService;
  private vectorDatabase = vectorDB;
  
  constructor() {
    this.ragService = new RAGService();
  }

  /**
   * Integrate legacy RAG with new unified system
   */
  async integrateRAG(
    originalResponse: string,
    userInput: string,
    conversationHistory: string[],
    config: LegacyRAGConfig
  ): Promise<RAGIntegrationResult> {
    const systemsUsed: string[] = [];
    let enhancedResponse = originalResponse;
    let retrievalMethod = 'none';
    let confidence = 0.5;

    try {
      // Step 1: Legacy Vector Database Integration
      if (config.useVectorDatabase) {
        const legacyResult = await this.applyLegacyVectorRetrieval(
          userInput, 
          conversationHistory,
          config
        );
        if (legacyResult.wasApplied) {
          enhancedResponse = legacyResult.response;
          systemsUsed.push('legacy-vector-database');
          retrievalMethod = 'legacy-vector';
          confidence = Math.max(confidence, legacyResult.confidence);
        }
      }

      // Step 2: Enhanced Retrieval with Reranking
      if (config.useReranking) {
        const rerankedResult = await this.applyEnhancedRetrieval(
          enhancedResponse,
          userInput,
          conversationHistory,
          config
        );
        if (rerankedResult.wasApplied) {
          enhancedResponse = rerankedResult.response;
          systemsUsed.push('enhanced-retrieval-reranking');
          retrievalMethod = 'enhanced-reranked';
          confidence = Math.max(confidence, rerankedResult.confidence);
        }
      }

      // Step 3: Chunking Algorithm Integration
      if (config.useChunking) {
        const chunkedResult = await this.applyChunkingAlgorithms(
          enhancedResponse,
          userInput,
          config
        );
        if (chunkedResult.wasApplied) {
          enhancedResponse = chunkedResult.response;
          systemsUsed.push('chunking-algorithms');
          confidence = Math.max(confidence, chunkedResult.confidence);
        }
      }

      // Step 4: Hybrid Search Integration
      if (config.useHybridSearch) {
        const hybridResult = await this.applyHybridSearch(
          enhancedResponse,
          userInput,
          conversationHistory,
          config
        );
        if (hybridResult.wasApplied) {
          enhancedResponse = hybridResult.response;
          systemsUsed.push('hybrid-search-retrieval');
          retrievalMethod = 'hybrid';
          confidence = Math.max(confidence, hybridResult.confidence);
        }
      }

      // Step 5: Unified Pipeline Integration (if not in legacy mode)
      if (!config.preserveLegacyBehavior && config.clientPriorityLevel === 'enterprise') {
        try {
          const unifiedResult = await processUnifiedRAGPipeline(
            enhancedResponse,
            userInput,
            conversationHistory,
            conversationHistory.length
          );
          enhancedResponse = unifiedResult.enhancedResponse;
          systemsUsed.push(...unifiedResult.systemsEngaged);
          retrievalMethod = 'unified-pipeline';
          confidence = Math.max(confidence, 0.9);
        } catch (unifiedError) {
          console.warn('Unified pipeline fallback to legacy:', unifiedError);
        }
      }

      return {
        enhancedResponse,
        retrievalMethod,
        confidence,
        systemsUsed,
        legacyCompatible: true
      };

    } catch (error) {
      console.error('Legacy RAG integration error:', error);
      return {
        enhancedResponse: originalResponse,
        retrievalMethod: 'fallback',
        confidence: 0.3,
        systemsUsed: ['error-fallback'],
        legacyCompatible: true
      };
    }
  }

  /**
   * Apply legacy vector database retrieval
   */
  private async applyLegacyVectorRetrieval(
    userInput: string,
    conversationHistory: string[],
    config: LegacyRAGConfig
  ): Promise<{ response: string; wasApplied: boolean; confidence: number }> {
    try {
      const retrievalResult = await retrieveAugmentation(userInput, conversationHistory);
      
      if (retrievalResult.retrievedContent && retrievalResult.retrievedContent.length > 0) {
        const augmentedResponse = await augmentResponseWithRetrieval(
          userInput,
          userInput,
          retrievalResult
        );
        
        return {
          response: augmentedResponse,
          wasApplied: true,
          confidence: retrievalResult.confidence || 0.7
        };
      }
      
      return { response: userInput, wasApplied: false, confidence: 0.3 };
    } catch (error) {
      console.error('Legacy vector retrieval error:', error);
      return { response: userInput, wasApplied: false, confidence: 0.1 };
    }
  }

  /**
   * Apply enhanced retrieval with reranking
   */
  private async applyEnhancedRetrieval(
    responseText: string,
    userInput: string,
    conversationHistory: string[],
    config: LegacyRAGConfig
  ): Promise<{ response: string; wasApplied: boolean; confidence: number }> {
    try {
      const enhancedResult = await retrieveEnhanced(userInput, [], {
        limit: 5,
        rerank: true,
        conversationContext: conversationHistory,
        useQueryExpansion: true,
        useHybridSearch: config.useHybridSearch
      });
      
      if (enhancedResult.length > 0) {
        const relevantContent = enhancedResult[0].content;
        const enhancedResponse = this.integrateRetrievedContent(responseText, relevantContent);
        
        return {
          response: enhancedResponse,
          wasApplied: true,
          confidence: 0.8
        };
      }
      
      return { response: responseText, wasApplied: false, confidence: 0.4 };
    } catch (error) {
      console.error('Enhanced retrieval error:', error);
      return { response: responseText, wasApplied: false, confidence: 0.2 };
    }
  }

  /**
   * Apply chunking algorithms
   */
  private async applyChunkingAlgorithms(
    responseText: string,
    userInput: string,
    config: LegacyRAGConfig
  ): Promise<{ response: string; wasApplied: boolean; confidence: number }> {
    try {
      // Use RAG service's chunking capabilities
      const chunks = await this.ragService.addContent(responseText, {
        source: 'legacy-integration',
        userInput,
        timestamp: Date.now()
      });
      
      return {
        response: responseText,
        wasApplied: true,
        confidence: 0.6
      };
    } catch (error) {
      console.error('Chunking algorithm error:', error);
      return { response: responseText, wasApplied: false, confidence: 0.3 };
    }
  }

  /**
   * Apply hybrid search integration
   */
  private async applyHybridSearch(
    responseText: string,
    userInput: string,
    conversationHistory: string[],
    config: LegacyRAGConfig
  ): Promise<{ response: string; wasApplied: boolean; confidence: number }> {
    try {
      // Create mock emotion analysis for RAG service
      const emotionAnalysis = {
        primaryEmotion: 'neutral',
        secondaryEmotions: [],
        intensity: 0.5,
        valence: 0,
        arousal: 0.5,
        confidence: 0.6,
        emotionalTriggers: []
      };

      // Create mock memory context
      const memoryContext = {
        relevantItems: [],
        confidence: 0.5,
        contextualRelevance: 0.6
      };

      const ragResult = await this.ragService.enhance(
        userInput,
        memoryContext,
        emotionAnalysis,
        conversationHistory
      );

      if (ragResult.wasApplied && ragResult.enhancedContext.length > 0) {
        const enhancedResponse = this.integrateRAGContext(responseText, ragResult.enhancedContext);
        
        return {
          response: enhancedResponse,
          wasApplied: true,
          confidence: ragResult.confidence
        };
      }
      
      return { response: responseText, wasApplied: false, confidence: 0.4 };
    } catch (error) {
      console.error('Hybrid search error:', error);
      return { response: responseText, wasApplied: false, confidence: 0.2 };
    }
  }

  /**
   * Integrate retrieved content into response
   */
  private integrateRetrievedContent(responseText: string, retrievedContent: string): string {
    if (!retrievedContent || responseText.includes(retrievedContent)) {
      return responseText;
    }

    // Find appropriate insertion point
    const sentences = responseText.split(/(?<=[.!?])\s+/);
    const insertPoint = Math.floor(sentences.length / 2);
    
    const integratedResponse = [
      ...sentences.slice(0, insertPoint),
      `I understand that ${retrievedContent.toLowerCase()}.`,
      ...sentences.slice(insertPoint)
    ].join(' ');

    return integratedResponse;
  }

  /**
   * Integrate RAG context into response
   */
  private integrateRAGContext(responseText: string, ragContext: string[]): string {
    if (!ragContext.length) return responseText;

    const relevantContext = ragContext[0];
    if (responseText.includes(relevantContext)) {
      return responseText;
    }

    return `${responseText} ${relevantContext}`;
  }

  /**
   * Get optimal configuration based on client priority
   */
  static getOptimalConfig(clientPriorityLevel: 'standard' | 'enhanced' | 'enterprise'): LegacyRAGConfig {
    switch (clientPriorityLevel) {
      case 'enterprise':
        return {
          useVectorDatabase: true,
          useReranking: true,
          useChunking: true,
          useHybridSearch: true,
          preserveLegacyBehavior: false,
          clientPriorityLevel: 'enterprise'
        };
      case 'enhanced':
        return {
          useVectorDatabase: true,
          useReranking: true,
          useChunking: false,
          useHybridSearch: true,
          preserveLegacyBehavior: false,
          clientPriorityLevel: 'enhanced'
        };
      default:
        return {
          useVectorDatabase: true,
          useReranking: false,
          useChunking: false,
          useHybridSearch: false,
          preserveLegacyBehavior: true,
          clientPriorityLevel: 'standard'
        };
    }
  }
}

// Export singleton instance
export const legacyRAGIntegrator = new LegacyRAGIntegrator();
