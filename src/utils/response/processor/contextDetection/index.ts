
/**
 * Context Detection Module
 * 
 * Provides functions to detect and analyze conversation context 
 * for emotional understanding and appropriate responses
 */

import { detectEmotionalContent } from '../../../masterRules/emotionalAttunement/detectors';
import { detectSocialEmotionalContext } from '../../../emotions/emotionsWheel';

/**
 * Analyzes user input for emotional and situational context
 */
export const detectContextualFactors = (userInput: string) => {
  // Detect emotional content using our emotions wheel integration
  const emotionalContext = detectEmotionalContent(userInput);
  
  // Check for social situations like embarrassment
  const socialContext = detectSocialEmotionalContext(userInput);
  
  // Check for Cleveland/Ohio references
  const hasOhioReference = /cleveland|ohio|midwest|lake erie|cuyahoga/i.test(userInput);
  
  // Check for sports references
  const hasSportsReference = /cavs|browns|guardians|game|match|team|sports/i.test(userInput);
  
  return {
    emotionalContext,
    socialContext,
    hasOhioReference,
    hasSportsReference
  };
};

/**
 * Determines if a response should be more conversational/casual or therapeutic
 */
export const shouldUseConversationalTone = (userInput: string): boolean => {
  // Use more conversational tone for social situations and embarrassment
  const socialContext = detectSocialEmotionalContext(userInput);
  if (socialContext?.primaryEmotion === 'embarrassed') {
    return true;
  }
  
  // Use more conversational tone for everyday situations
  const everydaySituationPatterns = [
    /spill(ed)?|mess|accident|awkward|embarrassing/i,
    /traffic|weather|rain|snow|cold|hot/i,
    /sports|game|match|movie|show|concert/i,
    /date|dating|relationship|crush|girlfriend|boyfriend/i
  ];
  
  return everydaySituationPatterns.some(pattern => pattern.test(userInput));
};
