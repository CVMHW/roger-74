
/**
 * Embedding Model Manager
 * 
 * Manages the embedding model initialization and state
 */

import { pipeline, PipelineType } from '@huggingface/transformers';
import { detectBestAvailableDevice } from './deviceDetection';
import { generateSimulatedEmbedding } from './simulatedEmbeddings';
import { EmbeddingResult, HuggingFaceProgressCallback, PipelineOptions } from './types';

// Model state management
let embeddingModel: any = null;
let isUsingSimulation = false;
let modelInitialized = false;
let modelInitializationPromise: Promise<void> | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Model configuration
const MODEL_CONFIG = {
  modelId: "Xenova/all-MiniLM-L6-v2", // Browser-optimized embedding model
  revision: "main",
  quantized: true, // Use quantized model for better performance
  backupModels: ["Xenova/paraphrase-multilingual-MiniLM-L12-v2", "Xenova/all-mpnet-base-v2"]
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

      // Configure pipeline options with proper TypeScript types
      const pipelineOptions: PipelineOptions = { 
        revision: MODEL_CONFIG.revision,
        quantized: MODEL_CONFIG.quantized,
        device,
        progress_callback: progressCallback
      };
      
      // Try primary model first, then fallback models if needed
      let modelToTry = MODEL_CONFIG.modelId;
      let modelLoadSuccess = false;
      
      // Try primary model
      try {
        // Create a feature-extraction pipeline with a browser-compatible model
        embeddingModel = await pipeline(
          "feature-extraction" as PipelineType,
          modelToTry,
          pipelineOptions
        );
        modelLoadSuccess = true;
      } catch (primaryError) {
        console.warn(`Failed to load primary model ${modelToTry}:`, primaryError);
        
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
 * Generate embeddings for text using the embedding model
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  totalEmbeddingRequests++;
  
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
    
    return embedArray;
    
  } catch (error) {
    console.error("Error generating embedding, falling back to simulation:", error);
    // Fallback to simulated embeddings
    isUsingSimulation = true;
    return generateSimulatedEmbedding(text);
  }
};

// Initialize on module load to speed up first embedding generation
setTimeout(() => {
  initializeEmbeddingModel().catch(error => {
    console.error("Failed to pre-initialize embedding model:", error);
  });
}, 1000); // Delay by 1 second to allow page to load first
