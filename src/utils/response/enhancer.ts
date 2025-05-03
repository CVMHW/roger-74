
/**
 * Response Enhancer - Unified Pipeline
 * 
 * UNIVERSAL LAW: Adds personality, spontaneity, and creativity to ALL responses
 * as mandated by the Universal Law of Spontaneity.
 */

import { addResponseVariety } from './personalityVariation';
import { detectConversationPatterns } from './patternDetection';
import { processResponseThroughMasterRules } from './processor';
import { enforceUniversalLaws } from '../masterRules/universalLaws';

/**
 * Enhances a response with memory rules, master rules, and chat log review
 * while enforcing the Universal Law of Spontaneity
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[]
): string => {
  // First, process through the master rules system
  const processedResponse = processResponseThroughMasterRules(
    responseText, 
    userInput, 
    messageCount,
    conversationHistory
  );
  
  // Analyze the processed response for repetitive patterns
  const previousResponses = conversationHistory
    .filter(msg => 
      !msg.startsWith("I'm") && 
      !userInput.includes(msg)
    ).slice(-3);
  
  const patternResults = detectConversationPatterns(
    processedResponse, 
    previousResponses, 
    conversationHistory
  );
  
  // Determine spontaneity and creativity levels based on pattern detection
  let spontaneityLevel = 65; // Default base level
  let creativityLevel = 60;   // Default base level
  
  // Increase spontaneity based on pattern detection results
  if (patternResults.isRepetitive) {
    console.log("ENHANCEMENT: Repetitive patterns detected, increasing spontaneity");
    spontaneityLevel = 90; // Very high spontaneity for breaking patterns
    creativityLevel = 85;  // Very high creativity for breaking patterns
  } else if (patternResults.repetitionScore > 0.5) {
    console.log("ENHANCEMENT: Some repetition tendencies detected, moderately increasing spontaneity");
    spontaneityLevel = 75;
    creativityLevel = 70;
  }
  
  // UNIVERSAL LAW: Always apply personality variation to enforce spontaneity
  const enhancedResponse = addResponseVariety(
    processedResponse,
    userInput,
    messageCount,
    spontaneityLevel,
    creativityLevel
  );
  
  // Final enforcement of universal laws
  return enforceUniversalLaws(enhancedResponse, userInput, messageCount);
};

/**
 * Simple enhancement function that just applies personality variation
 * Used when a full master rules process isn't needed
 */
export const simpleEnhancement = (
  responseText: string,
  userInput: string,
  messageCount: number
): string => {
  // Apply personality variation with moderate spontaneity
  return addResponseVariety(responseText, userInput, messageCount, 65, 60);
};
