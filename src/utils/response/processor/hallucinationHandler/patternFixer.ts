/**
 * Pattern Fixer - Detects and fixes dangerous repetition patterns in responses
 */

import { hasRepeatedContent } from './specialCases';

/**
 * Detect and fix dangerous repetition patterns in responses
 * Particularly focused on the "I hear you're dealing with" repetition patterns
 */
export const fixDangerousRepetitionPatterns = (responseText: string): {
  fixedResponse: string;
  hasRepetitionIssue: boolean;
} => {
  // Default response
  let fixedResponse = responseText;
  let hasRepetitionIssue = false;
  
  // CRITICAL: First specifically check for repetition patterns like "I hear you're dealing with I hear you're dealing with"
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i,
    /I hear you're dealing with you mentioned/i
  ];
  
  // Check each pattern and apply fix if found
  for (const pattern of repetitionPatterns) {
    if (pattern.test(responseText)) {
      console.log(`CRITICAL: Found dangerous repetition pattern: ${pattern}`);
      
      hasRepetitionIssue = true;
      
      // Special handling for "you may have indicated" pattern which is particularly problematic
      if (/you may have indicated/i.test(responseText)) {
        fixedResponse = "I'm listening. Could you tell me more about what you're experiencing?";
      } 
      // "I hear you're dealing with" repetition fix
      else if (/I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i.test(responseText)) {
        fixedResponse = responseText.replace(
          /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i, 
          "I hear you're dealing with"
        );
      }
      // General repetition fix - just take the first part of the response
      else {
        // Split the response at the repetition point and keep only the first part
        // This is a safety mechanism to avoid completely broken responses
        const firstSentence = responseText.split('.')[0];
        if (firstSentence && firstSentence.length > 20) {
          fixedResponse = firstSentence + ". Could you tell me more about that?";
        } else {
          fixedResponse = "I'd like to understand your situation better. Could you share more about what you're experiencing?";
        }
      }
      
      break;
    }
  }
  
  // Handle case of just a raw "you mentioned" without context
  if (/^I hear you're dealing with you mentioned/i.test(responseText)) {
    fixedResponse = "I'd like to understand what you're experiencing. Could you share more about your situation?";
    hasRepetitionIssue = true;
  }
  
  // Check for the exact pattern that's occurring in the example
  if (responseText.includes("I hear you're dealing with I hear you're dealing with")) {
    fixedResponse = "I'm here to listen. What's been going on for you recently?";
    hasRepetitionIssue = true;
  }
  
  return {
    fixedResponse,
    hasRepetitionIssue
  };
};
