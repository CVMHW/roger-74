
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { generateSafetyResponse } from '../safetyResponseGenerator';

/**
 * Process mental health related concerns
 */
export const processMentalHealthConcerns = (
  userInput: string,
  concernType: ConcernType,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  clientPreferences: any,
  conversationHistory: string[],
  updateStage: () => void
): Promise<MessageType | null> => {
  // For safety concerns, use our enhanced safety response generator
  if (concernType && 
      ['mental-health', 'ptsd', 'trauma-response', 'pet-illness'].includes(concernType)) {
    
    // Update conversation stage
    updateStage();
    
    return baseProcessUserMessage(
      userInput,
      () => generateSafetyResponse(userInput, concernType, clientPreferences, conversationHistory),
      () => concernType,
      1.0 // No delay for critical concerns
    );
  }
  
  return null;
};
