
/**
 * Stressor Awareness Enhancement
 * 
 * Improves responses based on detected stressors
 */

import { detectStressors } from '../../stressors/stressorDetection';
import { getStressorResponse } from '../../stressors/stressorResponses';
import { DetectedStressor } from '../../stressors/stressorTypes';

/**
 * Enhances responses by incorporating awareness of detected stressors
 * 
 * @param responseText Original response text
 * @param userInput User input that prompted the response
 * @param conversationHistory Previous conversation for context
 * @returns Enhanced response with stressor awareness
 */
export const enhanceWithStressorAwareness = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  // Don't modify responses that are already quite long
  if (responseText.length > 350) {
    return responseText;
  }
  
  // Detect potential stressors in the user input
  const detectedStressors = detectStressors(userInput, conversationHistory);
  
  // If no significant stressors detected, return original response
  if (!detectedStressors || detectedStressors.length === 0) {
    return responseText;
  }
  
  // Get the highest priority stressor
  const primaryStressor = detectedStressors.sort((a, b) => 
    (b.confidenceScore || 0) - (a.confidenceScore || 0)
  )[0];
  
  // Skip enhancement if confidence is low
  if (primaryStressor.confidenceScore && primaryStressor.confidenceScore < 0.6) {
    return responseText;
  }
  
  // Check if the original response already addresses the stressor
  if (primaryStressor.keyword && responseText.toLowerCase().includes(primaryStressor.keyword.toLowerCase())) {
    return responseText;
  }
  
  // Get a suitable response enhancement for this stressor
  const stressorResponse = getStressorResponse(primaryStressor.category || 'general', userInput);
  
  // If we have a relevant stressor response, integrate it
  if (stressorResponse) {
    // Check if the response is short enough to be enhanced
    if (responseText.length < 200) {
      return `${responseText} ${stressorResponse}`;
    } else {
      // For longer responses, find a good breaking point
      const lastSentenceBreak = responseText.lastIndexOf('.');
      if (lastSentenceBreak > responseText.length * 0.7) {
        // Insert before the last sentence
        return responseText.substring(0, lastSentenceBreak + 1) + 
               ` ${stressorResponse} ` + 
               responseText.substring(lastSentenceBreak + 1);
      } else {
        // Append to the end if no good breaking point
        return `${responseText} ${stressorResponse}`;
      }
    }
  }
  
  return responseText;
};

export default enhanceWithStressorAwareness;
