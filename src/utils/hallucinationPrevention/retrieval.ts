
/**
 * Retrieval system for hallucination prevention
 * Enhanced with vector database integration
 */

import { RetrievalResult } from './memoryTypes';
import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';

// Re-export the MemoryPiece type for other modules to use
export * from './memoryTypes';

/**
 * Initialize the retrieval system
 */
export const initializeRetrievalSystem = async (): Promise<boolean> => {
  try {
    // Ensure required collections exist
    if (!vectorDB.hasCollection('knowledge')) {
      vectorDB.createCollection('knowledge');
    }
    
    if (!vectorDB.hasCollection('conversation_history')) {
      vectorDB.createCollection('conversation_history');
    }
    
    if (!vectorDB.hasCollection('emotions')) {
      vectorDB.createCollection('emotions');
    }
    
    // Load initial data if needed
    const emotionsCollection = vectorDB.getCollection('emotions');
    
    // Add some basic emotion data if collection is empty
    if (emotionsCollection.size() === 0) {
      console.log("Initializing emotions data in vector database");
      
      // Add depression data
      const depressionEmbedding = await generateEmbedding("Depression is a serious condition characterized by persistent sadness, hopelessness, and loss of interest in activities");
      emotionsCollection.addItem({
        id: "emotion_depression",
        vector: depressionEmbedding,
        text: "Depression is a serious condition characterized by persistent sadness, hopelessness, and loss of interest in activities",
        metadata: {
          emotion: "depression",
          description: "Depression is a serious condition characterized by persistent sadness, hopelessness, and loss of interest in activities",
          priority: "high"
        }
      });
      
      // Add anxiety data
      const anxietyEmbedding = await generateEmbedding("Anxiety involves feelings of worry, nervousness, or unease about something with an uncertain outcome");
      emotionsCollection.addItem({
        id: "emotion_anxiety",
        vector: anxietyEmbedding,
        text: "Anxiety involves feelings of worry, nervousness, or unease about something with an uncertain outcome",
        metadata: {
          emotion: "anxiety",
          description: "Anxiety involves feelings of worry, nervousness, or unease about something with an uncertain outcome",
          priority: "high"
        }
      });
    }
    
    console.log("Retrieval system initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing retrieval system:", error);
    return false;
  }
};

/**
 * Retrieve augmentation for a user input
 */
export const retrieveAugmentation = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<RetrievalResult> => {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(userInput);
    
    // First check emotions collection for highly relevant emotional content
    const emotionsCollection = vectorDB.getCollection('emotions');
    const emotionalMatches = emotionsCollection.search(queryEmbedding, 2);
    
    // Then search knowledge base
    const knowledgeCollection = vectorDB.getCollection('knowledge');
    const knowledgeMatches = knowledgeCollection.search(queryEmbedding, 3);
    
    // Finally get conversation history context
    const historyCollection = vectorDB.getCollection('conversation_history');
    const historyMatches = historyCollection.search(queryEmbedding, 2);
    
    // Combine all retrieved content
    const retrievedContent: string[] = [];
    
    // Add emotional content first (highest priority)
    emotionalMatches.forEach(match => {
      if (match.score > 0.7 && (match.record.metadata?.description || match.record.text)) {
        retrievedContent.push(match.record.metadata?.description || match.record.text || "");
      }
    });
    
    // Add knowledge content
    knowledgeMatches.forEach(match => {
      if (match.score > 0.6 && (match.record.metadata?.content || match.record.text)) {
        retrievedContent.push(match.record.metadata?.content || match.record.text || "");
      }
    });
    
    // Add conversation history content
    historyMatches.forEach(match => {
      if (match.score > 0.8 && (match.record.metadata?.content || match.record.text)) {
        retrievedContent.push(match.record.metadata?.content || match.record.text || "");
      }
    });
    
    return {
      retrievedContent,
      confidence: retrievedContent.length > 0 ? 0.85 : 0.1
    };
  } catch (error) {
    console.error("Error in retrieveAugmentation:", error);
    return {
      retrievedContent: [],
      confidence: 0
    };
  }
};

