
import { detectContentConcerns } from '../../utils/conversationEnhancement/emotionalInputHandler';

export const useAlternativeResponseGenerator = () => {
  /**
   * Alternative response generation when default is too repetitive
   */
  const generateAlternativeResponse = (userInput: string): string => {
    // Detect if there's a specific content to focus on
    const contentInfo = detectContentConcerns(userInput);
    
    if (contentInfo.hasConcern) {
      return `Let's focus on what you said about ${contentInfo.specificConcern || contentInfo.category}. Can you tell me more about what's most important about this for you right now?`;
    }
    
    // If no specific content, use one of these varied responses
    const alternatives = [
      "I want to make sure I understand what's most important to you right now. What would be most helpful for us to discuss?",
      "Let's take a step back. What aspect of what you've shared would be most useful to explore?",
      "I'd like to shift our focus to what matters most to you right now. What's your priority?",
      "Let's make sure I'm focusing on what's most important. What specifically are you hoping to get from our conversation today?",
      "I want to be sure I'm addressing what matters to you. What's the main concern you'd like us to focus on?"
    ];
    
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  };

  /**
   * Check if a response is too similar to recent responses
   */
  const isResponseRepetitive = (response: string, recentResponses: string[]): boolean => {
    // Import calculateResponseSimilarity
    const { calculateResponseSimilarity } = require('../../utils/helpers/userInfoUtils');
    
    // Skip very short responses
    if (response.length < 20) return false;
    
    for (const prevResponse of recentResponses) {
      // Calculate similarity
      const similarity = calculateResponseSimilarity(response, prevResponse);
      if (similarity > 0.7) {
        return true;
      }
    }
    return false;
  };

  return {
    generateAlternativeResponse,
    isResponseRepetitive
  };
};
