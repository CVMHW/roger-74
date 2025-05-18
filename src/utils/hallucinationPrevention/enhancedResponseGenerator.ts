
/**
 * Enhanced Response Generator
 * 
 * Integrates RAG capabilities with response generation
 */

import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';
import { COLLECTIONS } from './dataLoader';

/**
 * Find relevant knowledge for a given input
 */
export const findRelevantKnowledge = async (
  userInput: string, 
  options: { 
    threshold?: number;
    limit?: number;
  } = {}
): Promise<string[]> => {
  const { threshold = 0.6, limit = 3 } = options;
  
  try {
    // Generate embedding for user input
    const embedding = await generateEmbedding(userInput);
    
    // Search for similar content across collections
    const knowledgeCollection = vectorDB.collection(COLLECTIONS.ROGER_KNOWLEDGE);
    const factsCollection = vectorDB.collection(COLLECTIONS.FACTS);
    
    // Get relevant knowledge
    const knowledgeResults = knowledgeCollection.findSimilar(embedding, {
      scoreThreshold: threshold,
      limit
    });
    
    // Get relevant facts
    const factResults = factsCollection.findSimilar(embedding, {
      scoreThreshold: threshold,
      limit
    });
    
    // Combine and sort by relevance
    const combined = [...knowledgeResults, ...factResults]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // Return relevant texts
    return combined.map(result => result.record.text);
  } catch (error) {
    console.error("Error finding relevant knowledge:", error);
    return [];
  }
};

/**
 * Enhance a response with relevant knowledge
 */
export const enhanceResponseWithKnowledge = async (
  responseText: string,
  userInput: string
): Promise<string> => {
  try {
    // Find relevant knowledge
    const relevantKnowledge = await findRelevantKnowledge(userInput);
    
    if (relevantKnowledge.length === 0) {
      return responseText;
    }
    
    // Natural insertion of knowledge
    const sentences = responseText.split(/(?<=[.!?])\s+/);
    
    if (sentences.length <= 2) {
      // For very short responses, prepend knowledge reference
      return `${relevantKnowledge[0]}. ${responseText}`;
    }
    
    // For longer responses, insert at a natural point
    const insertPoint = Math.min(2, sentences.length - 1);
    
    return [
      ...sentences.slice(0, insertPoint),
      relevantKnowledge[0],
      ...sentences.slice(insertPoint)
    ].join(' ');
  } catch (error) {
    console.error("Error enhancing response with knowledge:", error);
    return responseText;
  }
};
