
/**
 * Cleveland Knowledge Base
 * 
 * Central module for Cleveland-specific information to enhance
 * Roger's local knowledge, memory, and conversational abilities.
 * 
 * Roger is from Cleveland and has strong connections to the city,
 * which helps him build rapport with local patients.
 */

// Export all Cleveland-specific utilities
export * from './clevelandData';
export * from './clevelandTopics';
export * from './clevelandMemory';
export * from './clevelandDetectors';
export * from './clevelandResponses';

/**
 * Initialize Cleveland knowledge base
 */
export const initializeClevelandKnowledge = (): void => {
  try {
    console.log("CLEVELAND KNOWLEDGE: Initializing Cleveland knowledge base");
    
    // Initialize data from submodules
    const { loadClevelandData } = require('./clevelandData');
    loadClevelandData();
    
    console.log("CLEVELAND KNOWLEDGE: Successfully initialized");
  } catch (error) {
    console.error("CLEVELAND KNOWLEDGE: Failed to initialize", error);
  }
};

// Initialize on module load
initializeClevelandKnowledge();
