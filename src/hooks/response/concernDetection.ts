
import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { ConcernType } from '../../utils/reflection/reflectionTypes';

/**
 * Hook for detecting various concerns in user messages
 */
export const useConcernDetection = () => {
  /**
   * Detects concerns in a user's message
   * @param userInput The user's message
   * @returns The type of concern detected, or null if none detected
   */
  const detectConcerns = useCallback((userInput: string): ConcernType | null => {
    // Convert input to lowercase for case-insensitive matching
    const lowercaseInput = userInput.toLowerCase();

    // Check for crisis indicators
    if (
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(
        lowercaseInput
      )
    ) {
      return 'crisis';
    }

    // Check for self-harm
    if (/self.harm|hurt(ing)? (myself|me)|cut(ting)? (myself|me)/i.test(lowercaseInput)) {
      return 'tentative-harm';
    }

    // Check for eating disorder concerns
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && edResult.riskLevel !== 'low') {
      return 'eating-disorder';
    }

    // Check for medical concerns
    if (/doctor|nurse|hospital|medical|pain|sick|illness|disease|symptom/i.test(lowercaseInput)) {
      return 'medical';
    }

    // Check for mental health concerns
    if (
      /anxiety|depression|stress|panic|therapy|counseling|mental health|mental illness/i.test(
        lowercaseInput
      )
    ) {
      return 'mental-health';
    }

    // Check for substance use concerns
    if (/alcohol|drug|addiction|substance|drinking|smoking/i.test(lowercaseInput)) {
      return 'substance-use';
    }

    // Check for PTSD
    if (/flashbacks|nightmares|trauma|ptsd|hypervigilance/i.test(lowercaseInput)) {
      return 'ptsd';
    }

    // Default - no specific concern detected
    return null;
  }, []);

  return { detectConcerns };
};
