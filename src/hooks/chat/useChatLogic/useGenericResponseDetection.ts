
import { useState, useCallback } from 'react';

/**
 * Hook to detect and handle too many generic responses in a row
 */
export const useGenericResponseDetection = () => {
  const [consecutiveGenericResponses, setConsecutiveGenericResponses] = useState(0);
  
  // Function to detect if a response is too generic
  const isGenericResponse = useCallback((response: string): boolean => {
    const genericPatterns = [
      /I'm here to listen and support you/i,
      /What's been going on\??$/i,
      /I'm listening\. What would you like to talk about\??$/i,
      /I'm here for you\. What's on your mind\??$/i,
      /I'm sorry, I'm having trouble responding/i,
    ];
    
    return genericPatterns.some(pattern => pattern.test(response));
  }, []);
  
  return {
    consecutiveGenericResponses,
    setConsecutiveGenericResponses,
    isGenericResponse
  };
};
