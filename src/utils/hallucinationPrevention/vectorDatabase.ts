
/**
 * Vector Database Implementation
 */
import { VectorRecord, SimilaritySearchOptions } from './vectorDatabase/types';
import { VectorDatabase } from './vectorDatabase/vectorDatabase';
import { VectorCollection } from './vectorDatabase/vectorCollection';

// Create a singleton instance of the vector database
const vectorDB = new VectorDatabase();

// Enable indexing for better performance with larger collections
vectorDB.enableIndexing(16);

// Add missing methods to the vector database
Object.assign(vectorDB, {
  async generateEmbedding(text: string): Promise<number[]> {
    // Simple text-to-vector conversion for development
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(384).fill(0);
    
    // Create a simple hash-based embedding
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hash = this.simpleHash(word);
      const index = Math.abs(hash) % vector.length;
      vector[index] += 1 / (i + 1); // Weighted by position
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(val => val / magnitude) : vector;
  },

  async search(vector: number[], options: any = {}): Promise<any[]> {
    const { limit = 10, threshold = 0.5 } = options;
    const defaultCollection = this.collection('default');
    
    return defaultCollection.findSimilar(vector, {
      limit,
      scoreThreshold: threshold
    }).map(result => ({
      ...result.record,
      score: result.score
    }));
  },

  async keywordSearch(keywords: string[], options: any = {}): Promise<any[]> {
    const { limit = 10 } = options;
    const defaultCollection = this.collection('default');
    const allRecords = defaultCollection.getAll();
    
    const results = allRecords
      .map(record => {
        const content = (record.content || record.text || '').toLowerCase();
        const score = keywords.reduce((total, keyword) => {
          return total + (content.includes(keyword.toLowerCase()) ? 1 : 0);
        }, 0) / keywords.length;
        
        return { ...record, score };
      })
      .filter(record => record.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return results;
  },

  async add(record: any): Promise<void> {
    const defaultCollection = this.collection('default');
    defaultCollection.insert(record);
  },

  simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
});

// Export the singleton instance
export default vectorDB;
