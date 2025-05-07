
/**
 * Emotional Attunement System
 * 
 * Exports functionality for detecting emotions and generating 
 * emotionally appropriate responses.
 */

import { detectEmotionalContent, detectEverydaySituation, detectMeaningThemes } from './detectors';
import { 
  generateEmotionallyAttunedResponse, 
  generatePracticalSupportResponse,
  generateMeaningFocusedResponse,
  determineReflectionType,
  generateAppropriateReflection
} from './responseGenerators';
import { EmotionInfo, EverydaySituationInfo } from './types';

export {
  detectEmotionalContent,
  detectEverydaySituation,
  detectMeaningThemes,
  generateEmotionallyAttunedResponse,
  generatePracticalSupportResponse,
  generateMeaningFocusedResponse,
  determineReflectionType,
  generateAppropriateReflection
};

export type {
  EmotionInfo,
  EverydaySituationInfo
};

/**
 * Process user input and generate emotionally attuned response
 * Enhanced to properly distinguish between reflection of feeling and meaning
 * @param userInput User message to analyze
 * @returns Generated response or empty string if no emotion detected
 */
export const processEmotionalInput = (userInput: string): string => {
  // First check for emotional content
  const emotionInfo = detectEmotionalContent(userInput);
  
  if (emotionInfo.hasEmotion) {
    // Instead of always using feeling reflection, determine appropriate reflection type
    return generateAppropriateReflection(userInput, emotionInfo);
  }
  
  // If no strong emotion, check for everyday situations
  const situationInfo = detectEverydaySituation(userInput);
  
  if (situationInfo.isEverydaySituation) {
    return generatePracticalSupportResponse(situationInfo);
  }
  
  // No specific emotional content detected
  return "";
};
