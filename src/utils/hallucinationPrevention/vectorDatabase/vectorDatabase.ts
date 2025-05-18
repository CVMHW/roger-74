
/**
 * Vector Database Implementation
 * 
 * Provides efficient in-memory vector storage and retrieval with indexing
 */

import { VectorIndex, VectorRecord } from './types';
import { VectorCollection } from './vectorCollection';
import { findNearestNeighbors } from './utils';

// The main vector database class
export class VectorDatabase {
  private collections: VectorIndex = {};
  private dimensions: number | null = null;
  private indexingEnabled: boolean = false;
  
  /**
   * Create a new collection or get existing one
   */
  public collection(name: string): VectorCollection {
    if (!this.collections[name]) {
      this.collections[name] = { 
        records: [] 
      };
    }
    
    return new VectorCollection(this.collections[name].records, name, this);
  }
  
  /**
   * Enable HNSW-inspired approximate nearest neighbor indexing
   */
  public enableIndexing(maxConnections: number = 16): void {
    this.indexingEnabled = true;
    
    // Initialize indexing for all existing collections
    for (const name in this.collections) {
      this.initializeIndex(name, maxConnections);
    }
  }
  
  /**
   * Initialize the index for a collection
   */
  private initializeIndex(collectionName: string, maxConnections: number = 16): void {
    const collection = this.collections[collectionName];
    if (!collection) return;
    
    // Create the spatial index if it doesn't exist
    if (!collection.spatialIndex) {
      collection.spatialIndex = {
        neighbors: new Map<string, string[]>(),
        entryPoints: [],
        maxConnections
      };
    }
    
    // Build the index if we have records
    if (collection.records.length > 0) {
      this.rebuildIndex(collectionName);
    }
  }
  
  /**
   * Rebuild the index for a collection
   */
  public rebuildIndex(collectionName: string): void {
    const collection = this.collections[collectionName];
    if (!collection || !collection.spatialIndex) return;
    
    const { records } = collection;
    const { neighbors, maxConnections } = collection.spatialIndex;
    
    // Clear existing index
    neighbors.clear();
    collection.spatialIndex.entryPoints = [];
    
    // Skip if we have too few records
    if (records.length < 2) return;
    
    // For each record, find its nearest neighbors
    for (const record of records) {
      // Find nearest neighbors for this record
      const nearest = findNearestNeighbors(
        record, 
        records.filter(r => r.id !== record.id),
        maxConnections
      );
      
      // Store the connections
      neighbors.set(record.id, nearest.map(n => n.id));
    }
    
    // Select entry points (we'll use the first record for simplicity)
    if (records.length > 0) {
      collection.spatialIndex.entryPoints = [records[0].id];
    }
    
    console.log(`Index rebuilt for collection ${collectionName} with ${records.length} records`);
  }
  
  /**
   * List all collection names
   */
  public listCollections(): string[] {
    return Object.keys(this.collections);
  }
  
  /**
   * Drop a collection
   */
  public dropCollection(name: string): boolean {
    if (this.collections[name]) {
      delete this.collections[name];
      return true;
    }
    return false;
  }
  
  /**
   * Get stats about the vector database
   */
  public stats(): { 
    collections: number; 
    totalVectors: number;
    dimensions: number | null;
    indexingEnabled: boolean;
    indexedCollections: number;
  } {
    let totalVectors = 0;
    let indexedCollections = 0;
    
    for (const name in this.collections) {
      totalVectors += this.collections[name].records.length;
      if (this.collections[name].spatialIndex) {
        indexedCollections++;
      }
    }
    
    return {
      collections: Object.keys(this.collections).length,
      totalVectors,
      dimensions: this.dimensions,
      indexingEnabled: this.indexingEnabled,
      indexedCollections
    };
  }
  
  /**
   * Set vector dimensions
   */
  public setDimensions(dimensions: number): void {
    if (this.dimensions === null) {
      this.dimensions = dimensions;
    } else if (this.dimensions !== dimensions) {
      console.warn(`Vector dimensions mismatch: ${this.dimensions} vs ${dimensions}`);
    }
  }
}
