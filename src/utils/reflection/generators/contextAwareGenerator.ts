
import { contextAwareReflections } from '../data/contextAwareReflections';
import { identifyEnhancedFeelings } from '../feelingDetection';
import { handleMinimalResponses } from './minimalResponseHandler';

/**
 * Generate a context-aware reflection based on user input
 */
export const generateContextAwareReflection = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // First, identify enhanced feelings
  const enhancedFeelings = identifyEnhancedFeelings(input);
  
  // If no specific feelings are detected, check for minimal responses (tiredness, etc.)
  if (enhancedFeelings.length === 0) {
    return handleMinimalResponses(input);
  }
  
  // For each detected feeling, find a matching reflection
  for (const feelingData of enhancedFeelings) {
    const { detectedWord, category } = feelingData;
    
    // Find reflections that match the detected feeling
    const matchingReflections = contextAwareReflections.filter(reflection =>
      reflection.trigger.some(triggerWord => lowerInput.includes(triggerWord))
    );
    
    // If no matching reflections are found, continue to the next feeling
    if (matchingReflections.length === 0) {
      continue;
    }
    
    // Select a random reflection from the matching reflections
    const selectedReflection = matchingReflections[Math.floor(Math.random() * matchingReflections.length)];
    
    // Select a random response from the selected reflection
    const selectedResponse = selectedReflection.response[Math.floor(Math.random() * selectedReflection.response.length)];
    
    return selectedResponse;
  }
  
  // If no matching reflections are found for any feelings, return null
  return null;
};
