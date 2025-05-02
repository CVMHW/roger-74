
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
    // Look for indicators that might suggest which approach is most helpful
    const containsChangeTalk = userInput.toLowerCase().includes('change') || 
                               userInput.toLowerCase().includes('want to') ||
                               userInput.toLowerCase().includes('thinking about') ||
                               userInput.toLowerCase().includes('goal') ||
                               userInput.toLowerCase().includes('plan') ||
                               userInput.toLowerCase().includes('should') ||
                               userInput.toLowerCase().includes('need to');
                               
    const containsAmbivalence = userInput.toLowerCase().includes('but') ||
                                userInput.toLowerCase().includes('not sure') ||
                                userInput.toLowerCase().includes('conflicted') ||
                                userInput.toLowerCase().includes('part of me') ||
                                userInput.toLowerCase().includes('on the other hand') ||
                                userInput.toLowerCase().includes('might');
                                
    const containsExploration = userInput.toLowerCase().includes('feel') ||
                                userInput.toLowerCase().includes('understand') ||
                                userInput.toLowerCase().includes('why');
    
    const containsQuestionsAboutChange = userInput.toLowerCase().includes('how can i') ||
                                         userInput.toLowerCase().includes('how do i') ||
                                         userInput.toLowerCase().includes('what should i') ||
                                         userInput.toLowerCase().includes('help me') ||
                                         userInput.toLowerCase().includes('not sure how');
    
    const containsDoubtOrLackOfConfidence = userInput.toLowerCase().includes('can\'t') ||
                                            userInput.toLowerCase().includes('hard') ||
                                            userInput.toLowerCase().includes('difficult') ||
                                            userInput.toLowerCase().includes('tried before') ||
                                            userInput.toLowerCase().includes('failed') ||
                                            userInput.toLowerCase().includes('worried');

    // Check for existential concerns (meaning, values, mortality, freedom, isolation, suffering)
    const containsExistentialConcerns = userInput.toLowerCase().includes('meaning') ||
                                        userInput.toLowerCase().includes('purpose') ||
                                        userInput.toLowerCase().includes('what\'s the point') ||
                                        userInput.toLowerCase().includes('values') ||
                                        userInput.toLowerCase().includes('what matters') ||
                                        userInput.toLowerCase().includes('alone') ||
                                        userInput.toLowerCase().includes('isolation') ||
                                        userInput.toLowerCase().includes('death') ||
                                        userInput.toLowerCase().includes('dying') ||
                                        userInput.toLowerCase().includes('legacy') ||
                                        userInput.toLowerCase().includes('choices') ||
                                        userInput.toLowerCase().includes('responsible') ||
                                        userInput.toLowerCase().includes('suffering') ||
                                        userInput.toLowerCase().includes('why is this happening');
    
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
