
/**
 * Detection utilities for logotherapy integration
 */

import { EXISTENTIAL_CONCEPTS } from '../../../masterRules/logotherapyLaws';
import { LOGOTHERAPY_MEANING_PATHWAYS } from '../../../masterRules/logotherapyLaws';

/**
 * Detect existential themes in user input
 */
export const detectExistentialThemes = (userInput: string): boolean => {
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
export const detectMeaningQuestions = (userInput: string): boolean => {
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

/**
 * Determine the most relevant logotherapy pathway for the user input
 */
export const determineLogotherapyPathway = (
  userInput: string,
  conversationHistory: string[]
): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Check recent conversation history for relevant themes
  const { getFiveResponseMemory } = require('../../../../utils/memory/fiveResponseMemory');
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
