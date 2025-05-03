
/**
 * Memory utilities for logotherapy integration
 */

import { MessageEntry } from './types';
import { searchMemory } from '../memory/memoryController';

/**
 * Leverage memory systems for personalized response
 */
export const leverageMemorySystems = (userInput: string): string[] => {
  console.log("UNIVERSAL LAW COMPLIANCE: Leveraging memory systems for meaning enhancement");
  
  const memories: string[] = [];
  
  try {
    // Import memory systems here to avoid circular dependencies
    const { getFiveResponseMemory } = require('../memory/fiveResponseMemory');
    const { getContextualMemory } = require('../nlpProcessor');
    
    // First, use our refactored memory system
    const relevantMemories = searchMemory({
      keywords: extractKeywords(userInput),
      role: 'patient',
      limit: 3
    });
    
    if (relevantMemories.length > 0) {
      memories.push(relevantMemories[0].content);
    }
    
    // Check FiveResponseMemory for recent context
    const fiveResponseMemory = getFiveResponseMemory();
    if (fiveResponseMemory.length > 0) {
      // Type safety: Create a proper type guard function that checks necessary props
      const isMessageEntry = (msg: any): msg is MessageEntry => {
        return 'sender' in msg && typeof msg.sender === 'string' && 'content' in msg;
      };
      
      // Apply the type guard to filter valid entries
      const validMessageEntries = fiveResponseMemory.filter(isMessageEntry);
      
      // Extract relevant patient statements from 5ResponseMemory
      const patientStatements = validMessageEntries
        .filter(msg => msg.sender === 'patient')
        .map(msg => msg.content);
      
      if (patientStatements.length > 0 && !memories.includes(patientStatements[0])) {
        memories.push(patientStatements[Math.floor(Math.random() * patientStatements.length)]);
      }
    }
    
    // Check primary memory system as fallback
    const contextualMemory = getContextualMemory(userInput);
    if (contextualMemory.dominantTopics && contextualMemory.dominantTopics.length > 0) {
      // Use this as last resort if we have no other memories
      if (memories.length === 0) {
        memories.push(contextualMemory.dominantTopics[0]);
      }
    }
  } catch (error) {
    console.error('Error accessing memory systems in logotherapy integration:', error);
  }
  
  return memories;
};

/**
 * Extract keywords from user input for memory search
 */
const extractKeywords = (text: string): string[] => {
  // Split by non-word characters and filter out common words and short words
  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'have', 'what', 'when', 'where', 'would', 'could', 'should', 'about'].includes(word)
    );
};

/**
 * Incorporate memories into logotherapy response
 */
export const incorporateMemories = (response: string, memories: string[]): string => {
  if (!memories || memories.length === 0) return response;
  
  const memory = memories[Math.floor(Math.random() * memories.length)];
  
  // Avoid direct reference if the memory content isn't substantive
  if (!memory || memory.length < 5) return response;
  
  const memoryReferences = [
    `This connects to what you shared earlier about ${memory.substring(0, 15)}...`,
    `I remember you mentioned ${memory.substring(0, 15)}... which relates to this idea of meaning.`,
    `Considering what you said about ${memory.substring(0, 15)}..., this perspective might be helpful.`,
    `This meaning-centered approach seems relevant to your experience with ${memory.substring(0, 15)}...`
  ];
  
  const reference = memoryReferences[Math.floor(Math.random() * memoryReferences.length)];
  
  // Insert the memory reference at a natural point in the response
  const sentences = response.split(/(?<=[.?!])\s+/);
  
  if (sentences.length <= 2) {
    return `${reference} ${response}`;
  }
  
  const insertPoint = Math.floor(sentences.length / 2);
  const firstPart = sentences.slice(0, insertPoint).join(' ');
  const secondPart = sentences.slice(insertPoint).join(' ');
  
  return `${firstPart} ${reference} ${secondPart}`;
};
