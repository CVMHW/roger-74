
/**
 * Response Enhancer - Unified Pipeline
 * 
 * UNIVERSAL LAW: Adds personality, spontaneity, and creativity to ALL responses
 * as mandated by the Universal Law of Spontaneity.
 * UNIVERSAL LAW: Incorporates meaning and purpose perspective in all responses.
 */

import { addResponseVariety } from './personalityVariation';
import { detectConversationPatterns } from './patternDetection';
import { processResponseThroughMasterRules } from './processor';
import { enforceUniversalLaws } from '../masterRules/universalLaws';
import { enhanceWithLogotherapyPerspective } from '../masterRules/logotherapyLaws';

/**
 * Process a user message for memory tracking
 * Used by message handling components
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Import needed memory functions
    const { recordToMemory } = require('../nlpProcessor');
    // Record the user message to memory
    recordToMemory(userInput, '');
  } catch (error) {
    console.error('Error processing user message memory:', error);
  }
};

/**
 * Check if a response shows repetition compared to recent responses
 */
export const checkForResponseRepetition = (
  currentResponse: string,
  recentResponses: string[]
): boolean => {
  if (!recentResponses || recentResponses.length === 0) {
    return false;
  }
  
  // Check the most recent response for similarity
  const mostRecentResponse = recentResponses[0];
  
  // Calculate a simple similarity score
  const similarityScore = calculateResponseSimilarity(currentResponse, mostRecentResponse);
  
  // Consider responses too similar if they exceed threshold
  return similarityScore > 0.7;
};

/**
 * Generate a recovery response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice I might be circling around similar themes. Let's explore this differently - what aspect of your situation feels most important to focus on right now?",
    "I want to make sure I'm addressing what matters most to you. What would be most helpful to discuss at this point in our conversation?",
    "I'm wondering if we could approach this from a different angle. What feels most meaningful or important about this situation to you?",
    "Let's take a fresh perspective. What aspect of your experience would you like to explore more deeply?",
    "I realize we may have been covering similar ground. What other dimensions of this situation would be valuable to discuss?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};

/**
 * Calculate similarity between two responses
 */
const calculateResponseSimilarity = (response1: string, response2: string): number => {
  // Convert to lowercase and remove punctuation
  const normalize = (text: string) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
  const words1 = normalize(response1).split(/\s+/);
  const words2 = normalize(response2).split(/\s+/);
  
  // Count matching words
  let matchingWords = 0;
  for (const word of words1) {
    if (words2.includes(word) && word.length > 3) { // Only count meaningful words
      matchingWords++;
    }
  }
  
  // Calculate similarity as proportion of matching words
  return matchingWords / Math.max(words1.length, words2.length);
};

/**
 * Enhances a response with memory rules, master rules, and chat log review
 * while enforcing the Universal Law of Spontaneity and Meaning
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
  let spontaneityLevel = 70; // Increased base level for more spontaneity
  let creativityLevel = 65;  // Increased base level for more creativity
  
  // Increase spontaneity based on pattern detection results
  if (patternResults.isRepetitive) {
    console.log("ENHANCEMENT: Repetitive patterns detected, increasing spontaneity");
    spontaneityLevel = 95; // Very high spontaneity for breaking patterns
    creativityLevel = 90;  // Very high creativity for breaking patterns
  } else if (patternResults.repetitionScore > 0.5) {
    console.log("ENHANCEMENT: Some repetition tendencies detected, moderately increasing spontaneity");
    spontaneityLevel = 85;
    creativityLevel = 80;
  }
  
  // UNIVERSAL LAW: Always apply personality variation to enforce spontaneity
  let enhancedResponse = addResponseVariety(
    processedResponse,
    userInput,
    messageCount,
    spontaneityLevel,
    creativityLevel
  );
  
  // UNIVERSAL LAW: Ensure meaning and purpose perspective is incorporated
  enhancedResponse = enhanceWithLogotherapyPerspective(enhancedResponse, userInput);
  
  // Final enforcement of all universal laws
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
  const enhancedResponse = addResponseVariety(responseText, userInput, messageCount, 70, 65);
  
  // Ensure meaning perspective is incorporated
  return enhanceWithLogotherapyPerspective(enhancedResponse, userInput);
};
