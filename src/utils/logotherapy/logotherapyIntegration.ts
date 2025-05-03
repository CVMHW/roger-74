
/**
 * Logotherapy Integration Module
 * 
 * Integrates Viktor Frankl's logotherapy with Roger's core systems
 * UNIVERSAL LAW: All of Roger's systems must incorporate meaning and purpose
 */

import { generateLogotherapyResponse } from './logotherapyResponses';
import { PersonalityMode } from './types';
import { getRandomPersonality } from '../response/spontaneityGenerator';
import { leverageMemorySystems, incorporateMemories } from './memory-utils';
import { blendResponses } from './response-blending';
import { hasMeaningOrientation } from './meaning-detection';
import { getAppropriateEnhancement } from './context-enhancements';

/**
 * Integrate logotherapy into the adaptive response system
 * Called when meaning/purpose themes are detected in user input
 */
export const integrateLogotherapyResponse = (
  userInput: string,
  baseResponse: string,
  personalityMode: PersonalityMode = getRandomPersonality()
): string => {
  // Generate a pure logotherapy-based response
  const logotherapyResponse = generateLogotherapyResponse(userInput);
  
  // Leverage memory systems for more personalized response
  const memories = leverageMemorySystems(userInput);
  
  // Determine integration approach based on response length and content
  if (baseResponse.length < 100) {
    // For shorter responses, simply append the logotherapy perspective
    return `${baseResponse} ${incorporateMemories(logotherapyResponse, memories)}`;
  } else {
    // For longer responses, blend the perspectives
    return blendResponses(baseResponse, logotherapyResponse, personalityMode, memories);
  }
};

/**
 * Enhance any response with a meaning-oriented perspective
 * Used as a universal rule to ensure meaning integration
 * Now with age/cultural appropriateness checks
 */
export const enhanceWithMeaningPerspective = (
  response: string,
  userInput: string
): string => {
  // Check if response already has meaning-oriented language
  if (hasMeaningOrientation(response)) {
    return response;
  }
  
  // Detect appropriate enhancement based on user input context
  const enhancement = getAppropriateEnhancement(userInput);
  
  // Add the enhancement at an appropriate point in the response
  const sentences = response.split(/(?<=[.?!])\s+/);
  
  if (sentences.length <= 2) {
    // For short responses, simply append
    return `${response} ${enhancement}`;
  } else {
    // For longer responses, insert before conclusion
    const insertPoint = Math.max(Math.floor(sentences.length * 0.75), sentences.length - 2);
    
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    return `${beginning} ${enhancement} ${end}`;
  }
};

// Export this function explicitly for use in universalLaws.ts
export const enhanceWithLogotherapyPerspective = enhanceWithMeaningPerspective;
