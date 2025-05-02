/**
 * Main reflection module that integrates all reflection utilities
 */

import { ConversationStage, DevelopmentalStage } from './reflectionTypes';
import { identifyFeelings } from './feelingDetection';
import { createFeelingReflection, createMeaningReflection, createGeneralReflection } from './reflectionGenerators';
import { shouldUseReflection, detectDevelopmentalStage, generateAgeAppropriateReflection } from './reflectionStrategies';
import { generateConversationStarterResponse } from './ageAppropriateConversation';

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
    
    // Detect developmental stage for age-appropriate responses
    const developmentalStage = detectDevelopmentalStage(userMessage);
    
    // First identify any feelings that are explicitly stated
    const feelings = identifyFeelings(userMessage);
    
    // If feelings were explicitly shared, always acknowledge them first
    if (feelings.length > 0) {
      // If we detected a developmental stage, use age-appropriate reflection
      if (developmentalStage && developmentalStage !== 'adult') {
        return generateAgeAppropriateReflection(userMessage, feelings[0], developmentalStage);
      }
      
      // Otherwise use standard feeling reflection
      const feelingReflection = createFeelingReflection(feelings, userMessage);
      // Only fall back if reflection creation fails completely
      return feelingReflection || createGeneralReflection(userMessage);
    }
    
    // If no feelings were explicitly detected, try a meaning reflection
    if (conversationStage === 'initial' || conversationStage === 'early') {
      // Check for developmental stage for age-appropriate response
      if (developmentalStage && developmentalStage !== 'adult') {
        // Try generating an age-appropriate conversation starter sometimes
        if (Math.random() < 0.3) { // 30% chance
          const basicResponse = generateAgeAppropriateReflection(userMessage, '', developmentalStage);
          const starter = generateConversationStarterResponse(developmentalStage);
          // Add Roger's perspective for conversation starters
          const rogerPerspective = getRogerPerspectivePhrase();
          return `${basicResponse} ${starter} ${rogerPerspective}`;
        } else {
          return generateAgeAppropriateReflection(userMessage, '', developmentalStage);
        }
      }
      
      const meaningReflection = createMeaningReflection(userMessage);
      return meaningReflection || createGeneralReflection(userMessage);
    }
    
    // In established conversations, be more selective with reflections
    const useReflection = shouldUseReflection(userMessage, conversationStage);
    
    if (useReflection) {
      // Check for developmental stage for age-appropriate response
      if (developmentalStage && developmentalStage !== 'adult') {
        return generateAgeAppropriateReflection(userMessage, '', developmentalStage);
      }
      
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

/**
 * Occasionally adds Roger's personal perspective as someone with autism who has developed social work skills
 * @returns A phrase that reflects Roger's unique perspective
 */
const getRogerPerspectivePhrase = (): string => {
  // Only add these occasionally to keep conversations natural
  if (Math.random() > 0.3) return '';
  
  const perspectivePhrases = [
    "In my experience as a peer support professional, I've learned that understanding emotions can be challenging but rewarding.",
    "Sometimes I find social cues difficult, but I've worked hard to understand how people express their feelings.",
    "As someone who sees patterns in communication, I notice that people often need different types of responses.",
    "I've learned that it's okay to ask direct questions when I'm not sure what someone means.",
    "My social work training has helped me develop ways to understand people better.",
    "I find it helpful to be clear and direct in my communication, while still being supportive.",
    "I've found that routines and structures help me provide better support to others.",
    "One thing that's helped me in my work is focusing on really listening to what people say.",
    "I've learned that it's important to acknowledge feelings directly rather than making assumptions.",
    "My experiences have taught me that everyone processes emotions differently, and that's okay."
  ];
  
  return perspectivePhrases[Math.floor(Math.random() * perspectivePhrases.length)];
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
