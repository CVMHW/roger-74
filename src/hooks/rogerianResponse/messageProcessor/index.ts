
import { MessageType } from '../../../components/Message';
import { processUserMessage as processMessage } from './processor';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Process user message with proper detection and response generation
 * 
 * This is the main entry point for processing user messages.
 */
export const processUserMessage = async (
  userInput: string,
  detectConcerns: (userInput: string) => ConcernType,
  generateResponse: (userInput: string, concernType: ConcernType) => string,
  baseProcessUserMessage: any,
  conversationHistory: string[],
  clientPreferences: any,
  updateStage: () => void
): Promise<MessageType> => {
  // Pass all arguments individually to the processor
  return processMessage(
    userInput,
    detectConcerns,
    generateResponse,
    baseProcessUserMessage,
    conversationHistory,
    clientPreferences,
    updateStage
  );
};
