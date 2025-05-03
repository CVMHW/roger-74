
/**
 * Hallucination Detection System - Main Entry Point
 * 
 * Exports the main detector functionality and re-exports from submodules
 */

import { checkAndFixHallucinations } from './hallucination-checker';
import { detectHallucinations } from './hallucination-detector';

// Re-export main functions
export { checkAndFixHallucinations, detectHallucinations };

// Re-export from submodules
export * from './types';
export * from './similarity-utils';
