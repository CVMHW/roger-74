
/**
 * Logotherapy transitions based on personality modes
 */

import { PersonalityMode } from './types';

/**
 * Get appropriate transitions for blending logotherapy insights
 */
export const getLogotherapyTransitions = (personalityMode: PersonalityMode): string[] => {
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
