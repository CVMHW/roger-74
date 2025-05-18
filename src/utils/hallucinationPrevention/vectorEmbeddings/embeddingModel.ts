/**
 * Embedding Model Manager
 * 
 * Manages the embedding model initialization and state
 */

import { pipeline, PipelineType } from '@huggingface/transformers';
import { detectBestAvailableDevice, getAvailableMemory } from './deviceDetection';
import { generateSimulatedEmbedding } from './simulatedEmbeddings';
import { EmbeddingResult, HuggingFaceProgressCallback, PipelineOptions } from './types';

// Model state management
let embeddingModel: any = null;
let isUsingSimulation = false;
let modelInitialized = false;
let modelInitializationPromise: Promise<void> | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 5; // Increased from 3
let lastInitTime = 0;
const INIT_COOLDOWN_MS = 300000; // 5 minutes cooldown between force initialization attempts

// Cache for embeddings to reduce recomputation
const embeddingCache = new Map<string, {
  embedding: number[];
  timestamp: number;
  quality: number;
}>();

// Cache management
const MAX_CACHE_SIZE = 1000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LOW_MEMORY_THRESHOLD_MB = 200;

// Model configuration
const MODEL_CONFIG = {
  modelId: "Xenova/all-MiniLM-L6-v2", // Browser-optimized embedding model
  revision: "main",
  quantized: true, // Use quantized model for better performance
  backupModels: [
    "Xenova/paraphrase-multilingual-MiniLM-L12-v2", 
    "Xenova/all-mpnet-base-v2",
    "Xenova/all-MiniLM-L12-v2"
  ],
  // Model selection based on device capabilities
  deviceModels: {
    webgpu: "Xenova/all-MiniLM-L6-v2", // Best model for WebGPU
    webgl: "Xenova/all-MiniLM-L6-v2", // Default for WebGL
    wasm: "Xenova/paraphrase-multilingual-MiniLM-L12-v2", // Smaller model for WASM
    cpu: "Xenova/paraphrase-MiniLM-L3-v2" // Tiny model for CPU-only
  }
};

// Track success rates for persistence optimization
let successfulEmbeddings = 0;
let totalEmbeddingRequests = 0;

/**
 * Check if we're using simulated embeddings
 */
export const isUsingSimulatedEmbeddings = (): boolean => {
  return isUsingSimulation;
};

/**
 * Get embedding success rate (for persistence optimization)
 */
export const getEmbeddingSuccessRate = (): number => {
  return totalEmbeddingRequests > 0 ? successfulEmbeddings / totalEmbeddingRequests : 0;
};

/**
 * Progress callback for model loading
 * Properly typed to match HuggingFace expectations
 */
const progressCallback: HuggingFaceProgressCallback = (progress: number | { status?: string; progress?: number }) => {
  let percentage: number;
  let status: string = '';

  if (typeof progress === 'number') {
    percentage = Math.round(progress * 100);
  } else {
    percentage = Math.round((progress.progress || 0) * 100);
    status = progress.status || '';
  }

  console.log(`Model loading ${status}: ${percentage}%`);
};

/**
 * Clean up embedding cache to free memory
 * Uses LRU (Least Recently Used) strategy with quality weighting
 */
const cleanupEmbeddingCache = (forceCleanup = false): void => {
  const now = Date.now();
  
  // Check available memory before cleanup
  const memoryInfo = getAvailableMemory();
  const lowMemory = memoryInfo && (memoryInfo.available !== undefined) && 
                   (memoryInfo.available < LOW_MEMORY_THRESHOLD_MB * 1024 * 1024);
  
  // Determine how aggressive the cleanup should be
  const cleanupPercentage = forceCleanup ? 0.5 : 
                            lowMemory ? 0.4 : 
                            embeddingCache.size > MAX_CACHE_SIZE ? 0.3 : 0;
  
  if (cleanupPercentage === 0) return;
  
  console.log(`Cleaning up embedding cache (${cleanupPercentage * 100}% reduction target)`);
  
  // Create array from cache entries for sorting
  const entries = Array.from(embeddingCache.entries());
  
  // Calculate score based on recency and quality
  const scoredEntries = entries.map(([key, value]) => {
    const ageScore = 1 - Math.min(1, (now - value.timestamp) / CACHE_TTL_MS);
    const qualityScore = value.quality;
    // Combined score favors high quality and recent items
    const score = (ageScore * 0.6) + (qualityScore * 0.4);
    return { key, score };
  });
  
  // Sort by score (lower is less valuable)
  scoredEntries.sort((a, b) => a.score - b.score);
  
  // Delete lowest scoring entries based on cleanup percentage
  const deleteCount = Math.ceil(embeddingCache.size * cleanupPercentage);
  scoredEntries.slice(0, deleteCount).forEach(entry => {
    embeddingCache.delete(entry.key);
  });
  
  console.log(`Embedding cache cleanup complete. Removed ${deleteCount} entries, ${embeddingCache.size} remaining`);
};

