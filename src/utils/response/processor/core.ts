
/**
 * Core Response Processing
 * 
 * Central processing logic for all response enhancements
 * UNCONDITIONAL RULES: Ensures meaning integration in every response
 */

import { applyUnconditionalRules } from '../responseIntegration';
import { applyResponseRules } from './ruleProcessing';
import { enhanceResponseWithMemory } from './memoryEnhancement';
import { handleLogotherapyIntegration } from './logotherapy/integrationHandler';
import { detectConversationPatterns } from '../patternDetection';
import { 
  addResponseVariety,
  generateSpontaneousResponse
} from '../personalityVariation';
import { correctGrammar } from './grammarCorrection';
import { selectResponseApproach, adjustApproachForConversationFlow } from './approachSelector';
import { getRogerPerspectivePhrase } from '../personalityHelpers';
import { isIntroduction, isSmallTalk, isPersonalSharing } from '../../masterRules';

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
    
    // FIRST: Select the appropriate approach based on context
    // This determines how heavily to apply different aspects of Roger's training
    const initialApproach = selectResponseApproach(userInput, conversationHistory);
    const approach = adjustApproachForConversationFlow(initialApproach, conversationHistory, messageCount);
    
    console.log("Selected approach:", approach);
    
    let processedResponse = response;
    
    // Apply basic memory enhancement
    processedResponse = enhanceResponseWithMemory({
      response: processedResponse,
      userInput,
      conversationHistory
    });
    
    // CRITICAL: Check for social situations, embarrassment, or everyday issues
    // These patterns indicate cases where logotherapy should NOT be applied
    const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party/i.test(userInput);
    const resistanceToDeeperMeaning = conversationHistory.some(msg => 
      /what\?|all|that's all|just happened|it was just|how does.*reflect|are you insinuating|not that deep|too much|simple|regular|come on|get real/i.test(msg)
    );
    
    // Check if this is introduction, small talk or personal sharing using master rules
    const isIntroductionContext = isIntroduction(userInput);
    const isSmallTalkContext = isSmallTalk(userInput);
    const isPersonalSharingContext = isPersonalSharing(userInput);
    
    // Add Roger's personality perspective to appropriate responses - but NOT for everyday situations
    if (!isEverydaySituation && !resistanceToDeeperMeaning && Math.random() < 0.3) {
      const personalityPhrase = getRogerPerspectivePhrase(userInput, messageCount);
      if (personalityPhrase && !processedResponse.includes(personalityPhrase)) {
        processedResponse += personalityPhrase;
      }
    }
    
    // Apply logotherapy integration ONLY if appropriate - now much more restrictive
    if (approach.logotherapyStrength > 0.4 && !isEverydaySituation && !resistanceToDeeperMeaning && 
        !isIntroductionContext && !isSmallTalkContext) {
      console.log("APPLYING LOGOTHERAPY: Appropriate context for meaning-based approach");
      processedResponse = handleLogotherapyIntegration(processedResponse, userInput, conversationHistory);
    } else if (isEverydaySituation || resistanceToDeeperMeaning || approach.logotherapyStrength < 0.1 || 
               isIntroductionContext || isSmallTalkContext) {
      // For everyday situations or when resistance detected, use ZERO logotherapy content
      console.log("EVERYDAY SITUATION OR RESISTANCE DETECTED: Completely skipping logotherapy integration");
      // No logotherapy integration whatsoever for these cases
    }
    
    // Apply all response rules
    processedResponse = applyResponseRules(
      processedResponse,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Check for repetitive patterns
    const patternResult = detectConversationPatterns(processedResponse, conversationHistory);
    
    // Add personality variation based on the selected approach
    // For everyday social situations, use maximum spontaneity and creativity
    if (isEverydaySituation || isSmallTalkContext) {
      console.log("EVERYDAY SITUATION: Using maximum spontaneity and conversational tone");
      processedResponse = addResponseVariety(
        processedResponse,
        userInput,
        messageCount,
        95,  // Near-maximum spontaneity for social situations
        90   // Very high creativity for social situations
      );
    } else {
      processedResponse = addResponseVariety(
        processedResponse,
        userInput,
        messageCount,
        approach.spontaneityLevel,
        approach.creativityLevel
      );
    }
    
    // Apply grammar correction with user input for length adjustment
    return correctGrammar(processedResponse, userInput);
    
  } catch (error) {
    console.error('Error in core response processing:', error);
    
    // Even in error, try to apply basic rules
    try {
      // Apply unconditional rules as minimal safe processing
      const basicProcessed = applyUnconditionalRules(response, userInput, messageCount);
      // Apply grammar correction, but don't limit length in error cases
      return correctGrammar(basicProcessed, userInput);
    } catch (nestedError) {
      console.error('Critical failure in response processing:', nestedError);
      return response; // Return original response if all processing fails
    }
  }
};

// Export processed response utility for compatibility
export const processResponseCore = processCore;
