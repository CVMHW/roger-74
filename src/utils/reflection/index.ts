
/**
 * Main reflection module that integrates all reflection utilities
 * Enhanced with Feelings Wheel and Children's Emotions Wheel for better emotional understanding
 */

import { ConversationStage, DevelopmentalStage, ChildEmotionCategory, FeelingCategory } from './reflectionTypes';
import { identifyFeelings, identifyEnhancedFeelings, detectAgeAppropriateEmotions } from './feelingDetection';
import { createFeelingReflection, createMeaningReflection, createGeneralReflection } from './reflectionGenerators';
import { detectDevelopmentalStage } from './reflectionStrategies';
import { generateConversationStarterResponse } from './ageAppropriateConversation';
import { getRogerPersonalityInsight } from './rogerPersonality';
import { 
  feelingsWheel, 
  findFeelingInWheel, 
  getCoreEmotion, 
  getRelatedFeelings, 
  getAllEmotionWords 
} from './feelingsWheel';
import {
  childEmotionsWheel,
  findEmotionInChildWheel,
  getAllChildEmotionWords,
  translateToChildFriendlyEmotion,
  getChildFriendlyEmotionExplanation
} from './childEmotionsWheel';

/**
 * Generates appropriate reflection response based on user's message.
 * Export these functions that are being imported in other places
 */

// Add these two functions to fix the build errors
export const shouldUseReflection = (userMessage: string, conversationStage: ConversationStage): boolean => {
  // Implementation based on the context of the application
  if (conversationStage === 'initial' || conversationStage === 'early') {
    return true;
  }
  
  // For established conversations, be more selective with reflections
  // Check if the message contains personal content worthy of reflection
  return userMessage.length > 20 && 
         !userMessage.includes('?') && 
         Math.random() < 0.6; // 60% chance of using reflection in established conversations
};

export const generateAgeAppropriateReflection = (
  userMessage: string, 
  detectedEmotion: string, 
  stage: DevelopmentalStage, 
  isPastThirtyMinutes: boolean
): string => {
  // Implementation based on the context of the application
  switch (stage) {
    case 'infant_toddler':
      return `I see you're feeling ${detectedEmotion || 'something'}. It's okay to feel that way.`;
    case 'young_child':
      return `I can tell that you're feeling ${detectedEmotion || 'something'} about this. Would you like to tell me more?`;
    case 'middle_childhood':
      return `It sounds like you might be feeling ${detectedEmotion || 'something specific'} about what happened. That makes sense to me.`;
    case 'adolescent':
      return `I'm hearing that you're experiencing ${detectedEmotion || 'some feelings'} about this situation. That's completely valid.`;
    case 'young_adult':
    case 'adult':
    default:
      // For adults, use standard reflection
      if (detectedEmotion) {
        return createFeelingReflection([detectedEmotion as FeelingCategory], userMessage);
      } else {
        return createMeaningReflection(userMessage) || createGeneralReflection(userMessage);
      }
  }
};

/**
 * Generates an appropriate reflection response based on user's message
 * Enhanced with both the Feelings Wheel and Children's Emotions Wheel
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
        // Now we can use child-friendly emotion terms from either wheel
        const detectedWord = enhancedFeelings[0].childFriendly?.translation || 
                           translateToChildFriendlyEmotion(enhancedFeelings[0].detectedWord) || 
                           feelings[0];
                           
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

/**
 * Gets information about a child-friendly emotion
 * For use with younger users to help explain emotions in simpler terms
 * @param childEmotion The child-friendly emotion term
 * @returns Information about the emotion from the children's wheel
 */
export const getChildEmotionInfo = (childEmotion: string) => {
  const emotion = findEmotionInChildWheel(childEmotion);
  if (!emotion) return null;
  
  return {
    emotion: emotion.detectedFeeling,
    category: emotion.category,
    color: emotion.color,
    description: emotion.simpleDescription || getChildFriendlyEmotionExplanation(childEmotion),
    relatedEmotions: emotion.relatedFeelings
  };
};

/**
 * Creates an age-appropriate emotional reflection
 * Uses the children's emotions wheel for younger users
 * @param userMessage The user's message
 * @param stage The developmental stage of the user
 * @returns An age-appropriate reflection
 */
export const createAgeAppropriateEmotionalReflection = (
  userMessage: string, 
  stage: DevelopmentalStage
): string => {
  // Use the appropriate emotion detection based on age
  const emotionResult = detectAgeAppropriateEmotions(userMessage, stage);
  
  if (emotionResult.emotions.length === 0) {
    // No emotions detected, use general age-appropriate response
    switch (stage) {
      case 'infant_toddler':
        return "I see you're feeling something. It's okay to feel.";
      case 'young_child':
        return "I'm listening to how you're feeling. Would you like to tell me more?";
      case 'middle_childhood':
        return "I'm hearing what you're saying. How are you feeling about this?";
      case 'adolescent':
        return "I'm following what you're sharing. Can you tell me more about how this is affecting you?";
      default:
        return createGeneralReflection(userMessage);
    }
  }
  
  // We detected emotions, create an appropriate reflection
  const primaryEmotion = emotionResult.emotions[0];
  
  if (emotionResult.childFriendly) {
    // Get more information about this emotion from the children's wheel
    const childEmotion = findEmotionInChildWheel(primaryEmotion);
    
    if (childEmotion) {
      switch (stage) {
        case 'infant_toddler':
          return `I see you're feeling ${primaryEmotion}. That's okay!`;
        case 'young_child':
          return `I hear that you're feeling ${primaryEmotion}. ${childEmotion.simpleDescription || ''}`;
        case 'middle_childhood':
          return `It sounds like you might be feeling ${primaryEmotion}. ${childEmotion.simpleDescription || ''} Would you like to tell me more?`;
        case 'adolescent':
          return `I'm getting that you might be feeling ${primaryEmotion}. That makes sense given what you're going through.`;
        default:
          return createFeelingReflection([mapChildEmotionToAdultCategory(childEmotion.category)], userMessage);
      }
    }
  }
  
  // Fall back to standard reflection if child-specific approach fails
  return createFeelingReflection(['confused'], userMessage);
};

/**
 * Maps a child emotion category to standard feeling category
 * @param childCategory The child emotion category
 * @returns A standard feeling category
 */
const mapChildEmotionToAdultCategory = (childCategory: ChildEmotionCategory): FeelingCategory => {
  const mappings: Record<ChildEmotionCategory, FeelingCategory> = {
    'happy': 'happy',
    'mad': 'angry',
    'sad': 'sad',
    'scared': 'anxious',
    'excited': 'happy',
    'tired': 'overwhelmed',
    'worried': 'anxious',
    'loved': 'happy',
    'confused': 'confused',
    'silly': 'happy',
    'hungry': 'confused',
    'calm': 'relieved'
  };
  
  return mappings[childCategory] || 'confused';
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
export * from './childEmotionsWheel';
