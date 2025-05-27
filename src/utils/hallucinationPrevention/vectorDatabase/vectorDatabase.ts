
/**
 * Vector Database - Clean Implementation
 */

import { VectorRecord, SimilaritySearchOptions, SearchResult } from './types';
import { VectorCollection } from './vectorCollection';
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
   * Get collection (alias for compatibility)
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
   * Add a record to the default collection
   */
  async add(record: VectorRecord): Promise<void> {
    const defaultCollection = this.collection('default');
    defaultCollection.addItem(record);
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
    options: SimilaritySearchOptions = {}
  ): Promise<SearchResult[]> {
    const { limit = 10, fuzzy = false } = options;
    const results: SearchResult[] = [];

    // Search all collections for keyword matches
    for (const collection of this.collections.values()) {
      const allRecords = collection.getAll();
      
      for (const record of allRecords) {
        let score = 0;
        const text = record.text.toLowerCase();
        
        for (const keyword of keywords) {
          const keywordLower = keyword.toLowerCase();
          if (text.includes(keywordLower)) {
            score += 1;
          }
        }
        
        if (score > 0) {
          results.push({
            record,
            score: score / keywords.length
          });
        }
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get database statistics
   */
  stats() {
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

  /**
   * Get database status (alias for stats)
   */
  getStatus() {
    return this.stats();
  }
}
