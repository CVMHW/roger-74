/**
 * Main reflection module that integrates all reflection utilities
 */

import { ConversationStage, DevelopmentalStage } from './reflectionTypes';
import { identifyFeelings } from './feelingDetection';
import { createFeelingReflection, createMeaningReflection, createGeneralReflection } from './reflectionGenerators';
import { shouldUseReflection, detectDevelopmentalStage, generateAgeAppropriateReflection } from './reflectionStrategies';
import { generateConversationStarterResponse } from './ageAppropriateConversation';
import { getRogerPersonalityInsight } from './rogerPersonality';

/**
 * Generates an appropriate reflection response based on user's message
 * @param userMessage The user's message
 * @param conversationStage Current stage of conversation
 * @param messageCount Number of messages exchanged so far
 * @returns A reflection response
 */
export const generateReflectionResponse = (
  userMessage: string, 
  conversationStage: ConversationStage,
  messageCount: number = 0
): string => {
  try {
    // Input validation
    if (!userMessage || typeof userMessage !== 'string') {
      return "I'm here to listen. What's on your mind today?";
    }
    
    // Detect developmental stage for age-appropriate responses
    const developmentalStage = detectDevelopmentalStage(userMessage);
    
    // First identify any feelings that are explicitly stated
    const feelings = identifyFeelings(userMessage);
    
    // Check for conversation duration to respect the 30-minute rule about autism disclosure
    const isPastThirtyMinutes = messageCount >= 30; // assuming each message takes ~1 minute
    
    // If feelings were explicitly shared, always acknowledge them first
    if (feelings.length > 0) {
      // If we detected a developmental stage, use age-appropriate reflection
      if (developmentalStage && developmentalStage !== 'adult') {
        return generateAgeAppropriateReflection(userMessage, feelings[0], developmentalStage, isPastThirtyMinutes);
      }
      
      // Otherwise use standard feeling reflection
      const feelingReflection = createFeelingReflection(feelings, userMessage);
      
      // Get personality insight to potentially add to the reflection
      const personalityInsight = getRogerPersonalityInsight(userMessage, feelings[0], isPastThirtyMinutes);
      
      if (personalityInsight && Math.random() < 0.2) { // 20% chance to add personality insight
        return (feelingReflection || createGeneralReflection(userMessage)) + personalityInsight;
      }
      
      // Only fall back if reflection creation fails completely
      return feelingReflection || createGeneralReflection(userMessage);
    }
    
    // If no feelings were explicitly detected, try a meaning reflection
    if (conversationStage === 'initial' || conversationStage === 'early') {
      // Check for developmental stage for age-appropriate response
      if (developmentalStage && developmentalStage !== 'adult') {
        // Try generating an age-appropriate conversation starter sometimes
        if (Math.random() < 0.3) { // 30% chance
          const basicResponse = generateAgeAppropriateReflection(userMessage, '', developmentalStage, isPastThirtyMinutes);
          const starter = generateConversationStarterResponse(developmentalStage);
          return `${basicResponse} ${starter}`;
        } else {
          return generateAgeAppropriateReflection(userMessage, '', developmentalStage, isPastThirtyMinutes);
        }
      }
      
      const meaningReflection = createMeaningReflection(userMessage);
      
      // Get personality insight to potentially add
      const personalityInsight = getRogerPersonalityInsight(userMessage, '', isPastThirtyMinutes);
      
      if (personalityInsight && Math.random() < 0.2) { // 20% chance to add personality insight
        return (meaningReflection || createGeneralReflection(userMessage)) + personalityInsight;
      }
      
      return meaningReflection || createGeneralReflection(userMessage);
    }
    
    // In established conversations, be more selective with reflections
    const useReflection = shouldUseReflection(userMessage, conversationStage);
    
    if (useReflection) {
      // Check for developmental stage for age-appropriate response
      if (developmentalStage && developmentalStage !== 'adult') {
        return generateAgeAppropriateReflection(userMessage, '', developmentalStage, isPastThirtyMinutes);
      }
      
      const meaningReflection = createMeaningReflection(userMessage);
      
      // Get personality insight to potentially add
      const personalityInsight = getRogerPersonalityInsight(userMessage, '', isPastThirtyMinutes);
      
      if (personalityInsight && Math.random() < 0.15) { // 15% chance to add personality insight in established conversation
        return (meaningReflection || createGeneralReflection(userMessage)) + personalityInsight;
      }
      
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
export * from './ageAppropriateConversation';
export * from './rogerPersonality';
