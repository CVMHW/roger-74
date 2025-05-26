
/**
 * Enhanced process user message with refined crisis detection
 */

import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { handleRefinedCrisisDetection } from './messageProcessing/refinedCrisisDetection';
import { processSafetyConcerns } from '../processors/safetyProcessor';

interface ProcessUserMessageDependencies {
  conversationHistory: string[];
  updateConversationHistory: (message: string) => void;
  conversationStage: string;
  messageCount: number;
  updateStage: () => void;
  detectConcerns: (input: string) => ConcernType | null;
  generateResponse: (input: string) => string;
  baseProcessUserMessage: (input: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>;
  clientPreferences: any;
}

/**
 * Enhanced process user message with refined crisis detection and audit logging
 */
export const processUserMessage = async (
  userInput: string,
  deps: ProcessUserMessageDependencies
): Promise<MessageType> => {
  const {
    conversationHistory,
    updateConversationHistory,
    conversationStage,
    messageCount,
    updateStage,
    detectConcerns,
    generateResponse,
    baseProcessUserMessage,
    clientPreferences
  } = deps;

  // Update conversation history first
  updateConversationHistory(userInput);

  // CRITICAL: Refined crisis detection with severity assessment (HIGHEST PRIORITY)
  const crisisResponse = await handleRefinedCrisisDetection(userInput, updateStage);
  if (crisisResponse) {
    return crisisResponse;
  }

  // SAFETY CONCERNS: Check for other safety concerns
  const concernType = detectConcerns(userInput);
  if (concernType === 'tentative-harm' || concernType === 'crisis') {
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
  }

  // NORMAL PROCESSING: Continue with regular response generation
  return baseProcessUserMessage(
    userInput,
    generateResponse,
    () => concernType,
    1.0
  );
};
