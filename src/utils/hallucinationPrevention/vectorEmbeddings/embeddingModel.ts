
/**
 * Embedding Model Manager
 * 
 * Manages the embedding model initialization and state
 */

import { pipeline, PipelineType } from '@huggingface/transformers';
import { detectBestAvailableDevice } from './deviceDetection';
import { generateSimulatedEmbedding } from './simulatedEmbeddings';
import { EmbeddingResult, HuggingFaceProgressCallback } from './types';

// Model state management
let embeddingModel: any = null;
let isUsingSimulation = false;
let modelInitialized = false;
let modelInitializationPromise: Promise<void> | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

/**
 * Check if we're using simulated embeddings
 */
export const isUsingSimulatedEmbeddings = (): boolean => {
  return isUsingSimulation;
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
      // Using a model explicitly designed for browser environments
      embeddingModel = await pipeline(
        "feature-extraction" as PipelineType,
        "Xenova/all-MiniLM-L6-v2", // More browser-friendly model with public access
        { 
          revision: "main",
          device, // Now using the properly typed device value
          progress_callback: (progressInfo: any) => {
            // Handle progress in a type-safe way
            const percentage = typeof progressInfo === 'number' 
              ? Math.round(progressInfo * 100)
              : progressInfo.progress 
                ? Math.round(progressInfo.progress * 100) 
                : 0;
            
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
