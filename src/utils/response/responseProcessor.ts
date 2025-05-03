
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
import { addToFiveResponseMemory, getLastPatientMessage, getFiveResponseMemory, verifyFiveResponseMemorySystem } from '../memory/fiveResponseMemory';

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
    
    // CRITICAL: First verify the 5ResponseMemory system is operational
    const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
    if (!fiveResponseMemoryOperational) {
      console.error("CRITICAL: 5ResponseMemory system failure detected");
    }
    
    // MANDATORY: Check all system rules first
    checkAllRules();
    
    // CRITICAL: Record to 5ResponseMemory system - redundant protection
    addToFiveResponseMemory('patient', userInput);
    
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
    
    // FINAL CHECK: Verify response meets all requirements through both systems
    const primaryMemoryCheck = verifyMemoryUtilization(userInput, enhancedResponse, conversationHistory);
    
    // CRITICAL: Record final response to 5ResponseMemory system
    addToFiveResponseMemory('roger', enhancedResponse);
    
    // BACKUP CHECK: Use 5ResponseMemory as a verification system
    const fiveMemory = getFiveResponseMemory();
    const hasFiveResponseMemory = fiveMemory.length > 0;
    
    if (!primaryMemoryCheck) {
      console.error("CRITICAL ERROR: Final response fails primary memory verification");
      
      // Last-resort fix - add explicit memory reference using either system
      // First try 5ResponseMemory as it's our redundant system
      if (hasFiveResponseMemory) {
        const lastPatientMsg = getLastPatientMessage();
        if (lastPatientMsg) {
          return `I remember you mentioned ${lastPatientMsg.substring(0, 20)}... ${enhancedResponse}`;
        }
      }
      
      // Fallback to primary memory system
      const memory = getContextualMemory(userInput);
      return `I remember you mentioned ${memory.dominantTopics[0] || 'your concerns'} earlier. ${enhancedResponse}`;
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error in processing response through master rules:', error);
    
    // UNCONDITIONAL RULE: Even on error, record to ALL memory systems
    try {
      // Primary memory system
      enforceMemoryRule(userInput, response);
      
      // CRITICAL: Use 5ResponseMemory as backup even in error case
      addToFiveResponseMemory('patient', userInput);
      addToFiveResponseMemory('roger', response);
    } catch (memoryError) {
      console.error('Failed to enforce memory rule during error recovery:', memoryError);
    }
    
    // Double-redundant error recovery using both memory systems
    try {
      // Try to get memory from 5ResponseMemory system first (our most robust backup)
      const lastPatientMessage = getLastPatientMessage();
      if (lastPatientMessage) {
        return `I remember what you said about "${lastPatientMessage.substring(0, 20)}..." ${response}`;
      }
      
      // Fallback to primary memory system
      const memory = getContextualMemory(userInput);
      if (memory.dominantTopics && memory.dominantTopics.length > 0) {
        return `I remember what you've shared about ${memory.dominantTopics[0]}. ${response}`;
      }
      
      // Ultimate fallback if both systems fail to provide context
      return `I remember what you've told me. ${response}`;
    } catch (finalError) {
      console.error('Critical failure in error recovery:', finalError);
      // Return original response with basic memory reference if all else fails
      return `I remember what you've told me. ${response}`;
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
    
    // CRITICAL: Always record to 5ResponseMemory for redundancy
    addToFiveResponseMemory('patient', userInput);
    
    // Check if response already references memory
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      // Still record the response to 5ResponseMemory
      addToFiveResponseMemory('roger', response);
      return response;
    }
    
    // Apply full memory rules
    const enhancedResponse = applyMemoryRules(response, userInput, conversationHistory);
    
    // CRITICAL: Record enhanced response to 5ResponseMemory
    addToFiveResponseMemory('roger', enhancedResponse);
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    
    // CRITICAL: Even in error case, ensure 5ResponseMemory recording
    try {
      addToFiveResponseMemory('roger', response);
    } catch (memoryError) {
      console.error('Critical failure in 5ResponseMemory:', memoryError);
    }
    
    return response;
  }
};
