
/**
 * Memory System Loader
 * 
 * Functions to load data from the memory system
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from '../vectorDatabase';
import { generateEmbedding } from '../vectorEmbeddings';
import { searchMemory } from '../../memory/memoryController';
import { COLLECTIONS } from './types';

/**
 * Load data from the memory system into vector database
 */
export const loadFromMemorySystem = async (): Promise<void> => {
  try {
    console.log("🔄 Loading from memory system...");
    
    // Get all memories
    const memories = searchMemory({ limit: 50 });
    
    // Process patient memories
    const patientMemories = memories.filter(memory => memory.role === 'patient');
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    
    for (const memory of patientMemories) {
      try {
        const embedding = await generateEmbedding(memory.content);
        userCollection.insert({
          id: uuidv4(),
          text: memory.content,
          embedding,
          metadata: {
            timestamp: memory.timestamp || Date.now(),
            importance: memory.importance || 0.5,
            role: 'patient'
          }
        });
      } catch (error) {
        console.error("Error loading patient memory:", error);
      }
    }
    
    // Process Roger memories
    const rogerMemories = memories.filter(memory => memory.role === 'roger');
    const responseCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    for (const memory of rogerMemories) {
      try {
        const embedding = await generateEmbedding(memory.content);
        responseCollection.insert({
          id: uuidv4(),
          text: memory.content,
          embedding,
          metadata: {
            timestamp: memory.timestamp || Date.now(),
            importance: memory.importance || 0.5,
            role: 'roger'
          }
        });
      } catch (error) {
        console.error("Error loading roger memory:", error);
      }
    }
    
    console.log(`✅ Loaded ${patientMemories.length} patient memories and ${rogerMemories.length} Roger memories`);
  } catch (error) {
    console.error("❌ Error loading from memory system:", error);
  }
};
