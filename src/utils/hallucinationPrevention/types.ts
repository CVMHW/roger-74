
/**
 * Type definitions for hallucination prevention system
 */

// Result from vector retrieval
export interface RetrievalResult {
  retrievedContent: string[];
  confidence: number;
  sources?: string[];
  metadata?: any;
}

// Memory piece for storing in vector database
export interface MemoryPiece {
  id: string;
  content: string;
  embedding?: number[];
  vector?: number[];
  metadata?: {
    source?: string;
    timestamp?: number;
    confidence?: number;
    [key: string]: any;
  };
}

// Options for hallucination prevention
export interface HallucinationPreventionOptions {
  checkEmotionMisidentification: boolean;
  preventRepetition: boolean;
  enhanceWithRAG: boolean;
  useFactChecking: boolean;
  minimumConfidence: number;
}

// Result of hallucination detection process
export interface HallucinationProcessResult {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
  emotionMisidentified?: boolean;
  suggestedCorrection?: string;
}

// Vector search result interface
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
