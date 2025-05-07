
/**
 * Therapeutic Approach Processing
 * 
 * Handles selection and application of therapeutic approaches
 */

import * as approachModule from './approachSelector';

/**
 * Processes multiple therapeutic approaches
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @param conversationHistory Previous conversation for context
 * @returns Processed response text
 */
export function processApproaches(
  responseText: string, 
  userInput: string, 
  conversationHistory: string[] = []
): string {
  try {
    if (approachModule.selectResponseApproach) {
      // Get the approach based on user input and conversation history
      const approach = approachModule.selectResponseApproach(userInput, conversationHistory);
      console.log("Selected approach type:", approach.type);
      
      // Future enhancement: Apply the selected approach to transform the response
      // For now, we're just logging the approach type
    }
  } catch (error) {
    console.error("Error in processApproaches:", error);
  }
  
  return responseText;
}
