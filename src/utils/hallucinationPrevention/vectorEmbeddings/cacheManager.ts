
/**
 * Enhanced Vector Embedding Cache Manager
 * 
 * Implements advanced caching strategies for vector embeddings
 * to improve performance and reduce calls to embedding models
 */

import { simpleHash } from './utils';

// Cache entry type
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
  lastAccessed: number;
}

// Cache stats
export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  avgAccessTime: number;
}

/**
 * Advanced LRU+LFU cache for embeddings with persistence support
 */
export class EmbeddingCache<T> {
  // Internal storage
  private cache: Map<string, CacheEntry<T>> = new Map();
  // Cache stats
  private stats = {
    hits: 0,
    misses: 0,
    totalAccessTime: 0
  };
  // Cache config
  private maxSize: number;
  private ttl: number;
  private storageKey: string;
  
  constructor(
    maxSize: number = 500,
    ttlMs: number = 24 * 60 * 60 * 1000, // Default 24 hours
    storageKey: string = 'embedding_cache'
  ) {
    this.maxSize = maxSize;
    this.ttl = ttlMs;
    this.storageKey = storageKey;
    
    // Load from persistent storage
    this.loadFromStorage();
  }
  
  /**
   * Get an item from cache
   */
  public get(key: string): T | undefined {
    const startTime = performance.now();
    
    // Hash the key for consistency
    const hashedKey = typeof key === 'string' ? this.hashKey(key) : key;
    const entry = this.cache.get(hashedKey);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }
    
    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(hashedKey);
      this.stats.misses++;
      return undefined;
    }
    
    // Update stats
    const endTime = performance.now();
    this.stats.hits++;
    this.stats.totalAccessTime += (endTime - startTime);
    
    // Update entry metadata
    entry.hits++;
    entry.lastAccessed = Date.now();
    
    return entry.value;
  }
  
  /**
   * Set an item in cache
   */
  public set(key: string, value: T): void {
    // Hash the key for consistency
    const hashedKey = this.hashKey(key);
    
    // Create cache entry
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      hits: 1,
      lastAccessed: Date.now()
    };
    
    // Check if we need to prune before adding
    if (this.cache.size >= this.maxSize) {
      this.prune();
    }
    
    // Add to cache
    this.cache.set(hashedKey, entry);
    
    // Save to storage periodically
    if (this.cache.size % 10 === 0) {
      this.saveToStorage();
    }
  }
  
  /**
   * Check if cache has a key
   */
  public has(key: string): boolean {
    const hashedKey = this.hashKey(key);
    
    if (!this.cache.has(hashedKey)) {
      return false;
    }
    
    // Check if expired
    const entry = this.cache.get(hashedKey);
    if (entry && this.isExpired(entry)) {
      this.cache.delete(hashedKey);
      return false;
    }
    
    return true;
  }
  
  /**
   * Clear all items from cache
   */
  public clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      totalAccessTime: 0
    };
    
    // Clear from storage
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn("Failed to clear cache from storage:", e);
    }
  }
  
  /**
   * Get cache stats
   */
  public getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    const avgAccessTime = this.stats.hits > 0 ? this.stats.totalAccessTime / this.stats.hits : 0;
    
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      avgAccessTime
    };
  }
  
  /**
   * Prune least valuable items from cache
   */
  private prune(): void {
    if (this.cache.size < this.maxSize * 0.8) {
      return; // No need to prune yet
    }
    
    try {
      // First remove expired entries
      for (const [key, entry] of this.cache.entries()) {
        if (this.isExpired(entry)) {
          this.cache.delete(key);
        }
      }
      
      // If still too many entries, use combination of LRU and LFU
      if (this.cache.size >= this.maxSize * 0.9) {
        const entries = Array.from(this.cache.entries());
        
        // Score entries by combination of recency and frequency
        const scoredEntries = entries.map(([key, entry]) => {
          const ageMs = Date.now() - entry.timestamp;
          const recencyScore = Math.max(0, 1 - (ageMs / this.ttl));
          const frequencyScore = Math.min(1, Math.log(entry.hits) / Math.log(100));
          
          // Combined score (weighted)
          const score = recencyScore * 0.3 + frequencyScore * 0.7;
          
          return { key, score };
        });
        
        // Sort by score (lowest first)
        scoredEntries.sort((a, b) => a.score - b.score);
        
        // Remove lowest scoring entries to get back to 80% capacity
        const toRemove = Math.ceil(this.cache.size - (this.maxSize * 0.8));
        for (let i = 0; i < toRemove && i < scoredEntries.length; i++) {
          this.cache.delete(scoredEntries[i].key);
        }
      }
    } catch (e) {
      console.error("Error pruning cache:", e);
      
      // Fallback to removing oldest entries
      if (this.cache.size >= this.maxSize) {
        const oldest = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)
          .slice(0, Math.ceil(this.cache.size * 0.2))
          .map(([key]) => key);
          
        oldest.forEach(key => this.cache.delete(key));
      }
    }
  }
  
  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }
  
  /**
   * Hash a key string
   */
  private hashKey(key: string): string {
    return simpleHash(key).toString();
  }
  
  /**
   * Save cache to local storage
   */
  private saveToStorage(): void {
    try {
      // Convert cache entries to plain objects to avoid memory reference issues
      const serializable: Record<string, any> = {};
      
      for (const [key, entry] of this.cache.entries()) {
        serializable[key] = {
          value: entry.value,
          timestamp: entry.timestamp,
          hits: entry.hits,
          lastAccessed: entry.lastAccessed
        };
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(serializable));
    } catch (e) {
      console.warn("Failed to save cache to storage:", e);
    }
  }
  
  /**
   * Load cache from local storage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (typeof parsed === 'object' && parsed !== null) {
          for (const [key, entry] of Object.entries(parsed)) {
            if (
              typeof entry === 'object' && 
              entry !== null &&
              'value' in entry &&
              'timestamp' in entry
            ) {
              // Skip expired entries
              if (Date.now() - (entry as any).timestamp <= this.ttl) {
                this.cache.set(key, entry as CacheEntry<T>);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load cache from storage:", e);
    }
  }
}

// Create a singleton instance for embeddings
export const embeddingCache = new EmbeddingCache<number[]>(
  1000, // Store up to 1000 embeddings
  7 * 24 * 60 * 60 * 1000, // 7 day TTL
  'roger_embeddings_cache'
);

// Create a singleton instance for document content
export const documentCache = new EmbeddingCache<string>(
  500, // Store up to 500 documents
  14 * 24 * 60 * 60 * 1000, // 14 day TTL
  'roger_document_cache'
);

export default embeddingCache;
