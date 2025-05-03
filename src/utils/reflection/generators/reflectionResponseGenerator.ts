
import type { ConversationStage } from '../core/types';
import { generateContextAwareReflection } from './contextAwareGenerator';
import { correctGrammar } from '../../response/processor/grammarCorrection';

/**
 * Generate a reflection response based on user input and conversation context
 */
export const generateReflectionResponse = (
  userInput: string,
  conversationStage: ConversationStage,
  messageCount: number
): string | null => {
  // Try to generate a context-aware reflection first
  const contextReflection = generateContextAwareReflection(userInput);
  
  if (contextReflection) {
    // Apply enhanced grammar correction before returning, with userInput for length adjustment
    return correctGrammar(contextReflection, userInput);
  }
  
  // If no context-specific reflection was generated, return null
  // This will allow the calling code to fall back to other response types
  return null;
};
