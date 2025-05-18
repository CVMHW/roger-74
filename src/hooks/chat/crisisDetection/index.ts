
/**
 * Crisis detection system for handling dangerous or harmful content
 * Enhanced with vector-based semantic understanding
 */

export * from './types';
export * from './detectors';
export * from './useCrisisDetector';

// Export our new semantic detector with better naming to avoid conflicts
export { checkForCrisisContentAsync } from '../useChatLogic/useCrisisDetector';
