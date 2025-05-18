
/**
 * Vector Embeddings Types
 * 
 * Type definitions for vector embedding functionality
 */

import { PretrainedOptions } from '@huggingface/transformers';

// Define interface for embedding results
export interface EmbeddingResult {
  text: string;
  embedding: number[];
  metadata?: any;
}

// Define type for embedding generation options
export interface EmbeddingGenerationOptions {
  batchSize?: number;
  timeoutMs?: number;
}

// Define type for similarity search results
export interface SimilarityResult {
  text: string;
  score: number;
}

// Re-export the HuggingFace progress callback type for convenience
export type HuggingFaceProgressCallback = PretrainedOptions['progress_callback'];
