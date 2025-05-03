/**
 * Pattern fixer for dangerous repetition patterns
 */

import { hasRepeatedContent, fixRepeatedContent, hasSharedThatPattern } from './specialCases';

/**
 * Fixes dangerous repetition patterns in responses
 * These are specific patterns that indicate a severe hallucination
 */
export const fixDangerousRepetitionPatterns = (responseText: string, userInput: string): { 
  fixedResponse: string; 
  hasRepetitionIssue: boolean 
} => {
  // Check for repetition issues using common pattern detection
  const hasIssue = hasRepeatedContent(responseText);
  
  // Special check for the problematic "It seems like you shared that" pattern
  const hasSharedThatIssue = hasSharedThatPattern(responseText);
  
  // If no issue, return the original text
  if (!hasIssue && !hasSharedThatIssue) {
    return { 
      fixedResponse: responseText, 
      hasRepetitionIssue: false 
    };
  }
  
  // Fix the repetition issues
  let fixedResponse = fixRepeatedContent(responseText);
  
  // If there was a "shared that" pattern, we need more aggressive fixing
  if (hasSharedThatIssue) {
    // Create a completely new response structure based on user's content
    if (userInput.toLowerCase().includes("spill") && 
        (userInput.toLowerCase().includes("girl") || userInput.toLowerCase().includes("bar"))) {
      fixedResponse = "Social situations like that can feel awkward, especially when something unexpected happens. " +
                      "It's natural to replay the moment and think about what you could have done differently. " +
                      "What's your biggest concern about how you handled it?";
    } else if (userInput.toLowerCase().includes("embarrass") || 
              userInput.toLowerCase().includes("nervous")) {
      fixedResponse = "Those moments of embarrassment can really stick with us. " +
                     "Many of us replay social interactions and wish we'd handled them differently. " +
                     "What aspect of the situation has been most on your mind?";
    } else {
      // Keep the fixed response but ensure the "shared that" pattern is gone
      if (hasSharedThatPattern(fixedResponse)) {
        fixedResponse = fixedResponse.replace(
          /It seems like you shared that [^.]+\./i,
          "I understand what you're describing. "
        );
      }
    }
  }
  
  // Check if any changes were made
  const hasChanges = fixedResponse !== responseText;
  
  return {
    fixedResponse,
    hasRepetitionIssue: hasChanges
  };
};
