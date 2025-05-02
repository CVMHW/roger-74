
/**
 * Response Processor
 * 
 * Processes responses through the MasterRules system before final delivery
 */

import { applyUnconditionalRules, enhanceResponseWithRapport } from './responseIntegration';

/**
 * Process any response through the MasterRules system
 * @param response Initial response
 * @param userInput Original user input
 * @param messageCount Current message count
 * @returns Processed response conforming to all MasterRules
 */
export const processResponseThroughMasterRules = (
  response: string,
  userInput: string,
  messageCount: number
): string => {
  // First apply unconditional rules
  const ruleConformingResponse = applyUnconditionalRules(response, userInput, messageCount);
  
  // Then enhance with rapport building elements
  const enhancedResponse = enhanceResponseWithRapport(ruleConformingResponse, userInput, messageCount);
  
  return enhancedResponse;
};
