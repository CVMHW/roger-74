
/**
 * Shared types for memory and retrieval systems
 */

/**
 * Memory piece for storing in vector database
 */
export interface MemoryPiece {
  id?: string;
  content: string;
  embedding?: number[];
  vector?: number[];
  role: 'system' | 'user' | 'assistant';
  importance: number;
  metadata?: {
    source?: string;
    timestamp?: number;
    confidence?: number;
    [key: string]: any;
  };
}

/**
 * Result from vector retrieval
 */
export interface RetrievalResult {
  retrievedContent: string[];
  confidence: number;
  sources?: string[];
  metadata?: any;
}

/**
 * Vector search result interface
 */
export interface VectorSearchResult {
  record: {
    id: string;
    text?: string;
    content?: string;
    metadata?: any;
    [key: string]: any;
  };
  score: number;
}
