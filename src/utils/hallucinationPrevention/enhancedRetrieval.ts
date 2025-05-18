
/**
 * Enhanced Retrieval System
 * 
 * Integrates advanced RAG features:
 * - Hybrid search (vector + keyword)
 * - Cross-encoder reranking
 * - Session-persistent vector store
 * - Advanced query expansion
 */

import { 
  retrieveFactualGrounding, 
  MemoryPiece 
} from './retrieval';
import { 
  performHybridSearch 
} from './hybridSearch';
import { 
  rerankResults,
  retrieveWithReranking,
  rerankWithCrossAttention
} from './reranker';
import { 
  generateEmbedding, 
  cosineSimilarity 
} from './vectorEmbeddings';
import { COLLECTIONS } from './dataLoader/types';

// For query expansion
const EXPANSION_MIN_WORD_LENGTH = 4;
const EXPANSION_MAX_PHRASES = 8;

/**
 * Enhanced retrieval with hybrid search and reranking
 */
export const retrieveEnhanced = async (
  query: string,
  topics: string[],
  options: {
    limit?: number;
    collections?: string[];
    rerank?: boolean;
    expandQuery?: boolean;
    conversationContext?: string[];
  } = {}
): Promise<MemoryPiece[]> => {
  const { 
    limit = 5, 
    collections = [COLLECTIONS.FACTS, COLLECTIONS.ROGER_KNOWLEDGE],
    rerank = true,
    expandQuery = true,
    conversationContext = []
  } = options;
  
  try {
    // Expand query with topics for better recall
    let expandedQuery = query;
    
    if (expandQuery) {
      // Advanced query expansion
      const expandedTopics = await generateExpandedQuery(query, topics);
      expandedQuery = `${query} ${expandedTopics.join(" ")}`;
      console.log("Enhanced query:", expandedQuery);
    }
    
    // 1. Perform hybrid search to get candidates
    const hybridResults = await performHybridSearch(expandedQuery, collections, { 
      limit: limit * 3, // Get more candidates for reranking
      vectorWeight: 0.7,
      keywordWeight: 0.3
    });
    
    // 2. Perform cross-encoder reranking if enabled and we have results
    if (rerank && hybridResults.length > 0) {
      return await rerankWithCrossAttention(query, hybridResults, {
        finalLimit: limit,
        contextQueries: conversationContext
      });
    }
    
    // Return hybrid results directly if reranking is disabled or no results
    return hybridResults.slice(0, limit);
    
  } catch (error) {
    console.error("Error in enhanced retrieval:", error);
    
    // Fallback to standard retrieval
    return retrieveFactualGrounding(topics, limit);
  }
};

/**
 * Generate expanded query using advanced techniques:
 * - Named entity recognition
 * - Word variant generation
 * - Phrase analysis
 * - Contextual expansion
 */
export const generateExpandedQuery = async (
  query: string,
  initialTopics: string[] = []
): Promise<string[]> => {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
    "by", "about", "as", "of", "is", "are", "am", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "can", "could", "will",
    "would", "should", "shall", "may", "might", "must", "i", "you", "he", "she",
    "it", "we", "they", "me", "him", "her", "us", "them", "this", "that", "these",
    "those", "my", "your", "his", "its", "our", "their", "mine", "yours", "hers",
    "ours", "theirs"
  ]);
  
  // Result sets with scores
  const expansionResults = new Map<string, number>();
  
  // 1. Extract significant terms (non-stopwords longer than min length)
  const terms = query.toLowerCase()
    .split(/\W+/)
    .filter(term => term.length >= EXPANSION_MIN_WORD_LENGTH && !stopWords.has(term));
    
  // Add terms with high score
  terms.forEach(term => {
    expansionResults.set(term, 1.0);
  });
  
  // 2. Extract word variants (singular/plural, different tenses)
  const variants = extractWordVariants(terms);
  variants.forEach((variant, baseWord) => {
    variant.forEach(v => {
      if (!expansionResults.has(v)) {
        expansionResults.set(v, 0.8);
      }
    });
  });
  
  // 3. Extract multi-word phrases
  const phrases = extractPhrases(query, stopWords);
  phrases.forEach(phrase => {
    if (!expansionResults.has(phrase)) {
      // Higher score for longer phrases
      const wordCount = phrase.split(/\s+/).length;
      const phraseScore = 0.9 + (wordCount * 0.05); // Higher score for longer phrases
      expansionResults.set(phrase, Math.min(1.0, phraseScore));
    }
  });
  
  // 4. Add initial topics if they have sufficient quality
  initialTopics.forEach(topic => {
    if (topic.length >= EXPANSION_MIN_WORD_LENGTH && !expansionResults.has(topic)) {
      expansionResults.set(topic, 0.9);
    }
  });
  
  // 5. Named entity detection (simplified)
  const potentialEntities = extractPotentialEntities(query);
  potentialEntities.forEach(entity => {
    if (!expansionResults.has(entity)) {
      expansionResults.set(entity, 0.95); // High score for entities
    }
  });
  
  // Sort by score and limit the number of expansions
  const sortedExpansions = Array.from(expansionResults.entries())
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, EXPANSION_MAX_PHRASES);
  
  return sortedExpansions;
};

