
/**
 * Logotherapy Universal Laws
 * 
 * Based on Viktor Frankl's principles of logotherapy, these laws govern Roger's
 * foundational therapeutic approach, emphasizing meaning, purpose, and the human spirit.
 * UNIVERSAL LAW: All responses must incorporate the search for meaning and purpose.
 */

export const UNIVERSAL_LAW_MEANING = {
  name: "Unconditional Will to Meaning",
  description: "Roger recognizes that the will to meaning is the primary motivational force in humans. Every response must respect and honor the patient's search for meaning in all circumstances, including suffering.",
  priority: 10, // Highest priority alongside safety and memory
  
  // Implementation checks
  enforcement: {
    meaningPerspectiveIncorporated: true,
    willToMeaningRespected: true,
    purposeExplorationSupported: true,
    sufferingMeaningAddressed: true,
    existentialVacuumRecognized: true
  }
};

/**
 * The Three Pathways to Meaning (Frankl's triad)
 * 1. Creative values (giving to the world through creativity or work)
 * 2. Experiential values (receiving from the world through experiences and love)
 * 3. Attitudinal values (taking a stance toward unavoidable suffering)
 */
export const LOGOTHERAPY_MEANING_PATHWAYS = {
  creativeValues: {
    description: "Finding meaning through creative work, achievements, or giving to the world",
    keywords: ["create", "accomplish", "contribute", "work", "give", "help", "make", "build", "achieve"]
  },
  experientialValues: {
    description: "Finding meaning through experiences and love",
    keywords: ["experience", "feel", "love", "appreciate", "connect", "relationship", "beauty", "nature", "art"]
  },
  attitudinalValues: {
    description: "Finding meaning through the attitude taken toward unavoidable suffering",
    keywords: ["attitude", "choose", "face", "accept", "challenge", "difficulty", "struggle", "suffering", "resilience"]
  }
};

/**
 * Logotherapy Techniques
 */
export const LOGOTHERAPY_TECHNIQUES = {
  paradoxicalIntention: {
    description: "Using humor and ridicule to face fears by wishing for the very thing that is feared",
    applicationContexts: ["anxiety", "phobias", "rumination", "insomnia", "social anxiety"]
  },
  dereflection: {
    description: "Reducing self-focus by redirecting attention away from problems toward meaningful engagement",
    applicationContexts: ["hyperreflection", "self-consciousness", "performance anxiety", "excessive self-monitoring"]
  },
  socraticDialogue: {
    description: "Guiding discovery through questioning to uncover meaning and values",
    applicationContexts: ["existential vacuum", "value conflicts", "meaning exploration", "decision-making"]
  }
};

/**
 * Existential concepts from logotherapy
 */
export const EXISTENTIAL_CONCEPTS = {
  freedomOfWill: "Humans have freedom to choose their attitude in any circumstance",
  willToMeaning: "The primary motivational force in humans is the search for meaning",
  meaningInLife: "Life has meaning under all circumstances, even suffering",
  existentialVacuum: "The feeling of emptiness and meaninglessness when one lacks purpose",
  tragicTriad: "Suffering, guilt, and death as unavoidable aspects of human existence",
  selfTranscendence: "The ability to reach beyond oneself toward meaning and purpose"
};

/**
 * Check if a response incorporates logotherapy perspective
 */
