
/**
 * Query Expansion System
 * 
 * Implements advanced query expansion techniques to improve retrieval
 * by adding related terms, handling synonyms, and detecting key concepts
 */

import { 
  generateEmbedding, 
  findMostSimilar, 
  cosineSimilarity 
} from './vectorEmbeddings';

// Pre-defined domain-specific synonyms for mental health contexts
const MENTAL_HEALTH_SYNONYMS: Record<string, string[]> = {
  "sad": ["depressed", "unhappy", "melancholy", "blue", "down", "sorrowful"],
  "depressed": ["sad", "despondent", "hopeless", "dejected", "gloomy", "miserable"],
  "anxiety": ["worry", "nervousness", "unease", "fear", "apprehension", "stress"],
  "stressed": ["pressured", "tense", "overwhelmed", "strained", "taxed"],
  "angry": ["upset", "irritated", "frustrated", "furious", "enraged", "hostile"],
  "trauma": ["ptsd", "traumatic experience", "distressing event", "psychological injury"],
  "therapy": ["counseling", "treatment", "psychotherapy", "mental health support"],
  "suicidal": ["self-harm", "wanting to die", "ending life", "suicide"],
  "addiction": ["substance abuse", "dependency", "substance use disorder", "habit"],
  "alcohol": ["drinking", "alcoholism", "liquor", "booze"],
  "drug": ["narcotic", "substance", "medication", "pill"],
  "relationship": ["marriage", "partnership", "dating", "couple"]
};

/**
 * Options for query expansion
 */
export interface QueryExpansionOptions {
  // Maximum number of expanded terms to add
  maxExpandedTerms?: number;
  // Include synonyms in expansion
  includeSynonyms?: boolean;
  // Include concept detection in expansion
  includeConceptDetection?: boolean;
  // Include word embeddings based expansion
  includeEmbeddingExpansion?: boolean;
  // Context terms to boost relevance
  contextTerms?: string[];
  // Minimum length of terms to consider for expansion
  minTermLength?: number;
}

/**
 * Result of query expansion
 */
export interface QueryExpansionResult {
  // Original query
  originalQuery: string;
  // Expanded query with additional terms
  expandedQuery: string;
  // Extracted topics from original query
  topics: string[];
  // Extended topics after expansion
  expandedTopics: string[];
  // Detected concepts
  concepts: string[];
  // Synonym mappings used in expansion
  synonymMappings?: Record<string, string[]>;
}

/**
 * Expands a query with synonyms, related terms and key concepts
 * using multiple expansion techniques
 */
export const expandQuery = async (
  query: string,
  options: QueryExpansionOptions = {}
): Promise<QueryExpansionResult> => {
  try {
    const {
      maxExpandedTerms = 5,
      includeSynonyms = true,
      includeConceptDetection = true,
      includeEmbeddingExpansion = true,
      contextTerms = [],
      minTermLength = 4
    } = options;
    
    // Extract original topics/terms
    const topics = extractTerms(query, minTermLength);
    const expandedTopics = [...topics];
    const concepts: string[] = [];
    const synonymMappings: Record<string, string[]> = {};
    
    // 1. Add synonyms if enabled
    if (includeSynonyms && topics.length > 0) {
      topics.forEach(term => {
        const synonyms = findSynonyms(term);
        if (synonyms.length > 0) {
          // Add best synonym to expanded topics
          expandedTopics.push(...synonyms.slice(0, 2));
          synonymMappings[term] = synonyms;
        }
      });
    }
    
    // 2. Detect concepts based on term combinations
    if (includeConceptDetection && topics.length > 0) {
      const detectedConcepts = detectConcepts(topics, query);
      concepts.push(...detectedConcepts);
      expandedTopics.push(...detectedConcepts);
    }
    
    // 3. Use embeddings to find related terms
    if (includeEmbeddingExpansion && topics.length > 0) {
      try {
        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);
        
        // Combine with context terms if available
        if (contextTerms.length > 0) {
          expandedTopics.push(...contextTerms);
        }
        
        // Use embedding similarity to filter the most relevant expanded terms
        const allCandidateTerms = [...new Set([...expandedTopics, ...concepts])];
        
        // Generate embeddings for all candidate terms
        const termEmbeddings = await Promise.all(
          allCandidateTerms.map(async term => ({
            term,
            embedding: await generateEmbedding(term)
          }))
        );
        
        // Score each term by similarity to query
        const scoredTerms = termEmbeddings.map(item => ({
          term: item.term,
          score: cosineSimilarity(queryEmbedding, item.embedding)
        }));
        
        // Sort by similarity score
        scoredTerms.sort((a, b) => b.score - a.score);
        
        // Take the top terms
        const selectedTerms = scoredTerms
          .slice(0, maxExpandedTerms)
          .map(item => item.term);
          
        // Use the selected terms as the final expanded topics
        const uniqueExpandedTopics = [...new Set([...topics, ...selectedTerms])];
        
        // Build the expanded query string
        const expandedQuery = uniqueExpandedTopics.join(" ");
        
        return {
          originalQuery: query,
          expandedQuery,
          topics,
          expandedTopics: uniqueExpandedTopics,
          concepts,
          synonymMappings
        };
      } catch (error) {
        console.error("Error in embedding-based query expansion:", error);
      }
    }
    
    // Fallback if embedding expansion fails
    const uniqueExpandedTopics = [...new Set(expandedTopics)];
    const expandedQuery = uniqueExpandedTopics.join(" ");
    
    return {
      originalQuery: query,
      expandedQuery,
      topics,
      expandedTopics: uniqueExpandedTopics,
      concepts,
      synonymMappings
    };
  } catch (error) {
    console.error("Error in query expansion:", error);
    
    // Return minimal result on error
    return {
      originalQuery: query,
      expandedQuery: query,
      topics: [],
      expandedTopics: [],
      concepts: []
    };
  }
};

