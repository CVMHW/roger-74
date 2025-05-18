
/**
 * Message Handler
 * 
 * Functions to add user and Roger messages to the vector database
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from '../vectorDatabase';
import { generateEmbedding } from '../vectorEmbeddings';
import { COLLECTIONS } from './types';

/**
 * Add a new user message to the vector database
 */
export const addUserMessage = async (content: string): Promise<string | null> => {
  try {
    const collection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const embedding = await generateEmbedding(content);
    
    const id = collection.insert({
      id: uuidv4(),
      text: content,
      embedding,
      metadata: {
        timestamp: Date.now(),
        role: 'patient'
      }
    });
    
    return id;
  } catch (error) {
    console.error("Error adding user message to vector database:", error);
    return null;
  }
};

/**
 * Add a Roger response to the vector database
 */
export const addRogerResponse = async (content: string): Promise<string | null> => {
  try {
    const collection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    const embedding = await generateEmbedding(content);
    
    const id = collection.insert({
      id: uuidv4(),
      text: content,
      embedding,
      metadata: {
        timestamp: Date.now(),
        role: 'roger'
      }
    });
    
    return id;
  } catch (error) {
    console.error("Error adding Roger response to vector database:", error);
    return null;
  }
};
