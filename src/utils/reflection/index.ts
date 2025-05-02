/**
 * Main reflection module that integrates all reflection utilities
 * Enhanced with Feelings Wheel lexicon for better emotional understanding
 */

import { ConversationStage, DevelopmentalStage } from './reflectionTypes';
import { identifyFeelings, identifyEnhancedFeelings } from './feelingDetection';
import { createFeelingReflection, createMeaningReflection, createGeneralReflection } from './reflectionGenerators';
import { shouldUseReflection, detectDevelopmentalStage, generateAgeAppropriateReflection } from './reflectionStrategies';
import { generateConversationStarterResponse } from './ageAppropriateConversation';
import { getRogerPersonalityInsight } from './rogerPersonality';
import { 
  feelingsWheel, 
  findFeelingInWheel, 
  getCoreEmotion, 
  getRelatedFeelings, 
  getAllEmotionWords 
} from './feelingsWheel';

/**
 * Generates an appropriate reflection response based on user's message
 * Now enhanced with Feelings Wheel lexicon for more nuanced emotional understanding
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
    
    // Enhanced: Use our new feelings wheel detection for more nuanced understanding
    const enhancedFeelings = identifyEnhancedFeelings(userMessage);
    const feelings = enhancedFeelings.map(ef => ef.category);
    
    // Check for conversation duration to respect the 30-minute rule about autism disclosure
    const isPastThirtyMinutes = messageCount >= 30; // assuming each message takes ~1 minute
    
    // If feelings were explicitly shared, always acknowledge them first
    if (feelings.length > 0) {
      // If we detected a developmental stage, use age-appropriate reflection
      if (developmentalStage && developmentalStage !== 'adult') {
        // Now we can potentially use more specific feeling words from the wheel
        const detectedWord = enhancedFeelings[0].detectedWord || feelings[0];
        return generateAgeAppropriateReflection(userMessage, detectedWord, developmentalStage, isPastThirtyMinutes);
      }
      
      // Otherwise use standard feeling reflection with enhanced wheel data
      const feelingReflection = createFeelingReflection(feelings, userMessage);
      
      // Get personality insight to potentially add to the reflection
      const personalityInsight = getRogerPersonalityInsight(userMessage, enhancedFeelings[0].detectedWord || feelings[0], isPastThirtyMinutes);
      
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

/**
 * Gets information about a feeling from the Feelings Wheel
 * Useful for educational explanations about emotions when appropriate
 * @param feeling The feeling to get information about
 * @returns Information about the feeling's place in the wheel hierarchy
 */
export const getEmotionWheelInfo = (feeling: string) => {
  const wheelFeeling = findFeelingInWheel(feeling);
  if (!wheelFeeling) return null;
  
  const coreEmotion = getCoreEmotion(feeling);
  const relatedFeelings = getRelatedFeelings(feeling);
  
  return {
    feeling: wheelFeeling.name,
    synonyms: wheelFeeling.synonyms,
    coreEmotion,
    relatedFeelings: relatedFeelings.map(f => f.name),
    intensity: wheelFeeling.intensity
  };
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
export * from './feelingsWheel';
