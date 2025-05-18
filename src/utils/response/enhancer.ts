
/**
 * Response Enhancer
 * 
 * Enhances generated responses with memory, context, and content improvements
 */

import { addMemory, searchMemory } from '../memory/memoryController';
import { preventHallucinations } from '../memory/hallucination/preventionV2';

/**
 * Process a user message by saving it to memory
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Save user message to memory system with role 'patient'
    addMemory({
      role: 'patient',
      content: userInput,
      timestamp: Date.now(),
      importance: 0.8
    });
  } catch (error) {
    console.error("Error processing user message memory:", error);
  }
};

/**
 * Check if a response is too repetitive compared to recent responses
 */
export const checkForResponseRepetition = (
  response: string, 
  recentResponses: string[]
): boolean => {
  if (!recentResponses || recentResponses.length === 0) return false;
  
  const normalizedResponse = response.toLowerCase().trim();
  
  // Check for exact duplication
  if (recentResponses.some(r => r.toLowerCase().trim() === normalizedResponse)) {
    return true;
  }
  
  // Check for high similarity with most recent response
  const mostRecentResponse = recentResponses[0]?.toLowerCase().trim() || '';
  if (mostRecentResponse && calculateSimilarity(normalizedResponse, mostRecentResponse) > 0.8) {
    return true;
  }
  
  return false;
};

/**
 * Get a recovery response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const responses = [
    "I notice I may be repeating myself. Let's try a different approach. What specific aspect of this would you like to explore further?",
    "I want to make sure I'm being helpful. Let me try to look at this from another angle. What else would be useful to discuss?",
    "Let's shift our perspective on this. What would you find most valuable to focus on right now?",
    "I'd like to make sure we're making progress. What would be most helpful to address next?",
    "Let me approach this differently. What specific concerns or questions do you have that I haven't adequately addressed yet?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Enhance a response with memory, context, and hallucination prevention
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  conversationLength: number,
  conversationHistory: string[]
): Promise<string> => {
  try {
    // Apply hallucination prevention
    const hallucinationResult = preventHallucinations(
      responseText, 
      userInput, 
      conversationHistory
    );
    
    const enhancedResponse = hallucinationResult.wasModified ? 
      hallucinationResult.text : 
      responseText;
      
    // Save Roger's response to memory
    addMemory({
      role: 'roger',
      content: enhancedResponse,
      timestamp: Date.now(),
      importance: 0.7
    });
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error enhancing response:", error);
    return responseText;
  }
};

/**
 * Calculate basic text similarity (helper function)
 */
const calculateSimilarity = (text1: string, text2: string): number => {
  // Very basic similarity calculation
  const words1 = new Set(text1.split(/\s+/));
  const words2 = new Set(text2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};
