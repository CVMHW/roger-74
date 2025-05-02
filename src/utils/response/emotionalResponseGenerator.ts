
import { detectContentConcerns, detectEmotionalPatterns, generateEmotionalResponse } from '../../utils/conversationEnhancement/emotionalInputHandler';
import { detectSarcasm, generateSarcasmResponse } from '../../utils/conversationEnhancement/emotionalInputHandler';
import { detectRepetition, generateRepetitionAcknowledgment } from '../../utils/conversationEnhancement/emotionalInputHandler';
import { detectSimpleNegativeState, generateSimpleNegativeStateResponse } from '../../utils/conversationalUtils';
import { detectPoliticalEmotions, generatePoliticalEmotionResponse } from '../../utils/conversationalUtils';

/**
 * Handles initial emotional content detection and response generation
 * @param userInput The user's message
 * @param conversationHistory Recent conversation history
 */
export const handleEmotionalResponses = (userInput: string, conversationHistory: string[]): string | null => {
  // Check for repetition patterns that might indicate frustration
  if (conversationHistory.length >= 2) {
    const repetitionInfo = detectRepetition(userInput, conversationHistory.slice(-3));
    const contentInfo = detectContentConcerns(userInput);
    
    // If user is repeating themselves and showing signs of frustration, acknowledge it
    if (repetitionInfo.isRepeating && repetitionInfo.repetitionCount >= 2) {
      const isUserFrustrated = detectSarcasm(userInput) || 
                              userInput.toUpperCase() === userInput ||
                              userInput.includes('!');
      
      if (isUserFrustrated) {
        return generateRepetitionAcknowledgment(repetitionInfo, contentInfo);
      }
    }
  }
  
  // Check for sarcasm or frustration with responses
  if (detectSarcasm(userInput)) {
    const contentInfo = detectContentConcerns(userInput);
    return generateSarcasmResponse(contentInfo);
  }
  
  // Check for explicitly stated feelings first
  const negativeStateInfo = detectSimpleNegativeState(userInput);
  if (negativeStateInfo.isNegativeState) {
    // Enhanced to detect specific content concerns in the message
    const contentInfo = detectContentConcerns(userInput);
    
    // Always acknowledge explicitly stated feelings or emotional states first
    return generateSimpleNegativeStateResponse(userInput, negativeStateInfo, contentInfo);
  }
  
  // Check for political emotions
  const politicalInfo = detectPoliticalEmotions(userInput);
  if (politicalInfo.isPolitical) {
    return generatePoliticalEmotionResponse(userInput, politicalInfo);
  }
  
  // Check for emotional patterns and content simultaneously
  const emotionalInfo = detectEmotionalPatterns(userInput);
  const contentInfo = detectContentConcerns(userInput);
  
  // If we detect emotion and specific content, generate a response that acknowledges both
  if (emotionalInfo.hasEmotionalContent && contentInfo.hasConcern) {
    return generateEmotionalResponse(emotionalInfo, contentInfo);
  } else if (emotionalInfo.hasEmotionalContent) {
    return generateEmotionalResponse(emotionalInfo);
  }
  
  return null;
};
