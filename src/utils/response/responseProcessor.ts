
/**
 * Response Processor
 * 
 * Processes responses through the MasterRules system before final delivery
 * UNCONDITIONAL: Ensures memory usage in all responses
 */

import { applyUnconditionalRules, enhanceResponseWithRapport } from './responseIntegration';
import { enforceMemoryRule, verifyMemoryUtilization } from '../masterRules/unconditionalRuleProtections';
import { getContextualMemory } from '../nlpProcessor';

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
    // UNCONDITIONAL RULE: Enforce memory retention for all interactions
    enforceMemoryRule(userInput, response);
    
    // First apply unconditional rules with conversation history
    const ruleConformingResponse = applyUnconditionalRules(
      response, 
      userInput, 
      messageCount,
      conversationHistory
    );
    
    // UNCONDITIONAL RULE: Verify memory utilization in response
    if (messageCount > 0) {  // Changed from > 3 to > 0 to ALWAYS use memory
      // Get memory context
      const memory = getContextualMemory(userInput);
      
      // Check if response already uses memory
      const usesMemory = verifyMemoryUtilization(userInput, ruleConformingResponse, conversationHistory);
      
      // If response doesn't use memory, enhance it with memory context
      if (!usesMemory) {
        // Create memory-enhanced response
        let enhancedResponse = ruleConformingResponse;
        
        // Add memory context using rotation of different phrasings
        const memoryPhrases = [
          `I remember you mentioned ${memory.dominantTopics[0] || 'what you\'ve been going through'} earlier. `,
          `As we've been discussing about ${memory.dominantTopics[0] || 'your situation'}, `,
          `Given what you've shared about ${memory.dominantTopics[0] || 'your concerns'}, `,
          `Considering what you told me about ${memory.dominantTopics[0] || 'your experiences'}, `,
          `Based on our conversation about ${memory.dominantTopics[0] || 'what you\'ve shared'}, `
        ];
        
        // Select phrase based on message count to rotate through them
        const selectedPhrase = memoryPhrases[messageCount % memoryPhrases.length];
        
        // Add the memory phrase to response
        enhancedResponse = selectedPhrase + enhancedResponse;
        
        // Then enhance with rapport building elements
        return enhanceResponseWithRapport(
          enhancedResponse, 
          userInput, 
          messageCount,
          conversationHistory
        );
      }
    }
    
    // Then enhance with rapport building elements
    const enhancedResponse = enhanceResponseWithRapport(
      ruleConformingResponse, 
      userInput, 
      messageCount,
      conversationHistory
    );
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error in processing response through master rules:', error);
    
    // UNCONDITIONAL RULE: Even on error, record to memory
    try {
      enforceMemoryRule(userInput, response);
    } catch (memoryError) {
      console.error('Failed to enforce memory rule during error recovery:', memoryError);
    }
    
    // Return original response if error occurs
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
    const memory = getContextualMemory(userInput);
    
    // Even for short conversations, use memory (changed from < 3 to always use)
    
    // Check if response already references memory
    if (response.toLowerCase().includes("remember") || 
        response.toLowerCase().includes("mentioned") || 
        response.toLowerCase().includes("earlier") ||
        response.toLowerCase().includes("previously") ||
        response.toLowerCase().includes("you've shared")) {
      return response;
    }
    
    // Add memory context - UNCONDITIONAL!
    const memoryPhrases = [
      `I remember you mentioned ${memory.dominantTopics[0] || 'what you\'ve been going through'}. `,
      `Based on what you've told me about ${memory.dominantTopics[0] || 'your situation'}, `,
      `Considering our conversation about ${memory.dominantTopics[0] || 'your concerns'}, `
    ];
    
    const randomPhrase = memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
    return randomPhrase + response;
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    return response;
  }
};
