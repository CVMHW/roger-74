
import { useState } from 'react';
import { generateMIResponse } from '../utils/motivationalInterviewing';
import { generateRogerianResponse } from '../utils/rogerianPrinciples';
import { generateConversationalResponse } from '../utils/conversationalUtils';
import { generateExistentialResponse } from '../utils/existentialPrinciples';

/**
 * Hook that adaptively selects the most appropriate response approach
 * based on client input and context
 */
export const useAdaptiveResponse = () => {
  const [currentApproach, setCurrentApproach] = useState<'rogerian' | 'mi' | 'existential' | 'conversational'>('rogerian');
  
  /**
   * Analyzes user input to determine if the context suggests a shift in approach
   * would be beneficial, and generates an appropriate response
   */
  const generateAdaptiveResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for existential concerns (meaning, values, mortality, freedom, isolation, suffering)
    const containsExistentialConcerns = lowerInput.includes('meaning') ||
                                       lowerInput.includes('purpose') ||
                                       lowerInput.includes('what\'s the point') ||
                                       lowerInput.includes('values') ||
                                       lowerInput.includes('what matters') ||
                                       lowerInput.includes('alone') ||
                                       lowerInput.includes('isolation') ||
                                       lowerInput.includes('death') ||
                                       lowerInput.includes('dying') ||
                                       lowerInput.includes('legacy') ||
                                       lowerInput.includes('choices') ||
                                       lowerInput.includes('responsible') ||
                                       lowerInput.includes('suffering') ||
                                       lowerInput.includes('why is this happening') ||
                                       lowerInput.includes('empty') ||
                                       lowerInput.includes('hollow') ||
                                       lowerInput.includes('going through motions');
    
    // Look for indicators that might suggest which approach is most helpful
    const containsChangeTalk = lowerInput.includes('change') || 
                               lowerInput.includes('want to') ||
                               lowerInput.includes('thinking about') ||
                               lowerInput.includes('goal') ||
                               lowerInput.includes('plan') ||
                               lowerInput.includes('should') ||
                               lowerInput.includes('need to');
                               
    const containsAmbivalence = lowerInput.includes('but') ||
                                lowerInput.includes('not sure') ||
                                lowerInput.includes('conflicted') ||
                                lowerInput.includes('part of me') ||
                                lowerInput.includes('on the other hand') ||
                                lowerInput.includes('might');
                                
    const containsExploration = lowerInput.includes('feel') ||
                                lowerInput.includes('understand') ||
                                lowerInput.includes('why');
    
    const containsQuestionsAboutChange = lowerInput.includes('how can i') ||
                                         lowerInput.includes('how do i') ||
                                         lowerInput.includes('what should i') ||
                                         lowerInput.includes('help me') ||
                                         lowerInput.includes('not sure how');
    
    const containsDoubtOrLackOfConfidence = lowerInput.includes('can\'t') ||
                                            lowerInput.includes('hard') ||
                                            lowerInput.includes('difficult') ||
                                            lowerInput.includes('tried before') ||
                                            lowerInput.includes('failed') ||
                                            lowerInput.includes('worried');
    
    // First try an Existential response if existential concerns are detected
    if (containsExistentialConcerns) {
      const existentialResponse = generateExistentialResponse(userInput);
      if (existentialResponse) {
        setCurrentApproach('existential');
        return existentialResponse;
      }
    }
    
    // Next try a Motivational Interviewing response if change talk, ambivalence or questions about change are detected
    if (containsChangeTalk || containsAmbivalence || containsQuestionsAboutChange || containsDoubtOrLackOfConfidence) {
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
