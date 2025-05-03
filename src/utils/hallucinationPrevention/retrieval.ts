
/**
 * Retrieval-Augmented Generation (RAG) System
 * 
 * Implements retrieval augmentation techniques to ground responses
 * in factual information from conversation history.
 */

import { retrieveRelevantMemories } from '../memory/memoryBank';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';

export interface RetrievalResult {
  retrievedContent: string[];
  relevanceScores: number[];
  sourceTypes: ('memory' | 'history' | 'five_response')[];
}

/**
 * Perform retrieval augmentation for the current response
 * Gathers relevant information to ground the response
 */
export const retrieveAugmentation = (
  userInput: string,
  conversationHistory: string[]
): RetrievalResult => {
  console.log("RAG: Retrieving information to augment response generation");
  
  const retrievedContent: string[] = [];
  const relevanceScores: number[] = [];
  const sourceTypes: ('memory' | 'history' | 'five_response')[] = [];
  
  // Get relevant memories from memory bank
  const relevantMemories = retrieveRelevantMemories(userInput);
  for (const memory of relevantMemories) {
    retrievedContent.push(memory.content);
    relevanceScores.push(memory.importance);
    sourceTypes.push('memory');
  }
  
  // Get recent history for context
  const recentHistory = conversationHistory.slice(-4);
  for (const message of recentHistory) {
    // Calculate basic relevance score based on term overlap
    const relevance = calculateTermOverlap(userInput, message);
    
    if (relevance > 0.2) { // Only include if somewhat relevant
      retrievedContent.push(message);
      relevanceScores.push(relevance);
      sourceTypes.push('history');
    }
  }
  
  // Add backup from 5ResponseMemory
  const fiveResponseMemory = getFiveResponseMemory().filter(m => m.role === 'patient');
  for (const memory of fiveResponseMemory) {
    const relevance = calculateTermOverlap(userInput, memory.content);
    
    if (relevance > 0.3) { // Higher threshold for five_response memory
      retrievedContent.push(memory.content);
      relevanceScores.push(relevance);
      sourceTypes.push('five_response');
    }
  }
  
  // Sort by relevance score
  const indices = relevanceScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.index);
  
  return {
    retrievedContent: indices.map(i => retrievedContent[i]),
    relevanceScores: indices.map(i => relevanceScores[i]),
    sourceTypes: indices.map(i => sourceTypes[i])
  };
};

/**
 * Calculate term overlap between query and document
 * Simple relevance scoring function
 */
const calculateTermOverlap = (query: string, document: string): number => {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const documentLower = document.toLowerCase();
  
  let matchCount = 0;
  for (const term of queryTerms) {
    // Only consider meaningful terms (3+ chars)
    if (term.length > 2 && documentLower.includes(term)) {
      matchCount++;
    }
  }
  
  // Normalize by query length
  return queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
};

/**
 * Augment a response with retrieved information
 * @param responseText Initial response text
 * @param retrievalResult Result from retrieval process
 * @returns Augmented response with better factual grounding
 */
export const augmentResponseWithRetrieval = (
  responseText: string,
  retrievalResult: RetrievalResult
): string => {
  // If no retrieval results or already strong response, return original
  if (retrievalResult.retrievedContent.length === 0 || 
      responseText.includes("you mentioned") || 
      responseText.includes("I remember")) {
    return responseText;
  }
  
  // Get top relevant content
  const topRetrieval = retrievalResult.retrievedContent[0];
  const topRelevance = retrievalResult.relevanceScores[0];
  const topSourceType = retrievalResult.sourceTypes[0];
  
  // Only augment if we have relevant content
  if (topRelevance < 0.4) {
    return responseText;
  }
  
  // Extract key phrases from retrieval content
  const keyPhrases = extractKeyPhrases(topRetrieval);
  
  if (keyPhrases.length === 0) {
    return responseText;
  }
  
  // Create memory reference
  const memoryReference = topSourceType === 'memory' 
    ? `I remember you mentioned ${keyPhrases[0]}. `
    : `You shared that ${keyPhrases[0]}. `;
  
  // Add memory reference to beginning of response if not already there
  if (!responseText.includes(keyPhrases[0])) {
    return memoryReference + responseText;
  }
  
  return responseText;
};

/**
 * Extract key phrases from retrieval content
 */
const extractKeyPhrases = (content: string): string[] => {
  // Split into sentences
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Initialize result
  const keyPhrases: string[] = [];
  
  // Process each sentence
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    // Skip very short sentences
    if (trimmed.length < 10) continue;
    
    // Skip sentences with first-person pronouns (likely from Roger)
    if (/^I |^I'm |^I've |^I'll /i.test(trimmed)) continue;
    
    // Get key information (first 40 chars or less)
    keyPhrases.push(trimmed.length > 40 ? trimmed.substring(0, 40) + "..." : trimmed);
  }
  
  return keyPhrases;
};
