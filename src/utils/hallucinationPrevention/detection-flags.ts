
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
