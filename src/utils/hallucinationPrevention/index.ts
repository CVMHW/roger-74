/**
 * Main hallucination prevention system
 * 
 * Enhanced with emotion-specific RAG retrieval strategies and
 * integrated vector database
 */

import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../types/hallucinationPrevention';
import { preventHallucinations } from './processor';
import { detectHallucinations } from './detector';
import { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval, 
  initializeRetrievalSystem, 
  addConversationExchange,
  retrieveSimilarResponses,
  retrieveFactualGrounding
} from './retrieval';
import { createEmotionContext } from '../response/processor/emotionHandler/emotionMisidentificationHandler';
import { extractEmotionsFromInput } from '../response/processor/emotions';
import vectorDB from './vectorDatabase';

// Track initialization status
let isRAGInitialized = false;

/**
 * Initializes the RAG system
 * @returns Promise that resolves when initialization is complete
 */
export const initializeRAGSystem = async () => {
  try {
    console.log("Initializing RAG system...");
    
    // Call the retrieval system initialization
    await initializeRetrievalSystem();
    
    isRAGInitialized = true;
    console.log("RAG system initialized successfully");
    
    return true;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    return false;
  }
};

/**
 * Checks if the RAG system is ready for use
 */
export const isRAGSystemReady = () => {
  return isRAGInitialized;
};

/**
 * Enhanced RAG response processing
 * Now with emotion-specific RAG strategies and special handling for depression
 * 
 * @param responseText Original response text
 * @param userInput User's input message
 * @param conversationHistory Array of previous conversation messages
 * @param emotionContext Optional emotion context from previous processing
 * @returns Enhanced response text
 */
export const enhanceResponseWithRAG = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  emotionContext?: any
): Promise<string> => {
  try {
    // Prevent RAG processing for very short responses (likely error states)
    if (responseText.length < 20) {
      return responseText;
    }
    
    console.log("RAG: Enhancing response with advanced vector knowledge");
    
    // Extract emotions if not provided
    const emotions = emotionContext || extractEmotionsFromInput(userInput);
    
    // CRITICAL: Check for depression mentioned first - highest priority
    const hasDepressionIndicators = emotions.isDepressionMentioned || 
      /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
    
    // Create augmentation query - depression gets special handling
    let queryAugmentation = userInput;
    
    if (hasDepressionIndicators) {
      // For depression, explicitly include depression in the query
      queryAugmentation = `depression ${userInput}`;
      console.log("RAG: Depression detected, prioritizing depression context");
    } else if (emotions.hasDetectedEmotion) {
      // For other emotions, augment with detected emotion
      const primaryEmotion = emotions.explicitEmotion || 
                           (emotions.emotionalContent?.hasEmotion ? emotions.emotionalContent.primaryEmotion : null);
      
      if (primaryEmotion) {
        queryAugmentation = `${primaryEmotion} feeling ${userInput}`;
        console.log(`RAG: Emotion detected (${primaryEmotion}), augmenting query`);
      }
    }
    
    // Retrieve augmentation with enhanced query
    const augmentation = await retrieveAugmentation(queryAugmentation, conversationHistory);
    
    if (!augmentation || !augmentation.retrievedContent || augmentation.retrievedContent.length === 0) {
      console.log("RAG: No relevant augmentation found");
      return responseText;
    }
    
    // Enhanced special handling for depression
    if (hasDepressionIndicators) {
      // For depression, ensure the augmentation includes depression-relevant content
      const depressionRelevantContent = augmentation.retrievedContent.filter(content => 
        /\b(depress(ed|ing|ion)?|sad|down|low|mood|mental health|support|therapy|treatment)\b/i.test(content)
      );
      
      // If we have depression-relevant content, prioritize it
      if (depressionRelevantContent.length > 0) {
        console.log("RAG: Using depression-specific content for augmentation");
        return await augmentResponseWithRetrieval(
          responseText,
          userInput,
          { ...augmentation, retrievedContent: depressionRelevantContent }
        );
      }
    }
    
    // Normal augmentation process
    const enhancedResponse = await augmentResponseWithRetrieval(
      responseText,
      userInput,
      augmentation
    );
    
    // Record the exchange in the vector database for future use
    await addConversationExchange(userInput, enhancedResponse);
    
    console.log("RAG: Response enhanced with relevant knowledge");
    return enhancedResponse;
    
  } catch (error) {
    console.error("Error in RAG enhancement:", error);
    // Return original response if enhancement fails
    return responseText;
  }
};

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

/**
 * Analyzes the conversation context and checks for hallucinations
 * Enhanced with emotion context awareness
 */
export const analyzeConversation = async (
  conversationHistory: string[],
  options: Partial<HallucinationPreventionOptions> = {}
): Promise<any> => {
  try {
    if (!conversationHistory || conversationHistory.length < 2) {
      return { analysisComplete: false, message: "Not enough conversation history" };
    }
    
    // Get the last user message and Roger's response
    const userInput = conversationHistory[conversationHistory.length - 2];
    const responseText = conversationHistory[conversationHistory.length - 1];
    
    // Extract emotions from user input
    const emotions = extractEmotionsFromInput(userInput);
    
    // Check for hallucinations with emotion awareness
    const hallucination = detectHallucinations(
      responseText,
      userInput,
      conversationHistory.slice(0, -2) // Previous history
    );
    
    // Check for emotion misidentification
    const emotionAnalysis = {
      hasDetectedEmotion: emotions.hasDetectedEmotion,
      primaryEmotion: emotions.explicitEmotion || 
                     (emotions.emotionalContent?.hasEmotion ? emotions.emotionalContent.primaryEmotion : null),
      emotionMisidentified: hallucination.isHallucination && hallucination.emotionMisidentified
    };
    
    return {
      analysisComplete: true,
      wasHallucination: hallucination.isHallucination,
      emotionAnalysis,
      hallucination: hallucination.isHallucination ? hallucination : null,
      suggestedCorrection: hallucination.isHallucination ? "Corrected response would be provided here" : null
    };
    
  } catch (error) {
    console.error("Error analyzing conversation:", error);
    return { analysisComplete: false, error: error.message };
  }
};

// Export main functions
export { 
  preventHallucinations,
  detectHallucinations,
  retrieveAugmentation,
  augmentResponseWithRetrieval,
  // Re-export from retrieval.ts
  addConversationExchange,
  retrieveSimilarResponses,
  retrieveFactualGrounding
};
