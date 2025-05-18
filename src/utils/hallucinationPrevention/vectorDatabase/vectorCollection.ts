
/**
 * Vector Collection Implementation
 * 
 * A collection within the vector database for storing related vectors
 */

import { VectorIndex, VectorRecord, SimilaritySearchOptions } from './types';
import { findNearestNeighbors } from './utils';

/**
 * Options for Vector Collection
 */
interface VectorCollectionOptions {
  useIndexing?: boolean;
  indexingThreshold?: number;
}

/**
 * Collection for storing vector records
 */
export class VectorCollection {
  private name: string;
  private records: VectorRecord[];
  private useIndexing: boolean;
  private indexingThreshold: number;
  private index: VectorIndex | null;
  private lastIndexed: number;
  private isDirty: boolean;

  constructor(name: string, options: VectorCollectionOptions = {}) {
    this.name = name;
    this.records = [];
    this.useIndexing = options.useIndexing ?? false;
    this.indexingThreshold = options.indexingThreshold ?? 1000;
    this.index = null;
    this.lastIndexed = 0;
    this.isDirty = false;
    console.log(`VectorCollection: Created collection '${name}'`);
  }

  /**
   * Get the name of the collection
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get the number of items in the collection
   */
  getItemCount(): number {
    return this.records.length;
  }

  /**
   * Add a vector item to the collection
   */
  async addItem(record: VectorRecord): Promise<string> {
    if (!record.id) {
      record.id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    this.records.push(record);
    this.isDirty = true;
    
    // Check if we need to rebuild the index
    await this.rebuildIndexIfNeeded();
    
    return record.id;
  }

  /**
   * Delete an item from the collection
   */
  deleteItem(id: string): boolean {
    const initialLength = this.records.length;
    this.records = this.records.filter(record => record.id !== id);
    
    if (this.records.length !== initialLength) {
      this.isDirty = true;
      return true;
    }
    
    return false;
  }

  /**
   * Update an item in the collection
   */
  updateItem(id: string, updates: Partial<VectorRecord>): boolean {
    const recordIndex = this.records.findIndex(record => record.id === id);
    
    if (recordIndex === -1) {
      return false;
    }
    
    this.records[recordIndex] = {
      ...this.records[recordIndex],
      ...updates
    };
    
    this.isDirty = true;
    return true;
  }

  /**
   * Get an item by ID
   */
  getItem(id: string): VectorRecord | null {
    const record = this.records.find(record => record.id === id);
    return record || null;
  }

  /**
   * Rebuild the index if needed
   */
  private async rebuildIndexIfNeeded(): Promise<void> {
    if (!this.useIndexing) {
      return;
    }
    
    // Only rebuild if collection is large enough and dirty
    if (this.records.length >= this.indexingThreshold && this.isDirty) {
      try {
        console.log(`VectorCollection '${this.name}': Rebuilding index for ${this.records.length} items`);
        
        // In a real implementation, this would build a proper vector index
        // For now, we'll just mark as indexed
        this.index = {
          vectors: this.records.map(record => record.vector),
          ids: this.records.map(record => record.id)
        };
        
        this.lastIndexed = Date.now();
        this.isDirty = false;
      } catch (error) {
        console.error(`VectorCollection '${this.name}': Error building index`, error);
        // Continue without index
        this.index = null;
      }
    }
  }

  /**
   * Search for similar vectors
   */
  async search(
    queryVector: number[],
    limit: number = 5,
    options: SimilaritySearchOptions = {}
  ): Promise<Array<VectorRecord & { score: number }>> {
    // Rebuild index if needed
    await this.rebuildIndexIfNeeded();
    
    // Filter records if needed
    let records = this.records;
    if (options.filter) {
      records = records.filter(options.filter);
    }
    
    // Use the findNearestNeighbors function to find similar vectors
    const results = findNearestNeighbors(
      queryVector,
      records.map(record => ({ vector: record.vector, record })),
      limit,
      options.similarityFunction
    );
    
    return results.map(result => ({
      ...result.record,
      score: result.similarity
    }));
  }
}
