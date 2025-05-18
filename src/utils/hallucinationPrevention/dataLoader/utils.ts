
/**
 * Data Loader Utilities
 * 
 * Utility functions for the data loader
 */

/**
 * Create chunks from content for more granular retrieval
 */
export const createChunks = (content: string, maxChunkLength: number = 100): string[] => {
  // Simple chunking by sentences
  const sentences = content.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed max length, start a new chunk
    if (currentChunk.length + sentence.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
};
