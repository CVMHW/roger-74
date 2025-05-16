
/**
 * Unified response processor that integrates multiple specialized systems
 */

import { processEmergency } from './processor/emergency';
import { enhanceResponseWithMemory } from './processor/memoryEnhancement';
import { detectCrisis, generateCrisisResponse } from '../masterRules/safety/crisisDetection';
import { detectEatingDisorderConcerns } from '../conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../conversation/specializedDetection/eatingPatterns/processor';
import { retrieveAugmentation, augmentResponseWithRetrieval } from '../hallucinationPrevention/retrieval';
import { detectHallucinations } from '../hallucinationPrevention/detector/hallucination-detector';

/**
 * Master response processor that integrates:
 * 1. Crisis detection
 * 2. Eating disorder detection
 * 3. RAG augmentation
 * 4. Hallucination prevention
 * 5. Memory enhancement
 * 
 * @param responseText Original response text
 * @param userInput User's input message
 * @param conversationHistory Previous conversation history
 * @returns Processed and enhanced response
 */
export function processResponse(
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string {
  try {
    console.log("Processing response through unified system");
    
    // CRITICAL PRIORITY: Check for crisis situations first
    const crisisResult = detectCrisis(userInput, conversationHistory);
    if (crisisResult.isCrisis) {
      console.log(`CRISIS DETECTED: ${crisisResult.type} with severity ${crisisResult.severity}`);
      const crisisResponse = generateCrisisResponse(crisisResult);
      if (crisisResponse) {
        return crisisResponse;
      }
    }
    
    // Check for eating disorder content
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.riskLevel === 'moderate')) {
      console.log(`EATING DISORDER CONCERN: Risk level ${edResult.riskLevel}`);
      const foodResponse = processFoodRelatedMessage(userInput);
      if (foodResponse.responseType === 'eating_disorder') {
        return foodResponse.suggestedResponse;
      }
    }
    
    // Check for hallucinations in the response
    const hallucinationCheck = detectHallucinations(responseText, userInput, conversationHistory);
    if (hallucinationCheck.isHallucination) {
      console.log("HALLUCINATION DETECTED: Applying corrections");
      if (hallucinationCheck.corrections) {
        responseText = hallucinationCheck.corrections;
      }
    }
    
    // Use RAG to augment response with relevant information
    const retrievalResult = retrieveAugmentation(userInput, conversationHistory);
    if (retrievalResult.retrievedContent.length > 0 && retrievalResult.confidence > 0.4) {
      responseText = augmentResponseWithRetrieval(responseText, retrievalResult);
    }
    
    // Enhance response with memory awareness
    responseText = enhanceResponseWithMemory({
      response: responseText,
      userInput,
      conversationHistory
    });
    
    // Process emergency paths
    responseText = processEmergency(responseText, userInput);
    
    return responseText;
    
  } catch (error) {
    console.error("Error in processResponse:", error);
    // Return original if processing fails - safety fallback
    return responseText;
  }
}
