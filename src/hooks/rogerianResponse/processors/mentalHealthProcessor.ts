
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { generateSafetyResponse } from '../safetyResponseGenerator';
import { recordToMemory } from '../../../utils/nlpProcessor';
import { addToFiveResponseMemory } from '../../../utils/memory/fiveResponseMemory';

/**
 * Process mental health related concerns
 * With MULTI-MEMORY system integration
 */
export const processMentalHealthConcerns = async (
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
    
    console.log(`PROCESSING MENTAL HEALTH CONCERN: ${concernType}`);
    
    // CRITICAL: Record to BOTH memory systems immediately
    recordToMemory(userInput, `MENTAL HEALTH CONCERN: ${concernType}`);
    addToFiveResponseMemory('patient', userInput);
    
    // Update conversation stage
    updateStage();
    
    // Generate appropriate safety response
    const response = await baseProcessUserMessage(
      userInput,
      () => generateSafetyResponse(userInput, concernType, clientPreferences, conversationHistory),
      () => concernType,
      1.0 // No delay for critical concerns
    );
    
    // CRITICAL: Record response to BOTH memory systems
    recordToMemory(userInput, response.text);
    addToFiveResponseMemory('roger', response.text);
    
    return response;
  }
  
  return null;
};
