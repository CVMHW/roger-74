import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { extractKeyTopics, getAppropriateAdjective } from './topicExtractor';
import { processFrustrationAndSmallTalk } from './frustrationHandler';
import { processSafetyConcerns } from '../processors/safetyProcessor';
import { processSpecialCases } from '../processors/specialCaseProcessor';
import { processPetIllnessConcerns } from '../processors/petIllnessProcessor';
import { processMentalHealthConcerns } from '../processors/mentalHealthProcessor';
import { processGeneralMessage } from '../processors/generalMessageProcessor';
import { correctGrammar } from '../../../utils/response/processor/grammarCorrection';
import { selectResponseApproach } from '../../../utils/response/processor/approachSelector';

/**
 * Processes user messages and generates appropriate responses
 */
export const processUserMessage = async (
  userInput: string,
  detectConcerns: (userInput: string) => ConcernType,
  generateResponse: (userInput: string, concernType: ConcernType) => string,
  baseProcessUserMessage: any,
  conversationHistory: string[],
  clientPreferences: any,
  updateStage: () => void
): Promise<MessageType> => {
  try {
    // Skip processing if userInput is not valid
    if (!userInput || typeof userInput !== 'string') {
      console.error("Invalid user input received", userInput);
      return Promise.resolve(createMessage(
        "I'm here to listen. What would you like to talk about today?", 
        'roger'
      ));
    }
    
    // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
    const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
    
    // Determine the appropriate approach before processing
    const approach = selectResponseApproach(userInput, conversationHistory);
    console.log("Selected response approach:", approach.type, "with logotherapy strength:", approach.logotherapyStrength);
    
    // If this is the first substantive message, ensure we don't ask a redundant question
    if (isContentfulFirstMessage) {
      // Make sure we update the stage first
      updateStage();
      
      // Extract key topics from the user's message
      const topics = extractKeyTopics(userInput);
      
      if (topics.length > 0) {
        // Create a custom response acknowledging what they've shared
        let customResponse = `I hear that you're dealing with ${topics.join(" and ")}. That sounds ${getAppropriateAdjective(topics)}. Could you tell me more about how this has been affecting you?`;
        
        // Apply grammar correction with user input for length adjustment
        customResponse = correctGrammar(customResponse, userInput);
        
        // Use the baseProcessUserMessage with our custom response
        return baseProcessUserMessage(
          userInput,
          () => customResponse,
          () => detectConcerns(userInput)
        );
      }
    }
    
    // Process everyday frustrations and small talk - particularly important for social situations
    if (approach.type === 'smalltalk' || approach.type === 'everydayFrustration') {
      const frustrationOrSmallTalkResponse = await processFrustrationAndSmallTalk({
        userInput,
        baseProcessUserMessage,
        conversationHistory,
        updateStage
      });
      
      if (frustrationOrSmallTalkResponse) {
        // Apply grammar correction to the response text with user input for length adjustment
        frustrationOrSmallTalkResponse.text = correctGrammar(frustrationOrSmallTalkResponse.text, userInput);
        return frustrationOrSmallTalkResponse;
      }
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
      // Do not limit length for safety responses
      safetyResponse.text = correctGrammar(safetyResponse.text);
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
      // Apply grammar correction with user input for length adjustment
      specialCaseResponse.text = correctGrammar(specialCaseResponse.text, userInput);
      return specialCaseResponse;
    }
    
    // 3. Pet illness concerns
    const petIllnessResponse = await processPetIllnessConcerns(
      userInput,
      baseProcessUserMessage,
      updateStage
    );
    
    if (petIllnessResponse) {
      // Apply grammar correction with user input for length adjustment
      petIllnessResponse.text = correctGrammar(petIllnessResponse.text, userInput);
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
      // Apply grammar correction with user input for length adjustment
      mentalHealthResponse.text = correctGrammar(mentalHealthResponse.text, userInput);
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
    let processedText = processResponseThroughMasterRules(
      generalResponse.text, 
      userInput, 
      conversationHistory
    );
    
    // Apply grammar correction to the final processed response, with user input for length adjustment
    processedText = correctGrammar(processedText, userInput);
    
    const processedResponse = {
      ...generalResponse,
      text: processedText
    };
    
    return processedResponse;
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    // Return a fallback response if an error occurs - even in error, provide a supportive response
    // Don't limit length of fallback responses in error situations
    return Promise.resolve(createMessage(
      "I hear what you're sharing. What would be most helpful to focus on right now?", 
      'roger'
    ));
  }
};
