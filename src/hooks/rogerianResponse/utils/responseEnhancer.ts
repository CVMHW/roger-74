
/**
 * Response Enhancer - Acts as adapter to the unified enhancement pipeline
 * 
 * This maintains backward compatibility for existing imports while
 * using the new unified pipeline under the hood.
 */

import { enhanceResponse as enhanceResponseUnified } from '../../../utils/response/enhancer';

/**
 * Enhances a response with memory rules, master rules, and chat log review
 * Now delegates to the unified enhancement pipeline
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[]
): string => {
  return enhanceResponseUnified(responseText, userInput, messageCount, conversationHistory);
};
