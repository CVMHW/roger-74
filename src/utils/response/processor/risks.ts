
/**
 * Risk Assessment Processing
 * 
 * Handles detection and mitigation of risks in responses
 */

import { handlePotentialHallucinations } from './hallucinationHandler';

/**
 * Process risks including hallucinations in responses
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @param conversationHistory Previous conversation for context
 * @returns Object containing processed response
 */
export function processRisks(
  responseText: string, 
  userInput: string, 
  conversationHistory: string[] = []
): any {
  try {
    return handlePotentialHallucinations(responseText, userInput, conversationHistory);
  } catch (error) {
    console.error("Error in processRisks:", error);
    return { processedResponse: responseText };
  }
}
