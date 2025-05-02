
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles final processing steps for the response before returning it
 */
export const finalizeResponse = (
  responseText: string,
  ensureResponseCompliance: (response: string) => string,
  addToResponseHistory: (response: string) => void,
  concernType?: ConcernType
): MessageType => {
  try {
    // Apply master rules to ensure no repetition
    let text = responseText;
    try {
      text = ensureResponseCompliance(responseText);
    } catch (error) {
      console.error("Error ensuring response compliance:", error);
    }
    
    // Add this response to the history to prevent future repetition
    try {
      addToResponseHistory(text);
    } catch (error) {
      console.error("Error adding response to history:", error);
    }
    
    // Create response message
    return createMessage(text, 'roger', concernType || null);
  } catch (error) {
    console.error("Error in finalizeResponse:", error);
    // Return fallback response if an error occurs
    return createMessage(
      "I'm here to listen. What would you like to talk about?", 
      'roger',
      null
    );
  }
};
