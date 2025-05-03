
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
import { processThroughChatLogReview } from './chatLogReviewer';
import { addToMemoryBank, retrieveRelevantMemories } from '../memory/memoryBank';
import { processWithMultiHeadAttention } from '../memory/multiHeadAttention';

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
    
    // CRITICAL: First verify that all memory systems are operational
    const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
    if (!fiveResponseMemoryOperational) {
      console.error("CRITICAL: 5ResponseMemory system failure detected");
    }
    
    // MANDATORY: Check all system rules first
    checkAllRules();
    
    // CRITICAL: Process input through multi-head attention system
    const attentionResults = processWithMultiHeadAttention(userInput, conversationHistory);
    
    // CRITICAL: Record to MemoryBank system - most advanced memory system
    addToMemoryBank(
      userInput, 
      'patient', 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics,
      0.8 // High importance for user inputs
    );
    
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
    
    // NEW: Apply MemoryBank enhancement for deeper personalization
    const memoryBankEnhancedResponse = enhanceWithMemoryBank(
      enhancedResponse,
      userInput,
      attentionResults.relevantMemories,
      conversationHistory
    );
    
    // TERTIARY SAFEGUARD: Process through comprehensive chat log review
    const reviewedResponse = processThroughChatLogReview(
      memoryBankEnhancedResponse,
      userInput,
      conversationHistory
    );
    
    // FINAL CHECK: Verify response meets all requirements through all systems
    const primaryMemoryCheck = verifyMemoryUtilization(userInput, reviewedResponse, conversationHistory);
    
    // CRITICAL: Record final response to all memory systems
    addToMemoryBank(
      reviewedResponse, 
      'roger', 
      attentionResults.emotionalContext,
      attentionResults.dominantTopics,
      0.7 // Good importance for roger responses
    );
    addToFiveResponseMemory('roger', reviewedResponse);
    
    // BACKUP CHECK: Use 5ResponseMemory as a verification system
    const fiveMemory = getFiveResponseMemory();
    const hasFiveResponseMemory = fiveMemory.length > 0;
    
    if (!primaryMemoryCheck) {
      console.error("CRITICAL ERROR: Final response fails primary memory verification");
      
      // Last-resort fix - add explicit memory reference using the best available system
      const relevantMemories = retrieveRelevantMemories(userInput);
      
      if (relevantMemories.length > 0) {
        // Use the most relevant memory from MemoryBank
        const topMemory = relevantMemories[0];
        return `I remember you mentioned "${topMemory.content.substring(0, 30)}..." ${reviewedResponse}`;
      } 
      
      // Try 5ResponseMemory next
      if (hasFiveResponseMemory) {
        const lastPatientMsg = getLastPatientMessage();
        if (lastPatientMsg) {
          return `I remember you mentioned ${lastPatientMsg.substring(0, 20)}... ${reviewedResponse}`;
        }
      }
      
      // Fallback to primary memory system
      const memory = getContextualMemory(userInput);
      return `I remember you mentioned ${memory.dominantTopics[0] || 'your concerns'} earlier. ${reviewedResponse}`;
    }
    
    return reviewedResponse;
  } catch (error) {
    console.error('Error in processing response through master rules:', error);
    
    // UNCONDITIONAL RULE: Even on error, record to ALL memory systems
    try {
      // Primary memory system
      enforceMemoryRule(userInput, response);
      
      // CRITICAL: Use 5ResponseMemory as backup even in error case
      addToFiveResponseMemory('patient', userInput);
      addToFiveResponseMemory('roger', response);
      
      // CRITICAL: Use MemoryBank as backup even in error case
      addToMemoryBank(userInput, 'patient');
      addToMemoryBank(response, 'roger');
    } catch (memoryError) {
      console.error('Failed to enforce memory rule during error recovery:', memoryError);
    }
    
    // Triple-redundant error recovery using all memory systems
    try {
      // Try to get memory from most advanced system first (MemoryBank)
      const relevantMemories = retrieveRelevantMemories(userInput);
      if (relevantMemories.length > 0) {
        return `I remember what you said about "${relevantMemories[0].content.substring(0, 20)}..." ${response}`;
      }
      
      // Try to get memory from 5ResponseMemory system next
      const lastPatientMessage = getLastPatientMessage();
      if (lastPatientMessage) {
        return `I remember what you said about "${lastPatientMessage.substring(0, 20)}..." ${response}`;
      }
      
      // Fallback to primary memory system
      const memory = getContextualMemory(userInput);
      if (memory.dominantTopics && memory.dominantTopics.length > 0) {
        return `I remember what you've shared about ${memory.dominantTopics[0]}. ${response}`;
      }
      
      // Ultimate fallback if all systems fail to provide context
      return `I remember what you've told me. ${response}`;
    } catch (finalError) {
      console.error('Critical failure in error recovery:', finalError);
      // Return original response with basic memory reference if all else fails
      return `I remember what you've told me. ${response}`;
    }
  }
};

/**
 * Enhance response using the advanced MemoryBank system
 */
const enhanceWithMemoryBank = (
  response: string,
  userInput: string,
  relevantMemories: any[],
  conversationHistory: string[] = []
): string => {
  try {
    console.log("MEMORYBANK: Enhancing response with memory bank data");
    
    // Check if response already references memory adequately
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      return response;
    }
    
    // If we have relevant memories, use them to enhance the response
    if (relevantMemories.length > 0) {
      const memory = relevantMemories[0];
      
      // Don't repeat the exact same memory reference if it's already in the response
      if (!response.includes(memory.content.substring(0, 15))) {
        const memoryPhrase = `I remember you mentioned ${memory.content.substring(0, 30)}... `;
        return memoryPhrase + response;
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error enhancing response with MemoryBank:', error);
    return response;
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
    
    // CRITICAL: Process through multi-head attention
    const attentionResults = processWithMultiHeadAttention(userInput, conversationHistory);
    
    // CRITICAL: Always record to all memory systems for redundancy
    addToMemoryBank(userInput, 'patient', attentionResults.emotionalContext, attentionResults.dominantTopics);
    addToFiveResponseMemory('patient', userInput);
    
    // Check if response already references memory
    if (verifyMemoryUtilization(userInput, response, conversationHistory)) {
      // Still record the response to all memory systems
      addToMemoryBank(response, 'roger', attentionResults.emotionalContext, attentionResults.dominantTopics);
      addToFiveResponseMemory('roger', response);
      return response;
    }
    
    // Apply full memory rules
    const enhancedResponse = applyMemoryRules(response, userInput, conversationHistory);
    
    // CRITICAL: Record enhanced response to all memory systems
    addToMemoryBank(enhancedResponse, 'roger', attentionResults.emotionalContext, attentionResults.dominantTopics);
    addToFiveResponseMemory('roger', enhancedResponse);
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    
    // CRITICAL: Even in error case, ensure memory recording
    try {
      addToFiveResponseMemory('roger', response);
      addToMemoryBank(response, 'roger');
    } catch (memoryError) {
      console.error('Critical failure in memory systems:', memoryError);
    }
    
    return response;
  }
};
