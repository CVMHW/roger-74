
/**
 * Core hallucination detection functionality
 */

import { HallucinationCheck } from '../../types/hallucinationPrevention';
import { 
  detectFalseMemoryReferences,
  detectLogicalErrors,
  detectTokenLevelIssues,
  detectRepeatedContent,
  detectFalseContinuity
} from './detection-flags';
import { generateTokenLevelAnalysis } from './token-analysis';
import { checkEmotionMisidentification } from '../response/processor/emotionHandler/emotionMisidentificationHandler';
import { extractEmotionsFromInput } from '../response/processor/emotions';

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
  
  const flags = [];
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
        description: 'Depression mentioned but not acknowledged or misidentified as neutral'
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
      description: 'Response misidentifies user\'s emotional state'
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
        description: 'Mixing crisis response with casual/social content'
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
        description: 'Response about eating disorders when user is discussing suicide'
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
        description: 'Substance use concern addressed as eating disorder'
      });
      confidence -= 0.7;
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
      confidence -= 0.9; // Severe penalty for this dangerous hallucination
    }
    
    // Verify that suicide response contains appropriate crisis resources
    if (!/(988|crisis|professional|emergency|lifeline|help)/i.test(responseText)) {
      flags.push({
        type: 'missing_crisis_resources',
        severity: 'critical',
        description: 'Suicide response missing appropriate crisis resources'
      });
      confidence -= 0.8;
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
      confidence -= 0.9; // Severe penalty for this dangerous hallucination
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
      confidence -= 0.7; // Heavy penalty for dangerous repetition
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
      confidence -= 0.8; // Severe penalty for this dangerous hallucination
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
        description: 'False reference to previous conversation in a new chat'
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
    flags,
    confidence,
    isHallucination,
    wasHallucination: isHallucination, // For backward compatibility
    emotionMisidentified: hasMisidentifiedEmotion,
    depressionMisidentified: emotionInfo.isDepressionMentioned && 
      (!/\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase()))
  };
};

/**
 * Fixes hallucinations in responses
 * ENHANCED with emotion misidentification corrections
 */
export const checkAndFixHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): { 
  wasHallucination: boolean; 
  correctedResponse: string; 
  hallucinationDetails?: any; 
} => {
  // Check for hallucinations
  const hallucination = detectHallucinations(responseText, userInput, conversationHistory);
  
  if (hallucination.isHallucination) {
    let correctedResponse = responseText;
    
    // PRIORITY: Fix emotion misidentification first
    if (hallucination.emotionMisidentified) {
      console.log("HALLUCINATION CORRECTION: Fixing emotion misidentification");
      
      // Import needed for inline processing
      const { fixEmotionMisidentification } = require('../response/processor/emotionHandler/emotionMisidentificationHandler');
      correctedResponse = fixEmotionMisidentification(correctedResponse, userInput);
    }
    
    // Fix repetition issues
    if (hallucination.flags.some(flag => flag.type === 'repetition')) {
      console.log("HALLUCINATION CORRECTION: Fixing repetition issues");
      
      // Remove repeated phrases
      const repetitionPatterns = [
        /(I hear (you'?re|you are) dealing with).*(I hear (you'?re|you are) dealing with)/i,
        /(I remember (you|your|we)).*(I remember (you|your|we))/i,
        /(you (mentioned|said|told me)).*(you (mentioned|said|told me))/i,
        /((I hear|It sounds like) you('re| are) (dealing with|feeling)).*((I hear|It sounds like) you('re| are))/i
      ];
      
      for (const pattern of repetitionPatterns) {
        const match = correctedResponse.match(pattern);
        if (match && match[1] && match[3]) {
          // Keep the first instance, remove the repeated one
          correctedResponse = correctedResponse.replace(match[3], '');
        }
      }
      
      // Clean up any resulting artifacts
      correctedResponse = correctedResponse
        .replace(/\s{2,}/g, ' ')
        .replace(/\. \./g, '.')
        .replace(/,\s*\./g, '.');
    }
    
    // Fix crisis protocol mixing
    if (hallucination.flags.some(flag => flag.type === 'critical_protocol_violation' || 
                                       flag.type === 'critical_protocol_mix')) {
      console.log("HALLUCINATION CORRECTION: Fixing crisis protocol mixing");
      
      // If we have both crisis content and casual content, prioritize crisis
      if (/suicide|crisis|self-harm/i.test(userInput)) {
        // Create a crisis-focused response
        correctedResponse = "I'm concerned about what you've shared regarding thoughts of suicide or self-harm. " +
          "This is something to take seriously. The National Suicide Prevention Lifeline is available 24/7 at 988 " +
          "or 1-800-273-8255. Would it be helpful to discuss what resources might be available to you right now?";
      } else if (/eating disorder|binge|purge|anorexia|bulimia/i.test(userInput)) {
        // Create an eating disorder focused response
        correctedResponse = "Thank you for sharing your struggles with disordered eating. " +
          "These are serious concerns that deserve proper support. " +
          "The National Eating Disorders Association (NEDA) has resources that might help. " +
          "Would you like to talk more about what you're experiencing?";
      }
    }
    
    // Fix false memory references in early conversation
    if (hallucination.flags.some(flag => flag.type === 'false_memory')) {
      console.log("HALLUCINATION CORRECTION: Fixing false memory references");
      
      correctedResponse = correctedResponse
        .replace(/you mentioned before|you told me earlier|when we talked about|as we discussed|as you said|as you mentioned|you've told me/gi, 
                "based on what you're sharing")
        .replace(/we talked about|our previous conversation|earlier you said/gi, 
                "from what I understand");
    }
    
    // Fix crisis type mismatch
    if (hallucination.flags.some(flag => flag.type === 'crisis_type_mismatch')) {
      console.log("HALLUCINATION CORRECTION: Fixing crisis type mismatch");
      
      // Check which crisis is actually being discussed
      if (/suicide|kill (myself|me)|shoot myself|self.?harm|end my life/i.test(userInput.toLowerCase())) {
        correctedResponse = "I'm very concerned about what you've shared regarding thoughts of suicide. " +
          "This is something to take seriously. The National Suicide Prevention Lifeline is available 24/7 at 988 " +
          "or 1-800-273-8255. Would it help to talk about what you're going through right now?";
      } else if (/drinking|alcohol|drunk|intoxicated|substance|beer/i.test(userInput.toLowerCase())) {
        correctedResponse = "I hear your concerns about substance use. " +
          "The SAMHSA National Helpline at 1-800-662-4357 provides information and treatment referrals. " +
          "Would you like to talk about what's been going on with your drinking?";
      }
    }
    
    console.log("HALLUCINATION CORRECTION: Hallucination fixed");
    return {
      wasHallucination: true, 
      correctedResponse,
      hallucinationDetails: {
        flags: hallucination.flags,
        confidence: hallucination.confidence,
        isEmotionMisidentification: hallucination.emotionMisidentified
      }
    };
  }
  
  // No hallucination detected
  return { wasHallucination: false, correctedResponse: responseText };
};
