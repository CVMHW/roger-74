
/**
 * Vector Database Implementation
 * 
 * Provides efficient in-memory vector storage and retrieval with indexing
 */

import { cosineSimilarity } from './vectorEmbeddings';

// Define the vector database types
export interface VectorRecord {
  id: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
  timestamp: number;
}

interface VectorIndex {
  [key: string]: {
    records: VectorRecord[];
  }
}

// The main vector database class
export class VectorDatabase {
  private collections: VectorIndex = {};
  private dimensions: number | null = null;
  
  /**
   * Create a new collection or get existing one
   */
  public collection(name: string): VectorCollection {
    if (!this.collections[name]) {
      this.collections[name] = { 
        records: [] 
      };
    }
    
    return new VectorCollection(this.collections[name].records, name);
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
  } {
    let totalVectors = 0;
    
    for (const name in this.collections) {
      totalVectors += this.collections[name].records.length;
    }
    
    return {
      collections: Object.keys(this.collections).length,
      totalVectors,
      dimensions: this.dimensions
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

// Vector Collection class to handle operations on a specific collection
export class VectorCollection {
  constructor(
    private records: VectorRecord[],
    private name: string
  ) {}
  
  /**
   * Insert a vector into the collection
   */
  public insert(record: Omit<VectorRecord, "timestamp">): string {
    const timestamp = Date.now();
    const completeRecord = { ...record, timestamp };
    this.records.push(completeRecord);
    return record.id;
  }
  
  /**
   * Insert multiple vectors into the collection
   */
  public insertMany(records: Omit<VectorRecord, "timestamp">[]): string[] {
    const timestamp = Date.now();
    const ids = records.map(record => {
      const completeRecord = { ...record, timestamp };
      this.records.push(completeRecord);
      return record.id;
    });
    return ids;
  }
  
  /**
   * Find similar vectors based on cosine similarity
   */
  public findSimilar(
    embedding: number[],
    options: { 
      limit?: number; 
      scoreThreshold?: number;
      filter?: (record: VectorRecord) => boolean;
    } = {}
  ): { record: VectorRecord; score: number }[] {
    const { 
      limit = 10, 
      scoreThreshold = 0.7,
      filter = () => true
    } = options;
    
    // Calculate similarity for each record
    const results = this.records
      .filter(filter)
      .map(record => ({
        record,
        score: cosineSimilarity(embedding, record.embedding)
      }))
      .filter(result => result.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return results;
  }
  
  /**
   * Find by ID
   */
  public findById(id: string): VectorRecord | null {
    const record = this.records.find(record => record.id === id);
    return record || null;
  }
  
  /**
   * Find by metadata
   */
  public findByMetadata(
    key: string, 
    value: any, 
    options: { limit?: number } = {}
  ): VectorRecord[] {
    const { limit = 10 } = options;
    
    return this.records
      .filter(record => record.metadata && record.metadata[key] === value)
      .slice(0, limit);
  }
  
  /**
   * Update a record by ID
   */
  public update(id: string, update: Partial<Omit<VectorRecord, "id">>): boolean {
    const index = this.records.findIndex(record => record.id === id);
    
    if (index !== -1) {
      this.records[index] = { 
        ...this.records[index], 
        ...update,
        id, // Ensure ID doesn't change
        timestamp: Date.now() // Update timestamp
      };
      return true;
    }
    
    return false;
  }
  
  /**
   * Delete a record by ID
   */
  public delete(id: string): boolean {
    const initialLength = this.records.length;
    this.records = this.records.filter(record => record.id !== id);
    return this.records.length < initialLength;
  }
  
  /**
   * Delete multiple records by ID
   */
  public deleteMany(ids: string[]): number {
    const initialLength = this.records.length;
    const idSet = new Set(ids);
    this.records = this.records.filter(record => !idSet.has(record.id));
    return initialLength - this.records.length;
  }
  
  /**
   * Get the collection size
   */
  public size(): number {
    return this.records.length;
  }
  
  /**
   * Clear the collection
   */
  public clear(): void {
    this.records.length = 0;
  }
  
  /**
   * Get all records
   */
  public getAll(): VectorRecord[] {
    return [...this.records];
  }
  
  /**
   * Get collection name
   */
  public getName(): string {
    return this.name;
  }
}

// Create a singleton instance of the vector database
const vectorDB = new VectorDatabase();
export default vectorDB;
