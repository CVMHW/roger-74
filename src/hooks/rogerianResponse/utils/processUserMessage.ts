
/**
 * Enhanced process user message with pattern-matching NLP capabilities,
 * memory utilization, and safeguards for chat log review
 */

import { MessageType } from '../../../components/Message';
import { validateUserInput, createDefaultResponse } from './messageProcessing/messageValidation';
import { handleCrisisDetection } from './messageProcessing/crisisDetection';
import { handleEatingDisorderDetection } from './messageProcessing/eatingDisorderDetection';
import { handleFeedbackLoopDetection } from './messageProcessing/feedbackLoopDetection';
import { handlePatternProcessing } from './messageProcessing/patternProcessing';
import { handleEmotionalProcessing } from './messageProcessing/emotionalProcessing';
import { handleStandardProcessing } from './messageProcessing/standardProcessing';
import { createFallbackResponse } from './messageProcessing/errorHandling';
import { isSmallTalk, isIntroduction, isPersonalSharing, isEverydaySituation } from './messageProcessing/contextDetection';
import { checkAllRules } from '../../../utils/rulesEnforcement/rulesEnforcer';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Enhanced process user message with pattern-matching NLP capabilities,
 * memory utilization, and safeguards for chat log review
 */
export const processUserMessage = async (
  userInput: string,
  dependencies: {
    conversationHistory: string[],
    updateConversationHistory: (input: string) => void,
    conversationStage: any,
    messageCount: number,
    updateStage: () => void,
    detectConcerns: (input: string) => ConcernType | null,
    generateResponse: (input: string, concernType: ConcernType | null) => string,
    baseProcessUserMessage: (input: string, responseFn: any, concernFn: any, multiplier?: number) => Promise<MessageType>,
    clientPreferences: any
  }
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
  } = dependencies;
  
  try {
    // Validate input
    if (!validateUserInput(userInput)) {
      return Promise.resolve(createDefaultResponse());
    }
    
    // Run rule enforcement check at beginning of processing
    try {
      checkAllRules();
    } catch (error) {
      console.error("Rule enforcement error, continuing with processing:", error);
    }
    
    // Always update conversation history
    updateConversationHistory(userInput);
    
    // 1. Crisis detection (highest priority)
    const crisisResponse = handleCrisisDetection(userInput, updateStage);
    if (crisisResponse) {
      return Promise.resolve(crisisResponse);
    }
    
    // 2. Eating disorder detection (second highest priority)
    const eatingDisorderResponse = handleEatingDisorderDetection(userInput, updateStage);
    if (eatingDisorderResponse) {
      return Promise.resolve(eatingDisorderResponse);
    }
    
    // 3. Check for feedback loops
    const feedbackLoopResponse = handleFeedbackLoopDetection(userInput, conversationHistory, updateStage);
    if (feedbackLoopResponse) {
      return Promise.resolve(feedbackLoopResponse);
    }
    
    // 4. First message pattern detection
    const patternResponse = await handlePatternProcessing(userInput, conversationHistory, updateStage);
    if (patternResponse) {
      return Promise.resolve(patternResponse);
    }
    
    // 5. Emotional pattern processing
    const emotionalResponse = await handleEmotionalProcessing(
      userInput, 
      conversationHistory, 
      baseProcessUserMessage,
      detectConcerns,
      updateStage
    );
    if (emotionalResponse) {
      return Promise.resolve(emotionalResponse);
    }
    
    // 6. Standard message processing (fallback)
    return handleStandardProcessing(
      userInput,
      detectConcerns,
      generateResponse,
      baseProcessUserMessage,
      conversationHistory,
      messageCount,
      clientPreferences,
      updateStage
    );
    
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    return Promise.resolve(createFallbackResponse(userInput));
  }
};
