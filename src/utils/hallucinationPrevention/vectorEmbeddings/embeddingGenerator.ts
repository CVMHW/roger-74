/**
 * Embedding Generator
 * 
 * Handles batch processing of embeddings with timeout protection
 * and advanced similarity search capabilities
 */

import { generateEmbedding, isUsingSimulatedEmbeddings } from './embeddingModel';
import { generateSimulatedEmbedding } from './simulatedEmbeddings';
import { EmbeddingResult, EmbeddingGenerationOptions, SimilarityResult, BatchEmbeddingOptions } from './types';
import { cosineSimilarity, simpleHash } from './utils';

/**
 * Generate embeddings for multiple texts, with batching and timeout protection
 */
export const generateEmbeddings = async (
  texts: string[], 
  options: EmbeddingGenerationOptions = {}
): Promise<EmbeddingResult[]> => {
  const { 
    batchSize = 5, 
    timeoutMs = 10000, 
    forceFresh = false,
    parallelLimit = 3 
  } = options;
  
  try {
    if (isUsingSimulatedEmbeddings() && !forceFresh) {
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
      
      // Process parallel batches with a limit to avoid overwhelming the browser
      const processBatchWithLimit = async (textsToProcess: string[]) => {
        const results = [];
        
        // Process in chunks based on parallelLimit
        for (let j = 0; j < textsToProcess.length; j += parallelLimit) {
          const chunk = textsToProcess.slice(j, j + parallelLimit);
          const chunkPromises = chunk.map(text => generateEmbeddingWithTimeout(text, timeoutMs));
          const chunkResults = await Promise.all(chunkPromises);
          results.push(...chunkResults);
        }
        
        return results;
      };
      
      const batchResults = await processBatchWithLimit(batch);
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
 * Generate embedding with timeout protection
 */
const generateEmbeddingWithTimeout = async (
  text: string,
  timeoutMs: number
): Promise<EmbeddingResult> => {
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
};

/**
 * Find most similar texts using embeddings
 * Now with more sophisticated similarity calculations
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
    
    // Calculate similarity scores with lexical boost for exact matches
    const scores = candidateResults.map((candidate) => {
      // Cosine similarity for semantic matching
      const semanticScore = cosineSimilarity(queryEmbedding, candidate.embedding);
      
      // Lexical similarity for exact match boosting
      const lexicalScore = calculateLexicalSimilarity(query, candidate.text);
      
      // Combined score with 80% semantic, 20% lexical
      const combinedScore = (semanticScore * 0.8) + (lexicalScore * 0.2);
      
      return {
        id: simpleHash(candidate.text).toString(), // Convert hash to string to match SimilarityResult
        text: candidate.text,
        score: combinedScore,
        semanticScore,
        lexicalScore
      };
    });
    
    // Sort by combined similarity score (highest first)
    const sorted = scores.sort((a, b) => b.score - a.score);
    
    // Return top results
    return sorted.slice(0, limit);
  } catch (error) {
    console.error("Error finding most similar texts:", error);
    return [];
  }
};

/**
 * Calculate lexical similarity between two texts
 * Uses token overlap with weighting for important words
 */
const calculateLexicalSimilarity = (text1: string, text2: string): number => {
  // Simple implementation using word overlap
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Count matching words
  let matches = 0;
  const uniqueWords1 = new Set(words1);
  
  words2.forEach(word => {
    if (uniqueWords1.has(word)) {
      matches++;
    }
  });
  
  // Normalize by word count
  return matches / Math.max(words1.length, words2.length);
};

/**
 * Find semantically similar content with batch processing
 * Optimized for handling large collections
 */
export const findSimilarContent = async (
  query: string,
  texts: string[],
  options: {
    limit?: number;
    threshold?: number;
    batchSize?: number;
    useCache?: boolean;
  } = {}
): Promise<SimilarityResult[]> => {
  const { 
    limit = 5, 
    threshold = 0.7,
    batchSize = 50,
    useCache = true
  } = options;
  
  try {
    const queryEmbedding = await generateEmbedding(query);
    const results: SimilarityResult[] = [];
    
    // Process in batches to avoid memory issues
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      // Generate embeddings for the batch
      const embeddings = await generateEmbeddings(batch, {
        batchSize: 10,
        forceFresh: !useCache
      });
      
      // Calculate similarities
      embeddings.forEach((item) => {
        const score = cosineSimilarity(queryEmbedding, item.embedding);
        if (score >= threshold) {
          results.push({
            id: simpleHash(item.text).toString(),
            text: item.text,
            score
          });
        }
      });
    }
    
    // Sort by similarity
    results.sort((a, b) => b.score - a.score);
    
    // Return limited results
    return results.slice(0, limit);
  } catch (error) {
    console.error("Error in findSimilarContent:", error);
    return [];
  }
};

/**
 * Chunk and embed a long text for more effective similarity search
 */
export const chunkAndEmbedText = async (
  text: string,
  options: {
    chunkSize?: number;
    chunkOverlap?: number;
  } = {}
): Promise<EmbeddingResult[]> => {
  const {
    chunkSize = 200,
    chunkOverlap = 50
  } = options;
  
  // Split text into paragraphs first
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  
  // Process each paragraph
  for (const paragraph of paragraphs) {
    // Skip empty paragraphs
    if (paragraph.trim().length === 0) continue;
    
    // If paragraph is short enough, keep it whole
    if (paragraph.length <= chunkSize) {
      chunks.push(paragraph);
      continue;
    }
    
    // Otherwise, split into chunks with overlap
    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      // If adding this sentence would exceed chunk size, save current chunk and start new one
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk);
        
        // Start new chunk with overlap from end of previous chunk
        const lastChunk = currentChunk;
        currentChunk = '';
        
        // Create overlap with last few sentences of previous chunk
        const overlapWords = lastChunk
          .split(/\s+/)
          .slice(-Math.ceil(chunkOverlap / 5));
          
        if (overlapWords.length > 0) {
          currentChunk = overlapWords.join(' ') + ' ';
        }
      }
      
      currentChunk += sentence + ' ';
    }
    
    // Add final chunk if not empty
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
  }
  
  // Generate embeddings for all chunks
  return generateEmbeddings(chunks);
};
