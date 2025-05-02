
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
  // First 10 minutes (early stages) - use more reflections
  if (conversationStage === 'initial' || conversationStage === 'early') {
    const feelings = identifyFeelings(userMessage);
    
    // Alternate between feeling and meaning reflections
    if (feelings.length > 0) {
      return createFeelingReflection(feelings, userMessage);
    } else {
      return createMeaningReflection(userMessage);
    }
  } 
  
  // In established conversations, mix reflections with other response types
  const feelings = identifyFeelings(userMessage);
  const useReflection = shouldUseReflection(userMessage, conversationStage);
  
  if (useReflection) {
    // Randomly choose between feeling and meaning reflections
    if (feelings.length > 0 && Math.random() > 0.5) {
      return createFeelingReflection(feelings, userMessage);
    } else {
      return createMeaningReflection(userMessage);
    }
  }
  
  // If not using a reflection, return empty string to allow other response types
  return "";
};

// Export all submodules for direct access
export * from './reflectionTypes';
export * from './feelingDetection';
export * from './reflectionGenerators';
export * from './reflectionStrategies';
export * from './feelingCategories';
export * from './reflectionPhrases';
export * from './reflectionPrinciples';
