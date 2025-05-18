
/**
 * Simulated Embeddings Generator
 * 
 * Provides fallback functionality when real embedding models are unavailable
 */

import { simpleHash } from './utils';

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
