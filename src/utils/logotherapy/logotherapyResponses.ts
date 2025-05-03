
/**
 * Logotherapy Response Generators
 * 
 * Specialized response generators based on Viktor Frankl's logotherapy
 * UNIVERSAL LAW: Roger must incorporate meaning, purpose, and values
 * Enhanced with cultural and age-appropriate variations
 */

// This file now re-exports from our modular system for backward compatibility
export { getCulturalContext, getAgeAppropriateContext } from './responses/utils/contextDetection';
export {
  generateLogotherapyResponse,
  generateCreativeValuesResponse,
  generateExperientialValuesResponse,
  generateAttitudinalValuesResponse,
  generateExistentialVacuumResponse,
  generateParadoxicalIntentionResponse,
  generateSocraticLogotherapyResponse,
  detectLogotherapyApproach
} from './responses/index';
