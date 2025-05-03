
/**
 * Response blending utilities for logotherapy integration
 */

import { PersonalityMode } from './types';
import { getLogotherapyTransitions } from './transitions';

/**
 * Blend a base response with logotherapy perspective
 */
export const blendResponses = (
  baseResponse: string, 
  logotherapyResponse: string, 
  personalityMode: PersonalityMode,
  memories: string[] = []
): string => {
  // Extract key sentences/parts from each response
  const baseSentences = baseResponse.split(/(?<=[.?!])\s+/);
  const logoSentences = logotherapyResponse.split(/(?<=[.?!])\s+/);
  
  // Get transition phrases appropriate for personality
  const transitions = getLogotherapyTransitions(personalityMode);
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  // Select a key insight from the logotherapy response
  const keyLogoSentence = logoSentences[Math.floor(Math.random() * logoSentences.length)];
  
  // Add memory-enhanced content if available
  const memoryEnhancement = memories.length > 0 ? 
    ` I remember you mentioned ${memories[0].substring(0, 15)}... which relates to this.` : '';
  
  // Create a blended response based on length
  if (baseSentences.length <= 2) {
    // For very short base responses, add logotherapy perspective after
    return `${baseResponse} ${transition} ${keyLogoSentence}${memoryEnhancement}`;
  } else {
    // For longer responses, insert logotherapy perspective before conclusion
    const openingPart = baseSentences.slice(0, Math.ceil(baseSentences.length * 0.7)).join(' ');
    const closingPart = baseSentences.slice(Math.ceil(baseSentences.length * 0.7)).join(' ');
    
    return `${openingPart} ${transition} ${keyLogoSentence}${memoryEnhancement} ${closingPart}`;
  }
};
