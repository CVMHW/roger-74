
/**
 * Logotherapy Response Generator
 * 
 * Specialized response generators based on Viktor Frankl's logotherapy
 * UNIVERSAL LAW: Must incorporate meaning, purpose, and values
 * Enhanced with cultural and age-appropriate variations
 */

// Import all response generators
import { generateCreativeValuesResponse } from './creativeValues';
import { generateExperientialValuesResponse } from './experientialValues';
import { generateAttitudinalValuesResponse } from './attitudinalValues';
import { generateExistentialVacuumResponse } from './existentialVacuum';
import { generateParadoxicalIntentionResponse } from './paradoxicalIntention';
import { generateSocraticLogotherapyResponse } from './socraticDialogue';
import { detectLogotherapyApproach } from './detectors';

/**
 * Generate appropriate logotherapy response based on user input
 */
export const generateLogotherapyResponse = (userInput: string): string => {
  const approach = detectLogotherapyApproach(userInput);
  
  switch (approach) {
    case 'existentialVacuum':
      return generateExistentialVacuumResponse(userInput);
    case 'paradoxicalIntention':
      return generateParadoxicalIntentionResponse(userInput);
    case 'creativeValues':
      return generateCreativeValuesResponse(userInput);
    case 'experientialValues':
      return generateExperientialValuesResponse(userInput);
    case 'attitudinalValues':
      return generateAttitudinalValuesResponse(userInput);
    case 'socraticDialogue':
    default:
      return generateSocraticLogotherapyResponse(userInput);
  }
};

// Re-export all individual functions for direct access
export {
  generateCreativeValuesResponse,
  generateExperientialValuesResponse,
  generateAttitudinalValuesResponse,
  generateExistentialVacuumResponse,
  generateParadoxicalIntentionResponse,
  generateSocraticLogotherapyResponse,
  detectLogotherapyApproach
};
