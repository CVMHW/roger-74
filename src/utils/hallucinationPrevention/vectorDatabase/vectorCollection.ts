
/**
 * Vector Collection Implementation
 */

import { VectorRecord, SearchResult } from './types';
import { cosineSimilarity } from '../vectorEmbeddings';

export class VectorCollection {
  private records: Map<string, VectorRecord> = new Map();
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add item to collection (using addItem for compatibility)
   */
  addItem(record: VectorRecord): void {
    record.timestamp = record.timestamp || Date.now();
    this.records.set(record.id, record);
  }

  /**
   * Insert item to collection (alias for addItem)
   */
  insert(record: VectorRecord): void {
    this.addItem(record);
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
   * Get collection size
   */
  size(): number {
    return this.records.size;
  }

  /**
   * Get all records
   */
  getAll(): VectorRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Clear collection
   */
  clear(): void {
    this.records.clear();
  }
}
