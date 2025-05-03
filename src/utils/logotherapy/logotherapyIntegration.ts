
/**
 * Logotherapy Integration Module
 * 
 * Integrates Viktor Frankl's logotherapy with Roger's core systems
 * UNIVERSAL LAW: All of Roger's systems must incorporate meaning and purpose
 */

import { generateLogotherapyResponse } from './logotherapyResponses';
import { PersonalityMode, getRandomPersonality } from '../response/spontaneityGenerator';

/**
 * Integrate logotherapy into the adaptive response system
 * Called when meaning/purpose themes are detected in user input
 */
export const integrateLogotherapyResponse = (
  userInput: string,
  baseResponse: string,
  personalityMode: PersonalityMode = getRandomPersonality()
): string => {
  // Generate a pure logotherapy-based response
  const logotherapyResponse = generateLogotherapyResponse(userInput);
  
  // Determine integration approach based on response length and content
  if (baseResponse.length < 100) {
    // For shorter responses, simply append the logotherapy perspective
    return `${baseResponse} ${logotherapyResponse}`;
  } else {
    // For longer responses, blend the perspectives
    return blendResponses(baseResponse, logotherapyResponse, personalityMode);
  }
};

/**
 * Blend a base response with logotherapy perspective
 */
const blendResponses = (
  baseResponse: string, 
  logotherapyResponse: string, 
  personalityMode: PersonalityMode
): string => {
  // Extract key sentences/parts from each response
  const baseSentences = baseResponse.split(/(?<=[.?!])\s+/);
  const logoSentences = logotherapyResponse.split(/(?<=[.?!])\s+/);
  
  // Get transition phrases appropriate for personality
  const transitions = getLogotherapyTransitions(personalityMode);
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  // Select a key insight from the logotherapy response
  const keyLogoSentence = logoSentences[Math.floor(Math.random() * logoSentences.length)];
  
  // Create a blended response based on length
  if (baseSentences.length <= 2) {
    // For very short base responses, add logotherapy perspective after
    return `${baseResponse} ${transition} ${keyLogoSentence}`;
  } else {
    // For longer responses, insert logotherapy perspective before conclusion
    const openingPart = baseSentences.slice(0, Math.ceil(baseSentences.length * 0.7)).join(' ');
    const closingPart = baseSentences.slice(Math.ceil(baseSentences.length * 0.7)).join(' ');
    
    return `${openingPart} ${transition} ${keyLogoSentence} ${closingPart}`;
  }
};

/**
 * Get appropriate transitions for blending logotherapy insights
 */
const getLogotherapyTransitions = (personalityMode: PersonalityMode): string[] => {
  const commonTransitions = [
    "Looking at this through the lens of meaning and purpose,",
    "Considering how this relates to what gives your life meaning,",
    "Thinking about the deeper purpose behind this,",
    "From a meaning-centered perspective,",
    "When we consider the importance of meaning in our lives,"
  ];
  
  // Get mode-specific transitions
  const modeTransitions: Record<PersonalityMode, string[]> = {
    'curious': [
      "I wonder how this connects to your search for meaning?",
      "What if we explored how this relates to your deeper purpose?"
    ],
    'empathetic': [
      "I sense this might connect to your deeper search for meaning.",
      "These feelings often relate to our need for purpose and meaning."
    ],
    'reflective': [
      "Reflecting on how this relates to your life's meaning,",
      "Taking a step back to see how this connects to your values and purpose,"
    ],
    'direct': [
      "This directly connects to your search for meaning by",
      "Looking at the purpose behind this situation,"
    ],
    'analytical': [
      "Analyzing how this connects to meaning and purpose,",
      "When we break down how this relates to your values,"
    ],
    'warm': [
      "I appreciate how this journey relates to your search for meaning.",
      "It's meaningful to see how this connects to your deeper purpose."
    ],
    'thoughtful': [
      "I've been thinking about how this relates to your life's meaning.",
      "This reminds me of how we all search for purpose in our experiences."
    ],
    'conversational': [
      "You know, this really connects to finding meaning in your situation.",
      "So, this actually ties into your deeper purpose in an interesting way."
    ],
    'gentle': [
      "Perhaps we might consider how this relates to your search for meaning.",
      "Maybe there's a connection here to your deeper values and purpose."
    ],
    'grounded': [
      "Based on what you've shared, this clearly connects to your values and purpose.",
      "From a practical perspective, this relates to finding meaning by"
    ],
    'existential': [
      "This existential situation invites us to consider your deeper purpose.",
      "The meaning dimension of this experience suggests"
    ],
    'meaning-focused': [
      "Through the lens of meaning and purpose,",
      "Considering the deeper values at play here,"
    ]
  };
  
  // Combine common with mode-specific transitions
  const allTransitions = [...commonTransitions];
  
  // Add mode-specific transitions if available
  if (modeTransitions[personalityMode]) {
    allTransitions.push(...modeTransitions[personalityMode]);
  }
  
  return allTransitions;
};

/**
 * Enhance any response with a meaning-oriented perspective
 * Used as a universal rule to ensure meaning integration
 */
export const enhanceWithMeaningPerspective = (
  response: string,
  userInput: string
): string => {
  // Check if response already has meaning-oriented language
  if (hasMeaningOrientation(response)) {
    return response;
  }
  
  // Select an appropriate meaning enhancement
  const enhancement = getMeaningEnhancement();
  
  // Add the enhancement at an appropriate point in the response
  const sentences = response.split(/(?<=[.?!])\s+/);
  
  if (sentences.length <= 2) {
    // For short responses, simply append
    return `${response} ${enhancement}`;
  } else {
    // For longer responses, insert before conclusion
    const insertPoint = Math.max(Math.floor(sentences.length * 0.75), sentences.length - 2);
    
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    return `${beginning} ${enhancement} ${end}`;
  }
};

/**
 * Check if a response already has meaning-oriented language
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
 * Get a subtle meaning-oriented enhancement
 */
const getMeaningEnhancement = (): string => {
  const enhancements = [
    "This experience might reveal something about what matters most to you.",
    "How we respond to situations like this often reflects our deeper values.",
    "These moments often connect to our search for what gives life meaning.",
    "Finding your authentic response to this situation can reveal your unique purpose.",
    "The meaning we find in these experiences often comes from how they connect to our values.",
    "Sometimes these situations invite us to reflect on what gives our lives purpose.",
    "The way forward often becomes clearer when we connect with what matters most to us.",
    "Our responses to challenges often reveal what we truly value.",
    "Finding meaning in this situation might involve connecting it to your larger life purpose.",
    "What makes experiences meaningful is often how they connect to what we value most."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};
