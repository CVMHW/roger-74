
import { useCallback } from 'react';
import { detectCrisis, isCrisisSituation } from '../../../utils/masterRules/safety/crisisDetection';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';

/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to multiple specialized detection systems
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    // First check with our advanced crisis detection system
    if (isCrisisSituation(userInput)) {
      return true;
    }
    
    // Check with our eating disorder detection system for high-risk cases
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
      return true;
    }
    
    // Fallback pattern detection for crisis signals we might have missed
    const lowerInput = userInput.toLowerCase().trim();
    const crisisPatterns = [
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
      /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
      /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
      /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/,
      /voices telling me|hearing voices|seeing things|government watching|paranoid|psychotic/,
      /homicid|kill (them|him|her|someone)|shoot|stab|attack|murder/
    ];
    
    return crisisPatterns.some(pattern => pattern.test(lowerInput));
  }, []);
  
  return { checkForCrisisContent };
};

// Export the function directly for use in non-hook contexts
export const checkForCrisisContent = (userInput: string): boolean => {
  // First check with our advanced crisis detection system  
  if (isCrisisSituation(userInput)) {
    return true;
  }
  
  // Check with our eating disorder detection system for high-risk cases
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
    return true;
  }
  
  // Fallback pattern detection for crisis signals we might have missed
  const lowerInput = userInput.toLowerCase().trim();
  const crisisPatterns = [
    /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
    /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
    /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
    /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/,
    /voices telling me|hearing voices|seeing things|government watching|paranoid|psychotic/,
    /homicid|kill (them|him|her|someone)|shoot|stab|attack|murder/
  ];
  
  return crisisPatterns.some(pattern => pattern.test(lowerInput));
};
