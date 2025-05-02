
/**
 * Main reflection module that integrates all reflection utilities
 */

import { ConversationStage } from './reflectionTypes';
import { identifyFeelings } from './feelingDetection';
import { createFeelingReflection, createMeaningReflection, createGeneralReflection } from './reflectionGenerators';
import { shouldUseReflection } from './reflectionStrategies';

/**
 * Generates an appropriate reflection response based on user's message
 * @param userMessage The user's message
 * @param conversationStage Current stage of conversation
 * @returns A reflection response
 */
export const generateReflectionResponse = (userMessage: string, conversationStage: ConversationStage): string => {
  try {
    // Input validation
    if (!userMessage || typeof userMessage !== 'string') {
      return "I'm here to listen. What's on your mind today?";
    }
    
    // First 10 minutes (early stages) - prioritize directly acknowledging stated feelings
    const feelings = identifyFeelings(userMessage);
    
    // If feelings were explicitly shared, always acknowledge them first
    if (feelings.length > 0) {
      const feelingReflection = createFeelingReflection(feelings, userMessage);
      // Only fall back if reflection creation fails completely
      return feelingReflection || createGeneralReflection(userMessage);
    }
    
    // If no feelings were explicitly detected, try a meaning reflection
    if (conversationStage === 'initial' || conversationStage === 'early') {
      const meaningReflection = createMeaningReflection(userMessage);
      return meaningReflection || createGeneralReflection(userMessage);
    }
    
    // In established conversations, be more selective with reflections
    const useReflection = shouldUseReflection(userMessage, conversationStage);
    
    if (useReflection) {
      const meaningReflection = createMeaningReflection(userMessage);
      return meaningReflection || createGeneralReflection(userMessage);
    }
    
    // If not using a reflection, return empty string to allow other response types
    return "";
  } catch (error) {
    console.error("Error generating reflection response:", error);
    return "I'm listening. Could you tell me more?";
  }
};

// Export all submodules for direct access
export * from './reflectionTypes';
export * from './feelingDetection';
export * from './reflectionGenerators';
export * from './reflectionStrategies';
export * from './feelingCategories';
export * from './reflectionPhrases';
export * from './reflectionPrinciples';

