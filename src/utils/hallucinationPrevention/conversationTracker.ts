
/**
 * Conversation tracking functionality for hallucination prevention
 */
import vectorDB from './vectorDatabase';

/**
 * Adds a conversation exchange to the RAG system for learning
 */
export const addConversationExchange = async (
  userInput: string,
  responseText: string
): Promise<boolean> => {
  try {
    console.log("RAG: Adding conversation exchange to memory");
    
    if (vectorDB.hasCollection('conversation_history')) {
      const historyCollection = vectorDB.collection('conversation_history');
      
      // Generate simple embeddings
      const generateSimpleEmbedding = async (text: string): Promise<number[]> => {
        // Simple mock implementation
        const vector = new Array(128).fill(0);
        for (let i = 0; i < text.length; i++) {
          const charCode = text.charCodeAt(i);
          vector[i % vector.length] += charCode / 255;
        }
        
        // Normalize
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return vector.map(val => val / magnitude);
      };
      
      // Add user input
      await historyCollection.addItem({
        id: `user_${Date.now()}`,
        vector: await generateSimpleEmbedding(userInput),
        metadata: {
          content: userInput,
          role: 'user',
          timestamp: Date.now()
        }
      });
      
      // Add response
      await historyCollection.addItem({
        id: `assistant_${Date.now()}`,
        vector: await generateSimpleEmbedding(responseText),
        metadata: {
          content: responseText,
          role: 'assistant',
          timestamp: Date.now()
        }
      });
      
      return true;
    } else {
      // Create collection if it doesn't exist
      const historyCollection = vectorDB.createCollection('conversation_history');
      
      // We'll implement the adding logic in a future update
      return true;
    }
  } catch (error) {
    console.error("Error adding conversation exchange to RAG:", error);
    return false;
  }
};
