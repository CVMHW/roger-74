/**
 * Stressor Enhancement
 * 
 * Enhances responses with stressor awareness
 */

import { detectStressors, getPrimaryStressor } from '../../stressors/stressorDetection';
import { generateStressorResponse, getCoOccurringStressorResponse, getRelatedStressorResponse } from '../../stressors/stressorResponses';

/**
 * Enhance response with stressor awareness
 */
export const enhanceWithStressorAwareness = (
  response: string,
  userInput: string
): string => {
  try {
    // Only apply enhancement if response doesn't already have stressor content
    if (hasStressorResponseMarkers(response)) {
      return response;
    }
    
    // Detect stressors in user input
    const detectedStressors = detectStressors(userInput);
    
    // If no stressors or low confidence, return original
    if (detectedStressors.length === 0 || detectedStressors[0].confidence < 0.7) {
      return response;
    }
    
    // Get primary stressor
    const primaryStressor = detectedStressors[0];
    
    // Check for co-occurring stressors
    if (detectedStressors.length > 1 && detectedStressors[1].confidence > 0.65) {
      // Generate response for co-occurring stressors
      const secondaryStressor = detectedStressors[1];
      const stressorResponse = getCoOccurringStressorResponse(
        primaryStressor,
        secondaryStressor
      );
      
      // Combine with original response if appropriate
      if (response.length < 120) {
        return `${response} ${stressorResponse}`;
      } else {
        return stressorResponse;
      }
    }
    
    // Check for related stressors
    const relatedResponse = getRelatedStressorResponse(primaryStressor.stressor.id);
    if (relatedResponse) {
      // If the original response is short, combine them
      if (response.length < 120) {
        return `${response} ${relatedResponse}`;
      }
      
      // Otherwise, replace with stressor-specific response
      const stressorResponse = generateStressorResponse(primaryStressor, userInput);
      return stressorResponse;
    }
    
    // For high confidence and severe stressors, consider replacing response
    if (primaryStressor.confidence > 0.8 && 
        (primaryStressor.intensity === 'severe' || primaryStressor.stressor.severity === 'severe')) {
      const stressorResponse = generateStressorResponse(primaryStressor, userInput);
      return stressorResponse;
    }
    
    // For other cases, keep original response
    return response;
  } catch (error) {
    console.error("Error enhancing with stressor awareness:", error);
    return response;
  }
};

/**
 * Check if response already has stressor content
 */
const hasStressorResponseMarkers = (response: string): boolean => {
  const lowerResponse = response.toLowerCase();
  
  // Check for phrases that indicate stressor awareness
  const stressorPhrases = [
    'must be stressful',
    'sounds stressful',
    'that stress',
    'dealing with',
    'coping with',
    'handling',
    'pressure',
    'anxiety',
    'worried about',
    'concerned about'
  ];
  
  return stressorPhrases.some(phrase => lowerResponse.includes(phrase));
};

/**
 * Check if response is a specific stressor response
 */
export const isStressorResponse = (response: string): boolean => {
  // This can be used by other systems to detect when a response
  // has already been handled by the stressor system
  return response.includes("I hear how") || 
         response.includes("I can hear that") ||
         response.includes("I notice you're dealing with");
};
