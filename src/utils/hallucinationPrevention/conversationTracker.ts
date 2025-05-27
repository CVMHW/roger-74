
/**
 * Conversation Tracker - Enhanced
 */

import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';

/**
 * Store conversation exchange in vector database
 */
export const addConversationExchange = async (
  userInput: string,
  responseText: string
): Promise<boolean> => {
  try {
    const historyCollection = vectorDB.collection('conversation_history');
    
    // Add user message
    const userEmbedding = await generateEmbedding(userInput);
    historyCollection.addItem({
      id: `user_${Date.now()}`,
      vector: userEmbedding,
      text: userInput,
      metadata: {
        role: 'user',
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
    
    // Add assistant response
    const responseEmbedding = await generateEmbedding(responseText);
    historyCollection.addItem({
      id: `assistant_${Date.now()}`,
      vector: responseEmbedding,
      text: responseText,
      metadata: {
        role: 'assistant', 
        timestamp: Date.now()
      },
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error("Error storing conversation exchange:", error);
    return false;
  }
};
