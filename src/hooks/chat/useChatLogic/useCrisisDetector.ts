
import { useCallback } from 'react';

/**
 * Hook for detecting crisis content in user messages
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    const lowerInput = userInput.toLowerCase().trim();
    const crisisPatterns = [
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
      /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
      /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
      /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/
    ];
    
    return crisisPatterns.some(pattern => pattern.test(lowerInput));
  }, []);
  
  return { checkForCrisisContent };
};
