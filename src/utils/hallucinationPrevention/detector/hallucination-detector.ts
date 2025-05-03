
/**
 * Core hallucination detection functionality
 */

import { HallucinationCheck } from '../../../types/hallucinationPrevention';
import { 
  detectFalseMemoryReferences,
  detectLogicalErrors,
  detectTokenLevelIssues,
  detectRepeatedContent,
  detectFalseContinuity
} from './detection-flags';
import { generateTokenLevelAnalysis, generateCorrection } from './token-analysis';

/**
 * Checks for potential hallucinations in a response
 * Uses multi-faceted approach to detect different types of hallucinations
 */
export const detectHallucinations = (
  responseText: string,
  userInput: string, 
  conversationHistory: string[]
): HallucinationCheck => {
  console.log("HALLUCINATION DETECTOR: Analyzing response for potential hallucinations");
  
  const flags = [];
  let confidenceScore = 1.0; // Start with high confidence
  
  // CRITICAL: First specifically check for "we've been focusing on health" hallucination
  // This is a special case that's occurring frequently
  if (/we've been focusing on health/i.test(responseText) && 
      !conversationHistory.some(msg => /health|medical|doctor|sick|ill|wellness/i.test(msg))) {
    flags.push({
      type: 'false_continuity',
      severity: 'high',
      description: 'False reference to discussing health topics that were not mentioned'
    });
    confidenceScore -= 0.6; // Heavy penalty for this specific hallucination
  }
  
  // Check for memory references without actual memory
  const memoryFlags = detectFalseMemoryReferences(responseText, userInput, conversationHistory);
  flags.push(...memoryFlags);
  
  // Reduce confidence based on memory flags (most critical)
  confidenceScore -= memoryFlags.length * 0.25;
  
  // Check for logical errors and contradictions
  const logicalFlags = detectLogicalErrors(responseText, conversationHistory);
  flags.push(...logicalFlags);
  
  // Reduce confidence based on logical flags
  confidenceScore -= logicalFlags.length * 0.2;
  
  // Check for false continuity claims
  const continuityFlags = detectFalseContinuity(responseText, conversationHistory);
  flags.push(...continuityFlags);
  
  // Reduce confidence based on continuity flags
  confidenceScore -= continuityFlags.length * 0.3;
  
  // NEW: Detect token-level issues using probabilistic analysis
  const tokenFlags = detectTokenLevelIssues(responseText, userInput, conversationHistory);
  flags.push(...tokenFlags);
  
  // Reduce confidence based on token-level flags
  confidenceScore -= tokenFlags.length * 0.15;
  
  // NEW: Detect repeated content (a sign of model confusion)
  const repetitionFlags = detectRepeatedContent(responseText);
  flags.push(...repetitionFlags);
  
  // Reduce confidence based on repetition flags (very important)
  confidenceScore -= repetitionFlags.length * 0.35;
  
  // Extra check for hallucinations in short conversations
  if (conversationHistory.length <= 2) {
    // In new conversations, any reference to previous discussions is a hallucination
    if (/we've been|we discussed|as I mentioned|you told me|you said|you mentioned|I remember|earlier you said|previously/i.test(responseText)) {
      flags.push({
        type: 'false_continuity',
        severity: 'high',
        description: 'False reference to previous conversation in a new chat'
      });
      confidenceScore -= 0.4;
    }
  }
  
  // Bound confidence between 0 and 1
  confidenceScore = Math.max(0, Math.min(1, confidenceScore));
  
  // Determine if this should be flagged as hallucination
  const isHallucination = confidenceScore < 0.6 || 
                         flags.some(flag => flag.severity === 'high');
  
  // Generate token-level analysis result
  const tokenLevelAnalysis = generateTokenLevelAnalysis(responseText);
  
  return {
    content: responseText,
    confidenceScore,
    hallucination: isHallucination,
    flags,
    corrections: isHallucination ? generateCorrection(responseText, flags) : undefined,
    tokenLevelAnalysis // Include token analysis in the result
  };
};
