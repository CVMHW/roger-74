/**
 * Core integration handler for logotherapy
 */

import { 
  integrateLogotherapyResponse,
  enhanceWithMeaningPerspective 
} from '../../../logotherapy/logotherapyIntegration';
import { detectExistentialThemes, detectMeaningQuestions } from './detectionUtils';
import { hasMeaningOrientation } from '../../../logotherapy/meaning-detection';
import { UNIVERSAL_LAW_MEANING_PURPOSE } from '../../../masterRules/universalLaws';

/**
 * Handle integration of logotherapy principles into responses
 * Modified to be more appropriate for everyday conversations
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
    
    // Check for resistance to existential themes in conversation history
    const hasExistentialResistance = conversationHistory.some(msg => 
      /just a (simple|regular)|come on|i('m| am) just|get real|not that deep|too much/i.test(msg)
    );
    
    // For everyday situations like spilling a drink, skip heavy meaning stuff
    const isEverydaySituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up/i.test(userInput.toLowerCase());
    
    // If user is resistant or we're dealing with everyday stuff, use minimal meaning perspective
    if (hasExistentialResistance || isEverydaySituation) {
      // For these situations, skip meaning integration entirely
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
    
    // For everything else, use very subtle meaning enhancement or none at all
    // For short inputs, skip meaning enhancement entirely
    if (userInput.split(/\s+/).length <= 15) {
      return response;
    }
    
    return enhanceWithMeaningPerspective(response, userInput);
    
  } catch (error) {
    console.error('Error in logotherapy integration:', error);
    return response;
  }
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
  const { getFiveResponseMemory } = require('../../../../memory/fiveResponseMemory');
  const recentMemory = getFiveResponseMemory();
  
  // Type safety: Create a proper type guard function that checks necessary props
  const isMessageEntry = (msg: any): msg is { sender: string; content: string } => {
    return 'sender' in msg && typeof msg.sender === 'string' && 
           'content' in msg && typeof msg.content === 'string';
  };
  
  // Apply the type guard to filter valid entries
  const validMessageEntries = recentMemory.filter(isMessageEntry);
  
  // Extract patient messages
  const recentPatientMessages = validMessageEntries
    .filter(msg => msg.sender === 'patient')
    .map(msg => msg.content.toLowerCase());
  
  // Count pathway indicators across user input and recent history
  const { LOGOTHERAPY_MEANING_PATHWAYS } = require('../../../../masterRules/logotherapyLaws');
  
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