/**
 * Select the best model based on device capabilities
 */
const selectBestModel = async (device: string): Promise<string> => {
  // Choose model based on detected device
  const modelId = MODEL_CONFIG.deviceModels[device as keyof typeof MODEL_CONFIG.deviceModels] || 
                  MODEL_CONFIG.modelId;
                  
  console.log(`Selected model ${modelId} for device ${device}`);
  return modelId;
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
  
  // Apply cooldown between initialization attempts
  const now = Date.now();
  if (initAttempts > 0 && (now - lastInitTime) < INIT_COOLDOWN_MS) {
    console.log(`Initialization cooling down. Next attempt available in ${Math.ceil((lastInitTime + INIT_COOLDOWN_MS - now) / 1000)}s`);
    if (isUsingSimulation) return;
  }
  
  // Check if we've exceeded max attempts
  if (initAttempts >= MAX_INIT_ATTEMPTS) {
    console.warn(`⚠️ Max initialization attempts (${MAX_INIT_ATTEMPTS}) reached, using simulation`);
    isUsingSimulation = true;
    modelInitialized = false;
    return;
  }
  
  initAttempts++;
  lastInitTime = now;
  
  // Create a new initialization promise
  modelInitializationPromise = (async () => {
    try {
      console.log(`🔄 Initializing embedding model attempt ${initAttempts}/${MAX_INIT_ATTEMPTS}...`);
      
      // Cleanup cache before model load to free memory
      cleanupEmbeddingCache(true);
      
      // Detect the best available device
      const device = await detectBestAvailableDevice();
      console.log(`Using device: ${device} for model initialization`);
      
      const startTime = performance.now();
      
      // Browser memory info if available
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        console.log(`Memory before model load: ${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))}MB`);
      }

      // Configure pipeline options with proper TypeScript types
      const pipelineOptions: PipelineOptions = { 
        revision: MODEL_CONFIG.revision,
        quantized: MODEL_CONFIG.quantized,
        device,
        progress_callback: progressCallback
      };
      
      // Select best model based on device capabilities
      const primaryModelToTry = await selectBestModel(device);
      let modelLoadSuccess = false;
      
      // Try primary model first
      try {
        // Create a feature-extraction pipeline with a browser-compatible model
        embeddingModel = await pipeline(
          "feature-extraction" as PipelineType,
          primaryModelToTry,
          pipelineOptions
        );
        modelLoadSuccess = true;
      } catch (primaryError) {
        console.warn(`Failed to load primary model ${primaryModelToTry}:`, primaryError);
        
        // Try backup models sequentially
        for (const backupModel of MODEL_CONFIG.backupModels) {
          if (modelLoadSuccess) break;
          
          try {
            console.log(`Attempting to load backup model: ${backupModel}`);
            embeddingModel = await pipeline(
              "feature-extraction" as PipelineType,
              backupModel,
              pipelineOptions
            );
            modelLoadSuccess = true;
            console.log(`Successfully loaded backup model: ${backupModel}`);
          } catch (backupError) {
            console.warn(`Failed to load backup model ${backupModel}:`, backupError);
          }
        }
        
        if (!modelLoadSuccess) {
          throw new Error("All model loading attempts failed");
        }
      }
      
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
        
        // Reset tracking for this session
        successfulEmbeddings = 0;
        totalEmbeddingRequests = 0;
        
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
 * Force reinitialize embedding model
 * Useful when you suspect the model has failed
 */
export const forceReinitializeEmbeddingModel = async (): Promise<boolean> => {
  // Check for cooldown period
  const now = Date.now();
  if ((now - lastInitTime) < INIT_COOLDOWN_MS) {
    console.log(`Force reinitialization cooling down. Available in ${Math.ceil((lastInitTime + INIT_COOLDOWN_MS - now) / 1000)}s`);
    return !isUsingSimulation;
  }
  
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
 * Cache text embedding with quality score
 */
const cacheEmbedding = (text: string, embedding: number[], quality: number = 1.0): void => {
  // Create short hash key for the text
  const key = text.substring(0, 50).toLowerCase().trim();
  
  // Skip caching for very short texts
  if (key.length < 5) return;
  
  // Store with timestamp and quality score
  embeddingCache.set(key, {
    embedding,
    timestamp: Date.now(),
    quality
  });
  
  // Cleanup if cache is getting too big
  if (embeddingCache.size > MAX_CACHE_SIZE) {
    cleanupEmbeddingCache();
  }
};

/**
 * Try to get embedding from cache
 */
const getEmbeddingFromCache = (text: string): number[] | null => {
  // Create cache key
  const key = text.substring(0, 50).toLowerCase().trim();
  
  // Skip cache lookup for very short texts
  if (key.length < 5) return null;
  
  const cached = embeddingCache.get(key);
  
  if (cached) {
    const now = Date.now();
    
    // Check if cached embedding is still valid
    if (now - cached.timestamp < CACHE_TTL_MS) {
      // Update the timestamp to keep it fresh
      cached.timestamp = now;
      return cached.embedding;
    } else {
      // Remove expired entry
      embeddingCache.delete(key);
    }
  }
  
  return null;
};

/**
 * Generate embeddings for text using the embedding model
 * Now with caching and memory optimization
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  totalEmbeddingRequests++;
  
  // First check if we have a cached embedding
  const cachedEmbedding = getEmbeddingFromCache(text);
  if (cachedEmbedding) {
    console.log(`🏎️ Using cached embedding for "${text.substring(0, 20)}..."`);
    successfulEmbeddings++;
    return cachedEmbedding;
  }
  
  try {
    // If model not initialized, try initializing
    if (!modelInitialized) {
      await initializeEmbeddingModel();
      
      // If still not available after initialization attempt, use fallback
      if (!embeddingModel) {
        console.log("Using simulated embedding fallback");
        const simulated = generateSimulatedEmbedding(text);
        // Cache with low quality score
        cacheEmbedding(text, simulated, 0.3);
        return simulated;
      }
    }
    
    const startTime = performance.now();
    
    // Generate real embeddings using the model
    const result = await embeddingModel(text, { pooling: "mean", normalize: true });
    
    const processingTime = performance.now() - startTime;
    console.log(`Generated embedding in ${Math.round(processingTime)}ms for "${text.substring(0, 20)}..."`);
    
    // Handle different output formats more explicitly with TypeScript typing
    let embedArray: number[] = [];
    
    if (result) {
      if (result.data && result.data instanceof Float32Array) {
        embedArray = Array.from(result.data);
      } else if (result.data && Array.isArray(result.data)) {
        embedArray = result.data;
      } else if (result instanceof Float32Array) {
        embedArray = Array.from(result);
      } else if (Array.isArray(result)) {
        embedArray = result;
      }
    }
    
    if (embedArray.length === 0) {
      throw new Error("Could not extract embedding array from result");
    }
    
    // Track successful embedding generation
    successfulEmbeddings++;
    
    // Cache the successful embedding with high quality score
    cacheEmbedding(text, embedArray, 1.0);
    
    return embedArray;
    
  } catch (error) {
    console.error("Error generating embedding, falling back to simulation:", error);
    // Fallback to simulated embeddings
    isUsingSimulation = true;
    
    // Generate simulated embedding
    const simulated = generateSimulatedEmbedding(text);
    
    // Cache with low quality score
    cacheEmbedding(text, simulated, 0.1);
    
    return simulated;
  }
};

// Export cache stats for monitoring
export const getEmbeddingCacheStats = (): {
  size: number;
  hitRate: number;
  avgQuality: number;
} => {
  const hitRate = totalEmbeddingRequests > 0 ? 
    (totalEmbeddingRequests - (totalEmbeddingRequests - successfulEmbeddings)) / totalEmbeddingRequests : 0;
  
  // Calculate average quality score
  let totalQuality = 0;
  embeddingCache.forEach(entry => {
    totalQuality += entry.quality;
  });
  const avgQuality = embeddingCache.size > 0 ? totalQuality / embeddingCache.size : 0;
  
  return {
    size: embeddingCache.size,
    hitRate,
    avgQuality
  };
};

// Initialize preemptively with delayed start
setTimeout(() => {
  initializeEmbeddingModel().catch(error => {
    console.error("Failed to pre-initialize embedding model:", error);
  });
}, 1000); // Delay by 1 second to allow page to load first
