
/**
 * Ohio Context Manager
 * 
 * Manages the detection and response to Ohio-specific contexts in conversation.
 * Helps Roger connect with patients through local knowledge and references.
 */

// Ohio reference categories for detection
interface OhioReferences {
  hasOhioReference: boolean;
  detectedLocations: string[];
  detectedCulturalReferences: string[];
  detectedChildReferences: string[];
  detectedNewcomerReferences: string[];
}

// Response strategy for Ohio context
interface OhioContextStrategy {
  opener: string;
  shouldIncludeLocalReference: boolean;
  shouldIncludeMentalHealthConnection: boolean;
}

/**
 * Detects if the user is likely a child patient
 */
export const detectChildPatient = (userInput: string): boolean => {
  const childSignals = [
    /\b(mom|mommy|dad|daddy)\b/i,
    /\b(school|teacher|homework|class|recess)\b/i,
    /\b(playdate|toy|game|playground)\b/i,
    /\b(cartoon|pokemon|minecraft|fortnite|roblox)\b/i,
    /\bi('m| am) (\d|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen)\b/i,
    /\b(drawing|coloring|crayon)\b/i,
    /\bcool\b|\bawesome\b|\bfun\b/i
  ];
  
  return childSignals.some(pattern => pattern.test(userInput));
};

/**
 * Detects if the user is likely a newcomer patient
 */
export const detectNewcomerPatient = (userInput: string): boolean => {
  const newcomerSignals = [
    /\bnew (to|in) (cleveland|ohio|america|usa|united states)\b/i,
    /\bmoved (here|to cleveland|to ohio|to america)\b/i,
    /\b(refugee|immigrant|newcomer)\b/i,
    /\b(learning english|english class|esl)\b/i,
    /\b(miss|missing) (home|country|family|homeland)\b/i,
    /\b(translator|translate|not understand)\b/i,
    /\b(in my country|where I( am)? from)\b/i
  ];
  
  return newcomerSignals.some(pattern => pattern.test(userInput));
};

/**
 * Detects Ohio-specific references in the user's message
 */
export const detectOhioReferences = (userInput: string): OhioReferences => {
  // Define Ohio-specific patterns for detection
  const locations = [
    'cleveland', 'ohio', 'cuyahoga', 'akron', 'parma', 'shaker heights', 
    'lakewood', 'west side', 'east side', 'downtown', 'flats', 
    'tremont', 'ohio city', 'university circle', 'little italy', 
    'glenville', 'fairfax', 'western reserve', 'euclid', 'mayfield'
  ];
  
  const culturalReferences = [
    'browns', 'cavaliers', 'cavs', 'guardians', 'indians', 'monsters', 
    'lake erie', 'cuyahoga river', 'west side market', 'rock hall', 
    'rock and roll hall of fame', 'metroparks', 'edgewater', 'severance', 
    'playhouse square', 'terminal tower', 'public square', 'cleveland clinic', 
    'university hospitals', 'case western', 'csU', 'john carroll'
  ];
  
  const childReferences = [
    'zoo', 'aquarium', 'children\'s museum', 'great lakes science center', 
    'natural history museum', 'botanical garden', 'ice cream', 
    'mitchell\'s', 'malley\'s', 'cedar point', 'museum of art', 'goodyear'
  ];
  
  const newcomerReferences = [
    'international', 'welcome center', 'global cleveland', 'us together', 
    'hope center', 'refugee', 'immigrant', 'newcomer', 'catholic charities', 
    'english class', 'esl', 'migration', 'visa', 'green card'
  ];
  
  // Create regex patterns to find matches
  const locationMatches = locations.filter(loc => 
    new RegExp(`\\b${loc}\\b`, 'i').test(userInput)
  );
  
  const culturalMatches = culturalReferences.filter(ref => 
    new RegExp(`\\b${ref}\\b`, 'i').test(userInput)
  );
  
  const childMatches = childReferences.filter(ref => 
    new RegExp(`\\b${ref}\\b`, 'i').test(userInput)
  );
  
  const newcomerMatches = newcomerReferences.filter(ref => 
    new RegExp(`\\b${ref}\\b`, 'i').test(userInput)
  );
  
  // Determine if any Ohio reference was detected
  const hasOhioReference = locationMatches.length > 0 || 
                          culturalMatches.length > 0 ||
                          childMatches.length > 0 ||
                          newcomerMatches.length > 0;
  
  return {
    hasOhioReference,
    detectedLocations: locationMatches,
    detectedCulturalReferences: culturalMatches,
    detectedChildReferences: childMatches,
    detectedNewcomerReferences: newcomerMatches
  };
};

// Map of references to mental health topics
const referenceToMentalHealthMap = {
  'weather': {
    type: 'environment',
    description: 'Cleveland weather and its impact on mood',
    engagingQuestions: [
      "How does Cleveland's changing weather affect how you feel?",
      "Have you noticed any connections between weather and your mood?",
      "Some people find the lake effect weather challenging. How about you?"
    ]
  },
  'browns': {
    type: 'hobby',
    description: 'Cleveland Browns and sports as stress relief',
    engagingQuestions: [
      "Do you find watching the Browns helps take your mind off stress?",
      "Sports can be a great emotional outlet. Is following the Browns that for you?",
      "Many fans ride the emotional rollercoaster with Cleveland sports. How does that affect you?"
    ]
  },
  'cavaliers': {
    type: 'hobby',
    description: 'Cleveland Cavaliers and sports as community connection',
    engagingQuestions: [
      "Do the Cavs games help you feel connected to the Cleveland community?",
      "Sports teams can bring people together. Has that been your experience?"
    ]
  },
  'guardians': {
    type: 'hobby',
    description: 'Cleveland Guardians and recreation for mental wellness',
    engagingQuestions: [
      "Baseball season can be a nice routine. Does following the Guardians provide structure?",
      "Do you find baseball games relaxing or exciting?"
    ]
  },
  'west side market': {
    type: 'community',
    description: 'West Side Market as a social and cultural hub',
    engagingQuestions: [
      "Places like the West Side Market can help us feel connected. Do you enjoy visiting there?",
      "Community spaces are important for wellbeing. Is that market one of your go-to places?"
    ]
  },
  'metroparks': {
    type: 'nature',
    description: 'Cleveland Metroparks system for nature therapy',
    engagingQuestions: [
      "The Metroparks are wonderful for reducing stress. Do you spend time there?",
      "Nature can be healing. Do you find the parks help with your mental wellbeing?"
    ]
  },
  'lake erie': {
    type: 'nature',
    description: 'Lake Erie and water as calming elements',
    engagingQuestions: [
      "Many find the lake calming to look at. Do you ever go there when stressed?",
      "Water can have a soothing effect. Does Lake Erie have that impact for you?"
    ]
  },
  'international food': {
    type: 'food',
    description: "Cleveland's diverse food scene including West Side Market international vendors and Asia Plaza",
    engagingQuestions: [
      "Have you found foods from your home country in Cleveland?",
      "Familiar foods can be comforting when adjusting to a new place. Have you found comfort foods here?"
    ]
  }
};

/**
 * Maps a detected Ohio reference to a relevant mental health topic
 */
export const mapReferenceToMentalHealthTopic = (reference: string): string => {
  const lowerRef = reference.toLowerCase();
  
  // Check for direct matches
  for (const [key, value] of Object.entries(referenceToMentalHealthMap)) {
    if (lowerRef.includes(key)) {
      // Get a random engaging question
      const randomQuestion = value.engagingQuestions[
        Math.floor(Math.random() * value.engagingQuestions.length)
      ];
      
      return ` ${randomQuestion}`;
    }
  }
  
  // Handle general types of references
  if (lowerRef.includes('park') || lowerRef.includes('garden')) {
    return " Nature spaces like this can be great for reducing stress. Do you find outdoor areas help your mental wellbeing?";
  }
  
  if (lowerRef.includes('museum') || lowerRef.includes('art')) {
    return " Cultural spaces can stimulate our minds in positive ways. Do you find places like this help your mood?";
  }
  
  if (lowerRef.includes('food') || lowerRef.includes('restaurant')) {
    return " Food experiences can be comforting. Do you have places here that remind you of happy memories?";
  }
  
  // Default connection
  return " These local connections can be important for feeling a sense of belonging. How has your experience been in Cleveland?";
};

/**
 * Generates a context-aware response strategy based on Ohio references
 */
export const generateOhioContextResponse = (references: OhioReferences): OhioContextStrategy => {
  // Default strategy
  const strategy: OhioContextStrategy = {
    opener: '',
    shouldIncludeLocalReference: false,
    shouldIncludeMentalHealthConnection: false
  };
  
  // If no Ohio references, return empty strategy
  if (!references.hasOhioReference) {
    return strategy;
  }
  
  // Determine if we should make a local connection
  strategy.shouldIncludeLocalReference = true;
  
  // Decide whether to include mental health connection based on relevance
  strategy.shouldIncludeMentalHealthConnection = Math.random() > 0.5; // 50% chance
  
  // Generate appropriate opener based on detected references
  if (references.detectedLocations.length > 0) {
    const location = references.detectedLocations[0];
    strategy.opener = `I notice you mentioned ${location}. `;
  } 
  else if (references.detectedCulturalReferences.length > 0) {
    const culturalRef = references.detectedCulturalReferences[0];
    strategy.opener = `${culturalRef} is definitely a big part of Cleveland culture! `;
  }
  else if (references.detectedChildReferences.length > 0) {
    const childRef = references.detectedChildReferences[0];
    strategy.opener = `The ${childRef} is a fun spot in Cleveland! `;
  }
  else if (references.detectedNewcomerReferences.length > 0) {
    const newcomerRef = references.detectedNewcomerReferences[0];
    strategy.opener = `Cleveland has great ${newcomerRef} resources to help people feel welcome. `;
  }
  
  return strategy;
};
