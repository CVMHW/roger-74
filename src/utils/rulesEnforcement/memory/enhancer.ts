
/**
 * Memory enhancement utilities
 * Contains functions for enhancing responses with memory references
 */

import { getContextualMemory } from '../../nlpProcessor';
import { retrieveRelevantMemories } from '../../memory/memoryBank';
// Import our local version instead of the one from responseIntegration
import { getConversationMessageCount } from '../../memory/newConversationDetector';

/**
 * Create a natural memory reference
 * Avoids formulaic references that sound repetitive
 */
const createMemoryReference = (topic: string, emotion: string): string => {
  // Different ways to reference memories
  const memoryPhrases = [
    `I remember you mentioned ${topic}`,
    `You talked about ${topic} earlier`,
    `Earlier you shared about ${topic}`,
    `You've mentioned ${topic} before`,
    `We discussed ${topic} previously`,
  ];
  
  // More natural phrases for early conversations
  const lightMemoryPhrases = [
    `Going back to what you said about ${topic}`,
    `Thinking about what you shared about ${topic}`,
    `Reflecting on your comments about ${topic}`,
  ];
  
  // Select appropriate phrase templates based on conversation depth
  const messageCount = getConversationMessageCount();
  const phrases = messageCount < 5 ? lightMemoryPhrases : memoryPhrases;
  
  // Select a random phrase to avoid repetition
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  // Only include emotion if it's not neutral
  if (emotion !== 'neutral') {
    return `${randomPhrase} and feeling ${emotion}. `;
  }
  
  return `${randomPhrase}. `;
};

/**
 * Enhance a response with a reference to a specific memory topic
 */
export const enhanceWithTopicMemory = (
  responseText: string,
  topic: string,
  emotion: string = 'neutral'
): string => {
  // Don't add memory references if they already exist
  if (responseText.match(/I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i)) {
    return responseText;
  }
  
  // Skip topics that are too generic
  if (!topic || topic === '' || topic === 'neutral') {
    // Still add emotion reference if relevant
    if (emotion !== 'neutral') {
      const emotionPhrases = [
        `I notice you've been feeling ${emotion}. `,
        `You mentioned feeling ${emotion} before. `,
        `I remember you expressed feeling ${emotion}. `
      ];
      const randomPhrase = emotionPhrases[Math.floor(Math.random() * emotionPhrases.length)];
      return randomPhrase + responseText;
    }
    return responseText;
  }
  
  // Create a natural memory reference
  const memoryReference = createMemoryReference(topic, emotion);
  
  // Add memory reference at beginning of response
  return memoryReference + responseText;
};

/**
 * Enhance a response with relevant memories from memory bank
 */
export const enhanceWithRelevantMemory = (
  responseText: string,
  userInput: string,
  relevantMemories: any[]
): string => {
  // Don't add memory references if they already exist
  if (responseText.match(/I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i)) {
    return responseText;
  }
  
  if (relevantMemories.length > 0) {
    // Use most relevant memory for response enhancement
    const topMemory = relevantMemories[0];
    
    // Limit content length to avoid lengthy references
    const contentPreview = topMemory.content.substring(0, 25) + 
      (topMemory.content.length > 25 ? '...' : '');
    
    // Vary the phrasing to sound more natural
    const memoryPhrases = [
      `I remember you mentioned ${contentPreview} `,
      `You talked about ${contentPreview} earlier. `,
      `Earlier you shared about ${contentPreview} `,
      `From what you've told me about ${contentPreview} `,
    ];
    
    const randomPhrase = memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
    return randomPhrase + responseText;
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
  // Early conversations should have more subtle memory references
  const messageCount = getConversationMessageCount();
  
  if (messageCount < 5) {
    // For early messages, only occasionally add memory references
    if (Math.random() < 0.5) {
      return responseText;
    }
  }
  
  // Implementation without using external enhanceResponseWithRapport
  try {
    // Get relevant memories for rapport building
    const memories = retrieveRelevantMemories(userInput);
    
    if (memories.length === 0) {
      return responseText;
    }
    
    // Get first memory with content
    let memoryContent = null;
    for (const memory of memories) {
      if (typeof memory.content === 'string' && memory.content.trim().length > 0) {
        memoryContent = memory.content;
        break;
      }
    }
    
    if (!memoryContent) {
      return responseText;
    }
    
    // For short responses, add rapport at beginning
    if (responseText.length < 80) {
      return `I remember you mentioned ${memoryContent}. ${responseText}`;
    }
    
    // For longer responses, integrate naturally
    const sentences = responseText.split(/(?<=[.!?])\s+/);
    const insertPoint = Math.min(2, sentences.length - 1);
    
    return [
      ...sentences.slice(0, insertPoint),
      `I remember you mentioned ${memoryContent}.`,
      ...sentences.slice(insertPoint)
    ].join(' ');
    
  } catch (error) {
    console.error("Error enhancing with rapport:", error);
    return responseText;
  }
};
