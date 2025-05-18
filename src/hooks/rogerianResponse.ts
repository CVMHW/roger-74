
/**
 * Enhanced Rogerian Response Hook with integrated memory system
 * and advanced RAG capabilities
 */

// Import our unified memory system
import { 
  masterMemory, 
  isEarlyConversation, 
  processResponse 
} from '../utils/memory';

// Import our enhanced RAG system
import {
  enhanceResponseWithRAG,
  isRAGSystemReady,
  initializeRAGSystem
} from '../utils/hallucinationPrevention';

// Import original hook implementation
import originalUseRogerianResponse from './rogerianResponse/index';

// Import correct types
import { HallucinationPreventionOptions } from '../types/hallucinationPrevention';
import { MemorySystemConfig } from '../utils/memory/types';
import { extractEmotionsFromInput } from '../utils/response/processor/emotions';

/**
 * Enhanced Rogerian Response Hook with integrated memory and RAG systems
 * optimized for brief patient interactions (30s-5min)
 */
const useRogerianResponse = () => {
  // Get the original hook implementation
  const originalHook = originalUseRogerianResponse();
  
  // Store recent conversation history for context
  let conversationHistory: string[] = [];
  
  // Initialize the RAG system when the hook is first used
  if (!isRAGSystemReady()) {
    console.log("Initializing RAG system on hook first use");
    initializeRAGSystem().catch(error => {
      console.error("Failed to initialize RAG system on first use:", error);
    });
  }
  
  // Enhance processUserMessage with memory integration and RAG
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("ENHANCED ROGERIAN HOOK: Processing user message");
      
      // Add to conversation history
      conversationHistory.push(userInput);
      if (conversationHistory.length > 5) {
        conversationHistory = conversationHistory.slice(-5);
      }
      
      // Extract emotions for unified emotion handling
      const emotionInfo = extractEmotionsFromInput(userInput);
      
      // CRITICAL: Check for depression immediately
      const hasDepressionIndicators = emotionInfo.isDepressionMentioned || 
        /\b(depress(ed|ion|ing)?|sad|down|blue|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible|depressed))\b/i.test(userInput.toLowerCase());
      
      if (hasDepressionIndicators) {
        console.log("CRITICAL: Depression detected, ensuring appropriate response");
        // Store in memory with high importance
        masterMemory.addMemory(userInput, 'patient', { emotions: ['depressed'] }, 0.9);
      }
      
      // Check if this is a new conversation
      if (masterMemory.isNewConversation(userInput)) {
        console.log("NEW CONVERSATION DETECTED: Resetting memory systems");
        masterMemory.resetMemory();
        conversationHistory = [userInput];
      }
      
      // Store user input in memory with emotion context
      masterMemory.addMemory(userInput, 'patient', {
        emotions: emotionInfo.emotionalContent?.hasEmotion ? [emotionInfo.emotionalContent.primaryEmotion] : undefined,
        isDepressionMentioned: emotionInfo.isDepressionMentioned
      }, 0.8);
      
      // Process with original hook
      const response = await originalHook.processUserMessage(userInput);
      
      // Apply hallucination prevention with our unified system
      let enhancedText = await processResponse(
        response.text,
        userInput,
        conversationHistory
      );
      
      // Further enhance with RAG if system is ready
      if (isRAGSystemReady()) {
        try {
          // Check if message is longer than simple greeting
          const isSubstantiveMessage = userInput.length > 20 || 
            /\b(depress(ed|ion|ing)?|feeling|feel|sad|down|upset|stressed|anxious|worried|angry)\b/i.test(userInput.toLowerCase());
          
          if (isSubstantiveMessage) {
            console.log("SUBSTANTIVE MESSAGE: Applying RAG enhancement");
            enhancedText = await enhanceResponseWithRAG(
              enhancedText,
              userInput,
              conversationHistory,
              emotionInfo // Pass unified emotion context to RAG
            );
          }
        } catch (ragError) {
          console.error("Error in RAG enhancement:", ragError);
        }
      }
      
      // Track Roger's response in memory with emotion context
      masterMemory.addMemory(enhancedText, 'roger', {
        inResponseTo: userInput,
        userEmotions: emotionInfo.emotionalContent?.hasEmotion ? [emotionInfo.emotionalContent.primaryEmotion] : undefined
      });
      
      // Add to conversation history
      conversationHistory.push(enhancedText);
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }
      
      // FINAL CHECK: Ensure depression is properly addressed
      if (hasDepressionIndicators && !/\b(depress(ed|ion|ing)?|difficult|hard time)\b/i.test(enhancedText.toLowerCase())) {
        console.log("CRITICAL: Adding depression acknowledgment to response");
        enhancedText = "I'm really sorry to hear you're feeling depressed. " + enhancedText;
      }
      
      // Return enhanced response
      return { ...response, text: enhancedText };
      
    } catch (error) {
      console.error("Error in enhanced processUserMessage:", error);
      // Fall back to original implementation
      return originalHook.processUserMessage(userInput);
    }
  };
  
  // Return enhanced hook
  return {
    ...originalHook,
    processUserMessage: enhancedProcessUserMessage
  };
};

// Export the enhanced hook
export default useRogerianResponse;
