
/**
 * Enhanced Rogerian Response with Unified Memory System
 * 
 * Comprehensive integration of memory and hallucination prevention systems 
 * optimized for brief patient interactions (30s-5min)
 */

// Import from our integrated memory system
import { 
  resetMemory, 
  isNewConversation, 
  processResponse,
  getConversationMessageCount
} from './memory';

// Import our enhanced response processor
import { processResponseThroughMasterRules } from './response/responseProcessor';

// Import original hook implementation
import originalUseRogerianResponse from '../hooks/rogerianResponse/index';

// Import early conversation handling
import { isEarlyConversation } from './memory/systems/earlyConversationHandler';

/**
 * Enhanced Rogerian Response Hook optimized for brief interactions (30s-5min)
 */
const useRogerianResponse = () => {
  // Get the original hook implementation
  const originalHook = originalUseRogerianResponse();
  
  // Enhance processUserMessage to check for new conversations and prevent hallucinations
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("ENHANCED ROGERIAN HOOK: Processing user message");
      
      // First, check if this is likely a new conversation
      const isNewConvo = isNewConversation(userInput);
      
      // If new conversation detected, reset memory systems
      if (isNewConvo) {
        console.log("NEW CONVERSATION DETECTED: Resetting all memory systems");
        resetMemory();
      }
      
      // Process the message with the original logic
      const response = await originalHook.processUserMessage(userInput);
      
      // Check if we're in early conversation stage
      const earlyStage = isEarlyConversation();
      
      // Extract minimal conversation history for context
      let conversationHistory: string[] = [userInput];
      
      // Apply enhanced response processing with integrated memory system
      const enhancedText = processResponse(
        response.text,
        userInput,
        conversationHistory
      );
      
      // If the response was enhanced, return the modified version
      if (enhancedText !== response.text) {
        console.log("ROGERIAN RESPONSE: Using enhanced response text");
        return { ...response, text: enhancedText };
      }
      
      return response;
      
    } catch (error) {
      console.error("Error in enhanced processUserMessage:", error);
      // Fall back to original implementation
      return originalHook.processUserMessage(userInput);
    }
  };
  
  // Return enhanced hook with memory protection and hallucination prevention
  return {
    ...originalHook,
    processUserMessage: enhancedProcessUserMessage
  };
};

// Export the enhanced hook
export default useRogerianResponse;