/**
 * Extract word variants like plurals and different verb forms
 */
function extractWordVariants(words: string[]): Map<string, string[]> {
  const variants = new Map<string, string[]>();
  
  words.forEach(word => {
    const wordVariants: string[] = [];
    
    // Simple plural/singular
    if (word.endsWith('s')) {
      const singular = word.slice(0, -1);
      if (singular.length >= EXPANSION_MIN_WORD_LENGTH) {
        wordVariants.push(singular);
      }
    } else {
      wordVariants.push(`${word}s`);
    }
    
    // Simple verb forms
    if (word.endsWith('ing')) {
      const base = word.slice(0, -3);
      if (base.length >= EXPANSION_MIN_WORD_LENGTH) {
        wordVariants.push(base);
        wordVariants.push(`${base}ed`);
      }
    } else if (word.endsWith('ed')) {
      const base = word.slice(0, -2);
      if (base.length >= EXPANSION_MIN_WORD_LENGTH) {
        wordVariants.push(base);
        wordVariants.push(`${base}ing`);
      }
    }
    
    variants.set(word, wordVariants);
  });
  
  return variants;
}

/**
 * Extract phrases from text
 */
function extractPhrases(text: string, stopWords: Set<string>): string[] {
  const phrases: string[] = [];
  const words = text.toLowerCase().split(/\W+/);
  
  // Generate 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i+1].length > 2 && 
        !stopWords.has(words[i]) && !stopWords.has(words[i+1])) {
      phrases.push(`${words[i]} ${words[i+1]}`);
    }
  }
  
  // Generate 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i+2].length > 2 && 
        !stopWords.has(words[i]) && !stopWords.has(words[i+2])) {
      phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
  }
  
  return phrases;
}

/**
 * Extract potential named entities (simplified implementation)
 */
function extractPotentialEntities(text: string): string[] {
  const entities: string[] = [];
  
  // Simple capitalized phrases extraction
  const matches = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g);
  if (matches) {
    entities.push(...matches);
  }
  
  return entities;
}

/**
 * Extract topics and entities for query expansion
 * Legacy method for backward compatibility
 */
export const expandQuery = (query: string): string[] => {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
    "by", "about", "as", "of", "is", "are", "am", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "can", "could", "will",
    "would", "should", "shall", "may", "might", "must", "i", "you", "he", "she",
    "it", "we", "they", "me", "him", "her", "us", "them", "this", "that", "these",
    "those", "my", "your", "his", "its", "our", "their", "mine", "yours", "hers",
    "ours", "theirs"
  ]);
  
  // Extract significant terms (non-stopwords longer than 3 chars)
  const terms = query.toLowerCase()
    .split(/\W+/)
    .filter(term => term.length > 3 && !stopWords.has(term));
  
  // Extract 2-word and 3-word phrases
  const phrases: string[] = [];
  const words = query.toLowerCase().split(/\W+/);
  
  // Generate 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i+1].length > 2) {
      phrases.push(`${words[i]} ${words[i+1]}`);
    }
  }
  
  // Generate 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 2 && words[i+1].length > 2 && words[i+2].length > 2) {
      phrases.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
  }
  
  // Combine terms and phrases, removing duplicates
  return Array.from(new Set([...terms, ...phrases]));
};

