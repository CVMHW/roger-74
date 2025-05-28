
/**
 * Semantic-Aware Chunking System
 * 
 * Implements advanced chunking with context preservation for 5/5 chunking strategy
 */

import { generateEmbedding, cosineSimilarity } from '../hallucinationPrevention/vectorEmbeddings';

export interface ChunkConfig {
  maxChunkSize: number;
  minChunkSize: number;
  overlapSize: number;
  semanticThreshold: number;
  preserveContext: boolean;
  respectSentenceBoundaries: boolean;
  respectParagraphBoundaries: boolean;
}

export interface Chunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  semanticEmbedding?: number[];
  contextVector?: number[];
  metadata: {
    chunkIndex: number;
    totalChunks: number;
    coherenceScore: number;
    entityContinuity: string[];
    topicContinuity: string[];
  };
}

export interface ChunkingResult {
  chunks: Chunk[];
  coherenceScore: number;
  processingTime: number;
  strategy: string;
}

export class SemanticChunker {
  private config: ChunkConfig = {
    maxChunkSize: 512,
    minChunkSize: 100,
    overlapSize: 64,
    semanticThreshold: 0.7,
    preserveContext: true,
    respectSentenceBoundaries: true,
    respectParagraphBoundaries: true
  };

  constructor(config?: Partial<ChunkConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Main chunking method with semantic awareness
   */
  async chunkText(text: string, metadata?: any): Promise<ChunkingResult> {
    const startTime = Date.now();
    
    try {
      // Pre-process text
      const processedText = this.preprocessText(text);
      
      // Determine best chunking strategy
      const strategy = this.determineChunkingStrategy(processedText);
      
      let chunks: Chunk[];
      
      switch (strategy) {
        case 'semantic':
          chunks = await this.semanticChunking(processedText);
          break;
        case 'hierarchical':
          chunks = await this.hierarchicalChunking(processedText);
          break;
        case 'context-aware':
          chunks = await this.contextAwareChunking(processedText);
          break;
        default:
          chunks = await this.adaptiveChunking(processedText);
      }
      
      // Post-process chunks
      chunks = await this.postProcessChunks(chunks, text);
      
      // Calculate overall coherence
      const coherenceScore = await this.calculateOverallCoherence(chunks);
      
      return {
        chunks,
        coherenceScore,
        processingTime: Date.now() - startTime,
        strategy
      };
      
    } catch (error) {
      console.error('Semantic chunking error:', error);
      
      // Fallback to simple chunking
      return this.fallbackChunking(text);
    }
  }

  /**
   * Semantic chunking based on content similarity
   */
  private async semanticChunking(text: string): Promise<Chunk[]> {
    const sentences = this.splitIntoSentences(text);
    const chunks: Chunk[] = [];
    
    let currentChunk = '';
    let currentStart = 0;
    let chunkIndex = 0;
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
      
      if (potentialChunk.length <= this.config.maxChunkSize) {
        currentChunk = potentialChunk;
      } else {
        // Check semantic coherence before splitting
        if (currentChunk.length >= this.config.minChunkSize) {
          const semanticScore = await this.calculateSemanticCoherence(currentChunk, sentence);
          
          if (semanticScore < this.config.semanticThreshold) {
            // Create chunk
            chunks.push(await this.createChunk(
              currentChunk,
              currentStart,
              currentStart + currentChunk.length,
              chunkIndex++,
              text
            ));
            
            // Start new chunk with overlap
            currentChunk = this.createOverlap(currentChunk, sentence);
            currentStart = this.findStartIndex(text, currentChunk);
          } else {
            // Extend current chunk
            currentChunk = potentialChunk;
          }
        } else {
          currentChunk = potentialChunk;
        }
      }
    }
    
    // Add final chunk
    if (currentChunk.length >= this.config.minChunkSize) {
      chunks.push(await this.createChunk(
        currentChunk,
        currentStart,
        text.length,
        chunkIndex,
        text
      ));
    }
    
    return chunks;
  }

