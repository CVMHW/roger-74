
import { detectEnhancedFeelings, getPersistentFeelings, getDominantTopics } from '../../../utils/reflection/feelingDetection';

/**
 * Detects patterns in user input to create better responses
 */
export const detectPatterns = async (userInput: string): Promise<{
  persistentFeelings: string[];
  dominantTopics: string[];
  enhancedResponse: string | null;
}> => {
  try {
    // Analyze message with pattern matching
    const feelingResult = await detectEnhancedFeelings(userInput);
    
    // Access memory for context
    const persistentFeelings = getPersistentFeelings();
    const dominantTopics = getDominantTopics();
    
    // If we detect consistent emotions or topics, create more targeted responses
    if ((persistentFeelings.length > 0 || dominantTopics.length > 0)) {
      // Create enhanced context-aware response
      let enhancedResponse = "";
      
      // Acknowledge persistent emotions if present
      if (persistentFeelings.length > 0) {
        enhancedResponse = `I remember you've mentioned feeling ${persistentFeelings.join(", ")} several times. `;
        
        // Add relevant follow-up based on emotion
        if (persistentFeelings.includes('angry')) {
          enhancedResponse += "It sounds like this is really frustrating for you. ";
        } else if (persistentFeelings.includes('sad')) {
          enhancedResponse += "This seems to be weighing heavily on you. ";
        } else if (persistentFeelings.includes('anxious')) {
          enhancedResponse += "This appears to be causing you some worry. ";
        }
      }
      
      // Acknowledge dominant topics
      if (dominantTopics.length > 0) {
        if (enhancedResponse) {
          enhancedResponse += "I also notice we've been talking about ";
        } else {
          enhancedResponse = "I remember we've been focusing on ";
        }
        enhancedResponse += `${dominantTopics.join(", ")}. `;
      }
      
      // Add appropriate follow-up question
      if (enhancedResponse) {
        enhancedResponse += "What aspect of this feels most important for us to discuss right now?";
        
        // If this is detailed enough, return it
        if (enhancedResponse.length > 80) {
          return {
            persistentFeelings,
            dominantTopics,
            enhancedResponse
          };
        }
      }
    }
    
    return {
      persistentFeelings,
      dominantTopics,
      enhancedResponse: null
    };
  } catch (error) {
    console.error("Error in pattern detection:", error);
    return {
      persistentFeelings: [],
      dominantTopics: [],
      enhancedResponse: null
    };
  }
};