/**
 * Augment a response with retrieved content
 */
export const augmentResponseWithRetrieval = async (
  responseText: string,
  userInput: string,
  retrievalResult: RetrievalResult
): Promise<string> => {
  try {
    if (!retrievalResult.retrievedContent || retrievalResult.retrievedContent.length === 0) {
      return responseText;
    }
    
    // Simple augmentation strategy
    const contextText = retrievalResult.retrievedContent.join(" ");
    
    // Check for depression content
    const hasDepressionContent = /\b(depress(ed|ion|ing)?|sad|down|low|mood)\b/i.test(contextText);
    
    if (hasDepressionContent && !/\b(depress(ed|ion|ing)?|sad|down|low|mood)\b/i.test(responseText)) {
      // Ensure depression is acknowledged in the response if present in context
      return "I understand this relates to feelings of depression. " + responseText;
    }
    
    // For other cases, just return the original response for now
    // A more sophisticated implementation would carefully blend the information
    return responseText;
  } catch (error) {
    console.error("Error in augmentResponseWithRetrieval:", error);
    return responseText;
  }
};

/**
 * Add a conversation exchange to memory
 */
export const addConversationExchange = async (
  userInput: string,
  responseText: string
): Promise<boolean> => {
  try {
    // Generate embeddings
    const userEmbedding = await generateEmbedding(userInput);
    const responseEmbedding = await generateEmbedding(responseText);
    
    // Get history collection
    const historyCollection = vectorDB.getCollection('conversation_history');
    
    // Add user message
    const userMessageId = `user_message_${Date.now()}`;
    historyCollection.addItem({
      id: userMessageId,
      vector: userEmbedding,
      text: userInput,
      metadata: {
        role: 'user',
        timestamp: Date.now(),
        source: 'conversation'
      }
    });
    
    // Add assistant response
    const assistantMessageId = `assistant_response_${Date.now()}`;
    historyCollection.addItem({
      id: assistantMessageId,
      vector: responseEmbedding,
      text: responseText,
      metadata: {
        role: 'assistant',
        timestamp: Date.now(),
        source: 'conversation',
        relatedTo: userMessageId
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error storing conversation exchange:", error);
    return false;
  }
};

/**
 * Find similar previous responses to aid in consistent answering
 */
export const retrieveSimilarResponses = async (
  userInput: string,
  count: number = 3
): Promise<string[]> => {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(userInput);
    
    // Search conversation history for assistant responses
    const historyCollection = vectorDB.getCollection('conversation_history');
    const matches = historyCollection.search(queryEmbedding, count * 2, {
      filter: (record) => record.metadata?.role === 'assistant'
    });
    
    // Extract the content
    return matches
      .filter(match => match.score > 0.7)
      .slice(0, count)
      .map(match => match.record.metadata?.content || match.record.text || "")
      .filter(content => content.length > 0);
  } catch (error) {
    console.error("Error retrieving similar responses:", error);
    return [];
  }
};

/**
 * Retrieve factual grounding for a topic
 */
export const retrieveFactualGrounding = async (
  topics: string[],
  count: number = 3
): Promise<string[]> => {
  try {
    // Using the first topic as the main query for now
    // In a more advanced implementation, we could combine multiple topics
    const topic = Array.isArray(topics) ? topics[0] : topics;
    
    // Generate embedding for topic
    const topicEmbedding = await generateEmbedding(topic);
    
    // Search knowledge base
    const knowledgeCollection = vectorDB.getCollection('knowledge');
    const matches = knowledgeCollection.search(topicEmbedding, count);
    
    // Extract the content
    return matches
      .filter(match => match.score > 0.65)
      .map(match => match.record.metadata?.content || match.record.text || "")
      .filter(content => content.length > 0);
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};
