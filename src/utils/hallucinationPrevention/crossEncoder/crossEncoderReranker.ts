
/**
 * Cross-Encoder Reranker Implementation
 * 
 * This module provides cross-encoder reranking capabilities
 * to improve retrieval quality beyond bi-encoder similarity.
 */

import { MemoryPiece } from '../retrieval';

/**
 * Options for cross-encoder reranking
 */
export interface CrossEncoderOptions {
  // Number of top results to return
  topK?: number;
  // Minimum score threshold to include result
  scoreThreshold?: number;
  // Include contextual features in reranking
  useContextualFeatures?: boolean;
}

/**
 * Result of cross-encoder reranking
 */
export interface CrossEncoderResult {
  // The document content
  document: MemoryPiece;
  // The cross-encoder score
  score: number;
}

/**
 * Cross-Encoder reranking class
 */
export class CrossEncoderReranker {
  /**
   * Rerank documents using cross-encoder
   */
  public async rerank(
    query: string,
    documents: MemoryPiece[],
    options: CrossEncoderOptions = {}
  ): Promise<MemoryPiece[]> {
    return rerankDocumentsWithCrossEncoder(query, documents, options);
  }
}

/**
 * Rerank documents using cross-encoder model
 * 
 * This improves ranking accuracy by using a cross-encoder model
 * instead of simple vector similarity.
 */
export async function rerankDocumentsWithCrossEncoder(
  query: string,
  documents: MemoryPiece[],
  options: CrossEncoderOptions = {}
): Promise<MemoryPiece[]> {
  try {
    const {
      topK = 5,
      scoreThreshold = 0.3,
      useContextualFeatures = false
    } = options;

    // Early return if no documents to rerank
    if (!documents || documents.length === 0) {
      return [];
    }

    // Prepare documents for scoring
    const documentsWithScores: CrossEncoderResult[] = documents.map(doc => ({
      document: doc,
      score: simulateCrossEncoderScore(query, doc.content, useContextualFeatures)
    }));

    // Sort by score in descending order
    documentsWithScores.sort((a, b) => b.score - a.score);

    // Apply score threshold and take top K results
    return documentsWithScores
      .filter(item => item.score > scoreThreshold)
      .slice(0, topK)
      .map(item => item.document);
  } catch (error) {
    console.error("Error in cross-encoder reranking:", error);
    // Return original documents on error
    return documents.slice(0, options.topK || 5);
  }
}

/**
 * Simulate cross-encoder scores with enhanced logic
 * 
 * In a real implementation, this would use a transformer model for scoring.
 */
function simulateCrossEncoderScore(
  query: string,
  document: string,
  useContextualFeatures: boolean = false
): number {
  try {
    // Convert to lowercase for better matching
    const queryLower = query.toLowerCase();
    const docLower = document.toLowerCase();

    // Basic exact word matching
    const queryWords = queryLower.split(/\W+/).filter(w => w.length > 2);
    const docWords = docLower.split(/\W+/).filter(w => w.length > 2);
    
    // Count exact word matches
    const exactMatches = queryWords.filter(word => docWords.includes(word)).length;
    const exactMatchScore = queryWords.length > 0 ? exactMatches / queryWords.length : 0;
    
    // Calculate containment score (how much of the document is in the query)
    const containmentScore = docWords.length > 0 ? 
      docWords.filter(word => queryLower.includes(word)).length / docWords.length : 0;
    
    // Check for full phrase matches
    const phraseMatchScore = queryLower.length > 10 && docLower.includes(queryLower) ? 0.8 : 0;
    
    // Check if document length is reasonable
    const lengthScore = document.length > 20 && document.length < 500 ? 0.1 : 0;
    
    // Additional contextual features if enabled
    let contextualScore = 0;
    if (useContextualFeatures) {
      // Prefer documents with emotional or mental health terms for therapeutic context
      const therapeuticTerms = ['feel', 'feeling', 'emotion', 'anxiety', 'depression', 
                               'stress', 'therapy', 'mental health', 'help'];
      
      const hasMentalHealthContext = therapeuticTerms.some(term => docLower.includes(term));
      contextualScore = hasMentalHealthContext ? 0.1 : 0;
    }
    
    // Combine scores with weights
    const combinedScore = (
      exactMatchScore * 0.4 + 
      containmentScore * 0.2 + 
      phraseMatchScore * 0.3 + 
      lengthScore * 0.05 +
      contextualScore * 0.05
    );
    
    // Normalize to 0-1 range
    return Math.min(Math.max(combinedScore, 0), 1);
  } catch (error) {
    console.error("Error calculating cross-encoder score:", error);
    return 0.5; // Return neutral score on error
  }
}

// Export a default instance for convenience
const defaultCrossEncoder = new CrossEncoderReranker();
export default defaultCrossEncoder;
