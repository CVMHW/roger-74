
/**
 * Memory Loader
 * 
 * Functions to load data from memory systems into vector database
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from '../vectorDatabase';
import { generateEmbedding } from '../vectorEmbeddings';
import { COLLECTIONS } from './types';
import { createChunks } from './utils';

/**
 * Load data from memory system into vector database
 */
export const loadFromMemorySystem = async (): Promise<void> => {
  try {
    // Try to import memory systems dynamically to avoid circular dependencies
    const memoryController = await import('../../memory/memoryController');
    const fiveResponseMemory = await import('../../memory/fiveResponseMemory');
    
    console.log("🔄 Loading from memory systems...");
    
    // Load from the main memory system
    try {
      const memories = memoryController.getAllMemories();
      
      // Process patient memories
      const patientMemories = memories.filter(item => item.role === 'patient');
      for (const memory of patientMemories) {
        await addMemoryToCollection(
          memory.content,
          COLLECTIONS.USER_MESSAGES,
          { importance: memory.importance || 0.5, source: 'memory_system' }
        );
      }
      
      // Process roger memories
      const rogerMemories = memories.filter(item => item.role === 'roger');
      for (const memory of rogerMemories) {
        await addMemoryToCollection(
          memory.content,
          COLLECTIONS.ROGER_RESPONSES,
          { importance: memory.importance || 0.5, source: 'memory_system' }
        );
      }
      
      console.log(`✅ Loaded ${patientMemories.length} patient memories and ${rogerMemories.length} Roger memories from memory controller`);
    } catch (memoryError) {
      console.error("Error loading from main memory system:", memoryError);
    }
    
    // Load from 5ResponseMemory
    try {
      const fiveResponses = fiveResponseMemory.getFiveResponseMemory();
      
      // Process patient messages
      const patientMessages = fiveResponses.filter((item: any) => item.sender === 'patient');
      for (const msg of patientMessages) {
        await addMemoryToCollection(
          msg.content,
          COLLECTIONS.USER_MESSAGES,
          { importance: 0.8, source: '5response_memory' }
        );
      }
      
      // Process roger messages
      const rogerMessages = fiveResponses.filter((item: any) => item.sender === 'roger');
      for (const msg of rogerMessages) {
        await addMemoryToCollection(
          msg.content,
          COLLECTIONS.ROGER_RESPONSES,
          { importance: 0.8, source: '5response_memory' }
        );
      }
      
      console.log(`✅ Loaded ${patientMessages.length} patient messages and ${rogerMessages.length} Roger messages from 5ResponseMemory`);
    } catch (fiveMemoryError) {
      console.error("Error loading from 5ResponseMemory:", fiveMemoryError);
    }
    
  } catch (error) {
    console.error("Error loading from memory systems:", error);
  }
};

/**
 * Add memory item to vector collection
 */
const addMemoryToCollection = async (
  content: string,
  collectionName: string,
  metadata: Record<string, any>
): Promise<void> => {
  try {
    if (!content || content.trim().length === 0) return;
    
    // Generate embedding for the content
    const embedding = await generateEmbedding(content);
    
    // Get the collection
    const collection = vectorDB.collection(collectionName);
    
    // Add to collection
    collection.insert({
      id: uuidv4(),
      text: content,
      embedding,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        chunks: createChunks(content)
      }
    });
    
  } catch (error) {
    console.error(`Error adding memory to ${collectionName}:`, error);
  }
};
