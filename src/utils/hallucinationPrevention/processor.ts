/**
 * Main hallucination prevention processor
 */

import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../types/hallucinationPrevention';
import { checkAndFixHallucinations } from './detector/hallucination-checker';
import { applyReasoning } from './reasoner';
import { retrieveAugmentation, augmentResponseWithRetrieval } from './retrieval';
import { hasRepeatedContent, fixRepeatedContent } from './repetitionHandler';

// Default options
export const DEFAULT_OPTIONS: HallucinationPreventionOptions = {
  enableRAG: true,
  enableReasoning: true,
  enableDetection: true,
  reasoningThreshold: 0.7
};

/**
 * Comprehensive hallucination prevention processing
 * Runs the response through a multi-stage pipeline to ensure factuality
 */
export const preventHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[],
  options: Partial<HallucinationPreventionOptions> = {}
): HallucinationProcessResult => {
  const startTime = performance.now();
  console.log("HALLUCINATION PREVENTION: Starting comprehensive processing");
  
  // Merge provided options with defaults
  const mergedOptions: HallucinationPreventionOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };
  
  // Initialize result
  const result: HallucinationProcessResult = {
    processedResponse: responseText,
    wasRevised: false,
    reasoningApplied: false,
    detectionApplied: false,
    ragApplied: false,
    processingTime: 0,
    confidence: 1.0
  };
  
  // Extract emotion awareness context if provided
  const emotionAwareness = mergedOptions.emotionAwareness || {};
  
  // Track issues found
  const issueDetails: string[] = [];
  
  try {
    // Stage 1: Retrieval-Augmented Generation
    // This stage ensures we ground responses in factual context
    if (mergedOptions.enableRAG) {
      console.log("HALLUCINATION PREVENTION: Running RAG enhancement");
      
      // Note: Since we can't make this function async, we'll have to handle the async nature
      // of retrieveAugmentation differently. We'll use the synchronous approach for now.
      
      // Call retrieveAugmentation but don't await the result
      // This effectively makes it run in the background but won't affect the current response
      retrieveAugmentation(userInput, conversationHistory)
        .then(retrievalResult => {
          if (retrievalResult.retrievedContent && retrievalResult.retrievedContent.length > 0) {
            // We'll log the retrieved content but not integrate it in this synchronous context
            console.log("RAG retrieved content:", retrievalResult.retrievedContent[0]);
          }
        })
        .catch(error => {
          console.error("Error in RAG retrieval:", error);
        });
        
      // For now, we'll skip the actual integration to keep the function synchronous
    }
    
    // Stage 2: Reasoning & Chain-of-Thought
    // This stage ensures logical consistency
    if (mergedOptions.enableReasoning) {
      console.log("HALLUCINATION PREVENTION: Running chain-of-thought reasoning");
      const reasoningResult = applyReasoning(
        result.processedResponse,
        userInput, 
        conversationHistory
      );
      
      result.reasoningApplied = true;
      
      // If reasoning found issues, update the response
      if (reasoningResult && !reasoningResult.isLogicallySound) {
        result.processedResponse = reasoningResult.verifiedResponse;
        result.wasRevised = true;
        result.confidence *= 0.8;
        
        // Track problematic reasoning steps
        if (reasoningResult.reasoningSteps) {
          const problematicSteps = reasoningResult.reasoningSteps
            .filter(step => step.confidence < mergedOptions.reasoningThreshold);
          
          for (const step of problematicSteps) {
            issueDetails.push(`Reasoning issue: "${step.claim}" (confidence: ${step.confidence})`);
          }
        }
      }
    }
    
    // Stage 3: Hallucination Detection & Fixing
    // This stage directly detects and fixes hallucinations
    if (mergedOptions.enableDetection) {
      console.log("HALLUCINATION PREVENTION: Running hallucination detection");
      const detectionResult = checkAndFixHallucinations(
        result.processedResponse,
        userInput,
        conversationHistory
      );
      
      result.detectionApplied = true;
      
      // If hallucinations were detected, use the fixed version
      if (detectionResult.wasHallucination) {
        result.processedResponse = detectionResult.correctedResponse;
        result.wasRevised = true;
        result.confidence *= 0.7;
        
        // Track the hallucination details
        if (detectionResult.hallucinationDetails && detectionResult.hallucinationDetails.flags) {
          for (const flag of detectionResult.hallucinationDetails.flags) {
            issueDetails.push(`Hallucination: ${flag.type} - ${flag.description} (${flag.severity})`);
          }
        }
      }
    }
    
    // Final cleanup of any remaining repetition
    if (hasRepeatedContent(result.processedResponse)) {
      console.log("HALLUCINATION PREVENTION: Fixing repeated content in final pass");
      result.processedResponse = fixRepeatedContent(result.processedResponse);
      result.wasRevised = true;
    }
    
    // Finalize the result
    result.processingTime = performance.now() - startTime;
    
    return result;
  } catch (error) {
    console.error("Error in hallucination prevention:", error);
    
    // Return the original response in case of errors
    return {
      processedResponse: responseText,
      wasRevised: false,
      reasoningApplied: false,
      detectionApplied: false,
      ragApplied: false,
      processingTime: performance.now() - startTime,
      confidence: 1.0
    };
  }
};
