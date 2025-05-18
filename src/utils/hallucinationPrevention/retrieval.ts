
/**
 * Retrieval-Augmented Generation system
 * 
 * Provides vector-based knowledge retrieval to ground responses
 */

import { MemoryPiece } from '../../types/hallucinationPrevention';
import vectorDB from './vectorDatabase';
import { extractEmotionsFromInput } from '../response/processor/emotions';

// Export MemoryPiece for use in other modules
export type { MemoryPiece };

/**
 * Initializes the retrieval system
 */
export const initializeRetrievalSystem = async (): Promise<boolean> => {
  try {
    console.log("Initializing retrieval system...");
    
    // Initialize vector database with emotional content
    await initializeVectorDatabase();
    
    return true;
  } catch (error) {
    console.error("Error initializing retrieval system:", error);
    return false;
  }
};

/**
 * Initialize vector database with emotional content
 */
const initializeVectorDatabase = async (): Promise<boolean> => {
  try {
    // Create emotional content collection if it doesn't exist
    if (!vectorDB.hasCollection('emotional_content')) {
      const emotionalCollection = vectorDB.createCollection('emotional_content');
      
      // Add depression-related content
      const depressionContent = [
        "Depression is a serious mental health condition characterized by persistent sadness, loss of interest in activities, and can include feelings of worthlessness and hopelessness.",
        "When supporting someone with depression, acknowledge their feelings without judgment and encourage professional help.",
        "Depression affects approximately 280 million people worldwide and is a leading cause of disability."
      ];
      
      for (const content of depressionContent) {
        await emotionalCollection.addItem({
          id: `depression_${Date.now()}_${Math.random()}`,
          vector: await generateSimpleEmbedding(content),
          metadata: {
            content,
            category: 'depression',
            importance: 0.95
          }
        });
      }
      
      // Add anxiety-related content
      const anxietyContent = [
        "Anxiety disorders are characterized by persistent, excessive worry and fear about everyday situations.",
        "Supporting someone with anxiety involves validating their feelings while not reinforcing avoidance behaviors.",
        "Techniques like deep breathing, mindfulness, and cognitive behavioral therapy can help manage anxiety."
      ];
      
      for (const content of anxietyContent) {
        await emotionalCollection.addItem({
          id: `anxiety_${Date.now()}_${Math.random()}`,
          vector: await generateSimpleEmbedding(content),
          metadata: {
            content,
            category: 'anxiety',
            importance: 0.9
          }
        });
      }
      
      // Add stress-related content
      const stressContent = [
        "Stress is the body's response to pressure from difficult or challenging situations.",
        "Chronic stress can lead to various physical and mental health problems including anxiety and depression.",
        "Stress management techniques include exercise, mindfulness, social connection, and setting healthy boundaries."
      ];
      
      for (const content of stressContent) {
        await emotionalCollection.addItem({
          id: `stress_${Date.now()}_${Math.random()}`,
          vector: await generateSimpleEmbedding(content),
          metadata: {
            content,
            category: 'stress',
            importance: 0.85
          }
        });
      }
      
      console.log("Vector database initialized with emotional content");
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing vector database with emotional content:", error);
    return false;
  }
};

/**
 * Simple embedding function - would be replaced with a real embedding model
 * This is just for demo purposes
 */
const generateSimpleEmbedding = async (text: string): Promise<number[]> => {
  // In production, this would use a real embedding model
  // For now, create a pseudorandom but deterministic vector based on the text
  const vector = new Array(128).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    vector[i % vector.length] += charCode / 255;
  }
  
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
};

/**
 * Retrieves relevant context based on a query
 */