/**
 * Extract significant terms from a query
 */
export const extractTerms = (
  text: string, 
  minLength: number = 4
): string[] => {
  // Stop words to filter out
  const stopWords = new Set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", 
    "you", "your", "yours", "yourself", "yourselves", 
    "he", "him", "his", "himself", "she", "her", "hers", "herself", 
    "it", "its", "itself", "they", "them", "their", "theirs", "themselves", 
    "what", "which", "who", "whom", "this", "that", "these", "those", 
    "am", "is", "are", "was", "were", "be", "been", "being", 
    "have", "has", "had", "having", "do", "does", "did", "doing", 
    "a", "an", "the", "and", "but", "if", "or", "because", "as", 
    "until", "while", "of", "at", "by", "for", "with", "about", "against", 
    "between", "into", "through", "during", "before", "after", "above", 
    "below", "to", "from", "up", "down", "in", "out", "on", "off", 
    "over", "under", "again", "further", "then", "once", "here", "there", 
    "when", "where", "why", "how", "all", "any", "both", "each", "few", 
    "more", "most", "other", "some", "such", "no", "nor", "not", "only", 
    "own", "same", "so", "than", "too", "very", "can", "will", "just", "don", 
    "should", "now", "also", "get", "got", "like", "make", "way", "even", 
    "well", "back", "much", "many"
  ]);
  
  // Extract terms, removing punctuation and stopwords
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length >= minLength && 
      !stopWords.has(word) &&
      !/^\d+$/.test(word) // Filter out numbers
    );
};

/**
 * Find synonyms for a given term
 */
export const findSynonyms = (term: string): string[] => {
  // Check our mental health specific synonyms first
  if (term in MENTAL_HEALTH_SYNONYMS) {
    return MENTAL_HEALTH_SYNONYMS[term];
  }
  
  // Check variants (stemming-like approach)
  for (const [key, synonyms] of Object.entries(MENTAL_HEALTH_SYNONYMS)) {
    // Check if term is a stem of any key
    if (key.startsWith(term) || term.startsWith(key)) {
      return synonyms;
    }
    
    // Check if term is in the synonym list
    if (synonyms.some(s => s.includes(term) || term.includes(s))) {
      return [...synonyms, key].filter(s => s !== term);
    }
  }
  
  return [];
};

/**
 * Detect mental health concepts from terms and query
 */
export const detectConcepts = (
  terms: string[],
  fullQuery: string
): string[] => {
  const concepts: string[] = [];
  
  // Key mental health concepts with detection patterns
  const conceptPatterns: Array<{concept: string, patterns: RegExp[]}> = [
    {
      concept: "depression",
      patterns: [
        /depress(ed|ion|ive)?/i,
        /feeling (sad|down|low|blue)/i,
        /(lack|no) (energy|motivation)/i,
        /don't (feel|want|care)/i
      ]
    },
    {
      concept: "anxiety",
      patterns: [
        /anxi(ety|ous)/i,
        /(nervous|worried|stress)/i,
        /panic attack/i,
        /(fear|afraid|scared)/i
      ]
    },
    {
      concept: "trauma",
      patterns: [
        /trauma/i,
        /ptsd/i,
        /(flash|night)mares/i,
        /bad (memory|experience)/i,
        /something happened/i
      ]
    },
    {
      concept: "self-esteem",
      patterns: [
        /self(-|\s)?(esteem|worth|image|confidence)/i,
        /feel(ing)? (bad|ugly|worthless|unworthy) about (myself|me)/i,
        /hate (myself|my body)/i
      ]
    },
    {
      concept: "grief",
      patterns: [
        /grief|grieving/i,
        /loss of/i,
        /(lost|died|passed|death)/i,
        /cope with/i
      ]
    },
    {
      concept: "relationship issues",
      patterns: [
        /(relationship|marriage) (problem|issue|trouble)/i,
        /(partner|spouse|boyfriend|girlfriend)/i,
        /(break(-|\s)?up|divorce)/i
      ]
    }
  ];
  
  // Check for concept patterns in full query
  conceptPatterns.forEach(({ concept, patterns }) => {
    if (patterns.some(pattern => pattern.test(fullQuery))) {
      concepts.push(concept);
    }
  });
  
  return concepts;
};

/**
 * Generate hybrid query expansion with both semantic and lexical components
 */
export const generateHybridQueryExpansion = async (
  query: string,
  conversationContext: string[] = []
): Promise<QueryExpansionResult> => {
  try {
    // Extract context terms from recent conversation
    const contextTerms: string[] = [];
    if (conversationContext.length > 0) {
      // Extract terms from the most recent context messages (up to 2)
      const recentContext = conversationContext.slice(0, 2);
      for (const contextMsg of recentContext) {
        const terms = extractTerms(contextMsg, 4);
        contextTerms.push(...terms.slice(0, 3)); // Take up to 3 terms per message
      }
    }
    
    // Expand the query with context terms
    return expandQuery(query, {
      maxExpandedTerms: 10,
      includeSynonyms: true,
      includeConceptDetection: true,
      includeEmbeddingExpansion: true,
      contextTerms,
      minTermLength: 4
    });
  } catch (error) {
    console.error("Error in hybrid query expansion:", error);
    return {
      originalQuery: query,
      expandedQuery: query,
      topics: extractTerms(query),
      expandedTopics: extractTerms(query),
      concepts: []
    };
  }
};
