
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
    
    // CRITICAL PRIORITY CHECK: First check if this is a social/everyday situation
    // This is the HIGHEST priority check to ensure casual responses stay casual
    const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party|date|girl|guy|cute|dating/i.test(userInput);
    
    // For everyday situations, immediately provide a casual response and skip all other processing
    if (isEverydaySituation) {
      console.log("EVERYDAY SITUATION DETECTED: Providing casual conversational response");
      
      // Simple conversational responses for common social situations
      if (/spill(ed)?/i.test(userInput)) {
        return correctGrammar("Spilling something can definitely feel awkward in the moment. What happened next?");
      }
      
      if (/trip(ped)?|fall|fell|stumble/i.test(userInput)) {
        return correctGrammar("Those moments can feel so awkward! Everyone has those embarrassing moments. What happened next?");
      }
      
      if (/embarrass(ing|ed)?|awkward/i.test(userInput)) {
        return correctGrammar("Embarrassing moments like that can feel much bigger to us than they do to others. How are you feeling about it now?");
      }
      
      if (/girl|guy|cute|dating/i.test(userInput)) {
        return correctGrammar("Dating situations can be tricky. What do you think you might do differently next time?");
      }
      
      // If no specific pattern matched, just make sure the response stays casual
      return correctGrammar("I understand. That sounds challenging. Would you like to tell me more about what happened?");
    }
    
    // SECOND: Select the appropriate approach based on context
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
    
    // Check for resistance to deeper meaning from conversation history
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
    // For everyday social situations, use maximum spontaneity and conversational tone
    if (isSmallTalkContext) {
      console.log("SMALL TALK CONTEXT: Using high spontaneity and conversational tone");
      processedResponse = addResponseVariety(
        processedResponse,
        userInput,
        messageCount,
        85,  // High spontaneity for small talk
        80   // High creativity for small talk
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
      return correctGrammar(basicProcessed);
    } catch (nestedError) {
      console.error('Critical failure in response processing:', nestedError);
      return response; // Return original response if all processing fails
    }
  }
};

// Export processed response utility for compatibility
export const processResponseCore = processCore;

// Re-export important components for direct access
export { selectResponseApproach, adjustApproachForConversationFlow } from './approachSelector';
