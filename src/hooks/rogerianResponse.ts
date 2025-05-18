
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
  retrieveRelevantContent,
  isRAGSystemReady
} from '../utils/hallucinationPrevention';

// Import original hook implementation
import originalUseRogerianResponse from './rogerianResponse/index';

// Import correct types
import { HallucinationPreventionOptions } from '../types/hallucinationPrevention';
import { MemorySystemConfig } from '../utils/memory/types';

/**
 * Enhanced Rogerian Response Hook with integrated memory and RAG systems
 * optimized for brief patient interactions (30s-5min)
 */
const useRogerianResponse = () => {
  // Get the original hook implementation
  const originalHook = originalUseRogerianResponse();
  
  // Store recent conversation history for context
  let conversationHistory: string[] = [];
  
  // Enhance processUserMessage with memory integration and RAG
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("ENHANCED ROGERIAN HOOK: Processing user message");
      
      // Add to conversation history
      conversationHistory.push(userInput);
      if (conversationHistory.length > 5) {
        conversationHistory = conversationHistory.slice(-5);
      }
      
      // Check if this is a new conversation
      if (masterMemory.isNewConversation(userInput)) {
        console.log("NEW CONVERSATION DETECTED: Resetting memory systems");
        masterMemory.resetMemory();
        conversationHistory = [userInput];
      }
      
      // Store user input in memory
      masterMemory.addMemory(userInput, 'patient', undefined, 0.8);
      
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
          const isSubstantiveMessage = userInput.length > 30;
          
          if (isSubstantiveMessage) {
            enhancedText = await enhanceResponseWithRAG(
              enhancedText,
              userInput,
              conversationHistory
            );
          }
        } catch (ragError) {
          console.error("Error in RAG enhancement:", ragError);
        }
      }
      
      // Track Roger's response in memory
      masterMemory.addMemory(enhancedText, 'roger');
      
      // Add to conversation history
      conversationHistory.push(enhancedText);
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
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
