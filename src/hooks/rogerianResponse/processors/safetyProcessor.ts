
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';
import { generateSafetyResponse } from '../safetyResponseGenerator';
import { recordToMemory } from '../../../utils/nlpProcessor';
import { addToFiveResponseMemory } from '../../../utils/memory/fiveResponseMemory';

/**
 * Processes and handles safety-related messages with highest priority
 * With MULTI-MEMORY system integration
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
    
    // CRITICAL: Record to BOTH memory systems immediately
    recordToMemory(userInput, `SAFETY CONCERN: ${concernType}`);
    addToFiveResponseMemory('patient', userInput);
    
    // Update conversation stage
    updateStage();
    
    // Generate safety response
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
