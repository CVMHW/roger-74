
/**
 * Response enhancer
 * 
 * Enhances Roger's responses with context-aware improvements
 * and RAG-based factual grounding
 */

import { checkForCrisisContent, detectMultipleCrisisTypes } from '../../hooks/chat/crisisDetection';
import { enhanceResponseWithMemory } from './processor/memoryEnhancement';
import { preventHallucinations } from '../memory/hallucination/preventionV2';
import { isEarlyConversation } from '../memory/systems/earlyConversationHandler';
import { processResponse } from './processor';

// Import the new RAG components
import { 
  augmentResponseWithReranking,
  extractTopics 
} from '../hallucinationPrevention/vectorReranker';
import { 
  retrieveAugmentation,
  augmentResponseWithRetrieval,
  getPatientSentiment,
  initializeRetrievalSystem,
  addConversationExchange
} from '../hallucinationPrevention/retrieval';
import {
  isUsingSimulatedEmbeddings,
  forceReinitializeEmbeddingModel,
  detectBestAvailableDevice
} from '../hallucinationPrevention/vectorEmbeddings';

// Initialization flag to ensure we only try to initialize once
let ragSystemInitialized = false;
let lastInitAttempt = 0;
const INIT_COOLDOWN_MS = 60000; // 1 minute cooldown between init attempts

/**
 * Initialize the RAG system if not already initialized
 */
const ensureRAGSystemInitialized = async (): Promise<boolean> => {
  const now = Date.now();
  
  // If we've initialized recently or if we're already not using simulations, return
  if (ragSystemInitialized && now - lastInitAttempt < INIT_COOLDOWN_MS) {
    return !isUsingSimulatedEmbeddings();
  }
  
  lastInitAttempt = now;
  
  try {
    console.log("🔄 Checking RAG system initialization status...");
    
    // Detect best device
    const device = await detectBestAvailableDevice();
    console.log(`Using device: ${device} for RAG operations`);
    
    // If using simulated embeddings, try to reinitialize the model first
    if (isUsingSimulatedEmbeddings()) {
      console.log("⚠️ Attempting to switch from simulated to real embeddings...");
      await forceReinitializeEmbeddingModel();
    }
    
    // Initialize the retrieval system (includes vector database)
    const success = await initializeRetrievalSystem();
    ragSystemInitialized = true;
    
    return success && !isUsingSimulatedEmbeddings();
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    ragSystemInitialized = true; // Mark as initialized to avoid repeated attempts
    return false;
  }
};

/**
 * Records user message to memory systems
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Implementation would store the user input in memory system
    console.log("Processing user message for memory:", userInput.substring(0, 30) + "...");
  } catch (error) {
    console.error("Error processing user message for memory:", error);
  }
};

/**
 * Checks if a response is repetitive compared to recent responses
 */
export const checkForResponseRepetition = (
  responseText: string,
  recentResponses: string[] = []
): boolean => {
  if (recentResponses.length === 0) return false;
  
  // Simple repetition check - if the exact same response has been given recently
  if (recentResponses.includes(responseText)) {
    return true;
  }
  
  // Check for substantial overlap with recent responses
  for (const recentResponse of recentResponses) {
    const overlapThreshold = 0.8;
    const minLength = Math.min(responseText.length, recentResponse.length);
    
    if (minLength < 20) continue; // Skip very short responses
    
    // Calculate similarity (very simple check for demonstration)
    let matchingChars = 0;
    for (let i = 0; i < Math.min(responseText.length, recentResponse.length); i++) {
      if (responseText[i] === recentResponse[i]) {
        matchingChars++;
      }
    }
    
    const similarity = matchingChars / minLength;
    if (similarity > overlapThreshold) {
      return true;
    }
  }
  
  return false;
};

/**
 * Provides a response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I want to make sure I'm addressing your concerns fully. Could you tell me more about what's been going on?",
    "I'd like to explore this topic from a different angle. What aspects of this situation feel most challenging to you?",
    "Let's take a step back and look at the bigger picture. What would be most helpful to focus on right now?",
    "I notice we might be covering similar ground. Is there something specific you'd like me to address that I haven't yet?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};

/**
 * Get status of embedding system for diagnostics
 */
