
/**
 * Integration of RAG with Logotherapy
 * 
 * Connects vector database knowledge with Viktor Frankl's logotherapy principles
 */

import { retrieveFactualGrounding, retrieveSimilarResponses } from '../retrieval';
import { hasMeaningOrientation } from '../../logotherapy/meaning-detection';

/**
 * Enhance response with logotherapy knowledge from vector database
 */
export const enhanceLogotherapyResponse = async (
  response: string,
  userInput: string
): Promise<string> => {
  try {
    // Skip if response already has meaning-oriented content
    if (hasMeaningOrientation(response)) return response;
    
    // Common meaning-related topics to search for
    const meaningTopics = ['meaning', 'purpose', 'value', 'values', 'fulfillment', 'significance'];
    
    // Extract meaning-related keywords from user input
    const userKeywords = extractMeaningKeywords(userInput);
    
    // Combine with standard topics
    const searchTopics = [...meaningTopics, ...userKeywords];
    
    // Retrieve meaning-oriented content
    const meaningContent = retrieveFactualGrounding(searchTopics, 2);
    
    if (meaningContent.length === 0) {
      // Fall back to retrieving similar responses that might have meaning content
      const similarResponses = await retrieveSimilarResponses(userInput + " meaning purpose", 1);
      if (similarResponses.length > 0 && hasMeaningOrientation(similarResponses[0])) {
        return integrateLogotherapyContent(response, similarResponses[0]);
      }
      return response;
    }
    
    // Find most relevant content
    const bestContent = meaningContent[0];
    
    // Integrate meaning perspective
    return integrateLogotherapyContent(response, bestContent.content);
    
  } catch (error) {
    console.error("Error enhancing with logotherapy knowledge:", error);
    return response;
  }
};

/**
 * Extract meaning-related keywords from text
 */
function extractMeaningKeywords(text: string): string[] {
  const meaningKeywords = [
    'meaning', 'purpose', 'value', 'values', 'mission', 'legacy',
    'contribution', 'significance', 'fulfillment', 'meaningful',
    'worthwhile', 'important', 'calling', 'reason', 'direction',
    'life', 'existence', 'suffering', 'transcend', 'overcome'
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  return words.filter(word => meaningKeywords.includes(word));
}

/**
 * Integrate logotherapy content into the response
 */
function integrateLogotherapyContent(response: string, meaningContent: string): string {
  // Create meaning-oriented transitions
  const transitions = [
    "Finding meaning in this situation might involve considering that ",
    "From a meaning-centered perspective, ",
    "Viktor Frankl might suggest that ",
    "When we look for meaning in this experience, we might consider that ",
    "Looking at this through a meaning lens, "
  ];
  
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  // Add meaning content at appropriate point
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  if (sentences.length <= 2) {
    // For short responses, simply append
    return `${response} ${transition}${meaningContent}`;
  } else {
    // For longer responses, insert near end
    const insertPoint = Math.floor(sentences.length * 0.75);
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    return `${beginning} ${transition}${meaningContent} ${end}`;
  }
}
