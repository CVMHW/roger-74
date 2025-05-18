
/**
 * Vector Embeddings System
 * 
 * Implements proper text embeddings for semantic search
 */

import { pipeline } from '@huggingface/transformers';

// Define interface for embedding results
export interface EmbeddingResult {
  text: string;
  embedding: number[];
  metadata?: any;
}

let embeddingModel: any = null;
let isUsingSimulation = false;
let modelInitialized = false;
let modelInitializationPromise: Promise<void> | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

/**
 * Detect the best available device for running models
 */
export const detectBestAvailableDevice = async (): Promise<string> => {
  try {
    // Check for WebGPU support
    if ('gpu' in navigator) {
      console.log("WebGPU support detected, will try to use it");
      return "webgpu";
    }
    
    // Check for WebAssembly SIMD support
    if (WebAssembly && typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        const module = await WebAssembly.compile(new Uint8Array([
          0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 
          65, 0, 65, 0, 253, 0, 26, 11
        ]));
        const hasSIMD = WebAssembly.Module.exports(module).some(
          ({ name }) => name === "simd"
        );
        if (hasSIMD) {
          console.log("WebAssembly SIMD support detected, using WASM");
          return "wasm";
        }
      } catch (e) {
        // SIMD not supported
      }
    }

    // Fallback to CPU
    console.log("Using CPU as fallback");
    return "cpu";
  } catch (error) {
    console.error("Error detecting device capabilities:", error);
    return "cpu"; // Default to CPU
  }
};

/**
 * Initialize the embedding model
 * Uses a small but effective model suitable for browser environments
 */
export const initializeEmbeddingModel = async (): Promise<void> => {
  // If we already have a pending initialization, return that promise
  if (modelInitializationPromise) {
    return modelInitializationPromise;
  }
  
  // Check if we've exceeded max attempts
  if (initAttempts >= MAX_INIT_ATTEMPTS) {
    console.warn(`⚠️ Max initialization attempts (${MAX_INIT_ATTEMPTS}) reached, using simulation`);
    isUsingSimulation = true;
    modelInitialized = false;
    return;
  }
  
  initAttempts++;
  
  // Create a new initialization promise
  modelInitializationPromise = (async () => {
    try {
      console.log(`🔄 Initializing embedding model attempt ${initAttempts}/${MAX_INIT_ATTEMPTS}...`);
      
      // Detect the best available device
      const device = await detectBestAvailableDevice();
      console.log(`Using device: ${device} for model initialization`);
      
      const startTime = performance.now();
      
      // Browser memory info if available
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        console.log(`Memory before model load: ${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))}MB`);
      }
      
      // Create a feature-extraction pipeline with a browser-compatible model
      // Using a smaller model better suited for browser environments
      embeddingModel = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2", // More browser-friendly model
        { 
          revision: "main",
          device: device,
          progress_callback: (progress: number) => {
            const percentage = Math.round(progress * 100);
            console.log(`Model loading progress: ${percentage}%`);
          }
        }
      );
      
      const loadTime = performance.now() - startTime;
      console.log(`✅ Model loaded in ${Math.round(loadTime)}ms`);
      
      // Test the model with a simple example
      const testResult = await embeddingModel("Test embedding", { 
        pooling: "mean", 
        normalize: true 
      });
      
      if (testResult && (testResult.data || testResult)) {
        console.log("✅ Embedding model successfully initialized and tested");
        const dataArray = testResult.data || testResult;
        console.log(`📐 Embedding size: ${Array.isArray(dataArray) ? dataArray.length : 'unknown'}`);
        isUsingSimulation = false;
        modelInitialized = true;
        return;
      } else {
        throw new Error("Model initialized but test embedding failed");
      }
    } catch (error) {
      console.error("❌ Failed to initialize embedding model:", error);
      console.warn("⚠️ Falling back to simulated embeddings");
      embeddingModel = null;
      isUsingSimulation = true;
      modelInitialized = false;
      
      // Schedule retry with exponential backoff if attempts remain
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        const backoffTime = Math.pow(2, initAttempts) * 1000; // Exponential backoff
        console.log(`Will retry in ${backoffTime}ms`);
        setTimeout(() => {
          // Reset the promise so we can try again
          modelInitializationPromise = null;
          initializeEmbeddingModel().catch(e => {
            console.error("Retry failed:", e);
          });
        }, backoffTime);
      }
    } finally {
      // Reset the initialization promise once we're done
      modelInitializationPromise = null;
    }
  })();
  
  return modelInitializationPromise;
};

/**
 * Generate embeddings for text using the embedding model
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    // If model not initialized, try initializing
    if (!modelInitialized) {
      await initializeEmbeddingModel();
      
      // If still not available after initialization attempt, use fallback
      if (!embeddingModel) {
        console.log("Using simulated embedding fallback");
        return generateSimulatedEmbedding(text);
      }
    }
    
    const startTime = performance.now();
    
    // Generate real embeddings using the model
    const result = await embeddingModel(text, { pooling: "mean", normalize: true });
    
    const processingTime = performance.now() - startTime;
    console.log(`Generated embedding in ${Math.round(processingTime)}ms for "${text.substring(0, 20)}..."`);
    
    // Handle different output formats (some models return {data: Float32Array}, others return Float32Array directly)
    const embedArray = result.data ? Array.from(result.data) : Array.isArray(result) ? result : Array.from(result);
    
    return embedArray;
    
  } catch (error) {
    console.error("Error generating embedding, falling back to simulation:", error);
    // Fallback to simulated embeddings
    isUsingSimulation = true;
    return generateSimulatedEmbedding(text);
  }
};

/**
 * Generate embeddings for multiple texts, with batching and timeout protection
 */
