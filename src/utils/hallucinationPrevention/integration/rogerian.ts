
/**
 * Integration with Rogerian therapy approach
 */
import { retrieveSimilarResponses } from '../retrieval';

/**
 * Enhance a Rogerian response with RAG capabilities
 * 
 * @param responseText Original response
 * @param userInput User input
 * @param conversationHistory Full conversation history
 * @returns Enhanced response
 */
export const enhanceRogerianResponse = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): Promise<string> => {
  try {
    // Get similar previous responses
    const similarResponses = await retrieveSimilarResponses(userInput, 3);
    
    // If we found relevant responses, use them to enhance
    if (similarResponses && similarResponses.length > 0) {
      // Extract patterns from similar responses
      const patterns = extractPatterns(similarResponses);
      
      // Blend the patterns with the current response
      return blendRogerianPatterns(responseText, patterns);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error enhancing Rogerian response:", error);
    return responseText;
  }
};

/**
 * Extract common patterns from similar responses
 */
function extractPatterns(responses: string[]): string[] {
  // Simple implementation - just return unique sentences
  const sentences: string[] = [];
  
  responses.forEach(response => {
    const responseSentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    responseSentences.forEach(sentence => {
      if (!sentences.includes(sentence.trim())) {
        sentences.push(sentence.trim());
      }
    });
  });
  
  return sentences;
}

/**
 * Blend patterns with the current response
 */
function blendRogerianPatterns(responseText: string, patterns: string[]): string {
  // Simple implementation - just ensure we don't repeat ourselves
  if (patterns.length === 0) return responseText;
  
  // Check if response already contains any of the patterns
  for (const pattern of patterns) {
    if (responseText.includes(pattern)) {
      return responseText;
    }
  }
  
  // Add a relevant pattern if it doesn't exist yet
  const selectedPattern = patterns[0];
  return `${responseText} ${selectedPattern}`;
}
