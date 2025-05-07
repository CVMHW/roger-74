
/**
 * Roger Response Main Processor
 * 
 * Centralized system for processing all responses through standard steps
 */

import { processEmotions, extractEmotionsFromInput } from '../emotions';
import { verifyResponseMathematically } from '../strictVerification';

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
    
    // Step 1: Initial strict mathematical verification
    const verification = verifyResponseMathematically(responseText, userInput);
    if (verification.shouldRollback) {
      console.log("PROCESSOR: Verification failed, generating fallback");
      return generateFallbackResponse(userInput);
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
    
    // Step 14: Final strict mathematical verification
    const finalVerification = verifyResponseMathematically(responseText, userInput);
    if (finalVerification.shouldRollback) {
      console.log("PROCESSOR: Final verification failed, generating fallback");
      return generateFallbackResponse(userInput);
    }
    
    console.log("PROCESSOR: Response processing complete");
    return responseText;
  } catch (error) {
    console.error("Error in processCompleteResponse:", error);
    return responseText;
  }
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