  /**
   * Hierarchical chunking for structured content
   */
  private async hierarchicalChunking(text: string): Promise<Chunk[]> {
    const chunks: Chunk[] = [];
    
    // First level: paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    let chunkIndex = 0;
    let currentPosition = 0;
    
    for (const paragraph of paragraphs) {
      if (paragraph.trim().length === 0) continue;
      
      if (paragraph.length <= this.config.maxChunkSize) {
        // Single chunk for small paragraphs
        chunks.push(await this.createChunk(
          paragraph.trim(),
          currentPosition,
          currentPosition + paragraph.length,
          chunkIndex++,
          text
        ));
      } else {
        // Split large paragraphs semantically
        const paragraphChunks = await this.semanticChunking(paragraph);
        for (const chunk of paragraphChunks) {
          chunks.push({
            ...chunk,
            metadata: {
              ...chunk.metadata,
              chunkIndex: chunkIndex++
            }
          });
        }
      }
      
      currentPosition += paragraph.length + 2; // Account for newlines
    }
    
    return chunks;
  }

  /**
   * Context-aware chunking that preserves entity and topic continuity
   */
  private async contextAwareChunking(text: string): Promise<Chunk[]> {
    const sentences = this.splitIntoSentences(text);
    const entities = this.extractEntities(text);
    const topics = this.extractTopics(text);
    
    const chunks: Chunk[] = [];
    let currentChunk = '';
    let currentEntities: string[] = [];
    let currentTopics: string[] = [];
    let chunkIndex = 0;
    let currentStart = 0;
    
    for (const sentence of sentences) {
      const sentenceEntities = this.extractEntities(sentence);
      const sentenceTopics = this.extractTopics(sentence);
      
      // Check for context continuity
      const entityContinuity = this.calculateEntityContinuity(currentEntities, sentenceEntities);
      const topicContinuity = this.calculateTopicContinuity(currentTopics, sentenceTopics);
      
      const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;
      
      if (potentialChunk.length <= this.config.maxChunkSize && 
          (entityContinuity > 0.3 || topicContinuity > 0.3 || currentChunk.length < this.config.minChunkSize)) {
        // Extend current chunk
        currentChunk = potentialChunk;
        currentEntities = [...new Set([...currentEntities, ...sentenceEntities])];
        currentTopics = [...new Set([...currentTopics, ...sentenceTopics])];
      } else {
        // Create new chunk
        if (currentChunk.length >= this.config.minChunkSize) {
          chunks.push(await this.createChunk(
            currentChunk,
            currentStart,
            currentStart + currentChunk.length,
            chunkIndex++,
            text,
            { entities: currentEntities, topics: currentTopics }
          ));
        }
        
        // Start new chunk
        currentChunk = sentence;
        currentEntities = sentenceEntities;
        currentTopics = sentenceTopics;
        currentStart = this.findStartIndex(text, sentence);
      }
    }
    
    // Add final chunk
    if (currentChunk.length >= this.config.minChunkSize) {
      chunks.push(await this.createChunk(
        currentChunk,
        currentStart,
        text.length,
        chunkIndex,
        text,
        { entities: currentEntities, topics: currentTopics }
      ));
    }
    
    return chunks;
  }

  /**
   * Adaptive chunking that combines multiple strategies
   */
  private async adaptiveChunking(text: string): Promise<Chunk[]> {
    // Analyze text characteristics
    const characteristics = this.analyzeTextCharacteristics(text);
    
    if (characteristics.hasStructure) {
      return this.hierarchicalChunking(text);
    } else if (characteristics.hasEntities || characteristics.hasTopics) {
      return this.contextAwareChunking(text);
    } else {
      return this.semanticChunking(text);
    }
  }

  /**
   * Create a chunk with metadata
   */
  private async createChunk(
    content: string,
    startIndex: number,
    endIndex: number,
    chunkIndex: number,
    originalText: string,
    contextData?: { entities?: string[]; topics?: string[] }
  ): Promise<Chunk> {
    const embedding = await generateEmbedding(content);
    const coherenceScore = await this.calculateChunkCoherence(content);
    
    return {
      id: `chunk_${chunkIndex}_${Date.now()}`,
      content: content.trim(),
      startIndex,
      endIndex,
      semanticEmbedding: embedding,
      metadata: {
        chunkIndex,
        totalChunks: 0, // Will be updated later
        coherenceScore,
        entityContinuity: contextData?.entities || [],
        topicContinuity: contextData?.topics || []
      }
    };
  }

