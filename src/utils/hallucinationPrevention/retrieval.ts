
/**
 * Retrieval system - Clean implementation
 */

import { RetrievalResult } from './memoryTypes';
import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';

// Re-export the MemoryPiece type for other modules to use
export * from './memoryTypes';

/**
 * Initialize the retrieval system with clean data
 */
export const initializeRetrievalSystem = async (): Promise<boolean> => {
  try {
    console.log("Initializing clean retrieval system...");
    
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
    
    // Load essential therapy data
    await loadEssentialTherapyData();
    
    console.log("Clean retrieval system initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing retrieval system:", error);
    return false;
  }
};

/**
 * Load essential therapy data into the system
 */
const loadEssentialTherapyData = async (): Promise<void> => {
  const emotionsCollection = vectorDB.getCollection('emotions');
  
  // Only load if collection is empty
  if (emotionsCollection.size() === 0) {
    console.log("Loading essential therapy data...");
    
    const therapyData = [
      {
        id: "depression_support",
        text: "Depression involves persistent sadness, hopelessness, and loss of interest. Professional support and therapy can help manage these feelings.",
        emotion: "depression",
        priority: "high"
      },
      {
        id: "anxiety_support", 
        text: "Anxiety involves worry, nervousness, and fear about uncertain outcomes. Breathing techniques and grounding exercises can provide immediate relief.",
        emotion: "anxiety",
        priority: "high"
      },
      {
        id: "crisis_support",
        text: "If you're having thoughts of self-harm, please reach out immediately. Call 988 for the Suicide & Crisis Lifeline or go to your nearest emergency room.",
        emotion: "crisis",
        priority: "critical"
      }
    ];
    
    for (const data of therapyData) {
      const embedding = await generateEmbedding(data.text);
      emotionsCollection.addItem({
        id: data.id,
        vector: embedding,
        text: data.text,
        metadata: {
          emotion: data.emotion,
          priority: data.priority,
          description: data.text
        },
        timestamp: Date.now()
      });
    }
    
    console.log(`Loaded ${therapyData.length} essential therapy records`);
  }
};

/**
 * Retrieve augmentation for user input
 */
export const retrieveAugmentation = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<RetrievalResult> => {
  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(userInput);
    
    // Search emotions collection first (highest priority)
    const emotionsCollection = vectorDB.getCollection('emotions');
    const emotionalMatches = emotionsCollection.findSimilar(queryEmbedding, {
      limit: 3,
      scoreThreshold: 0.6
    });
    
    // Search knowledge base
    const knowledgeCollection = vectorDB.getCollection('knowledge');
    const knowledgeMatches = knowledgeCollection.findSimilar(queryEmbedding, {
      limit: 3,
      scoreThreshold: 0.5
    });
    
    // Combine retrieved content
    const retrievedContent: string[] = [];
    
    // Add emotional content first (highest priority)
    emotionalMatches.forEach(match => {
      if (match.record.text) {
        retrievedContent.push(match.record.text);
      }
    });
    
    // Add knowledge content
    knowledgeMatches.forEach(match => {
      if (match.record.text && !retrievedContent.includes(match.record.text)) {
        retrievedContent.push(match.record.text);
      }
    });
    
    const confidence = retrievedContent.length > 0 ? 0.85 : 0.1;
    
    console.log(`Retrieved ${retrievedContent.length} relevant pieces of content`);
    
    return {
      retrievedContent,
      confidence
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
 * Augment response with retrieved content
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
    
    // Use the most relevant retrieved content
    const relevantContent = retrievalResult.retrievedContent[0];
    
    // Check for crisis content
    if (relevantContent.includes("self-harm") || relevantContent.includes("988")) {
      // Ensure crisis content is prominent
      return relevantContent + " " + responseText;
    }
    
    // For other content, integrate naturally
    if (!responseText.includes(relevantContent.substring(0, 20))) {
      return "Based on what you're sharing, " + relevantContent + " " + responseText;
    }
    
    return responseText;
  } catch (error) {
    console.error("Error in augmentResponseWithRetrieval:", error);
    return responseText;
  }
};

/**
 * Add conversation exchange to memory
 */
export const addConversationExchange = async (
  userInput: string,
  responseText: string
): Promise<boolean> => {
  try {
    const historyCollection = vectorDB.getCollection('conversation_history');
    
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

/**
 * Retrieve factual grounding for topics
 */
export const retrieveFactualGrounding = async (
  topics: string[],
  count: number = 3
): Promise<string[]> => {
  try {
    if (!topics || topics.length === 0) return [];
    
    const topic = Array.isArray(topics) ? topics[0] : topics;
    const queryEmbedding = await generateEmbedding(topic);
    
    // Search all collections
    const results = await vectorDB.search(queryEmbedding, {
      limit: count,
      threshold: 0.5
    });
    
    return results
      .map(result => result.record.text || "")
      .filter(content => content.length > 0);
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};
