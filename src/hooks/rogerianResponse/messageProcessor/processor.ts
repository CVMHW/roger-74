
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { ProcessMessageProps } from './types';
import { extractKeyTopics, getAppropriateAdjective } from './topicExtractor';
import { processFrustrationAndSmallTalk } from './frustrationHandler';
import { processSafetyConcerns } from '../processors/safetyProcessor';
import { processSpecialCases } from '../processors/specialCaseProcessor';
import { processPetIllnessConcerns } from '../processors/petIllnessProcessor';
import { processMentalHealthConcerns } from '../processors/mentalHealthProcessor';
import { processGeneralMessage } from '../processors/generalMessageProcessor';

/**
 * Processes user messages and generates appropriate responses
 */
export const processUserMessage = async (
  props: ProcessMessageProps
): Promise<MessageType> => {
  const {
    userInput,
    detectConcerns,
    generateResponse,
    baseProcessUserMessage,
    conversationHistory,
    clientPreferences,
    updateStage
  } = props;
  
  try {
    // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
    const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
    
    // If this is the first substantive message, ensure we don't ask a redundant question
    if (isContentfulFirstMessage) {
      // Make sure we update the stage first
      updateStage();
      
      // Extract key topics from the user's message
      const topics = extractKeyTopics(userInput);
      
      if (topics.length > 0) {
        // Create a custom response acknowledging what they've shared
        const customResponse = `I hear that you're dealing with ${topics.join(" and ")}. That sounds ${getAppropriateAdjective(topics)}. Could you tell me more about how this has been affecting you?`;
        
        // Use the baseProcessUserMessage with our custom response
        return baseProcessUserMessage(
          userInput,
          () => customResponse,
          () => detectConcerns(userInput)
        );
      }
    }
    
    // Process everyday frustrations and small talk
    const frustrationOrSmallTalkResponse = await processFrustrationAndSmallTalk({
      userInput,
      baseProcessUserMessage,
      conversationHistory,
      updateStage
    });
    
    if (frustrationOrSmallTalkResponse) {
      return frustrationOrSmallTalkResponse;
    }
    
    // CRITICAL: Check for suicide/self-harm mentions as next highest priority
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
    const mentalHealthResponse = await processMentalHealthConcerns(
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
    const generalResponse = await processGeneralMessage(
      userInput,
      concernType,
      generateResponse,
      baseProcessUserMessage,
      updateStage
    );
    
    // 6. Process the response through master rules with conversation history
    const messageCount = conversationHistory.length;
    const processedResponse = {
      ...generalResponse,
      text: processResponseThroughMasterRules(
        generalResponse.text, 
        userInput, 
        messageCount,
        conversationHistory
      )
    };
    
    return processedResponse;
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    // Return a fallback response if an error occurs - even in error, provide a supportive response
    return Promise.resolve(createMessage(
      "I hear what you're sharing. What would be most helpful to focus on right now?", 
      'roger'
    ));
  }
};
