
/**
 * Hallucination Detection System
 * 
 * Central module for detecting and fixing hallucinations in responses
 */

// Re-export for backward compatibility
export { checkAndFixHallucinations } from './hallucination-checker';
export { detectHallucinations } from './hallucination-detector';

// Export standard HallucinationCheck types
export type { HallucinationCheck, HallucinationFlag, HallucinationSeverity, HallucinationFlagType } from './types';
