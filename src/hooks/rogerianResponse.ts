
// Original content import
import originalUseRogerianResponse from './rogerianResponse/index';

// Import memory reset functions
import { resetMemoryForNewConversation, isNewConversation } from '../utils/nlpProcessor';
import { resetFiveResponseMemory, isNewConversationFiveResponse } from '../utils/memory/fiveResponseMemory';

/**
 * Enhanced Rogerian Response Hook with conversation detection and memory reset
 * Ensures memory won't incorrectly reference past conversations
 */
const useRogerianResponse = () => {
  // Get the original hook implementation
  const originalHook = originalUseRogerianResponse();
  
  // Enhance processUserMessage to check for new conversations
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("ENHANCED ROGERIAN HOOK: Processing user message");
      
      // First, check if this is likely a new conversation
      const isNewConvo = isNewConversation(userInput);
      const isNewFiveResponseConvo = isNewConversationFiveResponse();
      
      // If either system detects a new conversation, reset both memory systems
      if (isNewConvo || isNewFiveResponseConvo) {
        console.log("NEW CONVERSATION DETECTED: Resetting memory systems");
        resetMemoryForNewConversation();
        resetFiveResponseMemory();
      }
      
      // Now process the message with the original logic
      return originalHook.processUserMessage(userInput);
      
    } catch (error) {
      console.error("Error in enhanced processUserMessage:", error);
      // Fall back to original implementation
      return originalHook.processUserMessage(userInput);
    }
  };
  
  // Return enhanced hook with memory protection
  return {
    ...originalHook,
    processUserMessage: enhancedProcessUserMessage
  };
};

// Export the enhanced hook
export default useRogerianResponse;
