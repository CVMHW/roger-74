
/**
 * Rogerian Integration for Hallucination Prevention
 */

import { retrieveSimilarResponses } from '../retrieval';

/**
 * Get Rogerian-style context for response enhancement
 */
export const getRogerianContext = async (
  userInput: string,
  conversationHistory: string[]
): Promise<string[]> => {
  try {
    // Get similar Rogerian responses
    const similarResponses = await retrieveSimilarResponses(userInput, 3);
    
    // Extract content strings from similarity results
    const contextTexts = similarResponses.map(response => response.content);
    
    // Add Rogerian principles
    const rogerianPrinciples = getRogerianPrinciples();
    contextTexts.unshift(...rogerianPrinciples);
    
    return contextTexts;
  } catch (error) {
    console.error("Error getting Rogerian context:", error);
    return [];
  }
};

/**
 * Get core Rogerian therapy principles
 */
const getRogerianPrinciples = (): string[] => {
  return [
    'Demonstrate unconditional positive regard for the client.',
    'Reflect the client\'s feelings and thoughts back to them.',
    'Show genuine empathy and understanding.',
    'Avoid giving direct advice; instead, help the client discover their own solutions.',
    'Create a safe, non-judgmental space for exploration.'
  ];
};
