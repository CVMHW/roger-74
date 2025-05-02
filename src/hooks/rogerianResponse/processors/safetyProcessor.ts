
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';
import { generateSafetyResponse } from '../safetyResponseGenerator';

/**
 * Processes and handles safety-related messages with highest priority
 */
export const processSafetyConcerns = async (
  userInput: string,
  concernType: ConcernType,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  clientPreferences: any,
  conversationHistory: string[],
  updateStage: () => void
): Promise<MessageType | null> => {
  // Check if this is a safety concern (tentative-harm or crisis)
  if (concernType === 'tentative-harm' || concernType === 'crisis') {
    console.log(`CRITICAL: Processing ${concernType} concern`);
    
    // Update conversation stage
    updateStage();
    
    // Use safety response generator for critical messages
    return baseProcessUserMessage(
      userInput,
      () => generateSafetyResponse(userInput, concernType, clientPreferences, conversationHistory),
      () => concernType,
      1.0 // No delay for critical concerns
    );
  }
  
  return null;
};
