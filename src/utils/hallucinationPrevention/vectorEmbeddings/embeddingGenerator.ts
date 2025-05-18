
/**
 * Embedding Generator
 * 
 * Handles batch processing of embeddings with timeout protection
 */

import { generateEmbedding } from './embeddingModel';
import { generateSimulatedEmbedding } from './simulatedEmbeddings';
import { isUsingSimulatedEmbeddings } from './embeddingModel';
import { EmbeddingResult, EmbeddingGenerationOptions, SimilarityResult } from './types';
import { cosineSimilarity } from './utils';

/**
 * Generate embeddings for multiple texts, with batching and timeout protection
 */
export const generateEmbeddings = async (
  texts: string[], 
  options: EmbeddingGenerationOptions = {}
): Promise<EmbeddingResult[]> => {
  const { batchSize = 5, timeoutMs = 10000 } = options;
  
  try {
    if (isUsingSimulatedEmbeddings()) {
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
    
    // Fallback to simulated embeddings
    return texts.map(text => ({
      text,
      embedding: generateSimulatedEmbedding(text)
    }));
  }
};

/**
 * Find most similar texts using embeddings
 */
export const findMostSimilar = async (
  query: string, 
  candidates: string[],
  limit: number = 3
): Promise<SimilarityResult[]> => {
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
