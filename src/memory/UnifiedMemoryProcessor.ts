/**
 * Unified Memory Processor
 * 
 * Centralizes all memory operations and ensures proper synchronization between layers
 */

import { advancedVectorDB } from '../core/AdvancedVectorDatabase';
import { educationalMemorySystem } from '../memory/EducationalMemorySystem';
import { accessControlSystem } from '../security/AccessControlSystem';

export interface MemoryLayer {
  working: Map<string, any>;
  shortTerm: Map<string, any>;
  longTerm: Map<string, any>;
  conversation: Map<string, any>;
  educational: Map<string, any>;
}

export interface MemoryTransferConfig {
  stmToLtmThreshold: number;
  workingMemoryTimeout: number;
  decayRate: number;
  importanceThreshold: number;
}

export class UnifiedMemoryProcessor {
  private memoryLayers: MemoryLayer = {
    working: new Map(),
    shortTerm: new Map(),
    longTerm: new Map(),
    conversation: new Map(),
    educational: new Map()
  };

  private transferConfig: MemoryTransferConfig = {
    stmToLtmThreshold: 0.8,
    workingMemoryTimeout: 300000, // 5 minutes
    decayRate: 0.1,
    importanceThreshold: 0.7
  };

  private transferQueue: Array<{
    content: any;
    fromLayer: keyof MemoryLayer;
    toLayer: keyof MemoryLayer;
    importance: number;
    timestamp: number;
  }> = [];

  /**
   * Unified memory addition with proper layer management
   */
  async addMemory(
    content: string,
    source: 'patient' | 'roger' | 'system',
    metadata?: any,
    importance: number = 0.5,
    sessionId?: string
  ): Promise<void> {
    const timestamp = Date.now();
    const memoryItem = {
      content,
      source,
      metadata: {
        ...metadata,
        timestamp,
        importance,
        sessionId
      }
    };

    // Always start in working memory
    const workingKey = `working_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    this.memoryLayers.working.set(workingKey, memoryItem);

    // Store in vector database with proper collection routing
    if (sessionId && accessControlSystem) {
      await accessControlSystem.storeUserData(
        sessionId,
        `memory_${source}`,
        memoryItem,
        { importance, layer: 'working' }
      );
    }

    // Store in advanced vector database
    await advancedVectorDB.collection('unified_memory').addVersionedRecord({
      id: workingKey,
      text: content,
      vector: await this.generateMemoryEmbedding(content, source, metadata),
      metadata: {
        ...memoryItem.metadata,
        layer: 'working',
        source
      }
    });

    // Evaluate for immediate promotion based on importance
    if (importance >= this.transferConfig.importanceThreshold) {
      await this.promoteToShortTerm(workingKey, memoryItem);
    }

    // Schedule automatic transfer evaluation
    this.scheduleTransferEvaluation(workingKey, memoryItem);
  }

  /**
   * Retrieve memories across all layers with proper ranking
   */
  async retrieveMemories(
    query: string,
    context: any = {},
    sessionId?: string,
    maxResults: number = 10
  ): Promise<any[]> {
    const queryEmbedding = await this.generateMemoryEmbedding(query, 'system', context);
    
    // Search across all memory layers in advanced vector database
    const searchResults = await advancedVectorDB.advancedSearch(queryEmbedding, {
      limit: maxResults * 2, // Get more to allow for filtering
      threshold: 0.5,
      metadataFilters: sessionId ? { sessionId } : {},
      useIndex: true
    });

    // Apply layer-based ranking (LTM > STM > Working > Conversation)
    const layerWeights = {
      'long_term': 1.0,
      'short_term': 0.8,
      'working': 0.6,
      'conversation': 0.7,
      'educational': 0.9
    };

    return searchResults
      .map(result => ({
        ...result,
        layerWeight: layerWeights[result.record.metadata?.layer] || 0.5,
        adjustedScore: result.score * (layerWeights[result.record.metadata?.layer] || 0.5)
      }))
      .sort((a, b) => b.adjustedScore - a.adjustedScore)
      .slice(0, maxResults);
  }

  /**
   * Promote working memory to short-term memory
   */
  private async promoteToShortTerm(workingKey: string, memoryItem: any): Promise<void> {
    const stmKey = `stm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Move to STM layer
    this.memoryLayers.shortTerm.set(stmKey, {
      ...memoryItem,
      metadata: {
        ...memoryItem.metadata,
        promotedAt: Date.now(),
        fromLayer: 'working'
      }
    });

    // Update in vector database
    await advancedVectorDB.collection('unified_memory').addVersionedRecord({
      id: stmKey,
      text: memoryItem.content,
      vector: await this.generateMemoryEmbedding(
        memoryItem.content, 
        memoryItem.source, 
        memoryItem.metadata
      ),
      metadata: {
        ...memoryItem.metadata,
        layer: 'short_term',
        promotedFrom: 'working'
      }
    });

    console.log(`Memory promoted to STM: ${workingKey} -> ${stmKey}`);
  }