export const getEmbeddingSystemStatus = async (): Promise<string> => {
  const isSimulated = isUsingSimulatedEmbeddings();
  const device = await detectBestAvailableDevice();
  
  return isSimulated 
    ? `⚠️ Using simulated embeddings (fallback mode) on ${device}` 
    : `✅ Using Hugging Face transformer embeddings on ${device}`;
};

/**
 * Enhances a response with unified enhancement pipeline
 * including RAG-based factual grounding
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextInfo: any = {}
): Promise<string> => {
  try {
    // Ensure the RAG system is initialized
    const startTime = performance.now();
    const isUsingRealEmbeddings = await ensureRAGSystemInitialized();
    const systemStatus = await getEmbeddingSystemStatus();
    console.log("Response enhancer status:", systemStatus);
    console.log(`RAG system using real embeddings: ${isUsingRealEmbeddings}`);
    
    // Check if this is a crisis situation - if so, don't modify the response
    if (checkForCrisisContent(userInput)) {
      console.log("Crisis content detected, returning original response");
      return responseText;
    }

    // Detect emotional content using semantic analysis
    const sentimentResult = await getPatientSentiment(userInput);
    const isDepressed = sentimentResult['depression'] === 'detected';
    const isAnxious = sentimentResult['anxiety'] === 'detected';
    const isAngry = sentimentResult['anger'] === 'detected';
    
    // Enhanced emotional detection for depression and sadness
    if (isDepressed || /\b(depress(ed|ion)|sad(ness)?|feeling (down|blue))\b/i.test(userInput.toLowerCase())) {
      console.log("Depression/sadness indicators detected in user input");
      
      // If response doesn't acknowledge depression/sadness, prioritize emotional acknowledgment
      if (!/\b(depress(ed|ion)|sad(ness)?|feeling (down|blue))\b/i.test(responseText.toLowerCase())) {
        console.log("Response doesn't acknowledge emotional state, enhancing");
        // Don't replace response but ensure emotional state is acknowledged
        const emotionAcknowledgment = "I hear that you're feeling depressed. ";
        
        // Only prepend if not already acknowledging emotions
        if (!responseText.toLowerCase().includes("feeling") && !responseText.toLowerCase().includes("emotion")) {
          responseText = emotionAcknowledgment + responseText;
        }
      }
    }
    
    // First enhance with memory awareness
    const memoryEnhanced = enhanceResponseWithMemory({
      response: responseText,
      userInput,
      conversationHistory
    });
    
    // Then apply hallucination prevention
    const hallucinationResult = preventHallucinations(
      memoryEnhanced,
      userInput,
      conversationHistory
    );
    
    // Get topics for RAG retrieval
    const topics = extractTopics(userInput);
    
    // Process through RAG system to ground in facts
    let enhancedResponse = hallucinationResult.text;
    
    try {
      // Check if embeddings are available
      if (isUsingRealEmbeddings) {
        console.log("Using real embeddings for RAG augmentation");
        
        // Use RAG augmentation with real embeddings
        const retrievalResult = await retrieveAugmentation(userInput, conversationHistory);
        
        if (retrievalResult.confidence > 0.3) {
          enhancedResponse = await augmentResponseWithRetrieval(enhancedResponse, retrievalResult);
          console.log(`RAG augmentation applied with confidence: ${retrievalResult.confidence.toFixed(2)}`);
        } else {
          // Fallback to reranker if retrieval confidence is low
          enhancedResponse = await augmentResponseWithReranking(enhancedResponse, userInput);
          console.log("Fallback to reranker for RAG augmentation");
        }
      } else {
        console.log("Using fallback reranking for RAG augmentation");
        enhancedResponse = await augmentResponseWithReranking(enhancedResponse, userInput);
      }
    } catch (error) {
      console.error("Error in RAG augmentation:", error);
    }
    
    // Process the response through all handlers using the unified processor
    const processedResponse = processResponse(
      enhancedResponse,
      userInput,
      conversationHistory
    );
    
    // Store the conversation exchange in the vector database for future reference
    addConversationExchange(userInput, processedResponse).catch(error => 
      console.error("Error storing conversation in vector database:", error)
    );
    
    // Log total enhancement time
    const enhancementTime = performance.now() - startTime;
    console.log(`Response enhancement completed in ${Math.round(enhancementTime)}ms`);
    
    // Return the final enhanced response
    return processedResponse;
    
  } catch (error) {
    console.log("Error in response enhancement:", error);
    return responseText; // Return original response if enhancement fails
  }
};
