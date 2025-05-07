
/**
 * Emotion Response Processing
 * 
 * Handles emotion detection and correction in responses
 */

import { checkEmotionMisidentification, fixEmotionMisidentification, addHumanTouch } from './emotionHandler/emotionMisidentificationHandler';
import { detectEmotionalContent } from '../../masterRules/emotionalAttunement/detectors';
import { detectExplicitEmotionStatement } from '../../masterRules/emotionalAttunement/detectors';
import { 
  getEmotionFromWheel, 
  detectSocialEmotionalContext 
} from '../../emotions/emotionsWheel';

/**
 * Processes emotions in responses, fixing misidentifications
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @returns Processed response text
 */
export function processEmotions(responseText: string, userInput: string): string {
  try {
    // First check if there's an emotion misidentification (especially "neutral" misidentifications)
    if (checkEmotionMisidentification(responseText, userInput)) {
      responseText = fixEmotionMisidentification(responseText, userInput);
    }
    
    // Check for explicit emotion statements that weren't acknowledged
    const explicitEmotion = detectExplicitEmotionStatement(userInput);
    if (explicitEmotion) {
      const emotion = getEmotionFromWheel(explicitEmotion);
      if (emotion && !responseText.toLowerCase().includes(explicitEmotion)) {
        // Response doesn't acknowledge the explicit emotion
        responseText = responseText.replace(
          /^(I hear |From what you've shared, |Based on what you're saying, )/i,
          `I hear that you're feeling ${emotion.name}. `
        );
      }
    }
    
    // Check for social contexts that need special handling
    const socialContext = detectSocialEmotionalContext(userInput);
    if (socialContext && !responseText.includes(socialContext.primaryEmotion)) {
      // For social embarrassment, make sure we acknowledge it properly
      if (socialContext.primaryEmotion === 'embarrassed') {
        responseText = addHumanTouch(responseText, userInput);
      }
    }
    
    return responseText;
  } catch (error) {
    console.error("Error in processEmotions:", error);
    return responseText;
  }
}

/**
 * Extracts emotions from user input
 * @param userInput User's message
 * @returns Object containing detected emotions and related information
 */
export function extractEmotionsFromInput(userInput: string) {
  // First check for explicit emotion statements
  const explicitEmotion = detectExplicitEmotionStatement(userInput);
  
  // Then check for social contexts
  const socialContext = detectSocialEmotionalContext(userInput);
  
  // Then full emotional content analysis
  const emotionalContent = detectEmotionalContent(userInput);
  
  return {
    explicitEmotion,
    socialContext,
    emotionalContent,
    hasDetectedEmotion: !!(explicitEmotion || (socialContext?.primaryEmotion) || emotionalContent.hasEmotion)
  };
}
