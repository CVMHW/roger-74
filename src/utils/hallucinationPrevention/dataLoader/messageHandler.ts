
/**
 * Message Handler
 * 
 * Functions to store user messages and Roger responses in vector database
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from '../vectorDatabase';
import { generateEmbedding } from '../vectorEmbeddings';
import { COLLECTIONS } from './types';
import { createChunks } from './utils';

/**
 * Add a user message to the vector database
 */
export const addUserMessage = async (message: string): Promise<void> => {
  try {
    if (!message || message.trim().length === 0) return;
    
    // Generate embedding for the message
    const embedding = await generateEmbedding(message);
    
    // Get the collection
    const collection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    
    // Add to collection
    collection.insert({
      id: uuidv4(),
      text: message,
      embedding,
      metadata: {
        timestamp: Date.now(),
        source: 'user',
        chunks: createChunks(message)
      }
    });
    
  } catch (error) {
    console.error("Error adding user message to vector database:", error);
  }
};

/**
 * Add a Roger response to the vector database
 */
export const addRogerResponse = async (response: string): Promise<void> => {
  try {
    if (!response || response.trim().length === 0) return;
    
    // Generate embedding for the response
    const embedding = await generateEmbedding(response);
    
    // Get the collection
    const collection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    // Add to collection
    collection.insert({
      id: uuidv4(),
      text: response,
      embedding,
      metadata: {
        timestamp: Date.now(),
        source: 'roger',
        chunks: createChunks(response)
      }
    });
    
  } catch (error) {
    console.error("Error adding Roger response to vector database:", error);
  }
};
