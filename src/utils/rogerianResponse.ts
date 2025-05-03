
/**
 * Enhanced Rogerian Response Hook with:
 * 1. Conversation detection and memory reset
 * 2. Advanced hallucination prevention system
 * 3. Token-level verification
 * 4. Optimized for brief patient interactions (30s-5min)
 * 
 * Ensures memory accuracy and factual consistency in responses
 */

// Original content import
import originalUseRogerianResponse from './rogerianResponse/index';

// Import memory reset functions
import { resetMemory, isNewConversation, processResponse } from './memory';
import { resetFiveResponseMemory, isNewConversationFiveResponse } from './memory/fiveResponseMemory';
import { detectNewConversation, resetConversationSession } from './memory/newConversationDetector';
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
      
      // First, check if this is likely a new conversation using all available methods
      const isNewConvo = isNewConversation(userInput);
      const isNewFiveResponseConvo = isNewConversationFiveResponse();
      const isNewDetectedConvo = detectNewConversation(userInput);
      
      // If any system detects a new conversation, reset all memory systems
      if (isNewConvo || isNewFiveResponseConvo || isNewDetectedConvo) {
        console.log("NEW CONVERSATION DETECTED: Resetting all memory systems");
        resetMemory();
        resetFiveResponseMemory();
        resetConversationSession();
      }
      
      // Now process the message with the original logic
      const response = await originalHook.processUserMessage(userInput);
      
      // Check if we're in early conversation stage
      const earlyStage = isEarlyConversation();
      
      // Extract minimal conversation history for context
      // This is a simple approximation, ideally you'd pass the actual history
      let conversationHistory: string[] = [userInput];
      
      // Apply enhanced response processing for brief interactions
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
