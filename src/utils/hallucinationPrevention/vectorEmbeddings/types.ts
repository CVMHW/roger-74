
/**
 * Type definitions for vector embeddings system
 */

// Result from embedding generation
export interface EmbeddingResult {
  embedding: number[];
  text: string;
  processTime?: number;
}

// Result from similarity calculation
export interface SimilarityResult {
  id: string;
  text: string;
  score: number;
  metadata?: Record<string, any>;
}

// Progress callback for HuggingFace transformers
export type HuggingFaceProgressCallback = 
  (progress: number | { status?: string; progress?: number }) => void;

// Configuration for embedding generation
export interface EmbeddingConfig {
  pooling?: 'mean' | 'max' | 'cls';
  normalize?: boolean;
  truncation?: boolean;
  maxLength?: number;
}

// Device options for model running
export type DeviceType = 'webgpu' | 'wasm' | 'cpu' | 'auto';

// Options for batch embedding generation
export interface BatchEmbeddingOptions extends EmbeddingConfig {
  batchSize?: number;
  concurrency?: number;
  showProgress?: boolean;
  timeoutMs?: number;
  forceFresh?: boolean;
  parallelLimit?: number;
}

// Embedding generation options (alias for backward compatibility)
export type EmbeddingGenerationOptions = BatchEmbeddingOptions;

// Pipeline options for HuggingFace transformers
export interface PipelineOptions {
  device?: DeviceType;
  quantized?: boolean;
  revision?: string;
  progress_callback?: HuggingFaceProgressCallback;
}
