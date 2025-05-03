
/**
 * Core Response Processing
 * 
 * Central processing logic for all response enhancements
 * UNCONDITIONAL RULES: Ensures meaning integration in every response
 */

import { applyUnconditionalRules } from '../responseIntegration';
import { applyResponseRules } from './ruleProcessing';
import { enhanceResponseWithMemory } from './memoryEnhancement';
import { verifyMemoryUtilization } from './memoryEnhancement';
import { handleLogotherapyIntegration } from './logotherapy/integrationHandler';
import { detectConversationPatterns } from '../patternDetection'; // Fixed import to use the correct function name
import { 
  addResponseVariety,
  generateSpontaneousResponse
} from '../personalityVariation';

/**
 * Process a response through the core rules system
 */
export const processCore = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("CORE PROCESSING: Applying response processing pipeline");
    
    // First enhance with meaning and purpose (logotherapy integration)
    const logotherapyEnhancedResponse = handleLogotherapyIntegration(response, userInput, conversationHistory);
    
    // Apply basic memory enhancement
    const memoryEnhancedResponse = enhanceResponseWithMemory({
      response: logotherapyEnhancedResponse,
      userInput,
      conversationHistory
    });
    
    // Apply all response rules
    const ruleProcessedResponse = applyResponseRules(
      memoryEnhancedResponse,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Check for repetitive patterns
    const patternResult = detectConversationPatterns(ruleProcessedResponse, conversationHistory);
    
    // If repetition detected, force higher spontaneity
    if (patternResult.isRepetitive || patternResult.repetitionScore > 0.5) {
      console.log("PATTERN DETECTED: Increasing spontaneity and creativity");
      
      return addResponseVariety(
        ruleProcessedResponse,
        userInput,
        messageCount,
        95, // Very high spontaneity
        90  // Very high creativity
      );
    }
    
    // Add standard personality variation to ensure spontaneity (Universal Law)
    return addResponseVariety(
      ruleProcessedResponse,
      userInput,
      messageCount,
      70, // Standard spontaneity
      65  // Standard creativity
    );
    
  } catch (error) {
    console.error('Error in core response processing:', error);
    
    // Even in error, try to apply basic rules
    try {
      // Apply unconditional rules as minimal safe processing
      return applyUnconditionalRules(response, userInput, messageCount);
    } catch (nestedError) {
      console.error('Critical failure in response processing:', nestedError);
      return response; // Return original response if all processing fails
    }
  }
};

// Export processed response utility for compatibility
export const processResponseCore = processCore;
