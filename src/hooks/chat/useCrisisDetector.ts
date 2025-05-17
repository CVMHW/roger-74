
import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../../utils/conversation/specializedDetection/eatingPatterns/processor';

/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to multiple specialized detection systems and executive control
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    console.log("CRISIS DETECTOR: Checking user input for crisis content");
    
    // Skip processing if userInput is not a string or is empty
    if (!userInput || typeof userInput !== 'string') {
      console.error("CRISIS DETECTOR: Invalid input received", userInput);
      return false;
    }
    
    try {
      const lowerInput = userInput.toLowerCase().trim();
      
      // Check for multiple crisis indicators
      const crisisTypes = detectMultipleCrisisTypes(userInput);
      console.log("CRISIS DETECTOR: Detected crisis types:", crisisTypes);
      
      // If any crisis type is detected, this is a crisis
      return crisisTypes.length > 0;
    } catch (error) {
      console.error("CRISIS DETECTOR: Error in crisis detection", error);
      // Safety fallback - if there's any error, better to assume it might be a crisis
      return /suicid|kill|harm|hurt|die|dead|eating|drink/i.test(userInput.toLowerCase());
    }
  }, []);
  
  return { checkForCrisisContent };
};

/**
 * Detects all crisis types mentioned in a single message
 * This helps handle cases where multiple crisis topics are mentioned
 */
export const detectMultipleCrisisTypes = (userInput: string): string[] => {
  if (!userInput || typeof userInput !== 'string') {
    return [];
  }
  
  const lowerInput = userInput.toLowerCase().trim();
  const crisisTypes = [];
  
  // Check for suicide content - highest priority
  if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|don'?t want to (live|be alive)|take my (own )?life|want to die|shoot myself/i.test(lowerInput)) {
    crisisTypes.push('suicide');
  }
  
  // Check for self-harm (without explicit suicide mention)
  if (/harm (myself|me)|cut (myself|me)|hurt (myself|me)/i.test(lowerInput)) {
    crisisTypes.push('self-harm');
  }
  
  // Check for eating disorder indicators
  if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i.test(lowerInput)) {
    crisisTypes.push('eating-disorder');
  }
  
  // Check for substance abuse indicators
  if (/drinking|drunk|alcohol|can't stop drinking|addicted|substance|[0-9]+ beers/i.test(lowerInput)) {
    crisisTypes.push('substance-use');  // Changed from 'substance-abuse' to match ConcernType
  }
  
  return crisisTypes;
};

// Export the function directly for use in non-hook contexts
export const checkForCrisisContent = (userInput: string): boolean => {
  if (!userInput || typeof userInput !== 'string') {
    console.error("CRISIS DETECTOR: Invalid input received", userInput);
    return false;
  }
  
  try {
    // Just delegate to the shared implementation
    const crisisTypes = detectMultipleCrisisTypes(userInput);
    return crisisTypes.length > 0;
  } catch (error) {
    console.error("CRISIS DETECTOR: Error in crisis detection", error);
    // Safety fallback - if there's any error, better to assume it might be a crisis
    return /suicid|kill|harm|hurt|die|dead|eating|drink/i.test(userInput.toLowerCase());
  }
};
