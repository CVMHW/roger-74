
import { useCallback } from 'react';

/**
 * Hook for validating response quality
 */
export const useResponseValidator = (
  rogerResponseHistory: string[],
  isGenericResponse: (response: string) => boolean
) => {
  // Double check if a response is appropriate based on conversation context
  const validateResponse = useCallback((response: string, userInput: string, userHistory: string[]): boolean => {
    // Check for repetitive responses
    if (rogerResponseHistory.length > 0) {
      const lastRogerResponse = rogerResponseHistory[rogerResponseHistory.length - 1];
      if (lastRogerResponse && lastRogerResponse.toLowerCase().includes(response.toLowerCase())) {
        console.warn("RESPONSE VALIDATION: Detected potential repetition");
        return false;
      }
    }
    
    // Check for inappropriate generic responses to specific topics
    const isAboutPet = /pet|dog|cat|animal|died|passed|molly/i.test(userInput);
    if (isAboutPet && isGenericResponse(response)) {
      console.warn("RESPONSE VALIDATION: Generic response to pet topic");
      return false;
    }
    
    // Check for responses that don't acknowledge user's explicit mentions
    const mentionedPetDeath = /my pet (died|passed)/i.test(userInput);
    if (mentionedPetDeath && !/(sorry|pet|loss|died|passed)/i.test(response)) {
      console.warn("RESPONSE VALIDATION: Failed to acknowledge pet death");
      return false;
    }
    
    return true;
  }, [rogerResponseHistory, isGenericResponse]);
  
  return { validateResponse };
};
