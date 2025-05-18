
/**
 * Vector Database Implementation
 * 
 * A simple, memory-based vector database with indexing capabilities
 */

import { VectorIndex, VectorRecord, SimilaritySearchOptions } from './types';
import { findNearestNeighbors } from './utils';
import { VectorCollection } from './vectorCollection';

/**
 * Vector Database for storing and retrieving vector embeddings
 */
export class VectorDatabase {
  private collections: Map<string, VectorCollection>;
  private useIndexing: boolean = false;
  private indexingThreshold: number = 1000;

  constructor() {
    this.collections = new Map();
    console.log("VectorDatabase: Initialized");
  }

  /**
   * Enable indexing for collections over a certain size
   */
  enableIndexing(threshold: number = 1000): void {
    this.useIndexing = true;
    this.indexingThreshold = threshold;
    console.log(`VectorDatabase: Indexing enabled for collections with > ${threshold} items`);
  }

  /**
   * Disable indexing
   */
  disableIndexing(): void {
    this.useIndexing = false;
    console.log("VectorDatabase: Indexing disabled");
  }

  /**
   * Check if a collection exists
   */
  hasCollection(collectionName: string): boolean {
    return this.collections.has(collectionName);
  }

  /**
   * Create a new collection
   */
  createCollection(collectionName: string): VectorCollection {
    if (this.collections.has(collectionName)) {
      console.log(`VectorDatabase: Collection '${collectionName}' already exists, returning existing collection`);
      return this.collections.get(collectionName)!;
    }

    const collection = new VectorCollection(collectionName, {
      useIndexing: this.useIndexing,
      indexingThreshold: this.indexingThreshold
    });
    
    this.collections.set(collectionName, collection);
    console.log(`VectorDatabase: Created collection '${collectionName}'`);
    return collection;
  }

  /**
   * Get an existing collection
   */
  getCollection(collectionName: string): VectorCollection {
    if (!this.collections.has(collectionName)) {
      throw new Error(`VectorDatabase: Collection '${collectionName}' does not exist`);
    }
    
    return this.collections.get(collectionName)!;
  }

  /**
   * Delete a collection
   */
  deleteCollection(collectionName: string): boolean {
    const result = this.collections.delete(collectionName);
    if (result) {
      console.log(`VectorDatabase: Deleted collection '${collectionName}'`);
    } else {
      console.log(`VectorDatabase: Collection '${collectionName}' not found for deletion`);
    }
    return result;
  }

  /**
   * Get all collection names
   */
  getCollectionNames(): string[] {
    return Array.from(this.collections.keys());
  }

  /**
   * Get database stats
   */
  getStats(): { totalCollections: number; collectionStats: { [key: string]: { itemCount: number } } } {
    const collectionStats: { [key: string]: { itemCount: number } } = {};
    
    for (const [name, collection] of this.collections.entries()) {
      collectionStats[name] = {
        itemCount: collection.getItemCount()
      };
    }
    
    return {
      totalCollections: this.collections.size,
      collectionStats
    };
  }
}
