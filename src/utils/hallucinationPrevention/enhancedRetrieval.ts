
/**
 * Enhanced Retrieval System with Cross-Encoding
 * 
 * Combines bi-encoder retrieval with cross-encoder reranking
 * to achieve optimal retrieval performance
 */

import { MemoryPiece } from './retrieval';
import { retrieveFactualGrounding } from './retrieval';
import { performHybridSearch } from './hybridSearch';
import { expandQuery, generateHybridQueryExpansion, extractTerms } from './queryExpansion';
import { CrossEncoderReranker, rerankDocumentsWithCrossEncoder } from './crossEncoder';

/**
 * Options for enhanced retrieval
 */
export interface EnhancedRetrievalOptions {
  // Maximum number of results to return
  limit?: number;
  // Whether to apply reranking
  rerank?: boolean;
  // Conversation context for improved retrieval
  conversationContext?: string[];
  // Use query expansion
  useQueryExpansion?: boolean;
  // Use hybrid search combining vector and keyword search
  useHybridSearch?: boolean;
  // Threshold for relevance
  relevanceThreshold?: number;
}

/**
 * Enhanced retrieval with query expansion and reranking
 */
export const retrieveEnhanced = async (
  query: string,
  topics: string[] = [],
  options: EnhancedRetrievalOptions = {}
): Promise<MemoryPiece[]> => {
  try {
    const {
      limit = 5,
      rerank = true,
      conversationContext = [],
      useQueryExpansion = true,
      useHybridSearch = true,
      relevanceThreshold = 0.3
    } = options;
    
    // Use provided topics or extract from query
    const initialTopics = topics.length > 0 ? topics : extractTerms(query);
    
    // 1. Apply query expansion if enabled
    const expandedTopics = useQueryExpansion
      ? await generateExpandedQuery(query, initialTopics)
      : initialTopics;
    
    // 2. Retrieve initial candidate set using hybrid search or basic retrieval
    let initialResults: MemoryPiece[] = [];
    
    if (useHybridSearch) {
      initialResults = await performHybridSearch(
        query, 
        expandedTopics,
        limit * 3, // Retrieve more for better reranking
        relevanceThreshold
      );
    } else {
      // Fallback to basic retrieval
      initialResults = retrieveFactualGrounding(expandedTopics, limit * 2);
    }
    
    // Early return if no results or reranking disabled
    if (initialResults.length === 0 || !rerank) {
      return initialResults.slice(0, limit);
    }
    
    // 3. Apply cross-encoder reranking
    const rerankedResults = await rerankDocumentsWithCrossEncoder(
      query,
      initialResults,
      conversationContext,
      {
        topK: limit,
        scoreThreshold: relevanceThreshold
      }
    );
    
    return rerankedResults;
  } catch (error) {
    console.error("Error in enhanced retrieval:", error);
    // Fallback to basic retrieval
    const fallbackTopics = extractTerms(query);
    return retrieveFactualGrounding(fallbackTopics, limit);
  }
};

/**
 * Generate expanded query with rich techniques
 */
export const generateExpandedQuery = async (
  query: string,
  initialTopics: string[] = []
): Promise<string[]> => {
  try {
    // Use our advanced query expansion
    const expansion = await generateHybridQueryExpansion(query);
    
    // Combine with initial topics
    const combinedTopics = [
      ...initialTopics,
      ...expansion.expandedTopics,
      ...expansion.concepts
    ];
    
    // Remove duplicates and return
    return [...new Set(combinedTopics)];
  } catch (error) {
    console.error("Error generating expanded query:", error);
    return initialTopics;
  }
};

/**
 * Augment a response with the most relevant retrieved content
 * using semantic integration techniques
 */
export const augmentResponseWithEnhancedRetrieval = (
  responseText: string,
  userInput: string,
  retrievedContent: MemoryPiece[]
): string => {
  try {
    if (!retrievedContent || retrievedContent.length === 0) {
      return responseText;
    }
    
    // Get the most relevant retrieved content
    const topContent = retrievedContent[0];
    
    // Skip augmentation if the content is already integrated
    if (responseText.includes(topContent.content)) {
      return responseText;
    }
    
    // Find a good insertion point
    const sentences = responseText.split(/(?<=[.!?])\s+/);
    
    // For simplicity, insert after the first third of the response
    const insertPoint = Math.ceil(sentences.length / 3);
    
    // Create a natural transition phrase
    let transitionPhrase = "I understand that ";
    if (topContent.content.includes("feel") || topContent.content.includes("feeling")) {
      transitionPhrase = "I recognize that you might be feeling ";
    } else if (topContent.content.includes("think") || topContent.content.includes("thought")) {
      transitionPhrase = "It sounds like you're thinking about ";
    } else if (topContent.content.includes("want") || topContent.content.includes("need")) {
      transitionPhrase = "Based on what you're sharing, you might need ";
    }
    
    // Insert the content with transition
    const augmentedResponse = [
      ...sentences.slice(0, insertPoint),
      transitionPhrase + topContent.content,
      ...sentences.slice(insertPoint)
    ].join(" ");
    
    return augmentedResponse;
  } catch (error) {
    console.error("Error augmenting response:", error);
    return responseText;
  }
};
