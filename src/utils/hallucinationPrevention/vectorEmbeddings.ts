
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

/**
 * Initialize the embedding model
 * Uses a small but effective model suitable for browser environments
 */
export const initializeEmbeddingModel = async (): Promise<void> => {
  try {
    console.log("Initializing embedding model from Hugging Face...");
    
    // Create a feature-extraction pipeline with a small, efficient model
    embeddingModel = await pipeline(
      "feature-extraction",
      "mixedbread-ai/mxbai-embed-xsmall-v1"
    );
    
    // Test the model with a simple example
    const testEmbedding = await embeddingModel("Test embedding", { 
      pooling: "mean", 
      normalize: true 
    });
    
    if (testEmbedding && testEmbedding.data) {
      console.log("✅ Embedding model successfully initialized and tested");
      isUsingSimulation = false;
      return;
    } else {
      throw new Error("Model initialized but test embedding failed");
    }
  } catch (error) {
    console.error("❌ Failed to initialize embedding model:", error);
    console.warn("⚠️ Falling back to simulated embeddings");
    embeddingModel = null;
    isUsingSimulation = true;
  }
};

/**
 * Generate embeddings for text using the embedding model
 */
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    if (!embeddingModel) {
      // Initialize model if not already done
      await initializeEmbeddingModel();
      
      // If still not available, use fallback
      if (!embeddingModel) {
        console.log("Using simulated embedding fallback");
        return generateSimulatedEmbedding(text);
      }
    }
    
    // Generate real embeddings using the model
    const result = await embeddingModel(text, { pooling: "mean", normalize: true });
    
    // Convert to regular array for easier handling
    return Array.from(result.data);
    
  } catch (error) {
    console.error("Error generating embedding, falling back to simulation:", error);
    // Fallback to simulated embeddings
    isUsingSimulation = true;
    return generateSimulatedEmbedding(text);
  }
};

/**
 * Generate embeddings for multiple texts
 */
export const generateEmbeddings = async (texts: string[]): Promise<EmbeddingResult[]> => {
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
    const batchSize = 5;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      // Generate embeddings for each text in the batch
      const embeddings = await Promise.all(
        batch.map(async (text) => {
          const embedding = await generateEmbedding(text);
          return {
            text,
            embedding
          };
        })
      );
      
      results.push(...embeddings);
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

