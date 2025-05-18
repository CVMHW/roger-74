
/**
 * Vector Database Data Loader
 * 
 * Loads data into the vector database from various sources
 */

import vectorDB from '../vectorDatabase';
import { loadKnowledge } from './knowledgeLoader';
import { loadFromMemorySystem } from './memoryLoader';
import { rogerTherapeuticKnowledge, mentalHealthFacts } from './knowledgeData';
import { COLLECTIONS } from './types';

// Re-export types and constants
export type { KnowledgeEntry } from './types';
export { COLLECTIONS } from './types';
export { createChunks } from './utils';
export { addUserMessage, addRogerResponse } from './messageHandler';

/**
 * Initialize the vector database with core knowledge
 */
export const initializeVectorDatabase = async (): Promise<boolean> => {
  try {
    console.log("🔄 Initializing vector database with core knowledge...");
    
    // Create collections if they don't exist
    const rogerCollection = vectorDB.collection(COLLECTIONS.ROGER_KNOWLEDGE);
    const factsCollection = vectorDB.collection(COLLECTIONS.FACTS);
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const responseCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    // Skip if already populated
    if (rogerCollection.size() > 0) {
      console.log("✅ Vector database already initialized");
      return true;
    }
    
    // Load Roger therapeutic knowledge
    await loadKnowledge(rogerTherapeuticKnowledge, COLLECTIONS.ROGER_KNOWLEDGE);
    
    // Load mental health facts
    await loadKnowledge(mentalHealthFacts, COLLECTIONS.FACTS);
    
    // Load from memory system
    await loadFromMemorySystem();
    
    console.log("✅ Vector database initialized successfully");
    const stats = vectorDB.stats();
    console.log(`📊 Vector database stats: ${JSON.stringify(stats)}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error initializing vector database:", error);
    return false;
  }
};

// Export a default function for backward compatibility
export default {
  initializeVectorDatabase,
  loadKnowledge
};
