
/**
 * Emotional Attunement System
 * 
 * Exports functionality for detecting emotions and generating 
 * emotionally appropriate responses.
 */

import { detectEmotionalContent, detectEverydaySituation } from './detectors';
import { generateEmotionallyAttunedResponse, generatePracticalSupportResponse } from './responseGenerators';
import { EmotionInfo, EverydaySituationInfo } from './types';

export {
  detectEmotionalContent,
  detectEverydaySituation,
  generateEmotionallyAttunedResponse,
  generatePracticalSupportResponse
};

export type {
  EmotionInfo,
  EverydaySituationInfo
};

/**
 * Process user input and generate emotionally attuned response
 * @param userInput User message to analyze
 * @returns Generated response or empty string if no emotion detected
 */
export const processEmotionalInput = (userInput: string): string => {
  // First check for emotional content
  const emotionInfo = detectEmotionalContent(userInput);
  
  if (emotionInfo.hasEmotion) {
    return generateEmotionallyAttunedResponse(emotionInfo, userInput);
  }
  
  // If no strong emotion, check for everyday situations
  const situationInfo = detectEverydaySituation(userInput);
  
  if (situationInfo.isEverydaySituation) {
    return generatePracticalSupportResponse(situationInfo);
  }
  
  // No specific emotional content detected
  return "";
};

