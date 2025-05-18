
/**
 * Hallucination Detection System
 * 
 * Central module for detecting and fixing hallucinations in responses
 */

// Re-export for backward compatibility
export { checkAndFixHallucinations } from './hallucination-checker';

// Export standard HallucinationCheck types
export type { HallucinationCheck } from './types';
