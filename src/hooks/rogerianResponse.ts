
/**
 * Enhanced Rogerian Response Hook with:
 * 1. Conversation detection and memory reset
 * 2. Advanced hallucination prevention system
 * 3. Token-level verification
 * 
 * Ensures memory accuracy and factual consistency in responses
 */

// Original content import
import originalUseRogerianResponse from './rogerianResponse/index';

// Import memory reset functions
import { resetMemoryForNewConversation, isNewConversation } from '../utils/nlpProcessor';
import { resetFiveResponseMemory, isNewConversationFiveResponse } from '../utils/memory/fiveResponseMemory';
import { detectNewConversation, resetConversationSession } from '../utils/memory/newConversationDetector';

// Import hallucination prevention system with enhanced features
import { preventHallucinations } from '../utils/memory/hallucination/preventionV2';
import { HallucinationPreventionOptions } from '../types/hallucinationPrevention';

/**
 * Enhanced Rogerian Response Hook with conversation detection, memory reset,
 * and comprehensive hallucination prevention
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
      
      // Get settings based on conversation stage
      const conversationHistoryLength = 5; // History to check for hallucinations
      
      // Extract minimal conversation history for context
      // This is a simple approximation, ideally you'd pass the actual history
      let conversationHistory: string[] = [userInput];
      
      // Apply hallucination prevention with appropriate configuration
      const preventionOptions: HallucinationPreventionOptions = {
        enableReasoning: true,
        enableRAG: true,
        enableDetection: true,
        reasoningThreshold: 0.7,
        detectionSensitivity: 0.7,
        enableTokenLevelDetection: true,
        tokenThreshold: 0.6,
        enableReranking: false
      };
      
      // Detect common hallucination triggers in the response
      const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(response.text);
      const containsEarlyReference = /last time|previous session|we've been|we discussed|as I mentioned earlier/i.test(response.text);
      
      // Adjust options for high-risk responses
      if (containsMemoryReference) {
        console.log("MEMORY REFERENCE DETECTED: Using enhanced verification");
        preventionOptions.detectionSensitivity = 0.85;
        preventionOptions.enableReranking = true;
      }
      
      // Extra precautions for early conversation references
      if (containsEarlyReference && conversationHistory.length < 3) {
        console.log("CRITICAL: Early conversation with continuity claims");
        preventionOptions.detectionSensitivity = 0.95;
        preventionOptions.enableTokenLevelDetection = true;
        preventionOptions.enableNLIVerification = true;
      }
      
      // Apply hallucination prevention
      const hallucinationResult = preventHallucinations(
        response.text, 
        userInput, 
        conversationHistory,
        preventionOptions
      );
      
      // If hallucination prevention modified the response, use the corrected version
      if (hallucinationResult.wasRevised) {
        console.log("HALLUCINATION CORRECTED: Using revised response");
        return { ...response, text: hallucinationResult.processedResponse };
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
