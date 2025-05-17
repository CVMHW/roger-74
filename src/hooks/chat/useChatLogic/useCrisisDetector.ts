
/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to multiple specialized detection systems and executive control
 */

import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../../utils/conversation/specializedDetection/eatingPatterns/processor';
import { checkForCrisisContent } from '../crisisDetection';

/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to multiple specialized detection systems and executive control
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    console.log("CRISIS DETECTOR: Checking user input for crisis content");
    
    // Delegate to our specialized crisis detection module
    return checkForCrisisContent(userInput);
  }, []);
  
  return { checkForCrisisContent };
};

// Export the function directly for use in non-hook contexts
export { checkForCrisisContent };
