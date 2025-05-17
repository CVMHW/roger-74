
import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../utils/conversation/specializedDetection/eatingPatterns/processor';

// Define crisis types
export type CrisisType = 'suicide' | 'self-harm' | 'eating-disorder' | 'substance-use' | 'general-crisis';

/**
 * Detects multiple crisis types in a single message
 * @returns Array of crisis types detected
 */
export const detectMultipleCrisisTypes = (userInput: string): CrisisType[] => {
  if (!userInput || typeof userInput !== 'string') {
    return [];
  }
  
  const crisisTypes: CrisisType[] = [];
  const lowerInput = userInput.toLowerCase();
  
  // Check for suicide mentions (highest priority)
  if (/suicid|kill (myself|me)|end (my|this) life|want to die|don't want to (live|be alive)|take my (own )?life/i.test(lowerInput)) {
    crisisTypes.push('suicide');
  }
  
  // Check for self-harm
  if (/harm (myself|me)|cut (myself|me)|hurt (myself|me)|self.harm/i.test(lowerInput)) {
    crisisTypes.push('self-harm');
  }
  
  // Check for eating disorders
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.riskLevel === 'medium')) {
    crisisTypes.push('eating-disorder');
  }
  
  // Check for substance use crisis
  if (/drinking|alcohol|drunk|intoxicated|can't stop drinking|addicted|substance|drug/i.test(lowerInput)) {
    // Check for quantity indicators that suggest crisis
    const quantityMatch = lowerInput.match(/(\d+)\s+(beers|drinks|shots|bottles)/);
    if (quantityMatch) {
      const quantity = parseInt(quantityMatch[1], 10);
      if (quantity > 10) {
        crisisTypes.push('substance-use');
      }
    }
    
    // Check for severe language
    if (/withdrawal|DTs|shakes|alcohol poisoning|can't stop|addicted/i.test(lowerInput)) {
      crisisTypes.push('substance-use');
    }
  }
  
  // Check general crisis indicators
  if (/crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/i.test(lowerInput)) {
    crisisTypes.push('general-crisis');
  }
  
  return crisisTypes;
};

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
      // Check for multiple crisis types
      const crisisTypes = detectMultipleCrisisTypes(userInput);
      if (crisisTypes.length > 0) {
        console.log("CRISIS DETECTOR: Detected crisis types:", crisisTypes);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("CRISIS DETECTOR: Error in crisis detection", error);
      // Safety fallback - if there's any error, better to assume it might be a crisis
      return /suicid|kill|harm|hurt|die|dead/i.test(userInput.toLowerCase());
    }
  }, []);
  
  return { checkForCrisisContent };
};

// Export the function directly for use in non-hook contexts
export const checkForCrisisContent = (userInput: string): boolean => {
  if (!userInput || typeof userInput !== 'string') {
    console.error("CRISIS DETECTOR: Invalid input received", userInput);
    return false;
  }
  
  try {
    // Check for multiple crisis types
    const crisisTypes = detectMultipleCrisisTypes(userInput);
    if (crisisTypes.length > 0) {
      console.log("CRISIS DETECTOR: Detected crisis types:", crisisTypes);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("CRISIS DETECTOR: Error in crisis detection", error);
    // Safety fallback - if there's any error, better to assume it might be a crisis
    return /suicid|kill|harm|hurt|die|dead/i.test(userInput.toLowerCase());
  }
};
