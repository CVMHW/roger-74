
/**
 * Utilities for generating reflections based on detected emotions
 */

import { FeelingCategory, ConversationStage } from './reflectionTypes';
import { reflectionPhrases, generalReflections, meaningReflections } from './reflectionPhrases';

/**
 * Generates a reflection of feeling based on detected emotions
 * @param feelings Array of identified feelings
 * @param userMessage The original user message
 * @returns A reflection of feeling response
 */
export const createFeelingReflection = (feelings: FeelingCategory[], userMessage: string): string => {
  // If no specific feelings were detected, return a general reflection
  if (feelings.length === 0) {
    return createGeneralReflection(userMessage);
  }

  // Select the most prominent feeling (could enhance logic here)
  const primaryFeeling = feelings[0];
  const phrases = reflectionPhrases[primaryFeeling] || [];
  
  if (phrases.length > 0) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  return createGeneralReflection(userMessage);
};

/**
 * Creates a reflection focused on meaning when specific feelings aren't identified
 * @param userMessage The user's message
 * @returns A reflection that attempts to capture meaning
 */
export const createMeaningReflection = (userMessage: string): string => {
  // Select a random meaning reflection starter
  const reflectionStarter = meaningReflections[Math.floor(Math.random() * meaningReflections.length)];
  
  // Extract key phrases from the user message for the meaning reflection
  // This is a simplified approach - in a real implementation, this would be more sophisticated
  const words = userMessage.split(' ');
  const keyPhrase = words.length > 10 ? words.slice(0, 10).join(' ') + "..." : userMessage;
  
  return `${reflectionStarter} ${keyPhrase}. Is that close to what you're experiencing?`;
};

/**
 * Creates a general reflection when specific feelings or meanings are unclear
 * @param userMessage The user's message
 * @returns A general reflection response
 */
export const createGeneralReflection = (userMessage: string): string => {
  return generalReflections[Math.floor(Math.random() * generalReflections.length)];
};
