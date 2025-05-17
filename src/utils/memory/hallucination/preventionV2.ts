
/**
 * Hallucination Prevention System V2
 * 
 * Advanced system for preventing hallucinations in Roger's responses,
 * especially during the critical first 30 seconds to 5 minutes of interaction
 */

import { isEarlyConversation, detectRiskyEarlyStatements, fixRiskyEarlyStatements } from '../systems/earlyConversationHandler';
import { detectHallucinations } from './detectorV2';
import { MemorySystemConfig } from '../types';
import { DEFAULT_MEMORY_CONFIG } from '../config';

/**
 * Apply hallucination prevention to a response
 */
export const preventHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[],
  config: MemorySystemConfig = DEFAULT_MEMORY_CONFIG
): {
  text: string;
  wasModified: boolean;
  confidence: number;
} => {
  console.log("HALLUCINATION PREVENTION: Checking response");
  
  // Special handling for early conversation
  if (isEarlyConversation()) {
    console.log("HALLUCINATION PREVENTION: Early conversation detected");
    
    // Check for risky early statements
    const riskyCheck = detectRiskyEarlyStatements(responseText);
    
    if (riskyCheck.isRisky) {
      console.log(`HALLUCINATION PREVENTION: Risky early statement detected - ${riskyCheck.reason}`);
      const fixedResponse = fixRiskyEarlyStatements(responseText);
      
      return {
        text: fixedResponse,
        wasModified: true,
        confidence: 0.9
      };
    }
  }
  
  // Check for hallucinations in the response
  const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
  
  // If hallucination detected, apply fix
  if (hallucinationCheck.isHallucination) {
    console.log(`HALLUCINATION PREVENTION: Hallucination detected with confidence: ${hallucinationCheck.confidence}`);
    
    // Apply correction based on hallucination prevention level
    let preventedResponse = responseText;
    
    // Check for suicide/self-harm content to ensure appropriate response is maintained
    if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|don'?t want to (live|be alive)/i.test(userInput.toLowerCase())) {
      // For suicide content, create a clean response that maintains appropriate crisis intervention
      preventedResponse = "I'm very concerned about what you're sharing. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
    }
    // Check for eating disorder content
    else if (/can't stop eating|binge eating|overeating|eating too much|not eating|haven'?t been eating/i.test(userInput.toLowerCase())) {
      // For eating disorder content, create a clean response without reference to previous conversation
      preventedResponse = "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
    }
    // For other hallucinations, create a generic clean response
    else {
      preventedResponse = "I hear what you're sharing. What would be most helpful to focus on right now?";
    }
    
    return {
      text: preventedResponse,
      wasModified: true,
      confidence: hallucinationCheck.confidence
    };
  }
  
  // No hallucination detected, return original response
  return {
    text: responseText,
    wasModified: false,
    confidence: 1.0
  };
};