  /**
   * Promote short-term memory to long-term memory
   */
  private async promoteToLongTerm(stmKey: string, memoryItem: any): Promise<void> {
    const ltmKey = `ltm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Move to LTM layer
    this.memoryLayers.longTerm.set(ltmKey, {
      ...memoryItem,
      metadata: {
        ...memoryItem.metadata,
        consolidatedAt: Date.now(),
        fromLayer: 'short_term'
      }
    });

    // Update in vector database
    await advancedVectorDB.collection('unified_memory').addVersionedRecord({
      id: ltmKey,
      text: memoryItem.content,
      vector: await this.generateMemoryEmbedding(
        memoryItem.content, 
        memoryItem.source, 
        memoryItem.metadata
      ),
      metadata: {
        ...memoryItem.metadata,
        layer: 'long_term',
        consolidatedFrom: 'short_term'
      }
    });

    // Store in educational memory if relevant
    if (this.isEducationalContent(memoryItem)) {
      await educationalMemorySystem.storeAdaptiveLearning(
        memoryItem.content,
        memoryItem.metadata.sessionId || 'global',
        {
          conceptType: this.extractConceptType(memoryItem),
          importance: memoryItem.metadata.importance,
          source: memoryItem.source
        }
      );
    }

    console.log(`Memory consolidated to LTM: ${stmKey} -> ${ltmKey}`);
  }

  /**
   * Apply memory decay mechanisms
   */
  async applyMemoryDecay(): Promise<void> {
    const now = Date.now();
    const decayThreshold = 24 * 60 * 60 * 1000; // 24 hours
    
    // Decay working memory
    for (const [key, item] of this.memoryLayers.working.entries()) {
      const age = now - item.metadata.timestamp;
      if (age > this.transferConfig.workingMemoryTimeout) {
        // Evaluate for STM promotion or deletion
        if (item.metadata.importance >= 0.6) {
          await this.promoteToShortTerm(key, item);
        }
        this.memoryLayers.working.delete(key);
      }
    }

    // Decay short-term memory
    for (const [key, item] of this.memoryLayers.shortTerm.entries()) {
      const age = now - item.metadata.timestamp;
      if (age > decayThreshold) {
        // Evaluate for LTM promotion
        if (item.metadata.importance >= this.transferConfig.stmToLtmThreshold) {
          await this.promoteToLongTerm(key, item);
        }
        this.memoryLayers.shortTerm.delete(key);
      }
    }
  }

  /**
   * Schedule transfer evaluation for memory items
   */
  private scheduleTransferEvaluation(key: string, memoryItem: any): void {
    setTimeout(async () => {
      await this.evaluateMemoryTransfer(key, memoryItem);
    }, this.transferConfig.workingMemoryTimeout);
  }

  /**
   * Evaluate memory for layer transfer
   */
  private async evaluateMemoryTransfer(key: string, memoryItem: any): Promise<void> {
    const currentImportance = this.calculateCurrentImportance(memoryItem);
    
    if (currentImportance >= this.transferConfig.stmToLtmThreshold) {
      // Promote to appropriate layer
      if (this.memoryLayers.working.has(key)) {
        await this.promoteToShortTerm(key, memoryItem);
      } else if (this.memoryLayers.shortTerm.has(key)) {
        await this.promoteToLongTerm(key, memoryItem);
      }
    }
  }

  /**
   * Generate memory-enhanced embeddings
   */
  private async generateMemoryEmbedding(
    content: string, 
    source: string, 
    metadata: any
  ): Promise<number[]> {
    // Enhanced embedding that includes context from source and metadata
    const enhancedContent = `[${source}] ${content} [context: ${JSON.stringify(metadata)}]`;
    
    // Use advanced vector database's embedding generation
    const collection = advancedVectorDB.collection('unified_memory');
    return await collection.generateEmbedding(enhancedContent);
  }

  /**
   * Calculate current importance based on access patterns and age
   */
  private calculateCurrentImportance(memoryItem: any): number {
    const age = Date.now() - memoryItem.metadata.timestamp;
    const baseImportance = memoryItem.metadata.importance || 0.5;
    const accessCount = memoryItem.metadata.accessCount || 0;
    
    // Decay over time but boost with access
    const timeFactor = Math.exp(-age / (7 * 24 * 60 * 60 * 1000)); // 7-day half-life
    const accessFactor = Math.min(1.0, accessCount * 0.1);
    
    return (baseImportance * timeFactor) + accessFactor;
  }

  /**
   * Check if content is educational
   */
  private isEducationalContent(memoryItem: any): boolean {
    const educationalKeywords = [
      'depression', 'anxiety', 'therapy', 'coping', 'strategy',
      'technique', 'skill', 'exercise', 'concept', 'learning'
    ];
    
    return educationalKeywords.some(keyword => 
      memoryItem.content.toLowerCase().includes(keyword)
    );
  }

  /**
   * Extract concept type from memory item
   */
  private extractConceptType(memoryItem: any): string {
    const content = memoryItem.content.toLowerCase();
    
    if (content.includes('depression')) return 'depression_management';
    if (content.includes('anxiety')) return 'anxiety_coping';
    if (content.includes('coping')) return 'coping_strategies';
    if (content.includes('emotion')) return 'emotional_regulation';
    
    return 'general_therapy';
  }

  /**
   * Get memory system status
   */
  getMemoryStatus() {
    return {
      layers: {
        working: this.memoryLayers.working.size,
        shortTerm: this.memoryLayers.shortTerm.size,
        longTerm: this.memoryLayers.longTerm.size,
        conversation: this.memoryLayers.conversation.size,
        educational: this.memoryLayers.educational.size
      },
      transferQueue: this.transferQueue.length,
      config: this.transferConfig
    };
  }
}

export const unifiedMemoryProcessor = new UnifiedMemoryProcessor();

// Schedule regular memory maintenance
setInterval(() => {
  unifiedMemoryProcessor.applyMemoryDecay();
}, 60 * 60 * 1000); // Every hour
