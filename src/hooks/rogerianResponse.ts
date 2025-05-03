
/**
 * Enhanced Rogerian Response Hook with:
 * 1. Conversation detection and memory reset
 * 2. Hallucination prevention system
 * 
 * Ensures memory accuracy and factual consistency in responses
 */

// Original content import
import originalUseRogerianResponse from './rogerianResponse/index';

// Import memory reset functions
import { resetMemoryForNewConversation, isNewConversation } from '../utils/nlpProcessor';
import { resetFiveResponseMemory, isNewConversationFiveResponse } from '../utils/memory/fiveResponseMemory';
import { detectNewConversation, resetConversationSession } from '../utils/memory/newConversationDetector';

// New: Import hallucination prevention system
import { preventHallucinations } from '../utils/hallucinationPrevention';

/**
 * Enhanced Rogerian Response Hook with conversation detection and memory reset
 * Ensures memory won't incorrectly reference past conversations
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
        resetMemoryForNewConversation();
        resetFiveResponseMemory();
        resetConversationSession();
      }
      
      // Now process the message with the original logic
      const response = await originalHook.processUserMessage(userInput);
      
      // Verify the response for hallucinations if this isn't the first message
      if (!isNewConvo && !isNewFiveResponseConvo && !isNewDetectedConvo &&
          response.text.includes("you mentioned") || response.text.includes("I remember")) {
        
        console.log("CHECKING RESPONSE FOR HALLUCINATIONS");
        
        // Get conversation history for context
        // This is a simple approximation, ideally you'd pass the actual history
        const conversationHistory: string[] = [userInput];
        
        // Apply hallucination prevention
        const hallucinationResult = preventHallucinations(
          response.text, 
          userInput, 
          conversationHistory
        );
        
        // If hallucination prevention modified the response, use the corrected version
        if (hallucinationResult.wasRevised) {
          console.log("HALLUCINATION CORRECTED: Using revised response");
          return { ...response, text: hallucinationResult.processedResponse };
        }
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
