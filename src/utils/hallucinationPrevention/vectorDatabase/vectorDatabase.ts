
/**
 * Vector Database Implementation
 * 
 * A simple in-memory vector database for storing and retrieving vectors
 */

import { VectorRecord, SimilaritySearchOptions } from './types';
import { cosineSimilarity } from '../vectorEmbeddings';

/**
 * Vector Collection class
 */
export class VectorCollection {
  private records: VectorRecord[] = [];
  private name: string;
  private indexEnabled: boolean = false;
  private indexSize: number = 0;
  
  constructor(name: string) {
    this.name = name;
  }
  
  /**
   * Insert a record into the collection
   */
  public insert(record: VectorRecord): void {
    // Ensure either vector or embedding is set
    if (!record.vector && record.embedding) {
      record.vector = record.embedding;
    } else if (!record.vector && !record.embedding) {
      throw new Error("Vector record must have either vector or embedding property");
    }
    
    this.records.push(record);
  }
  
  /**
   * Add an item to the collection (alias for insert)
   */
  public addItem(record: VectorRecord): void {
    this.insert(record);
  }
  
  /**
   * Get all records in the collection
   */
  public getAll(): VectorRecord[] {
    return [...this.records];
  }
  
  /**
   * Get the number of records in the collection
   */
  public size(): number {
    return this.records.length;
  }
  
  /**
   * Find records similar to the given vector
   */
  public findSimilar(
    vector: number[],
    options: { limit?: number; scoreThreshold?: number; filter?: (record: VectorRecord) => boolean } = {}
  ): Array<{ record: VectorRecord; score: number }> {
    const { 
      limit = 10, 
      scoreThreshold = 0.5,
      filter = () => true
    } = options;
    
    return this.records
      .filter(filter)
      .map(record => {
        const recordVector = record.vector || record.embedding || [];
        return {
          record,
          score: cosineSimilarity(vector, recordVector)
        };
      })
      .filter(item => item.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  /**
   * Search for records (alias for findSimilar)
   */
  public search(
    vector: number[],
    limit: number = 10,
    options: { filter?: (record: VectorRecord) => boolean; scoreThreshold?: number } = {}
  ): Array<{ record: VectorRecord; score: number }> {
    return this.findSimilar(vector, { 
      limit, 
      scoreThreshold: options.scoreThreshold || 0.5,
      filter: options.filter
    });
  }
  
  /**
   * Get the name of the collection
   */
  public getName(): string {
    return this.name;
  }
  
  /**
   * Clear the collection
   */
  public clear(): void {
    this.records = [];
  }
  
  /**
   * Enable indexing for this collection
   */
  public enableIndexing(indexSize: number): void {
    this.indexEnabled = true;
    this.indexSize = indexSize;
    console.log(`Indexing enabled for collection ${this.name} with size ${indexSize}`);
  }
}

/**
 * Vector Database class
 */
export class VectorDatabase {
  private collections: Map<string, VectorCollection> = new Map();
  private globalIndexSize: number = 0;
  
  /**
   * Create a new collection
   */
  public createCollection(name: string): VectorCollection {
    const collection = new VectorCollection(name);
    this.collections.set(name, collection);
    
    // Apply global indexing if enabled
    if (this.globalIndexSize > 0) {
      collection.enableIndexing(this.globalIndexSize);
    }
    
    return collection;
  }
  
  /**
   * Get a collection by name
   */
  public getCollection(name: string): VectorCollection {
    const collection = this.collections.get(name);
    if (!collection) {
      throw new Error(`Collection '${name}' not found`);
    }
    return collection;
  }
  
  /**
   * Check if a collection exists
   */
  public hasCollection(name: string): boolean {
    return this.collections.has(name);
  }
  
  /**
   * Get a collection, creating it if it doesn't exist
   */
  public collection(name: string): VectorCollection {
    if (!this.hasCollection(name)) {
      return this.createCollection(name);
    }
    return this.getCollection(name);
  }
  
  /**
   * Get all collection names
   */
  public getCollectionNames(): string[] {
    return Array.from(this.collections.keys());
  }
  
  /**
   * Get database statistics
   */
  public stats(): { collections: number; totalRecords: number } {
    const collectionsCount = this.collections.size;
    let totalRecords = 0;
    
    for (const collection of this.collections.values()) {
      totalRecords += collection.size();
    }
    
    return {
      collections: collectionsCount,
      totalRecords
    };
  }
  
  /**
   * Enable indexing for all collections (current and future)
   */
  public enableIndexing(indexSize: number): void {
    this.globalIndexSize = indexSize;
    
    // Apply to all existing collections
    for (const collection of this.collections.values()) {
      collection.enableIndexing(indexSize);
    }
  }
}

// Create the default instance
const vectorDB = new VectorDatabase();
export default vectorDB;
