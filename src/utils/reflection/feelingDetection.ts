
/**
 * Utilities for detecting feelings in user messages
 */

import { FeelingCategory } from './reflectionTypes';
import { feelingCategories } from './feelingCategories';

/**
 * Identifies potential feelings in a user's message
 * @param userMessage The user's message text
 * @returns Array of detected feelings
 */
export const identifyFeelings = (userMessage: string): FeelingCategory[] => {
  const lowerMessage = userMessage.toLowerCase();
  const detectedFeelings: FeelingCategory[] = [];
  
  // Enhanced detection with context awareness
  // Check for explicit mentions of emotions
  for (const [category, words] of Object.entries(feelingCategories)) {
    if (words.some(word => {
      // Check for exact word matches with word boundaries
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerMessage);
    })) {
      detectedFeelings.push(category as FeelingCategory);
    }
  }
  
  // Infer emotions from context if none were explicitly detected
  if (detectedFeelings.length === 0) {
    // Check for sad context
    if (lowerMessage.includes('miss') || 
        lowerMessage.includes('lost') || 
        lowerMessage.includes('gone') || 
        lowerMessage.includes('moving') || 
        lowerMessage.includes('leaving') ||
        lowerMessage.includes('away')) {
      detectedFeelings.push('sad');
    }
    
    // Check for anxious context
    if (lowerMessage.includes('worried about') || 
        lowerMessage.includes('not sure if') ||
        lowerMessage.includes('what if') ||
        lowerMessage.includes('might happen')) {
      detectedFeelings.push('anxious');
    }
    
    // Check for angry context
    if (lowerMessage.includes('unfair') || 
        lowerMessage.includes('shouldn\'t have') ||
        lowerMessage.includes('wrong') ||
        lowerMessage.includes('hate when')) {
      detectedFeelings.push('angry');
    }
    
    // Check for positive context
    if (lowerMessage.includes('great') || 
        lowerMessage.includes('wonderful') ||
        lowerMessage.includes('awesome') ||
        lowerMessage.includes('love it')) {
      detectedFeelings.push('happy');
    }
  }
  
  return detectedFeelings;
};
