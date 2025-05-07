
/**
 * Response validation functionality
 * Provides validation and verification of response content
 */

import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';
import { verifyFiveResponseMemorySystem } from '../../memory/fiveResponseMemory';

/**
 * Validates the quality of a response before delivery
 */
export const validateResponseQuality = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): { isValid: boolean; reason?: string } => {
  // Check for empty or too short responses
  if (!responseText || responseText.trim().length < 5) {
    return { isValid: false, reason: 'Response is empty or too short' };
  }
  
  // Check for overly generic responses when user message is substantive
  if (userInput.length > 30 && 
      responseText.length < 25 && 
      /^(I understand|I'm here|I hear you|Tell me more)/.test(responseText)) {
    return { isValid: false, reason: 'Response is too generic for substantive input' };
  }
  
  // Check for response that doesn't match the user's input tone
  if (isEmotionalMessage(userInput) && !hasEmotionalResponsiveness(responseText)) {
    return { isValid: false, reason: 'Response lacks emotional attunement' };
  }
  
  return { isValid: true };
};

/**
 * Checks if a user message contains emotional content
 */
function isEmotionalMessage(message: string): boolean {
  const emotionalKeywords = [
    'sad', 'upset', 'angry', 'furious', 'depressed', 'anxious', 'worried',
    'scared', 'afraid', 'happy', 'excited', 'grateful', 'thankful', 'hurt',
    'disappointed', 'frustrated', 'overwhelmed', 'exhausted', 'lonely'
  ];
  
  return emotionalKeywords.some(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(message)
  );
}

/**
 * Checks if a response shows emotional responsiveness
 */
function hasEmotionalResponsiveness(response: string): boolean {
  const emotionalPhrases = [
    'understand', 'sounds', 'feeling', 'experience', 'challenging',
    'difficult', 'sense', 'hear that', 'must be', 'seems like'
  ];
  
  return emotionalPhrases.some(phrase => 
    new RegExp(`\\b${phrase}\\b`, 'i').test(response)
  );
}

/**
 * Verify all systems are operational before response processing
 */
export const verifySystemsOperational = (): boolean => {
  // CRITICAL: First verify that all memory systems are operational
  const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
  if (!fiveResponseMemoryOperational) {
    console.error("CRITICAL: 5ResponseMemory system failure detected");
    return false;
  }
  
  // MANDATORY: Check all system rules first
  checkAllRules();
  
  return true;
};