  /**
   * Helper methods
   */
  private preprocessText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }

  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private determineChunkingStrategy(text: string): string {
    const characteristics = this.analyzeTextCharacteristics(text);
    
    if (characteristics.hasStructure) return 'hierarchical';
    if (characteristics.hasEntities) return 'context-aware';
    if (characteristics.complexity > 0.7) return 'semantic';
    return 'adaptive';
  }

  private analyzeTextCharacteristics(text: string) {
    return {
      hasStructure: /\n\s*\n/.test(text),
      hasEntities: /[A-Z][a-z]+ [A-Z][a-z]+/.test(text),
      hasTopics: text.length > 500,
      complexity: Math.min(text.length / 1000, 1)
    };
  }

  private async calculateSemanticCoherence(chunk1: string, chunk2: string): Promise<number> {
    try {
      const [emb1, emb2] = await Promise.all([
        generateEmbedding(chunk1),
        generateEmbedding(chunk2)
      ]);
      return cosineSimilarity(emb1, emb2);
    } catch {
      return 0.5; // Default moderate coherence
    }
  }

  private async calculateChunkCoherence(content: string): Promise<number> {
    const sentences = this.splitIntoSentences(content);
    if (sentences.length < 2) return 1.0;
    
    try {
      const embeddings = await Promise.all(sentences.map(s => generateEmbedding(s)));
      let totalSimilarity = 0;
      let pairs = 0;
      
      for (let i = 0; i < embeddings.length - 1; i++) {
        for (let j = i + 1; j < embeddings.length; j++) {
          totalSimilarity += cosineSimilarity(embeddings[i], embeddings[j]);
          pairs++;
        }
      }
      
      return pairs > 0 ? totalSimilarity / pairs : 1.0;
    } catch {
      return 0.7; // Default good coherence
    }
  }

  private async calculateOverallCoherence(chunks: Chunk[]): Promise<number> {
    if (chunks.length === 0) return 0;
    
    const coherenceScores = chunks.map(c => c.metadata.coherenceScore);
    return coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
  }

  private extractEntities(text: string): string[] {
    // Simple entity extraction (can be enhanced with NLP libraries)
    const entities = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
    return [...new Set(entities)];
  }

  private extractTopics(text: string): string[] {
    // Simple topic extraction based on keywords
    const topics: string[] = [];
    const topicPatterns = {
      'health': /\b(health|medical|doctor|hospital|illness|sick|treatment|therapy)\b/gi,
      'emotions': /\b(feel|emotion|sad|happy|angry|anxious|depressed|mood)\b/gi,
      'relationships': /\b(relationship|partner|spouse|family|friend|love|marriage)\b/gi,
      'work': /\b(work|job|career|boss|colleague|employment|workplace)\b/gi
    };
    
    for (const [topic, pattern] of Object.entries(topicPatterns)) {
      if (pattern.test(text)) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  private calculateEntityContinuity(entities1: string[], entities2: string[]): number {
    if (entities1.length === 0 && entities2.length === 0) return 0;
    
    const intersection = entities1.filter(e => entities2.includes(e));
    const union = [...new Set([...entities1, ...entities2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private calculateTopicContinuity(topics1: string[], topics2: string[]): number {
    if (topics1.length === 0 && topics2.length === 0) return 0;
    
    const intersection = topics1.filter(t => topics2.includes(t));
    const union = [...new Set([...topics1, ...topics2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  private createOverlap(currentChunk: string, nextSentence: string): string {
    const words = currentChunk.split(' ');
    const overlapWords = words.slice(-this.config.overlapSize);
    return overlapWords.join(' ') + ' ' + nextSentence;
  }

  private findStartIndex(text: string, chunk: string): number {
    return text.indexOf(chunk.substring(0, 50));
  }

  private async postProcessChunks(chunks: Chunk[], originalText: string): Promise<Chunk[]> {
    // Update total chunks count
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });
    
    return chunks;
  }

  private fallbackChunking(text: string): ChunkingResult {
    const chunks: Chunk[] = [];
    let chunkIndex = 0;
    
    for (let i = 0; i < text.length; i += this.config.maxChunkSize) {
      const content = text.slice(i, i + this.config.maxChunkSize);
      chunks.push({
        id: `fallback_chunk_${chunkIndex}`,
        content,
        startIndex: i,
        endIndex: Math.min(i + this.config.maxChunkSize, text.length),
        metadata: {
          chunkIndex: chunkIndex++,
          totalChunks: 0,
          coherenceScore: 0.5,
          entityContinuity: [],
          topicContinuity: []
        }
      });
    }
    
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });
    
    return {
      chunks,
      coherenceScore: 0.5,
      processingTime: 0,
      strategy: 'fallback'
    };
  }
}

export const semanticChunker = new SemanticChunker();
