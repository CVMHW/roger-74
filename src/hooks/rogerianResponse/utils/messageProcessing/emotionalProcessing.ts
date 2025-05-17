
import { handleEmotionalPatterns } from '../../emotionalResponseHandlers';
import { MessageType } from '../../../../components/Message';
import { recordToMemorySystems } from '../memoryHandler';
import { ConcernType } from '../../../../utils/reflection/reflectionTypes';

/**
 * Handles emotional pattern detection in user messages
 * 
 * @param userInput User's original message
 * @param conversationHistory Array of previous conversation messages
 * @param baseProcessUserMessage Base function for processing user messages
 * @param detectConcerns Function to detect user concerns
 * @param updateStage Function to update conversation stage
 * @returns Emotional response message if appropriate, null otherwise
 */
export const handleEmotionalProcessing = async (
  userInput: string,
  conversationHistory: string[],
  baseProcessUserMessage: any,
  detectConcerns: (input: string) => ConcernType | null,
  updateStage: () => void
): Promise<MessageType | null> => {
  if (!userInput || typeof userInput !== 'string') {
    return null;
  }

  // Handle emotional patterns and special cases
  const emotionalResponse = await handleEmotionalPatterns(
    userInput, 
    conversationHistory,
    baseProcessUserMessage,
    detectConcerns,
    updateStage
  );
  
  if (emotionalResponse) {
    // Record to memory systems
    recordToMemorySystems(userInput, emotionalResponse.text);
    
    return emotionalResponse;
  }
  
  return null;
};
