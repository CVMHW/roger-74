
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
    if (messageCount > 3 && !verifyMemoryUtilization(userInput, ruleConformingResponse, conversationHistory)) {
      // If response doesn't use memory, enhance it with memory context
      const memory = getContextualMemory(userInput);
      
      // Create memory-enhanced response
      let enhancedResponse = ruleConformingResponse;
      
      // Check if we should add memory context prefix
      if (!ruleConformingResponse.toLowerCase().includes("remember") && 
          !ruleConformingResponse.toLowerCase().includes("mentioned") &&
          !ruleConformingResponse.toLowerCase().includes("earlier") &&
          !ruleConformingResponse.toLowerCase().includes("previously")) {
        
        // Add memory context using rotation of different phrasings
        const memoryPhrases = [
          `I remember you mentioned ${memory.dominantTopics[0] || 'this'} earlier. `,
          `As we've been discussing about ${memory.dominantTopics[0] || 'these concerns'}, `,
          `Given what you've shared about ${memory.dominantTopics[0] || 'your situation'}, `,
          `Considering your earlier comments about ${memory.dominantTopics[0] || 'this topic'}, `,
          `Based on what you've told me about ${memory.dominantTopics[0] || 'your experiences'}, `
        ];
        
        // Select phrase based on message count to rotate through them
        const selectedPhrase = memoryPhrases[messageCount % memoryPhrases.length];
        
        // Add the memory phrase to response
        enhancedResponse = selectedPhrase + enhancedResponse;
      }
      
      // Then enhance with rapport building elements
      return enhanceResponseWithRapport(
        enhancedResponse, 
        userInput, 
        messageCount,
        conversationHistory
      );
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
    
    // If no memory or very short conversation, return original response
    if (conversationHistory.length < 3 || !memory.dominantTopics.length) {
      return response;
    }
    
    // Check if response already references memory
    if (response.toLowerCase().includes("remember") || 
        response.toLowerCase().includes("mentioned") || 
        response.toLowerCase().includes("earlier") ||
        response.toLowerCase().includes("previously")) {
      return response;
    }
    
    // Add memory context
    const memoryPhrase = `I remember you mentioned ${memory.dominantTopics[0] || 'this'} earlier. `;
    return memoryPhrase + response;
  } catch (error) {
    console.error('Error enhancing response with memory:', error);
    return response;
  }
};
