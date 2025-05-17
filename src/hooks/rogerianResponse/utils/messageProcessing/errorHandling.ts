
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';
import { recordErrorToMemorySystems } from '../memoryHandler';

/**
 * Creates a fallback response when an error occurs
 * 
 * @param userInput User's original message
 * @returns Fallback response message
 */
export const createFallbackResponse = (userInput: string): MessageType => {
  try {
    // Even in error, attempt to record the interaction
    recordErrorToMemorySystems(userInput);
  } catch (recordError) {
    console.error("Failed to record error to memory systems:", recordError);
  }
  
  // Return a fallback response if an error occurs
  return createMessage(
    "I'm listening. Could you tell me more about what's been happening?", 
    'roger'
  );
};
