/**
 * Integration with logotherapy system
 */

// Update imports to use the exported functions from the main index
import { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  retrieveSimilarResponses 
} from '../index';

/**
 * Enhance response with meaning perspective using logotherapy principles
 */
export const enhanceWithMeaningPerspective = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): Promise<string> => {
  try {
    console.log("LOGOTHERAPY: Enhancing response with meaning perspective");
    
    // Retrieve similar responses for context
    const similarResponses = await retrieveSimilarResponses(userInput, 3);
    
    // Check if the user is expressing existential frustration
    const isExistentialFrustration = /meaningless|purposeless|empty|lost|directionless/i.test(userInput);
    
    if (isExistentialFrustration) {
      // Add logotherapy-based insights to the response
      const logotherapyInsights = [
        "Logotherapy emphasizes finding meaning in life, even in difficult circumstances.",
        "Viktor Frankl believed that meaning can be discovered through creative values, experiential values, and attitudinal values.",
        "Consider exploring what truly matters to you and how you can contribute to something larger than yourself."
      ];
      
      // Combine insights with the original response
      const enhancedResponse = `${responseText} ${logotherapyInsights.join(' ')}`;
      return enhancedResponse;
    }
    
    return responseText;
  } catch (error) {
    console.error("Error in logotherapy enhancement:", error);
    return responseText;
  }
};
