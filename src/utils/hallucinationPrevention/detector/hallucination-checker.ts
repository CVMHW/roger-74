
/**
 * Hallucination checking and fixing functionality
 */

import { HallucinationCheck } from './types';
import { createEmotionMisidentificationFlag, createNeutralEmotionHallucinationFlag } from '../detection-flags';
import { analyzeTokenPatterns, calculateTextStats } from '../token-analysis';

/**
 * Calculate string similarity between two strings
 */
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Simple implementation of string similarity
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;
  
  // Calculate intersection of words
  const words1 = s1.split(/\s+/).filter(w => w.trim().length > 0);
  const words2 = s2.split(/\s+/).filter(w => w.trim().length > 0);
  
  const wordSet1 = new Set(words1);
  const intersection = words2.filter(word => wordSet1.has(word)).length;
  
  // Calculate jaccard similarity
  return intersection / (words1.length + words2.length - intersection);
};

/**
 * Quick check for hallucination patterns
 */
export const quickHallucinationCheck = (
  responseText: string,
  conversationHistory: string[]
): { potentialIssue: boolean, hasRepeatedSentences: boolean } => {
  // Check for repeating sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let hasRepeatedSentences = false;
  
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      if (calculateStringSimilarity(sentences[i], sentences[j]) > 0.7) {
        hasRepeatedSentences = true;
        break;
      }
    }
    if (hasRepeatedSentences) break;
  }
  
  // Check for memory references in early conversations
  const hasMemoryReference = conversationHistory.length < 3 && 
    /previously you|earlier you|you mentioned|as you said|we discussed|our previous session|last time we|you've been telling me/i.test(responseText);
  
  // Check for contradictions
  const hasContradictoryStatements = /but actually|contrary to|in fact|on the contrary|actually|despite what I said|however|nonetheless|nevertheless|even though/i.test(responseText);
  
  // Check for potential neutrality statements
  const hasNeutralityClaims = /you seem to be feeling neutral|you (don't|do not) seem to be feeling|I'm not detecting|I don't detect any strong emotions/i.test(responseText);
  
  return {
    potentialIssue: hasRepeatedSentences || hasMemoryReference || hasContradictoryStatements || hasNeutralityClaims,
    hasRepeatedSentences
  };
};

/**
 * Main function to check and fix hallucinations
 */
export const checkAndFixHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): { 
  correctedResponse: string;
  wasHallucination: boolean;
  hallucinationDetails: HallucinationCheck | null;
} => {
  // Check if we need to run full hallucination detection
  const quickCheck = quickHallucinationCheck(responseText, conversationHistory);
  
  // If quick check passes and it's not a new conversation, return original
  if (!quickCheck.potentialIssue && conversationHistory.length > 2) {
    return { 
      correctedResponse: responseText, 
      wasHallucination: false,
      hallucinationDetails: null
    };
  }
  
  // If this is a new conversation, be VERY cautious about memory claims
  const isNewConversation = conversationHistory.length <= 2;
  
  // First check for repetition patterns that need immediate fixing
  const repetitionPatterns = [
    {
      pattern: /(I hear (you'?re|you are) dealing with) I hear (you'?re|you are) dealing with/i,
      replacement: '$1'
    },
    {
      pattern: /(I remember (you|your|we)) I remember (you|your|we)/i,
      replacement: '$1'
    },
    {
      pattern: /(you (mentioned|said|told me)) you (mentioned|said|told me)/i,
      replacement: '$1'
    }
  ];
  
  let fixedResponse = responseText;
  let hasRepetitionIssue = false;
  
  // Apply repetition fixes first
  for (const { pattern, replacement } of repetitionPatterns) {
    if (pattern.test(fixedResponse)) {
      console.warn("REPETITION DETECTED: Fixing repeated phrases");
      fixedResponse = fixedResponse.replace(pattern, replacement);
      hasRepetitionIssue = true;
    }
  }
  
  // SPECIAL HANDLING: Check for depression in user input
  const hasDepressionIndicators = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  // Look for neutral emotion claim when depression is mentioned
  const hasNeutralClaim = /you seem (to be feeling|to feel) neutral|you (don't|do not) seem to be feeling|I'm not detecting any strong emotions|I don't detect any strong emotions|your emotions (seem|are|appear) neutral/i.test(responseText);
  
  // CRITICAL: Check for depression + neutrality hallucination
  if (hasDepressionIndicators && hasNeutralClaim) {
    console.warn("CRITICAL: Detected neutrality claim with depression mention");
    
    // Create emotional misidentification flag
    const emotionMisidentifiedCheck: HallucinationCheck = {
      isHallucination: true,
      confidence: 0.95,
      reason: "Claimed neutrality when depression was mentioned",
      flags: [
        createNeutralEmotionHallucinationFlag("depression")
      ],
      corrections: "I hear that you're feeling depressed. I'm here to listen and support you."
    };
    
    // Replace neutral claim with depression acknowledgment
    fixedResponse = fixedResponse.replace(
      /you seem (to be feeling|to feel) neutral|you (don't|do not) seem to be feeling|I'm not detecting any strong emotions|I don't detect any strong emotions|your emotions (seem|are|appear) neutral/i,
      "I hear that you're feeling depressed"
    );
    
    // If acknowledgment isn't at the start, add it
    if (!fixedResponse.toLowerCase().includes("depress")) {
      fixedResponse = `I'm very sorry to hear that you're feeling depressed. ${fixedResponse}`;
    }
    
    return {
      correctedResponse: fixedResponse,
      wasHallucination: true,
      hallucinationDetails: emotionMisidentifiedCheck
    };
  }
  
  // Perform analysis to detect other hallucinations
  const tokenAnalysis = analyzeTokenPatterns(responseText);
  
  // Create default response when no specific hallucination is detected
  return {
    correctedResponse: fixedResponse,
    wasHallucination: hasRepetitionIssue,
    hallucinationDetails: hasRepetitionIssue ? {
      isHallucination: true,
      confidence: 0.8,
      reason: "Repeated phrases detected",
      flags: [{
        type: "repetition" as any,
        severity: "medium" as any,
        description: "Repeated phrases in response"
      }]
    } : null
  };
};
