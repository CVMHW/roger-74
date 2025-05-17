import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { handleEmotionalPatterns } from '../emotionalResponseHandlers';
import { processUserMessage as processMessage } from '../messageProcessor';
import { recordToMemorySystems, recordErrorToMemorySystems } from './memoryHandler';
import { enhanceResponse } from './responseEnhancer';
import { detectPatterns } from './patternDetection';
import { useFeedbackLoopHandler } from '../../response/feedbackLoopHandler';
import { checkAllRules } from '../../../utils/rulesEnforcement/rulesEnforcer';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { createEatingDisorderResponse } from '../../../utils/response/handlers/eatingDisorderHandler';
import { detectMultipleCrisisTypes } from '../../chat/useCrisisDetector';
import { getCrisisResponse } from '../../../utils/crisis/crisisResponseCoordinator';

// Import or define the missing utility functions
const isSmallTalk = (input: string): boolean => {
  return /\bhello\b|\bhi\b|\bhey\b|\bgreetings\b|\bhowdy\b|\bweather\b|\bsports\b|\bweekend\b|\bplans\b/i.test(input.toLowerCase());
};

const isIntroduction = (input: string): boolean => {
  return /\bmy name is\b|\bi am\b|\bnice to meet\b|\bpleasure\b|\bintroduce\b|\bfirst time\b/i.test(input.toLowerCase());
};

const isPersonalSharing = (input: string): boolean => {
  return /\bi feel\b|\bi am feeling\b|\bi'm feeling\b|\bi've been\b|\bi have been\b|\bi'm going through\b|\bi am going through\b/i.test(input.toLowerCase());
};

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
    // Validate input
    if (!userInput || typeof userInput !== 'string') {
      console.error("Invalid user input received", userInput);
      return Promise.resolve(createMessage(
        "I'm here to listen. What would you like to talk about today?", 
        'roger'
      ));
    }
    
    // Run rule enforcement check at beginning of processing
    try {
      checkAllRules();
    } catch (error) {
      console.error("Rule enforcement error, continuing with processing:", error);
    }
    
    // Always update conversation history
    updateConversationHistory(userInput);
    
    // ENHANCED: MULTI-CRISIS DETECTION
    // Check for multiple crisis types in a single message
    const crisisTypes = detectMultipleCrisisTypes(userInput);
    
    // If multiple crisis types are detected, prioritize suicide first, then others
    if (crisisTypes.length > 0) {
      console.log("MULTI-CRISIS DETECTION: Found crisis types:", crisisTypes);
      
      // Update stage
      updateStage();
      
      let crisisType = crisisTypes[0];
      let crisisTag = `CRISIS:${crisisType.toUpperCase()}`;
      
      // Always prioritize suicide if it's one of the detected types
      if (crisisTypes.includes('suicide')) {
        crisisType = 'suicide';
        crisisTag = 'CRISIS:SUICIDE';
      }
      
      // Get appropriate crisis response from coordinator
      const response = getCrisisResponse(concernType as ConcernType);
      
      try {
        // Record to memory systems with crisis tag
        recordToMemorySystems(userInput, response, crisisTag);
      } catch (error) {
        console.error("Error recording to memory systems:", error);
      }
      
      // Return specific crisis response
      return Promise.resolve(createMessage(response, 'roger', crisisType));
    }
    
    // CRISIS DETECTION - HIGHEST PRIORITY: Always check first before any memory system
    // Check for suicide, self-harm, or other crisis indicators
    if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase())) {
      console.log("CRITICAL PRIORITY: Detected suicide or self-harm indicators");
      // Update stage
      updateStage();
      
      // Use crisis response
      const response = "I'm very concerned about what you're sharing regarding thoughts of suicide or self-harm. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
      
      try {
        // Record to memory systems with crisis tag
        recordToMemorySystems(userInput, response, "CRISIS:SUICIDE");
      } catch (error) {
        console.error("Error recording to memory systems:", error);
      }
      
      // Return immediate crisis response
      return Promise.resolve(createMessage(response, 'roger', 'crisis'));
    }
    
    // Check for eating disorder specifically to avoid hallucination - SECOND HIGHEST PRIORITY
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern) {
      console.log("HIGH PRIORITY: Detected eating disorder indicators with risk level:", edResult.riskLevel);
      // Update stage
      updateStage();
      
      // Get specialized response
      const edResponse = createEatingDisorderResponse(userInput);
      
      if (edResponse) {
        // Record to memory systems with crisis tag
        recordToMemorySystems(userInput, edResponse, "CRISIS:EATING-DISORDER");
        
        // Return eating disorder response
        return Promise.resolve(createMessage(edResponse, 'roger', 'eating-disorder'));
      }
    }
    
    // CRITICAL - Check if user just shared something but Roger is about to ask "what's going on"
    const isContentfulFirstMessage = userInput.length > 15 && conversationHistory.length <= 1;
    
    // Detect patterns for context-aware responses
    const patternResult = await detectPatterns(userInput);
    
    // Check for social situations using masterRules
    const isSmallTalkContext = isSmallTalk(userInput);
    const isIntroductionContext = isIntroduction(userInput);
    const isPersonalSharingContext = isPersonalSharing(userInput);
    
    // Check if this is an everyday situation
    const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party|date/i.test(userInput);
    
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
    
    // Call processMessage with individual arguments, not as an object
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
    // Pass information about message context for better response generation
    const finalResponseText = enhanceResponse(
      response.text,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Record to memory systems
    try {
      recordToMemorySystems(userInput, finalResponseText);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return the memory-enhanced response with tertiary safeguard applied
    const finalResponse = createMessage(finalResponseText, 'roger');
    return finalResponse;
    
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    
    // Even in error, attempt to record the interaction
    try {
      recordErrorToMemorySystems(userInput);
    } catch (recordError) {
      console.error("Failed to record error to memory systems:", recordError);
    }
    
    // Return a fallback response if an error occurs
    return Promise.resolve(createMessage(
      "I'm listening. Could you tell me more about what's been happening?", 
      'roger'
    ));
  }
};
