
/**
 * Conversation tracking functionality for hallucination prevention
 */
import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';
import { MemoryPiece } from './types';

/**
 * Adds a conversation exchange to the RAG system for learning
 */
export const addConversationExchange = async (
  userInput: string,
  responseText: string
): Promise<boolean> => {
  try {
    console.log("RAG: Adding conversation exchange to memory");
    
    if (!vectorDB.hasCollection('conversation_history')) {
      vectorDB.createCollection('conversation_history');
    }
    
    const historyCollection = vectorDB.getCollection('conversation_history');
    
    // Add user input
    const userVector = await generateEmbedding(userInput);
    historyCollection.addItem({
      id: `user_${Date.now()}`,
      vector: userVector,
      text: userInput,
      metadata: {
        content: userInput,
        role: 'user',
        timestamp: Date.now()
      }
    });
    
    // Add response
    const responseVector = await generateEmbedding(responseText);
    historyCollection.addItem({
      id: `assistant_${Date.now()}`,
      vector: responseVector,
      text: responseText,
      metadata: {
        content: responseText,
        role: 'assistant',
        timestamp: Date.now()
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error adding conversation exchange to RAG:", error);
    return false;
  }
};
