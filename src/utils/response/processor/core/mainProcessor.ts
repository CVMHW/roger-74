
/**
 * Roger Response Main Processor
 * 
 * Centralized system for processing all responses through standard steps
 */

import { processEmotions, extractEmotionsFromInput } from '../emotions';
import { verifyResponseMathematically } from '../strictVerification';
import { integratedAnalysis } from '../../../masterRules/integration';

/**
 * Process a complete response through all enhancement and verification steps
 * @param responseText Original response text from base generation
 * @param userInput User input that triggered the response
 * @param conversationHistory Array of recent conversation messages
 * @returns The processed and enhanced response
 */
export function processCompleteResponse(
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string {
  try {
    console.log("PROCESSOR: Starting response processing");
    
    // Perform integrated analysis (connects masterRules, personality, and topic detection)
    const integrated = integratedAnalysis(userInput, conversationHistory);
    console.log("PROCESSOR: Integrated analysis completed", {
      isSmallTalk: integrated.conversationalContext.isSmallTalk,
      isPersonalSharing: integrated.conversationalContext.isPersonalSharing,
      clevelandTopic: integrated.clevelandContext.primaryTopic?.type,
      responseTime: integrated.timing.responseTime
    });
    
    // Step 1: Initial strict mathematical verification
    const verification = verifyResponseMathematically(responseText, userInput);
    if (verification.shouldRollback) {
      console.log("PROCESSOR: Verification failed, generating fallback");
      return verification.altText || generateFallbackResponse(userInput);
    }
    
    // Extract emotions from user input for context-aware processing
    const emotionInfo = extractEmotionsFromInput(userInput);
    console.log(`PROCESSOR: Extracted emotions - has emotion: ${emotionInfo.hasDetectedEmotion}`);
    
    // Step 2-13: Core processing steps
    
    // CRITICALLY IMPORTANT: Check and fix emotion misidentifications
    // This must happen early in the process to avoid propagating incorrect emotional context
    responseText = processEmotions(responseText, userInput);
    
    // If the user explicitly mentioned an emotion, ALWAYS acknowledge it
    if (emotionInfo.explicitEmotion && !responseText.includes(emotionInfo.explicitEmotion)) {
      const emotionWord = emotionInfo.explicitEmotion;
      
      // Check if response already starts with an acknowledgment
      if (!responseText.match(/^I hear|^I understand|^It sounds like/i)) {
        responseText = `I hear that you're feeling ${emotionWord}. ${responseText}`;
      }
    }
    
    // Add personality insight if appropriate
    if (integrated.personality.shouldIncludeInsight && integrated.personality.insight) {
      // Find a good spot to insert the insight
      const sentenceBreakIndex = findSentenceBreak(responseText);
      if (sentenceBreakIndex > 0) {
        responseText = 
          responseText.substring(0, sentenceBreakIndex + 1) + 
          integrated.personality.insight +
          responseText.substring(sentenceBreakIndex + 1);
      }
    }
    
    // Step 14: Final strict mathematical verification
    const finalVerification = verifyResponseMathematically(responseText, userInput);
    if (finalVerification.shouldRollback) {
      console.log("PROCESSOR: Final verification failed, generating fallback");
      return finalVerification.altText || generateFallbackResponse(userInput);
    }
    
    console.log("PROCESSOR: Response processing complete");
    return responseText;
  } catch (error) {
    console.error("Error in processCompleteResponse:", error);
    return responseText;
  }
}

/**
 * Find an appropriate break between sentences to insert content
 */
function findSentenceBreak(text: string): number {
  const matches = text.match(/[.!?]\s+/g);
  if (!matches || matches.length === 0) return -1;
  
  // Find the position of the first sentence break
  const firstSentence = text.search(/[.!?]\s+/);
  
  // If it's too early in the text, find the second sentence break
  if (firstSentence < 30 && matches.length > 1) {
    const secondSentenceSearchStart = firstSentence + 1;
    const secondSentenceSearchText = text.substring(secondSentenceSearchStart);
    const secondSentenceBreakRelative = secondSentenceSearchText.search(/[.!?]\s+/);
    
    if (secondSentenceBreakRelative > 0) {
      return secondSentenceSearchStart + secondSentenceBreakRelative;
    }
  }
  
  return firstSentence;
}

/**
 * Generate a fallback response when verification fails
 * @param userInput User's original message
 * @returns Fallback response
 */
function generateFallbackResponse(userInput: string): string {
  const fallbackResponses = [
    "I hear what you're sharing. Would you mind telling me more about how that's been affecting you?",
    "That sounds important. Could you share more about your experience so I can better understand?",
    "I'd like to hear more about that. What aspects of this have been most challenging for you?",
    "Thank you for sharing that with me. What would be most helpful to focus on right now?"
  ];
  
  // Choose a fallback response based on characters in the user input (deterministic)
  const responseIndex = userInput.length % fallbackResponses.length;
  
  return fallbackResponses[responseIndex];
}
