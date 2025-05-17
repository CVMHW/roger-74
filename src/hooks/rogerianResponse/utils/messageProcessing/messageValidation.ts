
import { createMessage } from '../../../../utils/messageUtils';
import { MessageType } from '../../../../components/Message';

/**
 * Validates user input and returns a fallback message if invalid
 * 
 * @param userInput User's original message
 * @returns True if input is valid, false otherwise
 */
export const validateUserInput = (userInput: string): boolean => {
  if (!userInput || typeof userInput !== 'string') {
    console.error("Invalid user input received", userInput);
    return false;
  }
  return true;
};

/**
 * Creates a default message for invalid input
 * @returns Default response message
 */
export const createDefaultResponse = (): MessageType => {
  return createMessage(
    "I'm here to listen. What would you like to talk about today?", 
    'roger'
  );
};
