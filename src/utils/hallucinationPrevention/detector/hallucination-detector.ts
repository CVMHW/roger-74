
/**
 * Core hallucination detection functionality
 */

import { HallucinationCheck, HallucinationFlag } from './types';
import { 
  detectFalseMemoryReferences,
  detectLogicalErrors,
  detectTokenLevelIssues,
  detectRepeatedContent,
  detectFalseContinuity
} from '../detection-flags';
import { generateTokenLevelAnalysis } from '../token-analysis';
import { checkEmotionMisidentification } from '../../response/processor/emotionHandler/emotionMisidentificationHandler';
import { extractEmotionsFromInput } from '../../response/processor/emotions';

/**
 * Checks for potential hallucinations in a response
 * Uses multi-faceted approach to detect different types of hallucinations
 * ENHANCED with emotion misidentification detection
 */
export const detectHallucinations = (
  responseText: string,
  userInput: string, 
  conversationHistory: string[]
): HallucinationCheck => {
  console.log("HALLUCINATION DETECTOR: Analyzing response for potential hallucinations");
  
  const flags: HallucinationFlag[] = [];
  let confidence = 1.0; // Start with high confidence
  
  // CRITICAL: NEW EMOTIONAL MISIDENTIFICATION CHECK - highest priority
  // Check if the response misidentifies emotions, especially depression
  const emotionInfo = extractEmotionsFromInput(userInput);
  
  if (emotionInfo.isDepressionMentioned) {
    // Check if response claims neutral or doesn't acknowledge depression
    const claimsNeutral = /you'?re feeling neutral|you seem neutral|neutral tone/i.test(responseText);
    const acknowledgesDepression = /\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase());
    
    if (claimsNeutral || !acknowledgesDepression) {
      flags.push({
        type: 'critical_emotion_misidentification',
        severity: 'critical',
        description: 'Depression mentioned but not acknowledged or misidentified as neutral',
        confidence: 0.95
      });
      confidence -= 0.9; // Severe penalty
    }
  }
  
  // Check for general emotion misidentification
  const hasMisidentifiedEmotion = checkEmotionMisidentification(responseText, userInput);
  if (hasMisidentifiedEmotion) {
    flags.push({
      type: 'emotion_misidentification',
      severity: 'high',
      description: 'Response misidentifies user\'s emotional state',
      confidence: 0.9
    });
    confidence -= 0.7; // Substantial penalty
  }
  
  // CRITICAL: CRISIS DETECTION WITH VECTOR-BASED PATTERN RECOGNITION
  // Enhanced pattern detection for crisis situations
  
  // Check for dangerous mixing of crisis response with casual content
  if (/eating disorder|suicide|crisis|self-harm|mental health|drinking|alcohol|substance/i.test(responseText.toLowerCase())) {
    const containsCasualContent = /brewery|restaurant|pub|bar|craft beer|food|recipe|social gathering|concert/i.test(responseText);
    
    if (containsCasualContent) {
      flags.push({
        type: 'critical_protocol_violation',
        severity: 'critical',
        description: 'Mixing crisis response with casual/social content',
        confidence: 0.95
      });
      confidence -= 0.9; // Severe penalty for this dangerous mixture
    }
  }
  
  // ENHANCED: MULTI-CRISIS DETECTION
  // Check if the response is addressing the wrong crisis type
  if (/suicide|kill (myself|me)|shoot myself|self.?harm|end my life/i.test(userInput.toLowerCase())) {
    // If talking about suicide but response mentions eating disorders exclusively
    if (!/suicide|crisis|988|emergency|professional help|lifeline|kill|harm|emergency room/i.test(responseText.toLowerCase()) && 
        /eating disorder|NEDA|National Eating Disorders Association/i.test(responseText)) {
      flags.push({
        type: 'crisis_type_mismatch',
        severity: 'critical',
        description: 'Response about eating disorders when user is discussing suicide',
        confidence: 0.95
      });
      confidence -= 0.9;
    }
  }
  
  // Check for substance abuse content being mishandled
  if (/drinking|alcohol|drunk|intoxicated|can't stop drinking|addicted|substance|beer|30 beers/i.test(userInput.toLowerCase())) {
    // If response doesn't address substance use but instead talks about eating disorders
    if (!/drinking|alcohol|substance|SAMHSA|recovery|sober/i.test(responseText.toLowerCase()) &&
        /eating disorder|NEDA|National Eating Disorders Association/i.test(responseText)) {
      flags.push({
        type: 'substance_use_mishandled',
        severity: 'high',
        description: 'Substance use concern addressed as eating disorder',
        confidence: 0.9
      });
      confidence -= 0.7;
    }
  }
  
  // Check for memory references without actual memory
  const memoryFlags = detectFalseMemoryReferences(responseText, userInput, conversationHistory);
  flags.push(...memoryFlags);
  
  // Reduce confidence based on memory flags (most critical)
  confidence -= memoryFlags.length * 0.25;
  
  // Check for logical errors and contradictions
  const logicalFlags = detectLogicalErrors(responseText, conversationHistory);
  flags.push(...logicalFlags);
  
  // Reduce confidence based on logical flags
  confidence -= logicalFlags.length * 0.2;
  
  // Check for false continuity claims
  const continuityFlags = detectFalseContinuity(responseText, conversationHistory);
  flags.push(...continuityFlags);
  
  // Reduce confidence based on continuity flags
  confidence -= continuityFlags.length * 0.3;
  
  // Detect token-level issues using probabilistic analysis
  const tokenFlags = detectTokenLevelIssues(responseText, userInput, conversationHistory);
  flags.push(...tokenFlags);
  
  // Reduce confidence based on token-level flags
  confidence -= tokenFlags.length * 0.15;
  
  // Detect repeated content (a sign of model confusion)
  const repetitionFlags = detectRepeatedContent(responseText);
  flags.push(...repetitionFlags);
  
  // Reduce confidence based on repetition flags (very important)
  confidence -= repetitionFlags.length * 0.35;
  
  // Extra check for hallucinations in short conversations
  if (conversationHistory.length <= 2) {
    // In new conversations, any reference to previous discussions is a hallucination
    if (/we've been|we discussed|as I mentioned|you told me|you said|you mentioned|I remember|earlier you said|previously/i.test(responseText)) {
      flags.push({
        type: 'false_continuity',
        severity: 'high',
        description: 'False reference to previous conversation in a new chat',
        confidence: 0.9
      });
      confidence -= 0.4;
    }
  }
  
  // Bound confidence between 0 and 1
  confidence = Math.max(0, Math.min(1, confidence));
  
  // Determine if this should be flagged as hallucination
  const isHallucination = confidence < 0.6 || 
                         flags.some(flag => flag.severity === 'high' || flag.severity === 'critical');
  
  // Generate token-level analysis result
  const tokenLevelAnalysis = generateTokenLevelAnalysis(responseText);
  
  // Return results with emotion checks prioritized
  return {
    isHallucination,
    confidence,
    flags,
    tokenLevelAnalysis,
    emotionMisidentified: hasMisidentifiedEmotion,
    depressionMisidentified: emotionInfo.isDepressionMentioned && 
      (!/\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase()))
  };
};
