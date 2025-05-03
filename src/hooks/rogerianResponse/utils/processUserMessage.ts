
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { handleEmotionalPatterns } from '../emotionalResponseHandlers';
import { processUserMessage as processMessage } from '../messageProcessor';
import { recordToMemorySystems, recordErrorToMemorySystems } from './memoryHandler';
import { enhanceResponse } from './responseEnhancer';
import { detectPatterns } from './patternDetection';
import { useFeedbackLoopHandler } from '../../response/feedbackLoopHandler';
import { checkAllRules } from '../../../utils/rulesEnforcement/rulesEnforcer';
import { ProcessMessageProps } from '../messageProcessor/types';

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
    detectConcerns: (input: string) => any,
    generateResponse: (input: string, concernType: any) => string,
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
    // Run rule enforcement check at beginning of processing
    checkAllRules();
    
    // Always update conversation history
    updateConversationHistory(userInput);
    
    // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
    const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
    
    // Detect patterns for context-aware responses
    const patternResult = await detectPatterns(userInput);
    
    // If this is the first substantive message, ensure we don't ask a redundant question
    if (isContentfulFirstMessage && patternResult.enhancedResponse) {
      // Make sure we update the stage first
      updateStage();
      
      // Record to memory systems
      recordToMemorySystems(userInput, patternResult.enhancedResponse);
      
      // Return the enhanced context response
      return Promise.resolve(createMessage(patternResult.enhancedResponse, 'roger'));
    }
    
    // Check if the user is indicating Roger isn't listening or is stuck in a loop
    const { handleFeedbackLoop } = useFeedbackLoopHandler();
    const feedbackLoopResponse = handleFeedbackLoop(userInput, conversationHistory);
    
    if (feedbackLoopResponse) {
      // Update conversation stage
      updateStage();
      
      // Record to memory systems
      recordToMemorySystems(userInput, feedbackLoopResponse);
      
      // Create a message with the recovery response
      return Promise.resolve(createMessage(feedbackLoopResponse, 'roger'));
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
    
    // Fix: Check if processMessage accepts a props object or individual arguments
    // Looking at the error, we need to pass individual arguments
    const response = await processMessage(
      userInput,
      detectConcerns,
      generateResponse,
      baseProcessUserMessage,
      conversationHistory,
      clientPreferences,
      updateStage
    );
    
    // Enhance the response with memory rules, master rules, and chat log review
    const finalResponseText = enhanceResponse(
      response.text,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Record to memory systems
    recordToMemorySystems(userInput, finalResponseText);
    
    // Return the memory-enhanced response with tertiary safeguard applied
    const finalResponse = createMessage(finalResponseText, 'roger');
    return finalResponse;
    
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    
    // Even in error, attempt to record the interaction
    recordErrorToMemorySystems(userInput);
    
    // Return a fallback response if an error occurs
    return Promise.resolve(createMessage(
      "I remember what you've shared with me. Could you tell me more about what's been happening?", 
      'roger'
    ));
  }
};
