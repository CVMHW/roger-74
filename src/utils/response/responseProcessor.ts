
/**
 * Response Processor
 * 
 * Processes responses through the MasterRules system before final delivery
 * UNCONDITIONAL: Ensures memory usage in all responses
 */

import { applyUnconditionalRules, enhanceResponseWithRapport } from './responseIntegration';
import { enforceMemoryRule, verifyMemoryUtilization } from '../masterRules/unconditionalRuleProtections';
import { getContextualMemory } from '../nlpProcessor';
import { applyMemoryRules } from '../rulesEnforcement/memoryEnforcer';
import { checkAllRules } from '../rulesEnforcement/rulesEnforcer';

/**
 * Process any response through the MasterRules system
 * @param response Initial response
 * @param userInput Original user input
 * @param messageCount Current message count
 * @param conversationHistory Array of recent conversation messages
 * @returns Processed response conforming to all MasterRules
 */
export const processResponseThroughMasterRules = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("MASTER RULES: Beginning response processing");
    
    // MANDATORY: Check all system rules first
    checkAllRules();
    
    // UNCONDITIONAL RULE: Enforce memory retention for all interactions
    enforceMemoryRule(userInput, response);
    
    // First apply unconditional rules with conversation history
    const ruleConformingResponse = applyUnconditionalRules(
      response, 
      userInput, 
      messageCount,
      conversationHistory
    );
    
    // UNCONDITIONAL RULE: Apply enhanced memory rules
    const memoryEnforcedResponse = applyMemoryRules(
      ruleConformingResponse,
      userInput,
      conversationHistory
    );
    
    // Then enhance with rapport building elements
    const enhancedResponse = enhanceResponseWithRapport(
      memoryEnforcedResponse, 
      userInput, 
      messageCount,
      conversationHistory
    );
    
    // FINAL CHECK: Verify response meets all requirements
    const finalCheckPassed = verifyMemoryUtilization(userInput, enhancedResponse, conversationHistory);
    
    if (!finalCheckPassed) {
      console.error("CRITICAL ERROR: Final response fails memory verification");
      // Last-resort fix - add explicit memory reference
      const memory = getContextualMemory(userInput);
      return `I remember you mentioned ${memory.dominantTopics[0] || 'your concerns'} earlier. ${enhancedResponse}`;
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error in processing response through master rules:', error);
    
    // UNCONDITIONAL RULE: Even on error, record to memory
    try {
      enforceMemoryRule(userInput, response);
    } catch (memoryError) {
      console.error('Failed to enforce memory rule during error recovery:', memoryError);
    }
    
    // Add memory reference even in error case
    try {
      const memory = getContextualMemory(userInput);
      return `I remember what you've shared about ${memory.dominantTopics[0] || 'your situation'}. ${response}`;
    } catch (finalError) {
      console.error('Critical failure in error recovery:', finalError);
      // Return original response if all else fails
      return response;
    }
  }
};

/**
 * Additional export to directly access memory enhancement
 */
export const enhanceResponseWithMemory = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("APPLYING MEMORY ENHANCEMENT");
    
    // Check if response already references memory
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      return response;
    }
    
    // Apply full memory rules
    return applyMemoryRules(response, userInput, conversationHistory);
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    return response;
  }
};
