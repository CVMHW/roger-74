
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { processSafetyConcerns } from './processors/safetyProcessor';
import { processSpecialCases } from './processors/specialCaseProcessor';
import { processPetIllnessConcerns } from './processors/petIllnessProcessor';
import { processMentalHealthConcerns } from './processors/mentalHealthProcessor';
import { processGeneralMessage } from './processors/generalMessageProcessor';

/**
 * Processes user messages and generates appropriate responses
 */
export const processUserMessage = async (
  userInput: string,
  detectConcerns: (userInput: string) => ConcernType,
  generateResponse: (userInput: string, concernType: ConcernType) => string,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  conversationHistory: string[],
  clientPreferences: any,
  updateStage: () => void
): Promise<MessageType> => {
  try {
    // CRITICAL: Check for suicide/self-harm mentions first, with highest priority
    const concernType = detectConcerns(userInput);
    
    // Process in order of priority:
    
    // 1. Safety concerns (most critical)
    const safetyResponse = await processSafetyConcerns(
      userInput, 
      concernType, 
      baseProcessUserMessage, 
      clientPreferences, 
      conversationHistory,
      updateStage
    );
    
    if (safetyResponse) {
      return safetyResponse;
    }
    
    // 2. Special cases (inpatient, weather, cultural adjustment)
    const specialCaseResponse = await processSpecialCases(
      userInput,
      concernType,
      baseProcessUserMessage,
      conversationHistory,
      updateStage
    );
    
    if (specialCaseResponse) {
      return specialCaseResponse;
    }
    
    // 3. Pet illness concerns
    const petIllnessResponse = await processPetIllnessConcerns(
      userInput,
      baseProcessUserMessage,
      updateStage
    );
    
    if (petIllnessResponse) {
      return petIllnessResponse;
    }
    
    // 4. Mental health related concerns
    const mentalHealthResponse = processMentalHealthConcerns(
      userInput,
      concernType,
      baseProcessUserMessage,
      clientPreferences,
      conversationHistory,
      updateStage
    );
    
    if (mentalHealthResponse) {
      return mentalHealthResponse;
    }
    
    // 5. General message processing (fallback)
    return processGeneralMessage(
      userInput,
      concernType,
      generateResponse,
      baseProcessUserMessage,
      updateStage
    );
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    // Return a fallback response if an error occurs - even in error, provide a supportive response
    return Promise.resolve(createMessage(
      "I'm here to listen and support you. What's been going on?", 
      'roger'
    ));
  }
};
