
/**
 * Integration of RAG with Crisis Response
 * 
 * Connects vector database knowledge with crisis resources and responses
 */

import { retrieveFactualGrounding } from '../retrieval';
import { isSuicidalIdeation, isEmergency } from '../../masterRules/safety/safetyUtils';

/**
 * Enhance crisis response with accurate resources from vector database
 */
export const enhanceCrisisResponse = (
  response: string,
  userInput: string
): string => {
  try {
    // Check if this is a crisis situation
    const isEmergencySituation = isEmergency(userInput);
    const isSuicidal = isSuicidalIdeation(userInput);
    
    if (!isEmergencySituation && !isSuicidal) {
      return response; // Not a crisis situation, return original
    }
    
    // Define search topics based on crisis type
    let searchTopics: string[] = ['crisis', 'emergency', 'help'];
    
    if (isSuicidal) {
      searchTopics = [...searchTopics, 'suicide', 'suicidal', 'prevention', 'hotline'];
    }
    
    // Add keywords from user input
    const keywords = extractCrisisKeywords(userInput);
    searchTopics = [...searchTopics, ...keywords];
    
    // Retrieve crisis resources
    const resources = retrieveFactualGrounding(searchTopics, 5);
    
    if (resources.length === 0) {
      return response; // No resources found, return original
    }
    
    // Ensure we always include the National Suicide Prevention Lifeline for suicidal content
    if (isSuicidal) {
      return ensureSuicideHotline(response);
    }
    
    // For other crises, add factual resources
    let enhancedResponse = response;
    
    // Add the most relevant resource
    const resource = resources[0].content;
    if (!enhancedResponse.includes(resource)) {
      enhancedResponse = `${enhancedResponse}\n\nImportant resource: ${resource}`;
    }
    
    return enhancedResponse;
    
  } catch (error) {
    console.error("Error enhancing crisis response:", error);
    return response;
  }
};

/**
 * Ensure the suicide hotline is included in the response
 */
function ensureSuicideHotline(response: string): string {
  const hotlineInfo = "National Suicide Prevention Lifeline: 988 or 1-800-273-8255. Available 24/7.";
  
  if (response.includes("988") || response.includes("1-800-273-8255")) {
    return response; // Already includes hotline
  }
  
  return `${response}\n\n${hotlineInfo}`;
}

/**
 * Extract crisis-related keywords from text
 */
function extractCrisisKeywords(text: string): string[] {
  const crisisKeywords = [
    'emergency', 'crisis', 'suicide', 'kill', 'die', 'death', 'harm',
    'hurt', 'pain', 'overdose', 'dangerous', 'weapon', 'gun', 'knife',
    'threat', 'threatened', 'violence', 'violent', 'abuse', 'danger'
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  return words.filter(word => crisisKeywords.includes(word));
}
