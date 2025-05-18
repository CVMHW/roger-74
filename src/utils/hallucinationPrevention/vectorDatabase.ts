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

// Advanced Vector Index structure
interface VectorIndex {
  [key: string]: {
    records: VectorRecord[];
    // HNSW-inspired indexing structure for approximate nearest neighbor search
    spatialIndex?: {
      // Map of record IDs to their nearest neighbors (for fast lookup)
      neighbors: Map<string, string[]>;
      // List of entry points for efficient traversal
      entryPoints: string[];
      // Maximum number of connections per node
      maxConnections: number;
    }
  }
}

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
      const nearest = this.findNearestNeighbors(
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
   * Find nearest neighbors for a record
   */
  private findNearestNeighbors(
    record: VectorRecord, 
    candidates: VectorRecord[], 
    limit: number
  ): VectorRecord[] {
    return candidates
      .map(candidate => ({
        record: candidate,
        similarity: cosineSimilarity(record.embedding, candidate.embedding)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(result => result.record);
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

// Vector Collection class to handle operations on a specific collection
export class VectorCollection {
  constructor(
    private records: VectorRecord[],
    private name: string,
    private db: VectorDatabase
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
   * Uses approximate nearest neighbor search if indexing is enabled
   */
  public findSimilar(
    embedding: number[],
    options: { 
      limit?: number; 
      scoreThreshold?: number;
      filter?: (record: VectorRecord) => boolean;
      useIndex?: boolean;
    } = {}
  ): { record: VectorRecord; score: number }[] {
    const { 
      limit = 10, 
      scoreThreshold = 0.7,
      filter = () => true,
      useIndex = true
    } = options;
    
    const collection = (this.db as any).collections[this.name];
    const spatialIndex = collection?.spatialIndex;
    const useApproximateSearch = useIndex && spatialIndex && this.records.length > 100;
    
    // Use approximate nearest neighbor search if index is available and collection is large enough
    if (useApproximateSearch) {
      return this.findSimilarWithIndex(embedding, {
        limit,
        scoreThreshold,
        filter
      });
    }
    
    // Fallback to exhaustive search
    return this.records
      .filter(filter)
      .map(record => ({
        record,
        score: cosineSimilarity(embedding, record.embedding)
      }))
      .filter(result => result.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  /**
   * Find similar vectors using the spatial index (approximate nearest neighbor search)
   */
  private findSimilarWithIndex(
    embedding: number[],
    options: { 
      limit: number; 
      scoreThreshold: number;
      filter: (record: VectorRecord) => boolean;
    }
  ): { record: VectorRecord; score: number }[] {
    const { limit, scoreThreshold, filter } = options;
    const collection = (this.db as any).collections[this.name];
    const spatialIndex = collection?.spatialIndex;
    
    if (!spatialIndex || !spatialIndex.entryPoints.length) {
      // Fallback to exhaustive search if index is not available
      return this.records
        .filter(filter)
        .map(record => ({
          record,
          score: cosineSimilarity(embedding, record.embedding)
        }))
        .filter(result => result.score >= scoreThreshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    }
    
    // Start with entry points
    let candidates = new Set<string>(spatialIndex.entryPoints);
    const visited = new Set<string>();
    const results: { record: VectorRecord; score: number }[] = [];
    
    // Create a temporary record for the query embedding
    const queryRecord: VectorRecord = {
      id: '_query_',
      text: '',
      embedding,
      timestamp: Date.now()
    };
    
    // HNSW-inspired beam search
    while (candidates.size > 0) {
      const candidateIds = Array.from(candidates);
      candidates = new Set<string>();
      
      for (const id of candidateIds) {
        if (visited.has(id)) continue;
        visited.add(id);
        
        // Find the record
        const record = this.records.find(r => r.id === id);
        if (!record || !filter(record)) continue;
        
        // Calculate similarity
        const score = cosineSimilarity(embedding, record.embedding);
        
        // Add to results if above threshold
        if (score >= scoreThreshold) {
          results.push({ record, score });
        }
        
        // Add neighbors to candidates
        const neighborIds = spatialIndex.neighbors.get(id) || [];
        for (const neighborId of neighborIds) {
          if (!visited.has(neighborId)) {
            candidates.add(neighborId);
          }
        }
      }
      
      // Stop if we have enough results or no more candidates
      if (results.length >= limit * 2) break;
    }
    
    // Sort and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
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
   * Rebuild the index for this collection
   */
  public rebuildIndex(): void {
    (this.db as any).rebuildIndex(this.name);
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

// Enable indexing by default for large collections
vectorDB.enableIndexing(16);

export default vectorDB;
