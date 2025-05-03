
/**
 * Main entry point for message processing
 * Re-exports the core message processor functionality
 */

export { processUserMessage } from './processor';
export * from './types';

// Re-export utility functions for backward compatibility
export * from './topicExtractor';

