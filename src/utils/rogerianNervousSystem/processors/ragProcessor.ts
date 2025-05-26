
/**
 * Unified RAG Processor
 * 
 * Implements sophisticated RAG with reranking, multi-vector retrieval, and scholarly approaches
 */

import { RAGContext, EmotionalContext, SmallTalkContext } from '../core/types';
import { retrieveAugmentation } from '../../hallucinationPrevention/retrieval';
import { rerankWithVectorSimilarity } from '../../hallucinationPrevention/vectorReranker';

/**
 * Process RAG with advanced retrieval and reranking
 */
export const processRAG = async (
  userInput: string,
  emotionalContext: EmotionalContext,
  conversationHistory: string[],
  smallTalkContext?: SmallTalkContext
): Promise<RAGContext> => {
  console.log("RAG PROCESSOR: Processing RAG context with advanced techniques");
  
  try {
    // Determine if RAG should be applied based on sophisticated criteria
    const shouldApplyRAG = determineShouldApplyRAG(
      userInput,
      emotionalContext,
      conversationHistory,
      smallTalkContext
    );
    
    if (!shouldApplyRAG) {
      return {
        shouldApplyRAG: false,
        confidence: 0.1
      };
    }
    
    // Generate sophisticated query augmentation
    const queryAugmentation = generateQueryAugmentation(userInput, emotionalContext, conversationHistory);
    
    // Multi-stage retrieval with reranking
    const retrievalResult = await retrieveAugmentation(queryAugmentation, conversationHistory);
    
    if (!retrievalResult.retrievedContent || retrievalResult.retrievedContent.length === 0) {
      return {
        shouldApplyRAG: true,
        queryAugmentation,
        confidence: 0.2
      };
    }
    
    // Convert to MemoryPiece format for reranking
    const memoryPieces = retrievalResult.retrievedContent.map((content, index) => ({
      content,
      role: 'system' as const,
      importance: 0.7,
      metadata: { retrievalIndex: index }
    }));
    
    // Apply sophisticated reranking
    const rerankedMemories = await rerankWithVectorSimilarity(
      queryAugmentation,
      memoryPieces,
      {
        topK: 5,
        threshold: 0.6,
        requireMinimumScore: true,
        minimumScore: 0.3
      }
    );
    
    const rerankedContent = rerankedMemories.map(mem => mem.content);
    
    // Calculate confidence based on retrieval quality and reranking scores
    const confidence = calculateRAGConfidence(rerankedContent, retrievalResult.confidence);
    
    const ragContext: RAGContext = {
      shouldApplyRAG: true,
      queryAugmentation,
      retrievedKnowledge: rerankedContent,
      confidence,
      sources: rerankedContent.map((_, index) => `source_${index + 1}`)
    };
    
    console.log("RAG PROCESSOR: Advanced RAG processing complete", {
      originalCount: retrievalResult.retrievedContent.length,
      rerankedCount: rerankedContent.length,
      confidence
    });
    
    return ragContext;
    
  } catch (error) {
    console.error("RAG PROCESSOR: Error in RAG processing:", error);
    return {
      shouldApplyRAG: false,
      confidence: 0.1
    };
  }
};

/**
 * Determine if RAG should be applied using sophisticated criteria
 */
const determineShouldApplyRAG = (
  userInput: string,
  emotionalContext: EmotionalContext,
  conversationHistory: string[],
  smallTalkContext?: SmallTalkContext
): boolean => {
  // Skip RAG for small talk
  if (smallTalkContext?.isSmallTalk) {
    return false;
  }
  
  // Always apply RAG for emotional content
  if (emotionalContext.hasDetectedEmotion || emotionalContext.isDepressionMentioned) {
    return true;
  }
  
  // Apply RAG for substantive queries
  if (userInput.length > 30) {
    return true;
  }
  
  // Apply RAG for complex conversations
  if (conversationHistory.length > 3) {
    return true;
  }
  
  // Apply RAG for questions
  if (/\b(what|how|why|when|where|who|can you|could you|help me|tell me)\b/i.test(userInput)) {
    return true;
  }
  
  return false;
};

/**
 * Generate sophisticated query augmentation
 */
const generateQueryAugmentation = (
  userInput: string,
  emotionalContext: EmotionalContext,
  conversationHistory: string[]
): string => {
  let augmentation = userInput;
  
  // Priority augmentation for depression
  if (emotionalContext.isDepressionMentioned) {
    augmentation = `depression therapy counseling ${userInput}`;
  } else if (emotionalContext.primaryEmotion && emotionalContext.primaryEmotion !== 'neutral') {
    // Augment with specific emotion
    augmentation = `${emotionalContext.primaryEmotion} emotional support ${userInput}`;
  }
  
  // Add conversation context for complex queries
  if (conversationHistory.length > 2) {
    const recentContext = conversationHistory.slice(-2).join(' ');
    const contextKeywords = extractKeywords(recentContext);
    if (contextKeywords.length > 0) {
      augmentation = `${contextKeywords.join(' ')} ${augmentation}`;
    }
  }
  
  // Add therapeutic context
  augmentation = `rogerian therapy ${augmentation}`;
  
  return augmentation;
};

/**
 * Extract keywords from text for context augmentation
 */
const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 4 && !isStopWord(word));
  
  // Return unique words, limited to top 3
  return [...new Set(words)].slice(0, 3);
};

/**
 * Check if word is a stop word
 */
const isStopWord = (word: string): boolean => {
  const stopWords = ['that', 'this', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said'];
  return stopWords.includes(word);
};

/**
 * Calculate RAG confidence based on retrieval quality
 */
const calculateRAGConfidence = (retrievedContent: string[], baseConfidence: number): number => {
  if (retrievedContent.length === 0) return 0.1;
  
  // Factor in content quality
  const avgContentLength = retrievedContent.reduce((sum, content) => sum + content.length, 0) / retrievedContent.length;
  const lengthScore = Math.min(avgContentLength / 200, 1.0); // Normalize to 200 chars
  
  // Factor in diversity of sources
  const diversityScore = Math.min(retrievedContent.length / 3, 1.0); // Normalize to 3 sources
  
  return Math.min(baseConfidence * 0.5 + lengthScore * 0.3 + diversityScore * 0.2, 1.0);
};
