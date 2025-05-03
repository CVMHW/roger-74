/**
 * Hallucination Prevention System
 * 
 * Integrates multiple techniques to prevent hallucinations:
 * 1. Retrieval-Augmented Generation (RAG)
 * 2. Reasoning & Chain-of-Thought
 * 3. Fact checking & Hallucination detection
 * 4. Token-level verification
 * 5. Natural Language Inference (NLI)
 * 6. Response re-ranking
 */

import { checkAndFixHallucinations } from './detector';
import { applyReasoning } from './reasoner';
import { retrieveAugmentation, augmentResponseWithRetrieval } from './retrieval';
import { 
  HallucinationPreventionOptions,
  HallucinationProcessResult
} from '../../types/hallucinationPrevention';

const DEFAULT_OPTIONS: HallucinationPreventionOptions = {
  enableReasoning: true,
  enableRAG: true,
  enableDetection: true,
  reasoningThreshold: 0.7,
  detectionSensitivity: 0.65,
  enableTokenLevelDetection: false,
  enableNLIVerification: false,
  enableReranking: false,
  tokenThreshold: 0.6,
  entailmentThreshold: 0.7,
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
  
  // Track issues found
  const issueDetails: string[] = [];
  
  try {
    // Stage 1: Retrieval-Augmented Generation
    // This stage ensures we ground responses in factual context
    if (mergedOptions.enableRAG) {
      console.log("HALLUCINATION PREVENTION: Running RAG enhancement");
      const retrievalResult = retrieveAugmentation(userInput, conversationHistory);
      
      if (retrievalResult.retrievedContent.length > 0) {
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
      if (!reasoningResult.isLogicallySound) {
        result.processedResponse = reasoningResult.verifiedResponse;
        result.wasRevised = true;
        result.confidence *= 0.8;
        
        // Track problematic reasoning steps
        const problematicSteps = reasoningResult.reasoningSteps
          .filter(step => step.confidence < mergedOptions.reasoningThreshold);
        
        for (const step of problematicSteps) {
          issueDetails.push(`Reasoning issue: "${step.claim}" (confidence: ${step.confidence})`);
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
        result.confidence *= detectionResult.hallucinationDetails?.confidenceScore || 0.5;
        
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
    
    // NEW Stage 4: Special handling for repeated content
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

/**
 * Check if response has repeated content that needs fixing
 */
const hasRepeatedContent = (responseText: string): boolean => {
  // Check for exactly repeated sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Need at least 3 sentences to check for repetition patterns
  if (sentences.length < 3) {
    return false;
  }
  
  // Look for exact repetitions
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateSimilarity(sentences[i], sentences[j]);
      if (similarity > 0.85) {
        return true;
      }
    }
  }
  
  // Check for repeated phrases
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  for (let i = 0; i <= words.length - 4; i++) {
    const phrase = words.slice(i, i + 4).join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
    
    // If we find the same 4-word phrase repeated, it's a sign of repetition
    if (phrases[phrase] > 1 && phrase.length > 10) {
      return true;
    }
  }
  
  return false;
};

/**
 * Fix repeated content by keeping only unique sentences
 */
const fixRepeatedContent = (responseText: string): string => {
  // Split into sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Keep only sentences that aren't too similar to previous ones
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    let isDuplicate = false;
    
    for (const existingSentence of uniqueSentences) {
      const similarity = calculateSimilarity(sentence, existingSentence);
      if (similarity > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence.trim());
    }
  }
  
  // Recombine the unique sentences
  return uniqueSentences.join(". ") + ".";
};

/**
 * Calculate similarity between two text strings
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  // Check length first
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap for basic similarity
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

// Export all sub-module functions
export * from './detector';
export * from './reasoner';
export * from './retrieval';
