
/**
 * Vector Collection Class
 * 
 * Handles operations on specific vector collections
 */

import { VectorRecord, SimilaritySearchOptions } from './types';
import { cosineSimilarity } from '../vectorEmbeddings';
import { VectorDatabase } from './vectorDatabase';

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
    options: SimilaritySearchOptions = {}
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