export const retrieveAugmentation = async (
  query: string,
  conversationHistory: string[] = []
): Promise<{
  retrievalSucceeded: boolean;
  retrievedContent?: string[];
  score?: number;
}> => {
  try {
    console.log(`RAG: Retrieving context for query: ${query}`);
    
    // Extract emotions to aid in retrieval
    const emotions = extractEmotionsFromInput(query);
    
    // Try vector-based retrieval first
    try {
      if (vectorDB.hasCollection('emotional_content')) {
        const emotionalCollection = vectorDB.getCollection('emotional_content');
        
        // Generate query vector
        const queryVector = await generateSimpleEmbedding(query);
        
        // Search for similar content
        const results = await emotionalCollection.search(queryVector, 3);
        
        if (results && results.length > 0) {
          const retrievedContent = results.map(result => result.record.metadata.content);
          return {
            retrievalSucceeded: true,
            retrievedContent,
            score: results[0].score
          };
        }
      }
    } catch (vectorError) {
      console.error("Vector search failed, falling back to pattern matching:", vectorError);
    }
    
    // Fallback to pattern matching if vector search fails or is not available
    const mockEmotionalContent: Record<string, string[]> = {
      'depression': [
        "Depression is a serious mental health condition characterized by persistent sadness, loss of interest in activities, and can include feelings of worthlessness and hopelessness.",
        "When supporting someone with depression, acknowledge their feelings without judgment and encourage professional help.",
        "Depression affects approximately 280 million people worldwide and is a leading cause of disability."
      ],
      'anxiety': [
        "Anxiety disorders are characterized by persistent, excessive worry and fear about everyday situations.",
        "Supporting someone with anxiety involves validating their feelings while not reinforcing avoidance behaviors.",
        "Techniques like deep breathing, mindfulness, and cognitive behavioral therapy can help manage anxiety."
      ],
      'stress': [
        "Stress is the body's response to pressure from difficult or challenging situations.",
        "Chronic stress can lead to various physical and mental health problems including anxiety and depression.",
        "Stress management techniques include exercise, mindfulness, social connection, and setting healthy boundaries."
      ]
    };
    
    // Check if query is related to emotions
    let retrievedContent: string[] = [];
    let score = 0.5;
    
    // Check for depression content
    if (/\b(depress(ed|ion|ing)?|sad|down|low|hopeless|worthless|empty|numb)\b/i.test(query)) {
      retrievedContent = mockEmotionalContent['depression'];
      score = 0.95;
    } 
    // Check for anxiety content
    else if (/\b(anxious|anxiety|worry|worried|nervous|panic|fear|scared)\b/i.test(query)) {
      retrievedContent = mockEmotionalContent['anxiety'];
      score = 0.9;
    } 
    // Check for stress content
    else if (/\b(stress(ed|ful)?|overwhelm(ed|ing)?|pressure|burden(ed)?)\b/i.test(query)) {
      retrievedContent = mockEmotionalContent['stress'];
      score = 0.85;
    }
    
    return {
      retrievalSucceeded: retrievedContent.length > 0,
      retrievedContent: retrievedContent.length > 0 ? retrievedContent : undefined,
      score: retrievedContent.length > 0 ? score : undefined
    };
  } catch (error) {
    console.error("Error in RAG retrieval:", error);
    return { retrievalSucceeded: false };
  }
};

/**
 * Augments a response with retrieved knowledge
 */
export const augmentResponseWithRetrieval = async (
  responseText: string,
  userInput: string,
  retrievalResult: {
    retrievalSucceeded: boolean;
    retrievedContent?: string[];
    score?: number;
  }
): Promise<string> => {
  try {
    if (!retrievalResult.retrievalSucceeded || 
        !retrievalResult.retrievedContent || 
        retrievalResult.retrievedContent.length === 0) {
      return responseText;
    }
    
    console.log("RAG: Augmenting response with retrieved content");
    
    // For depression, ensure we explicitly acknowledge it
    if (/\b(depress(ed|ion|ing)?|sad|down|low|hopeless|worthless|empty|numb)\b/i.test(userInput) && 
        !responseText.toLowerCase().includes("depress")) {
      // Add depression acknowledgment if missing
      return `I hear that you're feeling depressed. ${responseText}`;
    }
    
    // For anxiety, ensure we acknowledge it
    if (/\b(anxious|anxiety|worry|worried|nervous|panic|fear|scared)\b/i.test(userInput) && 
        !responseText.toLowerCase().includes("anxi")) {
      // Add anxiety acknowledgment if missing
      return `I understand you're feeling anxious. ${responseText}`;
    }
    
    return responseText;
  } catch (error) {
    console.error("Error in RAG augmentation:", error);
    return responseText;
  }
};

/**
 * Retrieve factual grounding based on topics
 */
export const retrieveFactualGrounding = (
  topics: string[],
  limit: number = 5
): MemoryPiece[] => {
  try {
    console.log(`Retrieving factual grounding for topics: ${topics.join(', ')}`);
    
    const facts: MemoryPiece[] = [];
    
    // Add facts based on topics
    if (topics.some(topic => /depress|sad|down/i.test(topic))) {
      facts.push({
        content: "Depression is a serious mental health condition that affects how a person feels, thinks, and acts.",
        role: 'system',
        importance: 0.95
      });
    }
    
    if (topics.some(topic => /anxiety|worry|stress/i.test(topic))) {
      facts.push({
        content: "Anxiety disorders are characterized by persistent, excessive worry and fear about everyday situations.",
        role: 'system',
        importance: 0.9
      });
    }
    
    if (topics.some(topic => /crisis|emergency|suicide|harm/i.test(topic))) {
      facts.push({
        content: "If someone is experiencing thoughts of suicide, it's important to take it seriously and connect them with crisis resources like the 988 Suicide & Crisis Lifeline.",
        role: 'system',
        importance: 0.99
      });
    }
    
    // Return facts limited to specified count
    return facts.slice(0, limit);
  } catch (error) {
    console.error("Error retrieving factual grounding:", error);
    return [];
  }
};
