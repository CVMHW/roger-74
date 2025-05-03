
/**
 * Pattern fixer for dangerous repetition patterns
 */

import { hasRepeatedContent, fixRepeatedContent } from './specialCases';

/**
 * Fixes dangerous repetition patterns in responses
 * These are specific patterns that indicate a severe hallucination
 */
export const fixDangerousRepetitionPatterns = (responseText: string): { 
  fixedResponse: string; 
  hasRepetitionIssue: boolean 
} => {
  // Check for repetition issues using common pattern detection
  const hasIssue = hasRepeatedContent(responseText);
  
  // If no issue, return the original text
  if (!hasIssue) {
    return { 
      fixedResponse: responseText, 
      hasRepetitionIssue: false 
    };
  }
  
  // Fix the repetition issues
  const fixedResponse = fixRepeatedContent(responseText);
  
  // Check if any changes were made
  const hasChanges = fixedResponse !== responseText;
  
  return {
    fixedResponse,
    hasRepetitionIssue: hasChanges
  };
};
