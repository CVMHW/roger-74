
/**
 * Vector Database Data Loader - Main Entry Point
 * 
 * Re-exports data loader functionality from modular implementation
 */

// Re-export all functionality from the new modular implementation
export * from './dataLoader/index';

// Create a default export for backward compatibility
import dataLoaderDefault from './dataLoader/index';
export default dataLoaderDefault;
