
import { isUserIndicatingFeedbackLoop, extractConversationContext, generateFeedbackLoopRecoveryResponse } from '../../utils/conversationEnhancement/repetitionDetector';

export const useFeedbackLoopHandler = () => {
  /**
   * Function to check if the user is indicating Roger isn't listening
   */
  const checkForFeedbackLoopComplaints = (userInput: string): boolean => {
    return isUserIndicatingFeedbackLoop(userInput);
  };

  /**
   * Handles feedback loop detection and generates appropriate response
   */
  const handleFeedbackLoop = (userInput: string, conversationHistory: string[]): string | null => {
    if (checkForFeedbackLoopComplaints(userInput)) {
      const context = extractConversationContext(userInput, conversationHistory);
      return generateFeedbackLoopRecoveryResponse(context);
    }
    return null;
  };

  return {
    checkForFeedbackLoopComplaints,
    handleFeedbackLoop
  };
};
