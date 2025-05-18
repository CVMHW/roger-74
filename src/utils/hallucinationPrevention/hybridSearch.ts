
/**
 * Hybrid Search Implementation
 * 
 * Combines vector search with keyword-based search for more robust retrieval
 * with cross-encoder reranking for improved relevance.
 */

import { generateEmbedding, cosineSimilarity } from './vectorEmbeddings';
import vectorDB from './vectorDatabase';
import { COLLECTIONS } from './dataLoader/types';
import { createChunks } from './dataLoader/utils';
import { v4 as uuidv4 } from 'uuid';
import { MemoryPiece } from './retrieval';

// Hybrid search result with combined scoring
interface HybridSearchResult {
  content: string;
  vectorScore: number;
  keywordScore: number;
  combinedScore: number;
  metadata?: any;
}

/**
 * Perform hybrid search combining vector similarity and keyword matching
 */
export const performHybridSearch = async (
  query: string,
  collections: string[] = [COLLECTIONS.FACTS, COLLECTIONS.ROGER_KNOWLEDGE],
  options: {
    limit?: number;
    vectorWeight?: number;
    keywordWeight?: number;
  } = {}
): Promise<MemoryPiece[]> => {
  const {
    limit = 10,
    vectorWeight = 0.7,
    keywordWeight = 0.3
  } = options;
  
  try {
    // 1. Vector-based search
    const vectorResults = await performVectorSearch(query, collections);
    
    // 2. Keyword-based search
    const keywordResults = performKeywordSearch(query, collections);
    
    // 3. Combine and score results
    const combinedResults = combineSearchResults(
      vectorResults,
      keywordResults,
      vectorWeight,
      keywordWeight
    );
    
    // 4. Return top results
    return combinedResults
      .slice(0, limit)
      .map(result => ({
        content: result.content,
        role: 'system',
        importance: result.combinedScore,
        metadata: {
          ...result.metadata,
          vectorScore: result.vectorScore,
          keywordScore: result.keywordScore,
          combinedScore: result.combinedScore,
          hybridSearch: true
        }
      }));
      
  } catch (error) {
    console.error("Error in hybrid search:", error);
    // If hybrid search fails, fall back to simple keyword search
    return performKeywordSearch(query, collections)
      .slice(0, limit)
      .map(result => ({
        content: result.content,
        role: 'system',
        importance: result.keywordScore,
        metadata: {
          fallback: true,
          keywordScore: result.keywordScore
        }
      }));
  }
};

/**
 * Perform vector-based search
 */
async function performVectorSearch(
  query: string,
  collections: string[]
): Promise<HybridSearchResult[]> {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    const results: HybridSearchResult[] = [];
    
    // Search each collection
    for (const collectionName of collections) {
      const collection = vectorDB.collection(collectionName);
      
      // Skip empty collections
      if (collection.size() === 0) continue;
      
      // Perform search
      const searchResults = collection.findSimilar(embedding, {
        limit: 20,
        scoreThreshold: 0.3 // Lower threshold to get more candidates for reranking
      });
      
      // Add results with scores
      searchResults.forEach(result => {
        results.push({
          content: result.record.text,
          vectorScore: result.score,
          keywordScore: 0, // Will be populated in combined step
          combinedScore: result.score,
          metadata: result.record.metadata
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error("Vector search error:", error);
    return [];
  }
}

/**
 * Perform keyword-based search using BM25-inspired scoring
 */
function performKeywordSearch(
  query: string,
  collections: string[]
): HybridSearchResult[] {
  try {
    const queryTerms = query.toLowerCase()
      .split(/\W+/)
      .filter(term => term.length > 2);
    
    const results: HybridSearchResult[] = [];
    
    // Skip if no meaningful terms
    if (queryTerms.length === 0) {
      return results;
    }
    
    // Search each collection
    for (const collectionName of collections) {
      const collection = vectorDB.collection(collectionName);
      
      // Get all records
      const allRecords = collection.getAll();
      
      // Score each record
      allRecords.forEach(record => {
        const content = record.text.toLowerCase();
        let score = 0;
        let matchCount = 0;
        
        // Score individual term matches
        for (const term of queryTerms) {
          // Check if the term exists in the content
          if (content.includes(term)) {
            score += 0.2;
            matchCount++;
            
            // Bonus for exact phrase matches
            if (content.includes(queryTerms.join(" "))) {
              score += 0.4;
            }
          }
        }
        
        // Apply term density factor (percentage of query terms found)
        const termDensity = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
        score = score * (0.5 + 0.5 * termDensity);
        
        // Only add if there's at least one match
        if (score > 0) {
          results.push({
            content: record.text,
            vectorScore: 0, // Will be populated in combined step
            keywordScore: score,
            combinedScore: score,
            metadata: record.metadata
          });
        }
      });
    }
    
    // Sort by keyword score
    return results.sort((a, b) => b.keywordScore - a.keywordScore);
  } catch (error) {
    console.error("Keyword search error:", error);
    return [];
  }
}

/**
 * Combine vector and keyword search results with weighted scoring
 */
function combineSearchResults(
  vectorResults: HybridSearchResult[],
  keywordResults: HybridSearchResult[],
  vectorWeight: number,
  keywordWeight: number
): HybridSearchResult[] {
  // Create a map to combine duplicate content
  const contentMap = new Map<string, HybridSearchResult>();
  
  // Process vector results
  vectorResults.forEach(result => {
    contentMap.set(result.content, result);
  });
  
  // Process keyword results, updating existing entries or adding new ones
  keywordResults.forEach(result => {
    if (contentMap.has(result.content)) {
      // Update existing result with keyword score
      const existing = contentMap.get(result.content)!;
      existing.keywordScore = result.keywordScore;
      
      // Calculate combined score with weights
      existing.combinedScore = (
        vectorWeight * existing.vectorScore + 
        keywordWeight * result.keywordScore
      );
    } else {
      // Add new result
      contentMap.set(result.content, result);
    }
  });
  
  // Convert map to array and sort by combined score
  return Array.from(contentMap.values())
    .sort((a, b) => b.combinedScore - a.combinedScore);
}