/**
 * Natural language integration of retrieved content into responses
 * with improved placement logic
 */
export const augmentResponseWithEnhancedRetrieval = async (
  response: string,
  userInput: string,
  retrievedContent: MemoryPiece[]
): Promise<string> => {
  // If no content retrieved, return original response
  if (!retrievedContent || retrievedContent.length === 0) {
    return response;
  }
  
  try {
    // Filter out low quality content
    const qualityThreshold = 0.5;
    const qualityContent = retrievedContent.filter(content => 
      (content.importance || 0) >= qualityThreshold
    );
    
    // If no quality content remains, return original
    if (qualityContent.length === 0) {
      return response;
    }
    
    // Get the top memory
    const topMemory = qualityContent[0].content;
    
    // Skip if response already contains this content
    if (response.includes(topMemory)) {
      return response;
    }
    
    // Generate embedding for the memory to find best insertion point
    const memoryEmbedding = await generateEmbedding(topMemory);
    
    // Split response into semantic units (paragraphs or sentence groups)
    const semanticUnits = splitIntoSemanticUnits(response);
    
    if (semanticUnits.length <= 1) {
      // Very short response, just prepend with memory
      return `${topMemory} ${response}`;
    }
    
    // Find the best semantic unit to attach the memory to
    let bestUnitIndex = 0;
    let bestScore = -1;
    
    try {
      // Generate embeddings for each semantic unit
      const unitEmbeddings = await Promise.all(
        semanticUnits.map(unit => generateEmbedding(unit))
      );
      
      // Find unit with highest semantic similarity to memory
      unitEmbeddings.forEach((embedding, index) => {
        const similarity = cosineSimilarity(memoryEmbedding, embedding);
        if (similarity > bestScore) {
          bestScore = similarity;
          bestUnitIndex = index;
        }
      });
    } catch (error) {
      console.error("Error finding best insertion point:", error);
      // Default to inserting after first unit
      bestUnitIndex = 0;
    }
    
    // Generate a contextually appropriate transition phrase
    const transitionPhrase = generateTransitionPhrase(topMemory, semanticUnits[bestUnitIndex]);
    
    // Insert memory at best position with natural transition
    const enhancedUnits = [
      ...semanticUnits.slice(0, bestUnitIndex + 1),
      `${transitionPhrase}${topMemory}`,
      ...semanticUnits.slice(bestUnitIndex + 1)
    ];
    
    return enhancedUnits.join(' ');
    
  } catch (error) {
    console.error("Error augmenting response:", error);
    return response;
  }
};

/**
 * Split text into semantic units (paragraphs or multi-sentence groups)
 */
function splitIntoSemanticUnits(text: string): string[] {
  // First try to split by paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  if (paragraphs.length > 1) {
    return paragraphs;
  }
  
  // If no paragraphs, split into sentence groups
  const sentences = text.split(/(?<=[.!?])\s+/);
  const units: string[] = [];
  
  // Group 2-3 sentences together as semantic units
  for (let i = 0; i < sentences.length; i += 2) {
    if (i + 1 < sentences.length) {
      units.push(`${sentences[i]} ${sentences[i + 1]}`);
    } else {
      units.push(sentences[i]);
    }
  }
  
  return units;
}

/**
 * Generate contextually appropriate transition phrase
 */
function generateTransitionPhrase(memory: string, context: string): string {
  const memoryLower = memory.toLowerCase();
  
  // Choose transition based on content pattern matching
  if (memoryLower.includes("feel") || memoryLower.includes("emotion")) {
    return "Reflecting on your feelings, ";
  } else if (memoryLower.includes("think") || memoryLower.includes("thought")) {
    return "Building on your thoughts, ";
  } else if (memoryLower.includes("situation") || memoryLower.includes("experience")) {
    return "Considering your situation, ";
  } else if (memoryLower.includes("problem") || memoryLower.includes("issue")) {
    return "Regarding the challenge you mentioned, ";
  } else if (memoryLower.includes("hope") || memoryLower.includes("goal") || memoryLower.includes("future")) {
    return "Looking toward the future, ";
  } else {
    // Default transition
    return "Based on our conversation, ";
  }
}
