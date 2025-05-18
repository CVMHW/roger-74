
/**
 * Hallucination detection flags
 */

import { HallucinationFlag, HallucinationFlagType, HallucinationSeverity } from './detector/types';

/**
 * Create a hallucination detection flag
 */
export const createHallucinationFlag = (
  type: HallucinationFlagType,
  description: string,
  severity: HallucinationSeverity,
  confidence: number = 0.8,
  affectedText?: string
): HallucinationFlag => {
  return {
    type,
    description,
    severity,
    confidence,
    affectedText
  };
};

/**
 * Flag for emotion misidentification
 */
export const createEmotionMisidentificationFlag = (
  description: string,
  affectedText?: string
): HallucinationFlag => {
  return createHallucinationFlag(
    'emotion_misidentification',
    description,
    'high',
    0.9,
    affectedText
  );
};

/**
 * Flag for neutral emotion hallucination
 */
export const createNeutralEmotionHallucinationFlag = (
  userEmotion: string
): HallucinationFlag => {
  return createHallucinationFlag(
    'neutral_emotion_hallucination',
    `Incorrectly claimed neutral state when user expressed ${userEmotion}`,
    'critical',
    0.95
  );
};

/**
 * Flag for false memory
 */
export const createFalseMemoryFlag = (
  description: string,
  affectedText?: string
): HallucinationFlag => {
  return createHallucinationFlag(
    'false_memory',
    description,
    'high',
    0.9,
    affectedText
  );
};

/**
 * Flag for crisis type mismatch
 */
export const createCrisisTypeMismatchFlag = (
  description: string,
  affectedText?: string
): HallucinationFlag => {
  return createHallucinationFlag(
    'crisis_type_mismatch',
    description,
    'critical',
    0.95,
    affectedText
  );
};

/**
 * Detect false memory references
 */
export const detectFalseMemoryReferences = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for false memory references in early conversation
  if (conversationHistory.length <= 2) {
    const falseMemoryPatterns = [
      /you (mentioned|told me|said) (before|earlier|previously|last time)/i,
      /as we (discussed|talked about) (before|earlier|previously|last time)/i,
      /you('ve| have) (mentioned|told me|said) (before|earlier|previously|last time)/i
    ];
    
    for (const pattern of falseMemoryPatterns) {
      if (pattern.test(responseText)) {
        flags.push(createFalseMemoryFlag(
          'False memory reference in early conversation',
          responseText.match(pattern)?.[0]
        ));
      }
    }
  }
  
  return flags;
};

/**
 * Detect logical errors
 */
export const detectLogicalErrors = (
  responseText: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Simplified implementation
  const contradictionPatterns = [
    /you mentioned .* but also said .* which contradicts/i,
    /you said .* which contradicts your earlier statement about/i
  ];
  
  for (const pattern of contradictionPatterns) {
    if (pattern.test(responseText)) {
      flags.push(createHallucinationFlag(
        'factual_contradiction',
        'Logical contradiction in response',
        'high',
        0.85,
        responseText.match(pattern)?.[0]
      ));
    }
  }
  
  return flags;
};

/**
 * Detect token-level issues
 */
export const detectTokenLevelIssues = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for incomplete sentences
  const incompletePatterns = [
    /\.\.\. you/i,
    /\w+\.\.\. I/i,
    /\w+\.\.\. You/i
  ];
  
  for (const pattern of incompletePatterns) {
    if (pattern.test(responseText)) {
      flags.push(createHallucinationFlag(
        'repetition',
        'Incomplete sentence indicating model confusion',
        'medium',
        0.8,
        responseText.match(pattern)?.[0]
      ));
    }
  }
  
  return flags;
};

/**
 * Detect repeated content
 */
export const detectRepeatedContent = (
  responseText: string
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for repeated phrases
  const repetitionPatterns = [
    /(I hear|It sounds like) you('re| are) .{3,30}(I hear|It sounds like) you('re| are)/i,
    /(you mentioned|you said|you told me) .{3,30}(you mentioned|you said|you told me)/i,
    /(I understand|I recognize) that you're .{3,30}(I understand|I recognize) that you're/i
  ];
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(responseText)) {
      flags.push(createHallucinationFlag(
        'repetition',
        'Repeated phrases in response indicating model confusion',
        'medium',
        0.85,
        responseText.match(pattern)?.[0]
      ));
    }
  }
  
  return flags;
};

/**
 * Detect false continuity
 */
export const detectFalseContinuity = (
  responseText: string,
  conversationHistory: string[] = []
): HallucinationFlag[] => {
  const flags: HallucinationFlag[] = [];
  
  // Check for false continuity in early conversation
  if (conversationHistory.length <= 2) {
    const falseContPatterns = [
      /as we('ve| have) been discussing/i,
      /continuing our conversation about/i,
      /as you('ve| have) been sharing/i,
      /based on what you've shared so far/i
    ];
    
    for (const pattern of falseContPatterns) {
      if (pattern.test(responseText)) {
        flags.push(createHallucinationFlag(
          'false_continuity',
          'False continuity reference in early conversation',
          'medium',
          0.8,
          responseText.match(pattern)?.[0]
        ));
      }
    }
  }
  
  return flags;
};
