
import { useState } from 'react';
import { generateMIResponse } from '../utils/motivationalInterviewing';
import { generateRogerianResponse } from '../utils/rogerianPrinciples';
import { generateConversationalResponse } from '../utils/conversationalUtils';

/**
 * Hook that adaptively selects the most appropriate response approach
 * based on client input and context
 */
export const useAdaptiveResponse = () => {
  const [currentApproach, setCurrentApproach] = useState<'rogerian' | 'mi' | 'conversational'>('rogerian');
  
  /**
   * Analyzes user input to determine if the context suggests a shift in approach
   * would be beneficial, and generates an appropriate response
   */
  const generateAdaptiveResponse = (userInput: string): string => {
    // Look for indicators that might suggest which approach is most helpful
    const containsChangeTalk = userInput.toLowerCase().includes('change') || 
                               userInput.toLowerCase().includes('want to') ||
                               userInput.toLowerCase().includes('thinking about');
                               
    const containsAmbivalence = userInput.toLowerCase().includes('but') ||
                                userInput.toLowerCase().includes('not sure') ||
                                userInput.toLowerCase().includes('conflicted');
                                
    const containsExploration = userInput.toLowerCase().includes('feel') ||
                                userInput.toLowerCase().includes('understand') ||
                                userInput.toLowerCase().includes('why');
    
    // First try a Motivational Interviewing response if change talk is detected
    if (containsChangeTalk || containsAmbivalence) {
      const miResponse = generateMIResponse(userInput);
      if (miResponse) {
        setCurrentApproach('mi');
        return miResponse;
      }
    }
    
    // Next try a Rogerian response for exploration or understanding
    if (containsExploration) {
      const rogerianResponse = generateRogerianResponse(userInput);
      if (rogerianResponse) {
        setCurrentApproach('rogerian');
        return rogerianResponse;
      }
    }
    
    // Default to conversational response if no specific approach is indicated
    setCurrentApproach('conversational');
    return generateConversationalResponse(userInput);
  };
  
  return {
    generateAdaptiveResponse,
    currentApproach
  };
};

export default useAdaptiveResponse;
