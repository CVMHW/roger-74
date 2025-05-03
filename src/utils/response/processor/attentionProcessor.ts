
/**
 * Attention Processor
 * 
 * Processes responses using multi-head attention to focus on relevant context
 */

import { MemoryPiece } from '../../memory/memoryBank';
import { retrieveWithMultiHeadAttention } from '../../memory/multiHeadAttention';

/**
 * Process a response using multi-head attention
 */
export const processWithAttention = (
  responseText: string,
  userInput: string,
  memories: MemoryPiece[]
): string => {
  try {
    // If no memories available, return original response
    if (!memories || memories.length === 0) {
      return responseText;
    }
    
    // Use multi-head attention to retrieve context
    const attentionResult = retrieveWithMultiHeadAttention(userInput, memories);
    
    // If no relevant context found, return original
    if (!attentionResult || attentionResult.length === 0) {
      return responseText;
    }
    
    // Use the most relevant memory to enhance the response
    const topMemory = attentionResult[0];
    
    // Check if the response already contains this memory
    if (responseText.includes(topMemory.content)) {
      return responseText;
    }
    
    // For short responses, simply prepend memory reference
    if (responseText.length < 100) {
      return `I remember you mentioned ${topMemory.content}. ${responseText}`;
    }
    
    // For longer responses, insert at a natural point
    const sentences = responseText.split(/(?<=[.!?])\s+/);
    const insertPoint = Math.min(2, sentences.length - 1);
    
    return [
      ...sentences.slice(0, insertPoint),
      `I recall you shared about ${topMemory.content}.`,
      ...sentences.slice(insertPoint)
    ].join(' ');
    
  } catch (error) {
    console.error("Error processing with attention:", error);
    return responseText;
  }
};

export default processWithAttention;
