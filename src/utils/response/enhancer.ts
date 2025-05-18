
/**
 * Response Enhancer
 * 
 * Enhances responses with relevant information from vector database
 */

import { generateEmbedding, isUsingSimulatedEmbeddings } from '../hallucinationPrevention/vectorEmbeddings';
import vectorDB from '../hallucinationPrevention/vectorDatabase';
import { cosineSimilarity } from '../hallucinationPrevention/vectorEmbeddings';
import { isSmallTalk, isIntroduction, isPersonalSharing } from '../masterRules';

// Configuration for response enhancement
const RAG_CONFIG = {
  similarityThreshold: 0.7,
  maxRetrievedItems: 3,
  minWordCountForQuery: 5,
  maxQueryLength: 200,
  embeddingCacheTTL: 60 * 1000, // 1 minute
};

// Simple cache for embeddings to avoid regenerating them too frequently
const embeddingCache = new Map<string, { embedding: number[], timestamp: number }>();

/**
 * Get embedding for text with caching
 */
const getEmbeddingWithCache = async (text: string): Promise<number[]> => {
  const normalizedText = text.trim().toLowerCase();
  const cachedEntry = embeddingCache.get(normalizedText);
  
  if (cachedEntry && Date.now() - cachedEntry.timestamp < RAG_CONFIG.embeddingCacheTTL) {
    return cachedEntry.embedding;
  }
  
  const embedding = await generateEmbedding(normalizedText);
  embeddingCache.set(normalizedText, { embedding, timestamp: Date.now() });
  
  // Clean old cache entries
  if (embeddingCache.size > 100) {
    const oldestEntries = [...embeddingCache.entries()]
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, 20);
    
    oldestEntries.forEach(([key]) => embeddingCache.delete(key));
  }
  
  return embedding;
};

/**
 * Generate a refined query from the user input
 */
const generateRagQuery = (userInput: string): string => {
  // Clean up the input
  const cleaned = userInput.trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s?.,!]/g, '')
    .substring(0, RAG_CONFIG.maxQueryLength);
  
  // For very short inputs, return as is
  if (cleaned.split(' ').length <= RAG_CONFIG.minWordCountForQuery) {
    return cleaned;
  }
  
  // Extract main topic from longer inputs
  const sentences = cleaned.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 1) {
    // Use the first 2 sentences as the query
    return sentences.slice(0, 2).join('. ');
  }
  
  return cleaned;
};

/**
 * Fetch related content for the user query from the vector database
 */
const fetchRelatedContent = async (
  userInput: string,
  conversationHistory: string[]
): Promise<{ retrievedContent: string[], confidence: number }> => {
  try {
    // If we're using simulated embeddings, return with low confidence
    if (isUsingSimulatedEmbeddings()) {
      console.log("Using simulated embeddings, skipping RAG content retrieval");
      return { retrievedContent: [], confidence: 0.2 };
    }
    
    // Generate a focused query
    const query = generateRagQuery(userInput);
    
    if (query.length < 10) {
      console.log("Query too short for effective RAG retrieval");
      return { retrievedContent: [], confidence: 0.3 };
    }
    
    console.log(`RAG query: "${query}"`);
    
    // Get the knowledge collection
    const knowledgeCollection = vectorDB.collection('knowledge');
    
    if (knowledgeCollection.size() === 0) {
      console.log("Knowledge collection is empty");
      return { retrievedContent: [], confidence: 0.1 };
    }
    
    // Generate embedding for the query
    const queryEmbedding = await getEmbeddingWithCache(query);
    
    // Find similar content
    const results = knowledgeCollection.findSimilar(queryEmbedding, {
      limit: RAG_CONFIG.maxRetrievedItems,
      scoreThreshold: RAG_CONFIG.similarityThreshold,
      useIndex: true
    });
    
    console.log(`Found ${results.length} relevant knowledge items`);
    
    if (results.length === 0) {
      return { retrievedContent: [], confidence: 0.3 };
    }
    
    // Extract and return the content
    const retrievedContent = results.map(result => result.record.text);
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
    
    return {
      retrievedContent,
      confidence: averageScore 
    };
  } catch (error) {
    console.error("Error in RAG content retrieval:", error);
    return { retrievedContent: [], confidence: 0.1 };
  }
};

/**
 * Blend retrieved content into the response
 */
const blendContent = (
  responseText: string, 
  retrievedContent: string[], 
  confidence: number
): string => {
  // If no content or low confidence, return original response
  if (retrievedContent.length === 0 || confidence < 0.6) {
    return responseText;
  }
  
  // For moderate confidence, add content in a separate paragraph
  if (confidence < 0.8) {
    const contentSummary = retrievedContent.join(' ');
    const insight = `Based on what I understand about this topic, ${contentSummary}`;
    
    // Add to the end if the response is short, otherwise find a good insertion point
    if (responseText.length < 200) {
      return `${responseText}\n\n${insight}`;
    } else {
      // Find a paragraph break in the second half of the response
      const insertPosition = Math.floor(responseText.length / 2);
      const insertPoint = responseText.indexOf('\n\n', insertPosition);
      
      if (insertPoint !== -1) {
        return responseText.slice(0, insertPoint) + `\n\n${insight}\n\n` + responseText.slice(insertPoint);
      } else {
        return `${responseText}\n\n${insight}`;
      }
    }
  }
  
  // For high confidence, integrate content more naturally
  return responseText;
};

/**
 * Enhances a response with memory rules, master rules, and chat log review
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextFlags: {
    isEverydaySituation?: boolean;
    isSmallTalkContext?: boolean;
    isIntroductionContext?: boolean;
    isPersonalSharingContext?: boolean;
  } = {}
): Promise<string> => {
  try {
    // Skip enhancement for certain contexts
    const {
      isEverydaySituation = false,
      isSmallTalkContext = isSmallTalk(userInput),
      isIntroductionContext = isIntroduction(userInput),
      isPersonalSharingContext = isPersonalSharing(userInput)
    } = contextFlags;
    
    // Skip RAG for certain contexts
    if (isSmallTalkContext || isIntroductionContext || messageCount < 3) {
      console.log("Skipping RAG enhancement for small talk or introduction");
      return responseText;
    }
    
    // Fetch relevant content
    const result = await fetchRelatedContent(userInput, conversationHistory);
    
    // Blend content into the response
    const enhancedResponse = blendContent(responseText, result.retrievedContent, result.confidence);
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return responseText; // Return original if enhancement fails
  }
};
