
/**
 * Integration with crisis detection and response
 */
import { retrieveSimilarResponses, retrieveFactualGrounding } from '../retrieval';

/**
 * Enhance a crisis response with RAG capabilities
 * 
 * @param responseText Original response
 * @param crisisType Type of crisis detected
 * @param severity Severity level (1-10)
 * @returns Enhanced response
 */
export const enhanceCrisisResponse = async (
  responseText: string,
  crisisType: string,
  severity: number
): Promise<string> => {
  try {
    // For high severity crises, focus on immediate safety resources
    if (severity > 7) {
      const resources = await retrieveFactualGrounding(`${crisisType} crisis resources`, 1);
      if (resources && resources.length > 0) {
        return `${responseText}\n\nImportant resources that might help: ${resources[0]}`;
      }
    }
    
    // For lower severity, gather similar successful responses
    const similarResponses = await retrieveSimilarResponses(`${crisisType} support`, 2);
    
    // If we found relevant responses, blend them
    if (similarResponses && similarResponses.length > 0) {
      return blendCrisisResponses(responseText, similarResponses);
    }
    
    return responseText;
  } catch (error) {
    console.error("Error enhancing crisis response:", error);
    return responseText;
  }
};

/**
 * Blend successful crisis responses
 */
function blendCrisisResponses(responseText: string, similarResponses: string[]): string {
  // Simple implementation - just ensure we have the most important elements
  
  // Check if the response already contains important validation language
  const hasValidation = /understand|hear you|must be|difficult|challenging|you're feeling/i.test(responseText);
  
  if (!hasValidation && similarResponses.length > 0) {
    // Find a validation phrase we could add
    for (const response of similarResponses) {
      const validationMatch = response.match(/(I understand [^.]+\.|I hear you[^.]+\.|That must be [^.]+\.)/);
      if (validationMatch) {
        return `${validationMatch[0]} ${responseText}`;
      }
    }
  }
  
  return responseText;
}
