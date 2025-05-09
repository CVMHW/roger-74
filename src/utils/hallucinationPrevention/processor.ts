
/**
 * Main hallucination prevention processor
 */

import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../types/hallucinationPrevention';
import { checkAndFixHallucinations } from './detector';
import { applyReasoning } from './reasoner';
import { retrieveAugmentation, augmentResponseWithRetrieval } from './retrieval';
import { hasRepeatedContent, fixRepeatedContent } from './repetitionHandler';
import { DEFAULT_OPTIONS } from './config';

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
  
  // Track issues found
  const issueDetails: string[] = [];
  
  try {
    // Stage 1: Retrieval-Augmented Generation
    // This stage ensures we ground responses in factual context
    if (mergedOptions.enableRAG) {
      console.log("HALLUCINATION PREVENTION: Running RAG enhancement");
      const retrievalResult = retrieveAugmentation(userInput, conversationHistory);
      
      if (retrievalResult.retrievedContent && retrievalResult.retrievedContent.length > 0) {
        const augmentedResponse = augmentResponseWithRetrieval(
          responseText, 
          retrievalResult
        );
        
        // Update response if RAG changed it
        if (augmentedResponse !== responseText) {
          result.processedResponse = augmentedResponse;
          result.wasRevised = true;
          result.ragApplied = true;
        }
      }
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
      
      // If hallucinations detected, use the fixed version
      if (detectionResult.wasHallucination) {
        result.processedResponse = detectionResult.correctedResponse;
        result.wasRevised = true;
        result.confidence *= detectionResult.hallucinationDetails?.confidence || 0.5;
        
        // Track detected hallucinations
        if (detectionResult.hallucinationDetails?.flags) {
          for (const flag of detectionResult.hallucinationDetails.flags) {
            issueDetails.push(
              `Hallucination (${flag.type}): ${flag.description} (severity: ${flag.severity})`
            );
          }
        }
      }
    }
    
    // Stage 4: Special handling for repeated content
    // This can happen when the model gets "stuck" in a loop
    if (hasRepeatedContent(result.processedResponse)) {
      console.log("HALLUCINATION PREVENTION: Fixing repeated content");
      
      // Fix repeated content by keeping only unique sentences
      const fixedResponse = fixRepeatedContent(result.processedResponse);
      
      if (fixedResponse !== result.processedResponse) {
        result.processedResponse = fixedResponse;
        result.wasRevised = true;
        result.confidence *= 0.9;
        issueDetails.push("Repetition detected: Fixed repeated content");
      }
    }
    
    // Calculate processing time
    result.processingTime = performance.now() - startTime;
    
    // Add issue details if any were found
    if (issueDetails.length > 0) {
      result.issueDetails = issueDetails;
    }
    
    console.log(`HALLUCINATION PREVENTION: Processing complete in ${result.processingTime.toFixed(2)}ms`);
    return result;
    
  } catch (error) {
    console.error("Error in hallucination prevention:", error);
    
    // Calculate processing time even in error case
    result.processingTime = performance.now() - startTime;
    
    // Return original response in case of error
    return {
      ...result,
      processedResponse: responseText,
      wasRevised: false
    };
  }
};
