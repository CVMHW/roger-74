
import { detectEnhancedFeelings } from '../../../utils/reflection/feelingDetection';
import { containsCriticalKeywords, isPetLossContent, isUserPointingOutNonResponsiveness } from './detectionUtils';

/**
 * Determines the appropriate processing context based on user input
 */
export const determineProcessingContext = async (userInput: string): Promise<string> => {
  if (containsCriticalKeywords(userInput)) {
    return "Roger is carefully considering your message about self-harm...";
  } else if (isPetLossContent(userInput)) {
    return "Roger is reflecting on what you shared about your pet...";
  } else if (isUserPointingOutNonResponsiveness(userInput)) {
    return "Roger is reviewing your previous messages...";
  } else {
    try {
      // Use enhanced NLP to detect emotions and generate more specific context
      const feelingResult = await detectEnhancedFeelings(userInput);
      if (feelingResult.primaryFeeling) {
        return `Roger is reflecting on your feelings of ${feelingResult.primaryFeeling}...`;
      }
      
      // If no specific emotions detected, use topics
      if (feelingResult.topics && feelingResult.topics.length > 0) {
        return `Roger is considering what you shared about ${feelingResult.topics[0]}...`;
      }
    } catch (error) {
      console.error('Error in enhanced processing context:', error);
    }
    
    // Choose from various "thinking" contexts if NLP analysis fails
    const contexts = [
      "Roger is carefully listening...",
      "Roger is considering how to respond...",
      "Roger is reflecting on your message...",
      "Roger is thoughtfully processing..."
    ];
    return contexts[Math.floor(Math.random() * contexts.length)];
  }
};
