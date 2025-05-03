
/**
 * Multi-Head Attention Memory System
 * 
 * Provides advanced memory retrieval with enhanced relevance scoring
 */

import { searchMemory } from './memoryController';
import { MemoryPiece } from './memoryBank';

/**
 * Enhanced memory retrieval using multi-head attention
 */
export const retrieveWithMultiHeadAttention = (
  query: string,
  heads: number = 3,
  resultsPerHead: number = 2
): MemoryPiece[] => {
  // Results array
  const results: MemoryPiece[] = [];
  
  try {
    // Extract keywords for different attention heads
    const keywords = extractKeywords(query);
    
    // Split keywords into groups (heads)
    const keywordGroups = splitIntoGroups(keywords, heads);
    
    // For each head, perform a search
    for (let i = 0; i < keywordGroups.length; i++) {
      const headKeywords = keywordGroups[i];
      
      // Skip empty heads
      if (headKeywords.length === 0) continue;
      
      // Search memory with this head's keywords
      const headResults = searchMemory({
        keywords: headKeywords,
        limit: resultsPerHead
      });
      
      // Convert results to MemoryPiece format and add to results
      if (headResults && headResults.length > 0) {
        for (const item of headResults) {
          // Convert to MemoryPiece format
          const memoryPiece: MemoryPiece = {
            content: item.content,
            role: item.role,
            metadata: item.metadata,
            importance: item.importance
          };
          
          // Add if not duplicate
          if (!isMemoryDuplicate(results, memoryPiece)) {
            results.push(memoryPiece);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in multi-head attention:", error);
  }
  
  return results;
};

/**
 * Check if a memory is already in the results
 */
const isMemoryDuplicate = (memories: MemoryPiece[], newMemory: MemoryPiece): boolean => {
  return memories.some(mem => mem.content === newMemory.content);
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text: string): string[] => {
  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'have', 'what', 'when', 'where', 'would', 'could', 'should', 'about'].includes(word)
    );
};

/**
 * Split array into multiple groups
 */
const splitIntoGroups = <T>(array: T[], numGroups: number): T[][] => {
  const result: T[][] = Array(numGroups).fill(null).map(() => []);
  
  for (let i = 0; i < array.length; i++) {
    const groupIndex = i % numGroups;
    result[groupIndex].push(array[i]);
  }
  
  return result;
};
