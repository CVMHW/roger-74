
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
import { generateTokenLevelAnalysis } from './token-analysis';

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
  
  // CRITICAL: CRISIS DETECTION WITH VECTOR-BASED PATTERN RECOGNITION
  // Enhanced pattern detection for crisis situations
  
  // Check for dangerous mixing of crisis response with casual content
  if (/eating disorder|suicide|crisis|self-harm|mental health/i.test(responseText.toLowerCase())) {
    const containsCasualContent = /brewery|restaurant|pub|bar|craft beer|food|recipe|social gathering|concert/i.test(responseText);
    
    if (containsCasualContent) {
      flags.push({
        type: 'critical_protocol_violation',
        severity: 'critical',
        description: 'Mixing crisis response with casual/social content'
      });
      confidenceScore -= 0.9; // Severe penalty for this dangerous mixture
    }
  }
  
  // CRITICAL: SUICIDE AND CRISIS HALLUCINATION PATTERNS
  // Check specifically for suicide and crisis response consistency
  if (/suicide|kill (myself|me)|self.?harm|end my life/i.test(userInput.toLowerCase())) {
    // Check if the response repeats phrases or uses awkward references to prior conversation
    if (/you('re| are) sharing.+you('re| are) sharing/i.test(responseText) || 
        /what you('re| are) sharing what you/i.test(responseText)) {
      flags.push({
        type: 'critical_suicide_repetition',
        severity: 'critical',
        description: 'Critical repetition in suicide response'
      });
      confidenceScore -= 0.9; // Severe penalty for this dangerous hallucination
    }
    
    // Verify that suicide response contains appropriate crisis resources
    if (!/(988|crisis|professional|emergency|lifeline|help)/i.test(responseText)) {
      flags.push({
        type: 'missing_crisis_resources',
        severity: 'critical',
        description: 'Suicide response missing appropriate crisis resources'
      });
      confidenceScore -= 0.8;
    }
  }
  
  // CRITICAL: EATING DISORDER HALLUCINATION PATTERNS
  // Check specifically for the pattern where eating disorder statements mix with food small talk
  const eatingDisorderHallucinationPatterns = [
    // Location/food mentions mixed with eating disorders
    /(eating disorder|binge eating|can't stop eating).+(brewing|restaurant|pub|ohio|city|craft beer)/i,
    /(brewing|restaurant|pub|ohio|city|craft beer).+(eating disorder|binge eating|can't stop eating)/i,
    
    // Breaking in the middle of a critical eating disorder statement
    /eating disorder.*craft beer/i,
    /craft beer.*eating disorder/i,
    /binge eating.*pub fare/i,
    /pub fare.*binge eating/i,
    
    // Common eating disorder hallucination mixing patterns
    /You mentioned eat before when we talked about/i,
    /You mentioned \w+ before when we/i,
    /I've eate\.\.\. You mentioned/i
  ];
  
  // Check these critical patterns first
  for (const pattern of eatingDisorderHallucinationPatterns) {
    if (pattern.test(responseText)) {
      flags.push({
        type: 'critical_protocol_mix',
        severity: 'critical',
        description: 'Critical protocol mixing between eating disorder response and casual food content'
      });
      confidenceScore -= 0.9; // Severe penalty for this dangerous hallucination
    }
  }
  
  // CRITICAL: Check for repetition patterns like "I hear you're dealing with I hear you're dealing with"
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i,
    // NEW: Additional critical patterns found in recent hallucinations
    /You mentioned eat before when we talked about|You mentioned \w+ before when we/i,
    /I've eate\.\.\. You mentioned/i,
    // Suicide/crisis specific patterns
    /based on what you('re| are) sharing, what you('re| are) sharing what you('re| are) sharing/i,
    /what you('re| are) sharing what you('re| are) sharing/i
  ];
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(responseText)) {
      flags.push({
        type: 'repetition',
        severity: 'high',
        description: 'Repeated phrases in response indicating model confusion'
      });
      confidenceScore -= 0.7; // Heavy penalty for dangerous repetition
    }
  }
  
  // CRITICAL: Check for hallucinations about prior conversations in early conversations
  // This is extremely important for eating disorder and crisis situations
  if (conversationHistory.length <= 3) {
    if (/you mentioned before|you told me earlier|when we talked about|as we discussed|as you said|as you mentioned|you've told me/i.test(responseText)) {
      flags.push({
        type: 'false_memory',
        severity: 'critical', // This is a critical issue
        description: 'False memory reference in early conversation'
      });
      confidenceScore -= 0.8; // Severe penalty for this dangerous hallucination
    }
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
  
  // Detect token-level issues using probabilistic analysis
  const tokenFlags = detectTokenLevelIssues(responseText, userInput, conversationHistory);
  flags.push(...tokenFlags);
  
  // Reduce confidence based on token-level flags
  confidenceScore -= tokenFlags.length * 0.15;
  
  // Detect repeated content (a sign of model confusion)
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
                         flags.some(flag => flag.severity === 'high' || flag.severity === 'critical');
  
  // Generate token-level analysis result
  const tokenLevelAnalysis = generateTokenLevelAnalysis(responseText);
  
  // Create the result object with the correct properties
  return {
    isHallucination,
    confidence: confidenceScore,
    flags,
    tokenLevelAnalysis
  };
};
