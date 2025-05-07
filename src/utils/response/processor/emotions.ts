
/**
 * Emotion Response Processing
 * 
 * Handles emotion detection and correction in responses
 */

import { checkEmotionMisidentification, fixEmotionMisidentification, addHumanTouch } from './emotionHandler/emotionMisidentificationHandler';
import { 
  detectEmotionalContent,
  detectMeaningThemes,
  determineReflectionType
} from '../../masterRules/emotionalAttunement';
import { detectExplicitEmotionStatement } from '../../masterRules/emotionalAttunement/detectors';
import { 
  getEmotionFromWheel, 
  detectSocialEmotionalContext 
} from '../../emotions/emotionsWheel';

/**
 * Processes emotions in responses, fixing misidentifications
 * Enhanced to distinguish between reflections of feeling and meaning
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
    
    // Detect emotions and meaning themes
    const emotionInfo = detectEmotionalContent(userInput);
    const meaningThemes = detectMeaningThemes(userInput);
    
    // Determine which type of reflection is most appropriate
    const reflectionType = determineReflectionType(userInput, emotionInfo);
    
    // NEW: Special handling for brief temporal statements that should always use meaning reflection
    const isBriefTemporalStatement = userInput.split(/\s+/).length <= 5 && 
      /(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i.test(userInput);
    
    // Check for emotion-focused responses being used for meaning-focused content
    if ((reflectionType === 'meaning' || isBriefTemporalStatement) && 
        responseText.match(/I hear that you're feeling|I notice you're feeling|sounds like you feel|you seem to feel|That sounds difficult/i) &&
        !responseText.match(/important to you|matters to you|value|searching for|trying to|balance|tension between|struggling with|difficult moments often reveal|challenging experiences|priorities|significant/i)) {
      
      // This appears to be a reflection of feeling when meaning is needed
      // Let's enhance the response with meaning elements
      
      // For brief temporal statements, create a completely new meaning-focused response
      if (isBriefTemporalStatement) {
        const timeFrame = userInput.match(/(day|night|week|morning|evening)/i)?.[0].toLowerCase() || "experience";
        
        const meaningResponses = [
          `These challenging ${timeFrame}s often make us reflect on what's truly important. What aspects of this ${timeFrame} have been most significant for you?`,
          `Difficult ${timeFrame}s like this can reveal what matters to us on a deeper level. What has been weighing on your mind about this?`,
          `When we go through tough ${timeFrame}s, it often tells us something important about our lives and what we value. What's been most challenging about this for you?`
        ];
        
        return meaningResponses[Math.floor(Math.random() * meaningResponses.length)];
      }
      
      // For other meaning themes, enhance the existing response
      if (meaningThemes.hasMeaningTheme && meaningThemes.themes.length > 0) {
        const theme = meaningThemes.themes[0];
        
        if (meaningThemes.conflictingValues && meaningThemes.conflictingValues.length > 0) {
          // Add reflection of conflicting values
          responseText = responseText.replace(
            /\.(.*Would you like to tell me more about|.*Could you tell me more about|.*Can you share more about)/i,
            `. This seems to highlight a tension between ${meaningThemes.conflictingValues[0].split('-').join(' and ')}.$1`
          );
        } else if (meaningThemes.lifeValues && meaningThemes.lifeValues.length > 0) {
          // Add reflection of underlying values
          responseText = responseText.replace(
            /\.(.*Would you like to tell me more about|.*Could you tell me more about|.*Can you share more about)/i,
            `. It sounds like ${meaningThemes.lifeValues[0]} is important to you.$1`
          );
        } else {
          // Add general meaning reflection
          responseText = responseText.replace(
            /\.(.*Would you like to tell me more about|.*Could you tell me more about|.*Can you share more about)/i,
            `. This seems to bring up questions about ${theme} in your life.$1`
          );
        }
      }
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
  
  // Check for meaning themes
  const meaningThemes = detectMeaningThemes(userInput);
  
  return {
    explicitEmotion,
    socialContext,
    emotionalContent,
    meaningThemes,
    hasDetectedEmotion: !!(explicitEmotion || (socialContext?.primaryEmotion) || emotionalContent.hasEmotion),
    hasMeaningTheme: meaningThemes.hasMeaningTheme
  };
}