export const checkLogotherapyCompliance = (response: string): boolean => {
  // Check for meaning-oriented language
  const meaningOrientedPatterns = [
    /purpose/i, /meaning/i, /value/i, /choice/i, /attitude/i, 
    /perspective/i, /freedom/i, /responsibility/i, /decision/i,
    /create/i, /experience/i, /connect/i, /transcend/i
  ];
  
  // Check if any meaning-oriented pattern is present
  for (const pattern of meaningOrientedPatterns) {
    if (pattern.test(response)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Enhance response with logotherapy perspective
 */
export const enhanceWithLogotherapyPerspective = (
  response: string, 
  userInput: string
): string => {
  if (checkLogotherapyCompliance(response)) {
    return response; // Already incorporates logotherapy perspective
  }
  
  // Add meaning-oriented enhancement based on user input context
  const lowerInput = userInput.toLowerCase();
  
  // Check which pathway to meaning might be most relevant
  if (containsCreativeValueKeywords(lowerInput)) {
    return addCreativeValuesPerspective(response);
  } else if (containsExperientialValueKeywords(lowerInput)) {
    return addExperientialValuesPerspective(response);
  } else if (containsAttitudinalValueKeywords(lowerInput)) {
    return addAttitudinalValuesPerspective(response);
  }
  
  // Default enhancement with general meaning perspective
  return addGeneralMeaningPerspective(response);
};

// Helper functions to detect meaning pathways in user input
const containsCreativeValueKeywords = (input: string): boolean => {
  return LOGOTHERAPY_MEANING_PATHWAYS.creativeValues.keywords.some(keyword => 
    input.includes(keyword)
  );
};

const containsExperientialValueKeywords = (input: string): boolean => {
  return LOGOTHERAPY_MEANING_PATHWAYS.experientialValues.keywords.some(keyword => 
    input.includes(keyword)
  );
};

const containsAttitudinalValueKeywords = (input: string): boolean => {
  return LOGOTHERAPY_MEANING_PATHWAYS.attitudinalValues.keywords.some(keyword => 
    input.includes(keyword)
  );
};

// Helper functions to add specific meaning perspectives
const addCreativeValuesPerspective = (response: string): string => {
  const creativeValuesPhrases = [
    "When we create or contribute something meaningful, it can help us find purpose even in difficult times.",
    "Finding ways to meaningfully engage with the world through our actions often brings a sense of purpose.",
    "What we give to the world through our efforts and creativity often becomes a source of meaning.",
    "Contributing to something larger than ourselves can help illuminate our unique purpose."
  ];
  
  const selectedPhrase = creativeValuesPhrases[Math.floor(Math.random() * creativeValuesPhrases.length)];
  return `${response} ${selectedPhrase}`;
};

const addExperientialValuesPerspective = (response: string): string => {
  const experientialValuesPhrases = [
    "The deep connections we form and meaningful experiences we have often reveal what matters most to us.",
    "Sometimes meaning reveals itself in moments of connection or when we fully experience what's in front of us.",
    "Our relationships and experiences can be profound sources of meaning, especially when we're fully present in them.",
    "Being open to experiences and connections can help us discover what gives our lives meaning."
  ];
  
  const selectedPhrase = experientialValuesPhrases[Math.floor(Math.random() * experientialValuesPhrases.length)];
  return `${response} ${selectedPhrase}`;
};

const addAttitudinalValuesPerspective = (response: string): string => {
  const attitudinalValuesPhrases = [
    "Even in situations we can't change, we always retain the freedom to choose our attitude toward them.",
    "Sometimes finding meaning involves choosing how we face unavoidable challenges or suffering.",
    "The stance we take toward difficult circumstances can transform how we experience them.",
    "We always have the freedom to choose our attitude, even when we can't change our circumstances."
  ];
  
  const selectedPhrase = attitudinalValuesPhrases[Math.floor(Math.random() * attitudinalValuesPhrases.length)];
  return `${response} ${selectedPhrase}`;
};

const addGeneralMeaningPerspective = (response: string): string => {
  const generalMeaningPhrases = [
    "Exploring what gives your life meaning can be an important part of navigating this situation.",
    "Sometimes these moments invite us to reflect on what matters most in our lives.",
    "These experiences often connect to our deeper search for meaning and purpose.",
    "Reflecting on what's truly meaningful to you might offer a different perspective on this situation."
  ];
  
  const selectedPhrase = generalMeaningPhrases[Math.floor(Math.random() * generalMeaningPhrases.length)];
  return `${response} ${selectedPhrase}`;
};
