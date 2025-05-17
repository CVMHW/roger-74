
import { detectPatterns } from '../patternDetection';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { recordToMemorySystems } from '../memoryHandler';

/**
 * Handles pattern detection for first messages and context-aware responses
 * 
 * @param userInput User's original message
 * @param conversationHistory Array of previous conversation messages
 * @param updateStage Function to update conversation stage
 * @returns Pattern-based response message if appropriate, null otherwise
 */
export const handlePatternProcessing = async (
  userInput: string,
  conversationHistory: string[],
  updateStage: () => void
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
  const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
  
  // Detect patterns for context-aware responses
  const patternResult = await detectPatterns(userInput);
  
  // If this is the first substantive message, ensure we don't ask a redundant question
  if (isContentfulFirstMessage && patternResult.enhancedResponse) {
    // Make sure we update the stage first
    updateStage();
    
    // Record to memory systems
    recordToMemorySystems(userInput, patternResult.enhancedResponse);
    
    // Return the enhanced context response
    return createMessage(patternResult.enhancedResponse, 'roger');
  }
  
  return null;
};
