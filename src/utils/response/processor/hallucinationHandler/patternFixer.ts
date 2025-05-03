/**
 * Pattern Fixer - Detects and fixes dangerous repetition patterns in responses
 */

import { hasRepeatedContent, fixDealingWithPattern, fixIndicatedPattern } from './specialCases';
import { UNCONDITIONAL_RULES } from '../../../masterRules/core/coreRules';

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
  
  // UNCONDITIONAL RULE: Check for repetition patterns
  // This is a critical check that cannot be bypassed
  if (hasRepeatedContent(responseText)) {
    console.log("CRITICAL: Found dangerous repetition pattern");
    hasRepetitionIssue = true;
    
    // Apply specific fixes for known patterns
    fixedResponse = fixDealingWithPattern(responseText);
    
    // Special handling for "you may have indicated" pattern which is particularly problematic
    if (/you may have indicated/i.test(responseText)) {
      fixedResponse = fixIndicatedPattern(responseText);
    } 
    // "I hear you're dealing with" repetition fix
    else if (/I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i.test(responseText)) {
      fixedResponse = responseText.replace(
        /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i, 
        "I hear you're dealing with"
      );
    }
    // Handle case of just a raw "you mentioned" without context
    else if (/^I hear you're dealing with you mentioned/i.test(responseText)) {
      fixedResponse = "I'd like to understand what you're experiencing. Could you share more about your situation?";
    }
    // Check for the exact pattern that's occurring in the example
    else if (responseText.includes("I hear you're dealing with I hear you're dealing with")) {
      fixedResponse = "I'm here to listen. What's been going on for you recently?";
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
  }
  
  // Apply the UnconditionalRules to ensure memory integration
  const rulesEnforced = UNCONDITIONAL_RULES.some(rule => 
    typeof rule === 'string' ? fixedResponse.includes(rule) : fixedResponse.includes(rule.name)
  );
  
  // If no rules have been enforced yet and we have a repetition issue, ensure we add memory context
  if (!rulesEnforced && hasRepetitionIssue && !fixedResponse.includes("I remember") && !fixedResponse.includes("you mentioned")) {
    fixedResponse = "I remember what you've shared. " + fixedResponse;
  }
  
  return {
    fixedResponse,
    hasRepetitionIssue
  };
};
