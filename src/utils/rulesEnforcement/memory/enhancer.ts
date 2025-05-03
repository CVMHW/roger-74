
/**
 * Memory enhancement utilities
 * Contains functions for enhancing responses with memory references
 */

import { getContextualMemory } from '../../nlpProcessor';
import { retrieveRelevantMemories } from '../../memory/memoryBank';
import { enhanceResponseWithRapport } from '../../response/responseIntegration';

/**
 * Enhance a response with a reference to a specific memory topic
 */
export const enhanceWithTopicMemory = (
  responseText: string,
  topic: string,
  emotion: string = 'neutral'
): string => {
  const topicPhrase = topic ? `talking about ${topic}` : 'sharing your thoughts';
  
  const emotionPhrase = emotion !== 'neutral'
    ? `feeling ${emotion}`
    : 'having these experiences';
  
  return `I remember you ${topicPhrase} and ${emotionPhrase}. ${responseText}`;
};

/**
 * Enhance a response with relevant memories from memory bank
 */
export const enhanceWithRelevantMemory = (
  responseText: string,
  userInput: string,
  relevantMemories: any[]
): string => {
  if (relevantMemories.length > 0) {
    // Use most relevant memory for response enhancement
    const topMemory = relevantMemories[0];
    
    // Enhance response based on memory content (truncate to avoid excessively long references)
    return `I remember you mentioned ${topMemory.content.substring(0, 30)}... ${responseText}`;
  }
  
  return responseText;
};

/**
 * Apply rapport enhancement using existing response integration system
 */
export const enhanceWithRapport = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  return enhanceResponseWithRapport(responseText, userInput, 0, conversationHistory);
};
