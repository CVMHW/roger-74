
/**
 * Logotherapy Transitions
 * 
 * Transition phrases to help introduce logotherapy principles 
 * in a subtle, conversational manner
 */

// Import the PersonalityMode type directly rather than from personalityVariation
export type PersonalityMode = 
  'curious' | 
  'empathetic' | 
  'reflective' | 
  'direct' | 
  'analytical' | 
  'warm' | 
  'thoughtful' | 
  'conversational' | 
  'gentle' | 
  'grounded' | 
  'existential' |
  'meaning-focused' |
  'warm-social';

/**
 * Transitions for different personality modes
 * Maps each personality mode to appropriate transition phrases
 */
export const transitionsForMode: Record<PersonalityMode, string[]> = {
  curious: [
    "I'm wondering about",
    "I'm curious about how",
    "It makes me wonder if"
  ],
  empathetic: [
    "I can really hear that",
    "That must be so difficult when",
    "It makes sense you'd feel that way about"
  ],
  reflective: [
    "When I reflect on what you're saying",
    "Looking at this from another angle",
    "Taking a step back to consider"
  ],
  direct: [
    "Let's look at",
    "Consider how",
    "What if we explore"
  ],
  analytical: [
    "Analyzing this situation",
    "Looking at the patterns here",
    "Breaking this down"
  ],
  warm: [
    "I feel that",
    "This reminds me of",
    "There's something meaningful about"
  ],
  thoughtful: [
    "I've been thinking about",
    "Contemplating what you've shared",
    "Something to consider might be"
  ],
  conversational: [
    "You know, I was just thinking",
    "It's interesting how",
    "It strikes me that"
  ],
  gentle: [
    "Perhaps we could gently explore",
    "Maybe there's a subtle connection to",
    "There might be a soft insight here about"
  ],
  grounded: [
    "Bringing this back to the present moment",
    "Looking at the concrete situation",
    "Focusing on what's happening right now"
  ],
  existential: [
    "Considering the deeper meaning",
    "Looking at the existential aspect",
    "From a broader perspective"
  ],
  'meaning-focused': [
    "Thinking about what gives meaning here",
    "Considering the values at play",
    "Looking at what matters most in this situation"
  ],
  'warm-social': [
    "In everyday situations like this",
    "These social moments often",
    "When we're with others like that",
    "Social situations can be",
    "I've noticed in similar situations"
  ]
};

/**
 * Get a random transition phrase for the given personality mode
 */
export const getRandomTransition = (mode: PersonalityMode): string => {
  const transitions = transitionsForMode[mode] || transitionsForMode.conversational;
  return transitions[Math.floor(Math.random() * transitions.length)];
};

/**
 * Get a meaning-focused transition regardless of personality mode
 */
export const getMeaningFocusedTransition = (): string => {
  const meaningTransitions = [
    ...transitionsForMode.existential,
    ...transitionsForMode['meaning-focused']
  ];
  return meaningTransitions[Math.floor(Math.random() * meaningTransitions.length)];
};

/**
 * Get transitions for logotherapy integration
 * Exported for compatibility with response-blending.ts
 */
export const getLogotherapyTransitions = (mode: PersonalityMode): string[] => {
  return transitionsForMode[mode] || transitionsForMode.conversational;
};
