
import { useState, useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../utils/conversation/specializedDetection/eatingPatterns/processor';

export type CrisisType = 'suicide' | 'self-harm' | 'eating-disorder' | 'substance-use' | 'general-crisis';

/**
 * Hook for detecting crisis situations in user messages
 */
export const useCrisisDetector = () => {
  /**
   * Detects if a message contains crisis content
   * @param userInput User message to analyze
   * @returns True if crisis content is detected
   */
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    // Convert to lowercase for case-insensitive matching
    const lowercaseInput = userInput.toLowerCase();
    
    // Check for suicide indicators
    if (
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(
        lowercaseInput
      )
    ) {
      return true;
    }
    
    // Check for severe eating disorder indicators
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && edResult.riskLevel === 'high') {
      return true;
    }
    
    // Check for substance abuse indicators
    if (
      /overdose|addicted|withdrawal|relapse|heroin|cocaine|meth|substance abuse|substance use disorder|alcoholic|alcoholism/i.test(
        lowercaseInput
      )
    ) {
      return true;
    }
    
    return false;
  }, []);
  
  /**
   * Detects multiple crisis types in a single message 
   * @param userInput User message to analyze
   * @returns Array of crisis types detected
   */
  const detectMultipleCrisisTypes = useCallback((userInput: string): CrisisType[] => {
    const crisisTypes: CrisisType[] = [];
    const lowercaseInput = userInput.toLowerCase();
    
    // Check for suicide indicators
    if (
      /suicid|kill (myself|me)|end (my|this) life|don'?t want to (live|be alive)|take my (own )?life/i.test(
        lowercaseInput
      )
    ) {
      crisisTypes.push('suicide');
    }
    
    // Check for self-harm indicators separate from suicide
    if (
      /harm (myself|me)|cut (myself|me)|hurt (myself|me)|self.harm|cutting/i.test(
        lowercaseInput
      ) && !crisisTypes.includes('suicide')
    ) {
      crisisTypes.push('self-harm');
    }
    
    // Check for eating disorder indicators
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && edResult.riskLevel !== 'low') {
      crisisTypes.push('eating-disorder');
    }
    
    // Check for substance abuse indicators
    if (
      /overdose|addicted|withdrawal|relapse|heroin|cocaine|meth|substance abuse|substance use disorder|alcoholic|alcoholism|alcohol problem|drug problem|can't stop (drinking|using)/i.test(
        lowercaseInput
      )
    ) {
      crisisTypes.push('substance-use');
    }
    
    // If no specific type but there are general crisis indicators
    if (
      crisisTypes.length === 0 &&
      /crisis|emergency|urgent|help me|desperate|need help now/i.test(lowercaseInput)
    ) {
      crisisTypes.push('general-crisis');
    }
    
    return crisisTypes;
  }, []);
  
  return {
    checkForCrisisContent,
    detectMultipleCrisisTypes
  };
};
