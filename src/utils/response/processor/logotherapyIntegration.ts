/**
 * Logotherapy Integration for Response Processor
 * 
 * Ensures that logotherapy principles are incorporated into all responses
 * UNIVERSAL LAW: All responses must incorporate meaning-centered perspective
 */

import { 
  integrateLogotherapyResponse,
  enhanceWithMeaningPerspective 
} from '../../logotherapy/logotherapyIntegration';
import { 
  getFiveResponseMemory 
} from '../../memory/fiveResponseMemory';
import { 
  LOGOTHERAPY_MEANING_PATHWAYS,
  EXISTENTIAL_CONCEPTS 
} from '../../masterRules/logotherapyLaws';
import { UNIVERSAL_LAW_MEANING_PURPOSE } from '../../masterRules/universalLaws';

/**
 * Handle integration of logotherapy principles into responses
 */
export const handleLogotherapyIntegration = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  console.log("LOGOTHERAPY INTEGRATION: Enforcing", UNIVERSAL_LAW_MEANING_PURPOSE.name);
  
  try {
    // Check if the response already has meaning-oriented content
    if (hasMeaningOrientation(response)) {
      return response;
    }
    
    // Determine the appropriate logotherapy pathway based on user input
    const pathway = determineLogotherapyPathway(userInput, conversationHistory);
    
    // Check for existential themes or meaning-related questions
    const hasExistentialThemes = detectExistentialThemes(userInput);
    const hasMeaningQuestions = detectMeaningQuestions(userInput);
    
    // If user is explicitly asking about meaning/purpose, use stronger integration
    if (hasExistentialThemes || hasMeaningQuestions) {
      console.log("EXPLICIT MEANING CONTENT: Using full logotherapy integration");
      return integrateLogotherapyResponse(userInput, response);
    }
    
    // Otherwise, use subtle meaning enhancement
    return enhanceWithMeaningPerspective(response, userInput);
    
  } catch (error) {
    console.error('Error in logotherapy integration:', error);
    return response;
  }
};

/**
 * Check if response already contains meaning-oriented language
 */
const hasMeaningOrientation = (response: string): boolean => {
  const meaningWords = [
    'meaning', 'purpose', 'value', 'values', 'meaningful', 'purposeful',
    'contribution', 'legacy', 'transcend', 'significance', 'calling',
    'mission', 'fulfillment', 'authentic', 'genuine', 'worthy'
  ];
  
  const lowerResponse = response.toLowerCase();
  
  return meaningWords.some(word => lowerResponse.includes(word));
};

/**
 * Determine the most relevant logotherapy pathway for the user input
 */
const determineLogotherapyPathway = (
  userInput: string,
  conversationHistory: string[]
): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check recent conversation history for relevant themes
  const recentHistory = getFiveResponseMemory();
  const recentPatientMessages = recentHistory
    .filter(msg => msg.sender === 'patient')
    .map(msg => msg.content.toLowerCase());
  
  // Count pathway indicators across user input and recent history
  let creativeValuesCount = countPathwayIndicators(
    [lowerInput, ...recentPatientMessages], 
    LOGOTHERAPY_MEANING_PATHWAYS.creativeValues.keywords
  );
  
  let experientialValuesCount = countPathwayIndicators(
    [lowerInput, ...recentPatientMessages], 
    LOGOTHERAPY_MEANING_PATHWAYS.experientialValues.keywords
  );
  
  let attitudinalValuesCount = countPathwayIndicators(
    [lowerInput, ...recentPatientMessages], 
    LOGOTHERAPY_MEANING_PATHWAYS.attitudinalValues.keywords
  );
  
  // Determine predominant pathway
  const maxCount = Math.max(creativeValuesCount, experientialValuesCount, attitudinalValuesCount);
  
  if (maxCount === 0) {
    return 'general'; // No clear pathway detected
  }
  
  if (maxCount === creativeValuesCount) {
    return 'creative';
  } else if (maxCount === experientialValuesCount) {
    return 'experiential';
  } else {
    return 'attitudinal';
  }
};

/**
 * Count occurrences of pathway indicators in text samples
 */
const countPathwayIndicators = (
  textSamples: string[],
  indicators: string[]
): number => {
  let count = 0;
  
  textSamples.forEach(sample => {
    indicators.forEach(indicator => {
      if (sample.includes(indicator)) {
        count++;
      }
    });
  });
  
  return count;
};

/**
 * Detect existential themes in user input
 */
const detectExistentialThemes = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for explicit existential concepts
  for (const concept in EXISTENTIAL_CONCEPTS) {
    if (lowerInput.includes(concept.toLowerCase())) {
      return true;
    }
  }
  
  // Check for existential questions
  const existentialQuestions = [
    'what is the meaning',
    'purpose of life',
    'why are we here',
    'what\'s the point',
    'why do we exist',
    'reason for living',
    'meaning of suffering',
    'why suffer',
    'point of it all',
    'meaning in life',
    'find purpose',
    'feel empty',
    'feels meaningless',
    'no purpose'
  ];
  
  return existentialQuestions.some(question => lowerInput.includes(question));
};

/**
 * Detect meaning-related questions in user input
 */
const detectMeaningQuestions = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  const meaningQuestions = [
    'what gives',
    'how do i find',
    'where do i find',
    'how can i discover',
    'what brings meaning',
    'how to create meaning',
    'make life meaningful',
    'find my purpose',
    'discover my purpose',
    'create meaning',
    'feel fulfilled',
    'feel like my life has purpose'
  ];
  
  // Check if meaning/purpose words are near question words
  if ((lowerInput.includes('meaning') || lowerInput.includes('purpose')) &&
      (lowerInput.includes('how') || lowerInput.includes('what') || 
       lowerInput.includes('where') || lowerInput.includes('why'))) {
    return true;
  }
  
  return meaningQuestions.some(question => lowerInput.includes(question));
};
