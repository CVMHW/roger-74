
/**
 * Crisis Integration for Hallucination Prevention
 */

import { retrieveSimilarResponses } from '../retrieval';
import { generateEmbedding } from '../vectorEmbeddings';

/**
 * Get crisis-specific context for response enhancement
 */
export const getCrisisContext = async (
  userInput: string,
  crisisType: string
): Promise<string[]> => {
  try {
    // Get similar crisis responses from memory
    const similarResponses = await retrieveSimilarResponses(userInput, 3);
    
    // Extract just the content strings from the similarity results
    const responseTexts = similarResponses.map(response => response.content);
    
    // Add crisis-specific guidance
    const crisisGuidance = getCrisisGuidanceText(crisisType);
    if (crisisGuidance) {
      responseTexts.unshift(crisisGuidance);
    }
    
    return responseTexts;
  } catch (error) {
    console.error("Error getting crisis context:", error);
    return [];
  }
};

/**
 * Get specific crisis guidance text
 */
const getCrisisGuidanceText = (crisisType: string): string | null => {
  const guidance: Record<string, string> = {
    'suicide': 'If you are having thoughts of suicide, please call 988 (Suicide & Crisis Lifeline) immediately or go to your nearest emergency room.',
    'self-harm': 'If you are thinking about hurting yourself, please reach out for immediate support by calling 988 or going to an emergency room.',
    'crisis': 'This appears to be a crisis situation. Please contact emergency services or a crisis hotline immediately for support.'
  };
  
  return guidance[crisisType] || null;
};
