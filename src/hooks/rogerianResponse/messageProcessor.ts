
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { processSafetyConcerns } from './processors/safetyProcessor';
import { processSpecialCases } from './processors/specialCaseProcessor';
import { processPetIllnessConcerns } from './processors/petIllnessProcessor';
import { processMentalHealthConcerns } from './processors/mentalHealthProcessor';
import { processGeneralMessage } from './processors/generalMessageProcessor';
import { 
  detectEverydayFrustration, 
  generateEverydayFrustrationResponse,
  detectSmallTalkCategory,
  generateSmallTalkResponse,
  enhanceRapportInEarlyConversation 
} from '../../utils/conversation/theSmallStuff';
import { processResponseThroughMasterRules } from '../../utils/response/responseProcessor';

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
    
    // Check for everyday frustrations first (non-clinical concerns)
    const frustrationInfo = detectEverydayFrustration(userInput);
    if (frustrationInfo.isFrustration) {
      const frustrationResponse = generateEverydayFrustrationResponse(userInput, frustrationInfo);
      
      // Process through master rules for additional validation
      const processedResponse = processResponseThroughMasterRules(
        frustrationResponse,
        userInput,
        conversationHistory.length,
        conversationHistory
      );
      
      // Update conversation stage
      updateStage();
      
      // Process with frustration response
      return baseProcessUserMessage(
        userInput,
        () => processedResponse,
        () => null
      );
    }
    
    // Check for small talk in early conversation
    const messageCount = conversationHistory.length;
    if (messageCount <= 5) {
      const smallTalkInfo = detectSmallTalkCategory(userInput);
      if (smallTalkInfo.isSmallTalk) {
        const smallTalkResponse = generateSmallTalkResponse(userInput, smallTalkInfo.category, messageCount);
        
        // Update conversation stage
        updateStage();
        
        // Process with small talk response
        return baseProcessUserMessage(
          userInput,
          () => smallTalkResponse,
          () => null
        );
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

/**
 * Extract key topics from user input for contextual responses
 */
const extractKeyTopics = (input: string): string[] => {
  const topics = [];
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing/i, topic: "your lost wrench" },
    { regex: /storm|electricity|power|outage/i, topic: "the power outage" },
    { regex: /presentation|work|job|boss|meeting|deadline/i, topic: "your work presentation" },
    { regex: /laptop|computer|device|phone|mobile/i, topic: "technology issues" },
    { regex: /frustrat(ed|ing)|upset|angry|mad|stress(ed|ful)/i, topic: "your frustration" },
    { regex: /anxious|anxiety|worry|concern/i, topic: "your anxiety" },
    { regex: /sad|down|depress(ed|ing)|unhappy/i, topic: "your feelings" }
  ];
  
  for (const pattern of topicPatterns) {
    if (pattern.regex.test(input.toLowerCase()) && !topics.includes(pattern.topic)) {
      topics.push(pattern.topic);
    }
  }
  
  return topics;
};

/**
 * Get appropriate adjective based on topics
 */
const getAppropriateAdjective = (topics: string[]): string => {
  if (topics.some(topic => 
    topic.includes("frustration") || 
    topic.includes("anxiety") || 
    topic.includes("feelings") ||
    topic.includes("lost wrench")
  )) {
    return "difficult";
  }
  
  if (topics.some(topic => 
    topic.includes("power outage") || 
    topic.includes("technology issues") ||
    topic.includes("work presentation")
  )) {
    return "challenging";
  }
  
  return "important to address";
};
