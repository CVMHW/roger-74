
/**
 * Vector Database - Clean Implementation
 * 
 * Reliable vector storage and search
 */

import { VectorRecord, SimilaritySearchOptions, SearchResult } from './types';
import { generateEmbedding, cosineSimilarity } from '../vectorEmbeddings';

export class VectorDatabase {
  private collections: Map<string, VectorCollection> = new Map();
  private isIndexingEnabled: boolean = false;
  private indexDimension: number = 384;

  /**
   * Create a new collection
   */
  createCollection(name: string): VectorCollection {
    if (!this.collections.has(name)) {
      this.collections.set(name, new VectorCollection(name));
      console.log(`Created vector collection: ${name}`);
    }
    return this.collections.get(name)!;
  }

  /**
   * Get existing collection
   */
  collection(name: string): VectorCollection {
    if (!this.collections.has(name)) {
      return this.createCollection(name);
    }
    return this.collections.get(name)!;
  }

  /**
   * Get collection (alias for collection method)
   */
  getCollection(name: string): VectorCollection {
    return this.collection(name);
  }

  /**
   * Check if collection exists
   */
  hasCollection(name: string): boolean {
    return this.collections.has(name);
  }

  /**
   * Enable indexing for better performance
   */
  enableIndexing(dimension: number = 384): void {
    this.isIndexingEnabled = true;
    this.indexDimension = dimension;
    console.log(`Vector indexing enabled with dimension ${dimension}`);
  }

  /**
   * Generate embedding using the clean system
   */
  async generateEmbedding(text: string): Promise<number[]> {
    return generateEmbedding(text);
  }

  /**
   * Perform search across collections
   */
  async search(
    queryEmbedding: number[],
    options: SimilaritySearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = 10, threshold = 0.5 } = options;
    const results: SearchResult[] = [];

    // Search all collections
    for (const collection of this.collections.values()) {
      const collectionResults = collection.findSimilar(queryEmbedding, {
        limit,
        scoreThreshold: threshold
      });
      results.push(...collectionResults);
    }

    // Sort by score and limit
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Keyword search across collections
   */
  async keywordSearch(
    keywords: string[],
    options: any = {}
  ): Promise<SearchResult[]> {
    const { limit = 10, fuzzy = false } = options;
    const results: SearchResult[] = [];

    for (const collection of this.collections.values()) {
      const collectionResults = collection.keywordSearch(keywords, { limit, fuzzy });
      results.push(...collectionResults);
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Add record to specific collection
   */
  async add(record: {
    id: string;
    vector: number[];
    content: string;
    metadata?: any;
  }): Promise<void> {
    // Default to 'general' collection if none specified
    const collection = this.collection('general');
    collection.addItem({
      id: record.id,
      vector: record.vector,
      text: record.content,
      metadata: record.metadata || {}
    });
  }

  /**
   * Get database status
   */
  getStatus() {
    const collections = Array.from(this.collections.entries()).map(([name, collection]) => ({
      name,
      size: collection.size(),
      records: collection.size()
    }));

    return {
      collectionsCount: this.collections.size,
      collections,
      indexingEnabled: this.isIndexingEnabled,
      totalRecords: collections.reduce((sum, col) => sum + col.size, 0)
    };
  }
}

/**
 * Vector Collection Implementation
 */
export class VectorCollection {
  private records: Map<string, VectorRecord> = new Map();
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add item to collection
   */
  addItem(record: VectorRecord): void {
    record.timestamp = record.timestamp || Date.now();
    this.records.set(record.id, record);
  }

  /**
   * Find similar records
   */
  findSimilar(
    queryVector: number[],
    options: { limit?: number; scoreThreshold?: number } = {}
  ): SearchResult[] {
    const { limit = 10, scoreThreshold = 0.5 } = options;
    const results: SearchResult[] = [];

    for (const record of this.records.values()) {
      if (!record.vector || record.vector.length === 0) continue;

      const score = cosineSimilarity(queryVector, record.vector);
      
      if (score >= scoreThreshold) {
        results.push({
          record,
          score
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Keyword search within collection
   */
  keywordSearch(
    keywords: string[],
    options: { limit?: number; fuzzy?: boolean } = {}
  ): SearchResult[] {
    const { limit = 10, fuzzy = false } = options;
    const results: SearchResult[] = [];

    for (const record of this.records.values()) {
      let score = 0;
      const text = record.text.toLowerCase();

      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (text.includes(lowerKeyword)) {
          score += 0.3;
          
          // Bonus for exact word match
          if (text.split(/\W+/).includes(lowerKeyword)) {
            score += 0.2;
          }
        }
      }

      if (score > 0) {
        results.push({
          record,
          score
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Search records with filter
   */
  search(
    queryVector: number[],
    limit: number = 10,
    options: { filter?: (record: VectorRecord) => boolean } = {}
  ): SearchResult[] {
    const { filter } = options;
    const allRecords = Array.from(this.records.values());
    const filteredRecords = filter ? allRecords.filter(filter) : allRecords;

    return filteredRecords
      .map(record => ({
        record,
        score: record.vector ? cosineSimilarity(queryVector, record.vector) : 0
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get all records
   */
  getAll(): VectorRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get collection size
   */
  size(): number {
    return this.records.size;
  }

  /**
   * Clear collection
   */
  clear(): void {
    this.records.clear();
  }
}
