
/**
 * Response Enhancer
 * 
 * Unified system for enhancing responses with contextual awareness and error prevention
 */

import { checkForCrisisContent } from '../../hooks/chat/useCrisisDetector';
import { enhanceResponseWithMemory } from './processor/memoryEnhancement';
import { preventHallucinations } from '../memory/hallucination/preventionV2';
import { isEarlyConversation } from '../memory/systems/earlyConversationHandler';

/**
 * Enhances a response with unified enhancement pipeline
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextInfo: any = {}
): string => {
  try {
    // Check if this is a crisis situation - if so, don't modify the response
    if (checkForCrisisContent(userInput)) {
      return responseText;
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
    
    // Return the final enhanced response
    return hallucinationResult.text;
    
  } catch (error) {
    console.error("Error in response enhancement:", error);
    return responseText; // Return original response if enhancement fails
  }
};
