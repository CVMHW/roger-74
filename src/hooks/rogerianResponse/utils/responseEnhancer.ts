
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { applyMemoryRules } from '../../../utils/rulesEnforcement/memoryEnforcer';
import { processThroughChatLogReview } from '../../../utils/response/chatLogReviewer';

/**
 * Enhances a response with memory rules, master rules, and chat log review
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[]
): string => {
  try {
    // First process through master rules to ensure memory utilization
    let enhancedText = processResponseThroughMasterRules(
      responseText,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Force memory enhancement according to memory rules
    enhancedText = applyMemoryRules(
      enhancedText,
      userInput,
      conversationHistory
    );
    
    // Apply tertiary safeguard - comprehensive chat log review
    enhancedText = processThroughChatLogReview(
      enhancedText,
      userInput,
      conversationHistory
    );
    
    return enhancedText;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return responseText; // Return original if enhancement fails
  }
};