export const generateEmbeddings = async (
  texts: string[], 
  options: { batchSize?: number, timeoutMs?: number } = {}
): Promise<EmbeddingResult[]> => {
  const { batchSize = 5, timeoutMs = 10000 } = options;
  
  try {
    if (isUsingSimulation) {
      // If we're already known to be using simulation, don't attempt real embeddings
      return texts.map(text => ({
        text,
        embedding: generateSimulatedEmbedding(text)
      }));
    }
    
    const results: EmbeddingResult[] = [];
    
    // Process texts in batches to avoid memory issues
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      console.log(`Processing embedding batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
      
      // Generate embeddings for each text in the batch with timeout protection
      const batchPromises = batch.map(async (text) => {
        try {
          // Create a promise that rejects after timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Embedding generation timed out after ${timeoutMs}ms`)), timeoutMs);
          });
          
          // Race the embedding generation against the timeout
          const embedding = await Promise.race([
            generateEmbedding(text),
            timeoutPromise
          ]);
          
          return {
            text,
            embedding
          };
        } catch (error) {
          console.error(`Error generating embedding for text: "${text.substring(0, 30)}..."`, error);
          return {
            text,
            embedding: generateSimulatedEmbedding(text) // Fallback for individual failures
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error("Error generating batch embeddings:", error);
    isUsingSimulation = true;
    
    // Fallback to simulated embeddings
    return texts.map(text => ({
      text,
      embedding: generateSimulatedEmbedding(text)
    }));
  }
};

/**
 * Fallback function to generate simulated embeddings when model is unavailable
 * This provides a basic approximation based on character frequency
 */
export const generateSimulatedEmbedding = (text: string): number[] => {
  console.log("🛑 Using simulated embedding for: " + text.substring(0, 20) + "...");
  
  // Normalize text
  const normalizedText = text.toLowerCase().trim();
  
  // Generate a 128-dimension embedding based on character frequency patterns
  const embedding = new Array(128).fill(0);
  
  // Fill the embedding with character frequency information
  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText.charCodeAt(i);
    const position = char % embedding.length;
    embedding[position] = (embedding[position] + 1) / (i + 1);
  }
  
  // Add some word-level features
  const words = normalizedText.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const hash = simpleHash(word);
    const position = hash % embedding.length;
    embedding[position] += 0.1;
  }
  
  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / (magnitude || 1));
};

/**
 * Force reinitialize embedding model
 * Useful when you suspect the model has failed
 */
export const forceReinitializeEmbeddingModel = async (): Promise<boolean> => {
  console.log("🔄 Force reinitializing embedding model...");
  embeddingModel = null;
  modelInitialized = false;
  isUsingSimulation = false;
  modelInitializationPromise = null;
  initAttempts = 0;
  
  try {
    await initializeEmbeddingModel();
    return !isUsingSimulation;
  } catch (error) {
    console.error("Failed to reinitialize embedding model:", error);
    return false;
  }
};

/**
 * Check if we're using simulated embeddings
 */
export const isUsingSimulatedEmbeddings = (): boolean => {
  return isUsingSimulation;
};

/**
 * Simple hash function for strings
 */
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Calculate cosine similarity between two embeddings
 */
export const cosineSimilarity = (embedding1: number[], embedding2: number[]): number => {
  if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
    return 0;
  }
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }
  
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  const magnitudeProduct = magnitude1 * magnitude2;
  
  // Guard against division by zero
  if (magnitudeProduct === 0) {
    return 0;
  }
  
  return dotProduct / magnitudeProduct;
};

/**
 * Find most similar texts using embeddings
 */
export const findMostSimilar = async (
  query: string, 
  candidates: string[],
  limit: number = 3
): Promise<{text: string, score: number}[]> => {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Generate embeddings for all candidates
    const candidateResults = await generateEmbeddings(candidates);
    
    // Calculate similarity scores
    const scores = candidateResults.map(candidate => ({
      text: candidate.text,
      score: cosineSimilarity(queryEmbedding, candidate.embedding)
    }));
    
    // Sort by similarity score (highest first)
    const sorted = scores.sort((a, b) => b.score - a.score);
    
    // Return top results
    return sorted.slice(0, limit);
  } catch (error) {
    console.error("Error finding most similar texts:", error);
    return [];
  }
};

// Initialize the embedding model when this module is imported
initializeEmbeddingModel().then(() => {
  console.log(`Embedding system status: ${isUsingSimulation ? 'Using simulation' : 'Using Hugging Face model'}`);
}).catch(error => 
  console.error("Error initializing embedding model on import:", error)
);
