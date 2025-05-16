
/**
 * Central response processor with RAG integration
 * 
 * Applies multiple processing rules to responses to ensure quality,
 * prevent hallucinations, and maintain appropriate therapeutic boundaries
 */

import { detectPatternedResponses, fixProblematicPatterns } from './processor/patternDetector';
import { detectEmergencyPath, categorizeFlags } from './processor/emergencyPathDetection';
import { applyEmergencyIntervention } from './processor/emergencyPathDetection/interventionHandler';
import { detectSpecializedTopic, processSpecializedTopicResponse } from './processor/specializedTopics';

/**
 * Process response through all handlers and RAG integration
 * to prevent hallucinations and ensure quality
 * 
 * @param responseText The original response text
 * @param userInput The user message that triggered this response
 * @param conversationHistory Recent conversation history
 * @returns Processed response text
 */
export const processResponse = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  try {
    // Skip processing for very short responses or in early conversation
    if (responseText.length < 20 || conversationHistory.length < 2) {
      return responseText;
    }
    
    // Get previous responses from history to check for patterns
    const previousResponses = conversationHistory
      .filter(msg => msg !== userInput)
      .slice(-3);
    
    // 1. Check for problematic patterns that may indicate hallucinations
    const patternResult = detectPatternedResponses(responseText, userInput, previousResponses);
    let processedResponse = responseText;
    
    if (patternResult.hasProblematicPattern) {
      // Fix any problematic patterns detected
      processedResponse = fixProblematicPatterns(responseText, patternResult.problematicPhrases);
    }
    
    // 2. Check for emergency conversation paths
    const emergencyPathResult = detectEmergencyPath(
      processedResponse,
      userInput,
      conversationHistory,
      previousResponses
    );
    
    if (emergencyPathResult.isEmergencyPath) {
      // Apply appropriate intervention based on severity
      processedResponse = applyEmergencyIntervention(processedResponse, emergencyPathResult);
    }
    
    // 3. Handle specialized topics with appropriate resources
    const topicResult = detectSpecializedTopic(userInput);
    if (topicResult.topicDetected && topicResult.requiresSpecializedProcessing) {
      // Process response for specialized topic
      processedResponse = processSpecializedTopicResponse(
        processedResponse,
        userInput,
        topicResult.topicType
      );
    }
    
    return processedResponse;
  } catch (error) {
    console.error("Error in processResponse:", error);
    // In case of error, return the original response
    return responseText;
  }
};
