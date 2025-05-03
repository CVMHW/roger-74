
/**
 * Hallucination Prevention System
 * 
 * Integrates multiple techniques to prevent hallucinations:
 * 1. Retrieval-Augmented Generation (RAG)
 * 2. Reasoning & Chain-of-Thought
 * 3. Fact checking & Hallucination detection
 * 4. Token-level verification
 * 5. Natural Language Inference (NLI)
 * 6. Response re-ranking
 */

import { HallucinationProcessResult } from '../../types/hallucinationPrevention';
import { preventHallucinations } from './processor';
import { DEFAULT_OPTIONS } from './config';

// Export the main function
export { preventHallucinations };

// Export the default options
export { DEFAULT_OPTIONS };

// Export the needed types - using "export type" syntax for proper TypeScript isolatedModules support
export type { HallucinationProcessResult };

// Export all sub-module functions
export * from './detector';
export * from './reasoner';
export * from './retrieval';
export * from './repetitionHandler';
