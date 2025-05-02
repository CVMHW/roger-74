import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';

/**
 * Selectively adds Roger's personal perspective based on his experiences and personality
 * Based on therapeutic appropriateness and contextual relevance
 * @returns A phrase that reflects Roger's unique perspective or empty string
 */
export const getRogerPerspectivePhrase = (userInput: string, messageCount: number): string => {
  // Only add these occasionally (15% chance) to keep conversations natural
  // And only when therapeutically appropriate
  if (Math.random() > 0.15) return '';
  
  // Check if past 30-minute mark for autism disclosure (according to rule)
  const isPastThirtyMinutes = messageCount >= 30;
  
  // Get personality-based insight
  const enhancedFeelings = identifyEnhancedFeelings(userInput);
  const primaryFeeling = enhancedFeelings.length > 0 ? enhancedFeelings[0].detectedWord : '';
  
  return getRogerPersonalityInsight(userInput, primaryFeeling, isPastThirtyMinutes);
};
