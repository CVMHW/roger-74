
/**
 * Response Enhancer
 * 
 * Unified system for enhancing responses with contextual awareness and error prevention
 */

import { checkForCrisisContent } from '../../hooks/chat/useCrisisDetector';
import { enhanceResponseWithMemory } from './processor/memoryEnhancement';
import { preventHallucinations } from '../memory/hallucination/preventionV2';
import { isEarlyConversation } from '../memory/systems/earlyConversationHandler';
import { processResponse } from './processor';

/**
 * Records user message to memory systems
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Implementation would store the user input in memory system
    console.log("Processing user message for memory:", userInput.substring(0, 30) + "...");
  } catch (error) {
    console.error("Error processing user message for memory:", error);
  }
};

/**
 * Checks if a response is repetitive compared to recent responses
 */
export const checkForResponseRepetition = (
  responseText: string,
  recentResponses: string[] = []
): boolean => {
  if (recentResponses.length === 0) return false;
  
  // Simple repetition check - if the exact same response has been given recently
  if (recentResponses.includes(responseText)) {
    return true;
  }
  
  // Check for substantial overlap with recent responses
  for (const recentResponse of recentResponses) {
    const overlapThreshold = 0.8;
    const minLength = Math.min(responseText.length, recentResponse.length);
    
    if (minLength < 20) continue; // Skip very short responses
    
    // Calculate similarity (very simple check for demonstration)
    let matchingChars = 0;
    for (let i = 0; i < Math.min(responseText.length, recentResponse.length); i++) {
      if (responseText[i] === recentResponse[i]) {
        matchingChars++;
      }
    }
    
    const similarity = matchingChars / minLength;
    if (similarity > overlapThreshold) {
      return true;
    }
  }
  
  return false;
};

/**
 * Provides a response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I want to make sure I'm addressing your concerns fully. Could you tell me more about what's been going on?",
    "I'd like to explore this topic from a different angle. What aspects of this situation feel most challenging to you?",
    "Let's take a step back and look at the bigger picture. What would be most helpful to focus on right now?",
    "I notice we might be covering similar ground. Is there something specific you'd like me to address that I haven't yet?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};

/**
 * Enhances a response with unified enhancement pipeline
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextInfo: any = {}
): string => {
  try {
    // Check if this is a crisis situation - if so, don't modify the response
    if (checkForCrisisContent(userInput)) {
      return responseText;
    }
    
    // First enhance with memory awareness
    const memoryEnhanced = enhanceResponseWithMemory({
      response: responseText,
      userInput,
      conversationHistory
    });
    
    // Then apply hallucination prevention
    const hallucinationResult = preventHallucinations(
      memoryEnhanced,
      userInput,
      conversationHistory
    );
    
    // Process the response through all handlers using the unified processor
    const processedResponse = processResponse(
      hallucinationResult.text,
      userInput,
      conversationHistory
    );
    
    // Return the final enhanced response
    return processedResponse;
    
  } catch (error) {
    console.error("Error in response enhancement:", error);
    return responseText; // Return original response if enhancement fails
  }
};
