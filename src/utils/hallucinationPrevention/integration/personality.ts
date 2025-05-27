
/**
 * Personality Integration for Hallucination Prevention
 */

import { retrieveSimilarResponses } from '../retrieval';

/**
 * Get personality-consistent context for response enhancement
 */
export const getPersonalityContext = async (
  userInput: string,
  personalityTrait: string
): Promise<string[]> => {
  try {
    // Get similar responses that match personality
    const similarResponses = await retrieveSimilarResponses(userInput, 2);
    
    // Extract content and add personality guidance
    const contextTexts: string[] = [];
    
    // Add personality-specific guidance
    const personalityGuidance = getPersonalityGuidanceText(personalityTrait);
    if (personalityGuidance) {
      contextTexts.push(personalityGuidance);
    }
    
    // Add similar response contents
    for (const response of similarResponses) {
      contextTexts.push(response.content);
    }
    
    return contextTexts;
  } catch (error) {
    console.error("Error getting personality context:", error);
    return [];
  }
};

/**
 * Get personality-specific guidance text
 */
const getPersonalityGuidanceText = (trait: string): string | null => {
  const guidance: Record<string, string> = {
    'empathetic': 'Respond with deep understanding and emotional validation.',
    'analytical': 'Provide structured, thoughtful responses that explore patterns.',
    'supportive': 'Offer encouragement and practical suggestions for moving forward.',
    'reflective': 'Help the person explore their thoughts and feelings more deeply.'
  };
  
  return guidance[trait] || null;
};
