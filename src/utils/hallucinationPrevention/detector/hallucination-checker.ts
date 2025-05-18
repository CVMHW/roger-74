/**
 * Main hallucination check and fix function
 */

import { detectHallucinations } from './hallucination-detector';
import { HallucinationCheck } from './types';

/**
 * Checks for hallucinations and fixes them if found
 * 
 * @param responseText Response text to check
 * @param userInput User input that triggered the response 
 * @param conversationHistory Previous conversation history
 * @returns Object containing wasHallucination flag, corrected response, and hallucination details
 */
export const checkAndFixHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): { 
  wasHallucination: boolean; 
  correctedResponse: string; 
  hallucinationDetails?: HallucinationCheck; 
} => {
  // Check for hallucinations
  const hallucination = detectHallucinations(responseText, userInput, conversationHistory);
  
  if (hallucination.isHallucination) {
    let correctedResponse = responseText;
    
    // PRIORITY: Fix emotion misidentification first
    if (hallucination.emotionMisidentified) {
      console.log("HALLUCINATION CORRECTION: Fixing emotion misidentification");
      
      // Import needed for inline processing
      const { fixEmotionMisidentification } = require('../../response/processor/emotionHandler/emotionMisidentificationHandler');
      correctedResponse = fixEmotionMisidentification(correctedResponse, userInput);
    }
    
    // Fix repetition issues
    if (hallucination.flags && hallucination.flags.some(flag => flag.type === 'repetition')) {
      console.log("HALLUCINATION CORRECTION: Fixing repetition issues");
      
      // Remove repeated phrases
      const repetitionPatterns = [
        /(I hear (you'?re|you are) dealing with).*(I hear (you'?re|you are) dealing with)/i,
        /(I remember (you|your|we)).*(I remember (you|your|we))/i,
        /(you (mentioned|said|told me)).*(you (mentioned|said|told me))/i,
        /((I hear|It sounds like) you('re| are) (dealing with|feeling)).*((I hear|It sounds like) you('re| are))/i
      ];
      
      for (const pattern of repetitionPatterns) {
        const match = correctedResponse.match(pattern);
        if (match && match[1] && match[3]) {
          // Keep the first instance, remove the repeated one
          correctedResponse = correctedResponse.replace(match[3], '');
        }
      }
      
      // Clean up any resulting artifacts
      correctedResponse = correctedResponse
        .replace(/\s{2,}/g, ' ')
        .replace(/\. \./g, '.')
        .replace(/,\s*\./g, '.');
    }
    
    // Fix crisis protocol mixing
    if (hallucination.flags && hallucination.flags.some(flag => 
        flag.type === 'critical_protocol_violation' || flag.type === 'critical_protocol_mix')) {
      console.log("HALLUCINATION CORRECTION: Fixing crisis protocol mixing");
      
      // If we have both crisis content and casual content, prioritize crisis
      if (/suicide|crisis|self-harm/i.test(userInput)) {
        // Create a crisis-focused response
        correctedResponse = "I'm concerned about what you've shared regarding thoughts of suicide or self-harm. " +
          "This is something to take seriously. The National Suicide Prevention Lifeline is available 24/7 at 988 " +
          "or 1-800-273-8255. Would it be helpful to discuss what resources might be available to you right now?";
      } else if (/eating disorder|binge|purge|anorexia|bulimia/i.test(userInput)) {
        // Create an eating disorder focused response
        correctedResponse = "Thank you for sharing your struggles with disordered eating. " +
          "These are serious concerns that deserve proper support. " +
          "The National Eating Disorders Association (NEDA) has resources that might help. " +
          "Would you like to talk more about what you're experiencing?";
      }
    }
    
    // Fix false memory references in early conversation
    if (hallucination.flags && hallucination.flags.some(flag => flag.type === 'false_memory')) {
      console.log("HALLUCINATION CORRECTION: Fixing false memory references");
      
      correctedResponse = correctedResponse
        .replace(/you mentioned before|you told me earlier|when we talked about|as we discussed|as you said|as you mentioned|you've told me/gi, 
                "based on what you're sharing")
        .replace(/we talked about|our previous conversation|earlier you said/gi, 
                "from what I understand");
    }
    
    // Fix crisis type mismatch
    if (hallucination.flags && hallucination.flags.some(flag => flag.type === 'crisis_type_mismatch')) {
      console.log("HALLUCINATION CORRECTION: Fixing crisis type mismatch");
      
      // Check which crisis is actually being discussed
      if (/suicide|kill (myself|me)|shoot myself|self.?harm|end my life/i.test(userInput.toLowerCase())) {
        correctedResponse = "I'm very concerned about what you've shared regarding thoughts of suicide. " +
          "This is something to take seriously. The National Suicide Prevention Lifeline is available 24/7 at 988 " +
          "or 1-800-273-8255. Would it help to talk about what you're going through right now?";
      } else if (/drinking|alcohol|drunk|intoxicated|substance|beer/i.test(userInput.toLowerCase())) {
        correctedResponse = "I hear your concerns about substance use. " +
          "The SAMHSA National Helpline at 1-800-662-4357 provides information and treatment referrals. " +
          "Would you like to talk about what's been going on with your drinking?";
      }
    }
    
    console.log("HALLUCINATION CORRECTION: Hallucination fixed");
    return {
      wasHallucination: true, 
      correctedResponse,
      hallucinationDetails: hallucination
    };
  }
  
  // No hallucination detected
  return { wasHallucination: false, correctedResponse: responseText };
};
