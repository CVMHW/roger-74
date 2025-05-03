
/**
 * Enhanced Rogerian Response Hook with integrated memory system
 */

// Import our unified memory system
import { 
  masterMemory, 
  isEarlyConversation, 
  processResponse 
} from '../utils/memory';

// Import original hook implementation
import originalUseRogerianResponse from './rogerianResponse/index';

/**
 * Enhanced Rogerian Response Hook with integrated memory system optimized
 * for brief patient interactions (30s-5min)
 */
const useRogerianResponse = () => {
  // Get the original hook implementation
  const originalHook = originalUseRogerianResponse();
  
  // Enhance processUserMessage with memory integration
  const enhancedProcessUserMessage = async (userInput: string) => {
    try {
      console.log("ENHANCED ROGERIAN HOOK: Processing user message");
      
      // Check if this is a new conversation
      if (masterMemory.isNewConversation(userInput)) {
        console.log("NEW CONVERSATION DETECTED: Resetting memory systems");
        masterMemory.resetMemory();
      }
      
      // Store user input in memory
      masterMemory.addMemory(userInput, 'patient', undefined, 0.8);
      
      // Process with original hook
      const response = await originalHook.processUserMessage(userInput);
      
      // Extract minimal conversation history for context
      const conversationHistory: string[] = [userInput];
      
      // Apply hallucination prevention with our unified system
      const enhancedText = processResponse(
        response.text,
        userInput,
        conversationHistory
      );
      
      // Track Roger's response in memory
      masterMemory.addMemory(enhancedText, 'roger');
      
      // Return enhanced response if different
      if (enhancedText !== response.text) {
        console.log("ROGERIAN RESPONSE: Using enhanced response");
        return { ...response, text: enhancedText };
      }
      
      return response;
      
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
