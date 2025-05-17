
/**
 * Hook for detecting crisis situations in user messages
 */

import { useCallback } from 'react';
import { CrisisType } from './types';
import { checkForCrisisContent, detectMultipleCrisisTypes } from './detectors';

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
    
    // Delegate to the detector function
    return checkForCrisisContent(userInput);
  }, []);
  
  /**
   * Detects multiple crisis types in a single message 
   * @param userInput User message to analyze
   * @returns Array of crisis types detected
   */
  const detectCrisisTypes = useCallback((userInput: string): CrisisType[] => {
    return detectMultipleCrisisTypes(userInput);
  }, []);
  
  return {
    checkForCrisisContent,
    detectMultipleCrisisTypes: detectCrisisTypes
  };
};
