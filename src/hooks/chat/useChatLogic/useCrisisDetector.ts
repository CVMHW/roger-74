
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
    // First check directly for eating disorder content and other critical patterns
    // that need immediate attention - HIGHEST PRIORITY
    const lowerInput = userInput.toLowerCase().trim();
    
    // Direct check for eating disorder issues
    if (/can't stop eating|binge eating|eating too much|eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i.test(lowerInput)) {
      console.log("CRITICAL CRISIS DETECTED: Eating disorder pattern in message");
      return true;
    }
    
    // Next check with our eating disorder detection system for high-risk cases
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
      console.log("CRITICAL CRISIS DETECTED: High risk eating disorder detected");
      return true;
    }
    
    // Check with our advanced crisis detection system
    if (isCrisisSituation(userInput)) {
      console.log("CRITICAL CRISIS DETECTED: General crisis situation detected");
      return true;
    }
    
    // Fallback pattern detection for crisis signals we might have missed
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
  // First check directly for eating disorder content and other critical patterns  
  const lowerInput = userInput.toLowerCase().trim();
  
  // Direct check for eating disorder issues - HIGHEST PRIORITY
  if (/can't stop eating|binge eating|eating too much|eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i.test(lowerInput)) {
    console.log("CRITICAL CRISIS DETECTED: Eating disorder pattern in message");
    return true;
  }
  
  // Next check with our eating disorder detection system for high-risk cases
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
    console.log("CRITICAL CRISIS DETECTED: High risk eating disorder detected");
    return true;
  }
  
  // Check with our advanced crisis detection system 
  if (isCrisisSituation(userInput)) {
    console.log("CRITICAL CRISIS DETECTED: General crisis situation detected");
    return true;
  }
  
  // Fallback pattern detection for crisis signals we might have missed
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
