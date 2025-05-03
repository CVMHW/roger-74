
/**
 * Rule processing utilities for response processor
 */

import { applyUnconditionalRules, enhanceResponseWithRapport } from '../responseIntegration';
import { enforceMemoryRule } from '../../masterRules/unconditionalRuleProtections';
import { applyMemoryRules } from '../../rulesEnforcement/memoryEnforcer';
import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';
import { processThroughChatLogReview } from '../chatLogReviewer';
import { verifyMemoryUtilization } from './memoryEnhancement';

/**
 * Apply all response rules in proper order
 */
export const applyResponseRules = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("MASTER RULES: Applying all response rules");
    
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
    
    // TERTIARY SAFEGUARD: Process through comprehensive chat log review
    const reviewedResponse = processThroughChatLogReview(
      enhancedResponse,
      userInput,
      conversationHistory
    );
    
    // FINAL CHECK: Verify response meets all requirements
    const primaryMemoryCheck = verifyMemoryUtilization(userInput, reviewedResponse, conversationHistory);
    
    if (!primaryMemoryCheck) {
      console.error("CRITICAL ERROR: Final response fails primary memory verification");
      
      // Last-resort fix - add explicit memory reference
      return addExplicitMemoryReference(userInput, reviewedResponse);
    }
    
    return reviewedResponse;
  } catch (error) {
    console.error('Error in applying response rules:', error);
    return response;
  }
};

/**
 * Add explicit memory reference when verification fails
 */
const addExplicitMemoryReference = (
  userInput: string,
  response: string
): string => {
  try {
    // Last-resort fix - add explicit memory reference using the best available system
    const { retrieveRelevantMemories } = require('../../memory/memoryBank');
    const { getLastPatientMessage } = require('../../memory/fiveResponseMemory');
    const { getContextualMemory } = require('../../nlpProcessor');
    
    const relevantMemories = retrieveRelevantMemories(userInput);
    
    if (relevantMemories.length > 0) {
      // Use the most relevant memory from MemoryBank
      const topMemory = relevantMemories[0];
      return `I remember you mentioned "${topMemory.content.substring(0, 30)}..." ${response}`;
    } 
    
    // Try 5ResponseMemory next
    const lastPatientMsg = getLastPatientMessage();
    if (lastPatientMsg) {
      return `I remember you mentioned ${lastPatientMsg.substring(0, 20)}... ${response}`;
    }
    
    // Fallback to primary memory system
    const memory = getContextualMemory(userInput);
    return `I remember you mentioned ${memory.dominantTopics[0] || 'your concerns'} earlier. ${response}`;
  } catch (error) {
    console.error('Error adding explicit memory reference:', error);
    // Ultimate fallback
    return `I remember what you've told me. ${response}`;
  }
};
