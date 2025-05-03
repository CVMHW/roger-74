
/**
 * Stressors Knowledge Base
 * 
 * Central module for stressor-specific information to enhance
 * Roger's ability to recognize and respond to common problems
 * patients might report.
 */

// Export all stressor-specific utilities
export * from './stressorTypes';
export * from './stressorData';
export * from './stressorDetection';
export * from './stressorResponses';
export * from './stressorMemory';

/**
 * Initialize stressors knowledge base
 */
export const initializeStressorsKnowledge = (): void => {
  try {
    console.log("STRESSORS KNOWLEDGE: Initializing stressors knowledge base");
    
    // Initialize data from submodules
    const { loadStressorData } = require('./stressorData');
    loadStressorData();
    
    console.log("STRESSORS KNOWLEDGE: Successfully initialized");
  } catch (error) {
    console.error("STRESSORS KNOWLEDGE: Failed to initialize", error);
  }
};

// Initialize on module load
initializeStressorsKnowledge();

