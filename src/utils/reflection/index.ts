
/**
 * Reflection Module
 * 
 * Provides reflection functionality with integrated memory utilization
 * to ensure Roger demonstrates understanding of the patient's concerns.
 */

import { generateReflectionResponse } from './generators/reflectionResponseGenerator';
import { ConversationStage } from './reflectionTypes';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { getContextualMemory } from '../nlpProcessor';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';
import { enhanceReflectionResponse } from '../response/responseIntegration';

/**
 * Generate memory-enhanced reflection response
 */
export const generateMemoryEnhancedReflection = (
  userInput: string,
  conversationStage: ConversationStage,
  messageCount: number
): string | null => {
  try {
    console.log("REFLECTION: Generating memory-enhanced reflection");
    
    // First try to generate a standard reflection
    const baseReflection = generateReflectionResponse(userInput, conversationStage, messageCount);
    
    if (!baseReflection) {
      return null;
    }
    
    // Enhance the reflection with memory
    return enhanceReflectionResponse(baseReflection, userInput);
    
  } catch (error) {
    console.error('Error generating memory-enhanced reflection:', error);
    return null;
  }
};

/**
 * Get deep reflection based on conversation history and memory
 */
export const getDeepReflection = (
  userInput: string,
  conversationHistory: string[]
): string | null => {
  try {
    console.log("REFLECTION: Generating deep reflection with memory");
    
    // Try to get relevant memories first
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    if (relevantMemories.length > 0) {
      // Use most relevant memory for deep reflection
      const topMemory = relevantMemories[0];
      
      // Create reflection based on memory content
      return `I remember you mentioned ${topMemory.content.substring(0, 30)}... As you share this now, I wonder if you see any connection between these experiences?`;
    }
    
    // Fall back to contextual memory
    const memory = getContextualMemory(userInput);
    
    if (memory.dominantTopics.length > 0 || memory.dominantEmotion !== 'neutral') {
      const topicPhrase = memory.dominantTopics.length > 0 
        ? `talking about ${memory.dominantTopics[0]}`
        : 'sharing your thoughts';
      
      const emotionPhrase = memory.dominantEmotion !== 'neutral'
        ? `feeling ${memory.dominantEmotion}`
        : 'having these experiences';
      
      return `I remember you ${topicPhrase} and ${emotionPhrase}. How do you feel these experiences have been shaping your perspective?`;
    }
    
    // Final fallback - check 5ResponseMemory
    const fiveMemory = getFiveResponseMemory();
    const patientEntries = fiveMemory
      .filter(entry => entry.role === 'patient')
      .map(entry => entry.content);
    
    if (patientEntries.length > 0) {
      // Use the second most recent message to avoid repetition
      const previousMessage = patientEntries.length > 1 ? patientEntries[1] : patientEntries[0];
      
      return `Earlier you mentioned "${previousMessage.substring(0, 30)}..." I'm curious how that relates to what you're sharing now?`;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating deep reflection:', error);
    return null;
  }
};

export { 
  generateReflectionResponse,
  ConversationStage
};
