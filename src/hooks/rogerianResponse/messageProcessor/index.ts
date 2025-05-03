
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import type { ProcessMessageProps } from './types';

/**
 * Process user message with proper detection and response generation
 */
export const processUserMessage = async (
  props: ProcessMessageProps
): Promise<MessageType> => {
  const {
    userInput,
    detectConcernsFn,
    generateResponseFn,
    baseProcessUserMessage,
    conversationHistory,
    clientPreferences,
    updateStageFn
  } = props;
  
  try {
    // Detect any concerns in the user input
    const concernType = detectConcernsFn(userInput);

    // Generate an appropriate response based on the concern type
    const responseText = generateResponseFn(userInput, concernType);

    // Process the message using the base functionality
    const processedMessage = await baseProcessUserMessage(
      userInput,
      (input: string) => generateResponseFn(input, concernType),
      () => concernType
    );

    // Update conversation stage if needed
    if (updateStageFn) {
      updateStageFn();
    }

    return processedMessage;
  } catch (error) {
    console.error('Error processing message:', error);
    
    // Return a fallback message
    return createMessage(
      "I'm here to listen. Could you share more about what's been happening?",
      'roger'
    );
  }
};
