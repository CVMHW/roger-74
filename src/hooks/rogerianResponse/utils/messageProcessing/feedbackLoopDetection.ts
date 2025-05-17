
import { useFeedbackLoopHandler } from '../../../response/feedbackLoopHandler';
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { recordToMemorySystems } from '../memoryHandler';

/**
 * Handles detection of feedback loops in conversation
 * 
 * @param userInput User's original message
 * @param conversationHistory Array of previous conversation messages
 * @param updateStage Function to update conversation stage
 * @returns Feedback loop response message if detected, null otherwise
 */
export const handleFeedbackLoopDetection = (
  userInput: string,
  conversationHistory: string[],
  updateStage: () => void
): MessageType | null => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Check if the user is indicating Roger isn't listening or is stuck in a loop
  const { handleFeedbackLoop } = useFeedbackLoopHandler();
  const feedbackLoopResponse = handleFeedbackLoop(userInput, conversationHistory);
  
  if (feedbackLoopResponse) {
    // Update conversation stage
    updateStage();
    
    // Record to memory systems
    recordToMemorySystems(userInput, feedbackLoopResponse);
    
    // Create a message with the recovery response
    return createMessage(feedbackLoopResponse, 'roger');
  }
  
  return null;
};
