
/**
 * Repetition Prevention System
 * 
 * This module exports the main API for detecting and fixing repetitive patterns
 * in conversational responses.
 */

// Re-export the core functionality
export { detectHarmfulRepetitions } from './detector';
export { fixHarmfulRepetitions } from './fixer';

// Export types
export type { RepetitionDetectionResult } from './types';
