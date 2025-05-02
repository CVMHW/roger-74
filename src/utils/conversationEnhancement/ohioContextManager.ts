
/**
 * Utility for managing Ohio-specific cultural references and context
 * Helps Roger connect with users through local knowledge
 */

// Common Ohio locations and their associations
export const ohioLocations = {
  'cleveland': {
    region: 'northeast',
    nicknames: ['the land', 'cle', 'the 216'],
    teams: ['Browns', 'Guardians', 'Cavaliers'],
    landmarks: ['Rock & Roll Hall of Fame', 'West Side Market', 'Cleveland Clinic']
  },
  'columbus': {
    region: 'central',
    nicknames: ['cbus', 'the 614', 'cap city'],
    teams: ['Blue Jackets', 'Crew', 'Buckeyes'],
    landmarks: ['Ohio State University', 'Short North', 'German Village']
  },
  'cincinnati': {
    region: 'southwest',
    nicknames: ['cincy', 'the nasty nati', 'queen city'],
    teams: ['Bengals', 'Reds', 'FC Cincinnati'],
    landmarks: ['Findlay Market', 'Over-the-Rhine', 'Cincinnati Zoo']
  },
  'toledo': {
    region: 'northwest',
    nicknames: ['glass city', 'the 419'],
    teams: ['Mud Hens', 'Walleye'],
    landmarks: ['Toledo Museum of Art', 'Toledo Zoo']
  },
  'dayton': {
    region: 'southwest',
    nicknames: ['gem city'],
    teams: ['Dayton Flyers'],
    landmarks: ['National Museum of the US Air Force', 'Wright Brothers National Memorial']
  }
};

// Ohio cultural references and their emotional/psychological connections
export const ohioCulturalReferences = {
  'buckeye': {
    type: 'symbol',
    description: 'State symbol, Ohio State University mascot, and chocolate-peanut butter candy',
    emotionalAssociation: ['pride', 'community', 'tradition', 'comfort food']
  },
  'o-h-i-o': {
    type: 'chant',
    description: 'Call-and-response chant for Ohio State fans',
    emotionalAssociation: ['belonging', 'excitement', 'identity', 'team spirit']
  },
  'skyline chili': {
    type: 'food',
    description: 'Cincinnati-style chili served over spaghetti or hot dogs',
    emotionalAssociation: ['comfort', 'nostalgia', 'regional identity', 'debate']
  },
  'arnold festival': {
    type: 'event',
    description: 'Annual fitness festival in Columbus started by Arnold Schwarzenegger',
    emotionalAssociation: ['motivation', 'health focus', 'achievement', 'self-improvement']
  },
  'hocking hills': {
    type: 'nature',
    description: 'Scenic state park known for hiking, waterfalls, and outdoor recreation',
    emotionalAssociation: ['peace', 'escape', 'natural beauty', 'reflection']
  }
};

// Child-friendly references for connecting with younger patients
export const childFriendlyReferences = {
  'zoo animals': {
    type: 'attraction',
    description: 'Cleveland Metroparks Zoo animals like lions, elephants, and giraffes',
    engagingQuestions: [
      "What's your favorite zoo animal?",
      "Ever seen the monkeys in the zoo's RainForest?",
      "The zoo has a cool dinosaur exhibit! Do you like dinosaurs?"
    ]
  },
  'sports mascots': {
    type: 'sports',
    description: 'Cleveland sports team mascots like Chomps (Browns), Moondog (Cavaliers)',
    engagingQuestions: [
      "Have you seen Chomps at a Browns game?",
      "Do you like watching the Cavs' halftime shows?",
      "Ever been to a Guardians game where kids can run the bases?"
    ]
  },
  'treats': {
    type: 'food',
    description: 'Kid-friendly treats in Cleveland like Mitchell\'s Ice Cream and Malley\'s Chocolates',
    engagingQuestions: [
      "What's your favorite ice cream flavor?",
      "Ever tried chocolate pretzels from Malley's?",
      "Have you had a hot dog at a Guardians game?"
    ]
  },
  'museums': {
    type: 'attraction',
    description: 'Kid-friendly museums like Children\'s Museum of Cleveland and Great Lakes Science Center',
    engagingQuestions: [
      "Been to the Children's Museum's big playhouse?",
      "Want to see a space shuttle at the Science Center?",
      "Have you seen the dinosaurs at the Natural History Museum?"
    ]
  },
  'parks': {
    type: 'outdoors',
    description: 'Cleveland Metroparks system with playgrounds, beaches, and trails',
    engagingQuestions: [
      "Like making sandcastles at Edgewater Beach?",
      "Have you gone hiking in the Metroparks?",
      "Ever flown a kite by Lake Erie?"
    ]
  }
};

// Newcomer-friendly references for connecting with international/refugee patients
export const newcomerFriendlyReferences = {
  'welcome centers': {
    type: 'community',
    description: 'Organizations like The Welcome Center and Global Cleveland that help newcomers',
    engagingQuestions: [
      "Have you visited the Welcome Center on Fulton Parkway?",
      "Has your family been to any Global Cleveland events?",
      "Do you know about any community centers near you?"
    ]
  },
  'international food': {
    type: 'food',
    description: 'Cleveland's diverse food scene including West Side Market international vendors and Asia Plaza',
    engagingQuestions: [
      "Have you found foods from your home country in Cleveland?",
      "Have you been to Asia Plaza for noodles or dumplings?",
      "Do you have a favorite treat from the West Side Market?"
    ]
  },
  'multicultural events': {
    type: 'events',
    description: 'Cleveland events like World Refugee Day, Hispanic Alliance Festival, and more',
    engagingQuestions: [
      "Have you been to World Refugee Day at Edgewater?",
      "Do you enjoy festivals with music and food from different countries?",
      "Has your family attended any cultural celebrations in Cleveland?"
    ]
  },
  'school support': {
    type: 'education',
    description: 'Programs for newcomer students including ESL classes and after-school programs',
    engagingQuestions: [
      "Are you taking English classes at school?",
      "Have you joined any clubs or after-school activities?",
      "Do you get homework help at the library?"
    ]
  }
};

/**
 * Detects Ohio-specific references in user input
 * @param input User's message
 * @returns Object containing detected references and their context
 */
export const detectOhioReferences = (input: string): {
  hasOhioReference: boolean;
  detectedLocations: string[];
  detectedCulturalReferences: string[];
  detectedChildReferences: string[];
  detectedNewcomerReferences: string[];
  emotionalAssociations: string[];
  isChildFriendly: boolean;
  isNewcomerFriendly: boolean;
} => {
  const lowerInput = input.toLowerCase();
  const result = {
    hasOhioReference: false,
    detectedLocations: [] as string[],
    detectedCulturalReferences: [] as string[],
    detectedChildReferences: [] as string[],
    detectedNewcomerReferences: [] as string[],
    emotionalAssociations: [] as string[],
    isChildFriendly: false,
    isNewcomerFriendly: false
  };
  
  // Check for location references
  for (const [location, data] of Object.entries(ohioLocations)) {
    if (lowerInput.includes(location)) {
      result.detectedLocations.push(location);
      result.hasOhioReference = true;
    }
    
    // Check for location nicknames
    for (const nickname of data.nicknames) {
      if (lowerInput.includes(nickname)) {
        result.detectedLocations.push(location);
        result.hasOhioReference = true;
        break; // Found one nickname, no need to check others
      }
    }
    
    // Check for team names
    for (const team of data.teams) {
      if (lowerInput.includes(team.toLowerCase())) {
        result.detectedLocations.push(location);
        result.hasOhioReference = true;
        break;
      }
    }
  }
  
  // Check for cultural references
  for (const [reference, data] of Object.entries(ohioCulturalReferences)) {
    if (lowerInput.includes(reference)) {
      result.detectedCulturalReferences.push(reference);
      result.emotionalAssociations = [
        ...result.emotionalAssociations,
        ...data.emotionalAssociation
      ];
      result.hasOhioReference = true;
    }
  }

  // Check for child-friendly references
  const childKeywords = [
    'kids', 'children', 'child', 'playground', 'game', 'play', 'fun',
    'zoo', 'animals', 'mascot', 'ice cream', 'candy', 'chocolate', 
    'museum', 'park', 'dinosaur', 'toy', 'school'
  ];
  
  const hasChildReference = childKeywords.some(word => lowerInput.includes(word));
  if (hasChildReference) {
    result.isChildFriendly = true;
    
    // Check for specific child-friendly references
    for (const [reference, data] of Object.entries(childFriendlyReferences)) {
      if (lowerInput.includes(reference) || 
          lowerInput.includes(data.type) || 
          lowerInput.includes(data.description.toLowerCase())) {
        result.detectedChildReferences.push(reference);
        result.hasOhioReference = true;
      }
    }
  }

  // Check for newcomer-friendly references  
  const newcomerKeywords = [
    'new to', 'moved to', 'immigrant', 'refugee', 'foreign', 'international',
    'welcome', 'newcomer', 'language', 'english class', 'esl', 'country', 
    'culture', 'home country', 'community center'
  ];
  
  const hasNewcomerReference = newcomerKeywords.some(word => lowerInput.includes(word));
  if (hasNewcomerReference) {
    result.isNewcomerFriendly = true;
    
    // Check for specific newcomer-friendly references
    for (const [reference, data] of Object.entries(newcomerFriendlyReferences)) {
      if (lowerInput.includes(reference) || 
          lowerInput.includes(data.type) || 
          lowerInput.includes(data.description.toLowerCase())) {
        result.detectedNewcomerReferences.push(reference);
        result.hasOhioReference = true;
      }
    }
  }
  
  // Remove duplicates from emotional associations
  result.emotionalAssociations = [...new Set(result.emotionalAssociations)];
  
  return result;
};

/**
 * Generates an Ohio-relevant response based on detected references
 * @param detectedReferences Object containing detected Ohio references
 * @returns Appropriate response opener leveraging local knowledge
 */
export const generateOhioContextResponse = (
  detectedReferences: ReturnType<typeof detectOhioReferences>
): {
  opener: string;
  shouldIncludeLocalReference: boolean;
  suggestedEmotionalFocus: string | null;
} => {
  if (!detectedReferences.hasOhioReference) {
    return {
      opener: "",
      shouldIncludeLocalReference: false,
      suggestedEmotionalFocus: null
    };
  }
  
  let opener = "";
  let suggestedEmotionalFocus = null;
  
  // Handle child-friendly responses first (highest priority for younger patients)
  if (detectedReferences.isChildFriendly && detectedReferences.detectedChildReferences.length > 0) {
    const childReference = detectedReferences.detectedChildReferences[0];
    const referenceData = childFriendlyReferences[childReference as keyof typeof childFriendlyReferences];
    
    if (referenceData) {
      // Select a random child-friendly question
      const questions = referenceData.engagingQuestions;
      opener = questions[Math.floor(Math.random() * questions.length)];
      return {
        opener,
        shouldIncludeLocalReference: true,
        suggestedEmotionalFocus: 'comfort'
      };
    }
  }
  
  // Handle newcomer-friendly responses (second priority)
  if (detectedReferences.isNewcomerFriendly && detectedReferences.detectedNewcomerReferences.length > 0) {
    const newcomerReference = detectedReferences.detectedNewcomerReferences[0];
    const referenceData = newcomerFriendlyReferences[newcomerReference as keyof typeof newcomerFriendlyReferences];
    
    if (referenceData) {
      // Select a random newcomer-friendly question
      const questions = referenceData.engagingQuestions;
      opener = questions[Math.floor(Math.random() * questions.length)];
      return {
        opener,
        shouldIncludeLocalReference: true,
        suggestedEmotionalFocus: 'belonging'
      };
    }
  }
  
  // Handle location-specific responses (third priority)
  if (detectedReferences.detectedLocations.length > 0) {
    const location = detectedReferences.detectedLocations[0]; // Use first detected location
    const locationData = ohioLocations[location as keyof typeof ohioLocations];
    
    if (locationData) {
      // Generate location-specific opener
      const locationOpeners = [
        `I hear you mentioning ${location}! `,
        `Speaking of ${location}, that's a great part of Ohio. `,
        `${location} has a lot to offer. `
      ];
      
      opener = locationOpeners[Math.floor(Math.random() * locationOpeners.length)];
    }
  }
  
  // Handle cultural reference responses (lowest priority)
  if (detectedReferences.detectedCulturalReferences.length > 0) {
    const reference = detectedReferences.detectedCulturalReferences[0];
    const referenceData = ohioCulturalReferences[reference as keyof typeof ohioCulturalReferences];
    
    if (referenceData) {
      if (!opener) {
        // Create an opener based on the cultural reference
        const culturalOpeners = [
          `I see you mentioned ${reference}! `,
          `${reference} is definitely a big part of Ohio culture. `,
          `I recognize that reference to ${reference}! `
        ];
        
        opener = culturalOpeners[Math.floor(Math.random() * culturalOpeners.length)];
      }
      
      // Suggest emotional focus based on associations
      if (referenceData.emotionalAssociation.length > 0) {
        suggestedEmotionalFocus = referenceData.emotionalAssociation[
          Math.floor(Math.random() * referenceData.emotionalAssociation.length)
        ];
      }
    }
  }
  
  return {
    opener,
    shouldIncludeLocalReference: true,
    suggestedEmotionalFocus
  };
};

/**
 * Maps Ohio-specific references to mental health topics for refocusing conversations
 * @param reference The detected Ohio reference
 * @returns Refocusing question connecting the reference to mental health
 */
export const mapReferenceToMentalHealthTopic = (reference: string): string => {
  // First check for child-friendly references to adapt the response
  for (const [key, data] of Object.entries(childFriendlyReferences)) {
    if (reference.toLowerCase().includes(key)) {
      // Use a gentler, child-appropriate connection to feelings
      const childFriendlyResponses = [
        `Talking about ${key} is fun! How have you been feeling today while waiting?`,
        `${key} can be exciting! How are you feeling about seeing Dr. Eric today?`,
        `It's cool that you like ${key}. What kinds of things make you happy when you visit here?`
      ];
      return childFriendlyResponses[Math.floor(Math.random() * childFriendlyResponses.length)];
    }
  }

  // Check for newcomer-friendly references to adapt the response
  for (const [key, data] of Object.entries(newcomerFriendlyReferences)) {
    if (reference.toLowerCase().includes(key)) {
      // Use a culturally sensitive connection to feelings
      const newcomerResponses = [
        `Moving to a new place like Cleveland can bring up lots of feelings. How has that been for you?`,
        `Adjusting to Cleveland can be both exciting and challenging. What's been the best part so far?`,
        `Finding community in a new city is important. How have you been settling in emotionally?`
      ];
      return newcomerResponses[Math.floor(Math.random() * newcomerResponses.length)];
    }
  }

  // Standard mental health mappings for adult patients
  const mentalHealthMappings: Record<string, string[]> = {
    // Locations
    'cleveland': [
      "Cleveland has its ups and downs, just like our emotional well-being. How have your emotions been lately?",
      "Cleveland's weather can change quickly, like our moods. How have you been managing your emotions?"
    ],
    'columbus': [
      "Columbus has so many different neighborhoods, each with its own vibe. How would you describe your emotional neighborhood right now?",
      "Columbus is growing and changing, just like we all do. What changes are you experiencing in your life currently?"
    ],
    'cincinnati': [
      "Cincinnati sits on seven hills - some ups and downs. How has your emotional landscape been lately?",
      "Cincinnati has both historic and modern sides. Are you feeling more connected to your past or focused on the future right now?"
    ],
    
    // Cultural references
    'buckeye': [
      "Buckeyes are known for bringing luck. What brings you a sense of comfort these days?",
      "Like the buckeye tradition, what personal traditions help keep you grounded?"
    ],
    'o-h-i-o': [
      "That chant creates such a sense of belonging. Where do you feel most like you belong these days?",
      "The O-H-I-O chant connects people. How connected have you been feeling to others recently?"
    ],
    'skyline chili': [
      "Skyline Chili can be divisive - some love it, some don't. What's something in your life that brings mixed feelings?",
      "Comfort foods like Skyline often connect us to memories. What helps you feel comforted when you're stressed?"
    ],
    'hocking hills': [
      "Hocking Hills offers such peaceful natural settings. Where do you find peace in your daily life?",
      "Many people go to Hocking Hills to disconnect and recharge. How do you recharge when life gets overwhelming?"
    ]
  };
  
  // Find matching reference
  for (const [key, questions] of Object.entries(mentalHealthMappings)) {
    if (reference.toLowerCase().includes(key)) {
      return questions[Math.floor(Math.random() * questions.length)];
    }
  }
  
  // Default refocusing question
  return "Speaking of Ohio, how have you been feeling lately while you're waiting to see Dr. Eric?";
};

/**
 * Determines if the conversation is with a child based on context clues
 * @param userInput User's message
 * @returns Boolean indicating if the user appears to be a child
 */
export const detectChildPatient = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for child-like language patterns
  const childPatterns = [
    /my mom|my dad/i,
    /school|homework|teacher/i,
    /play|game|toy/i,
    /\bcool\b|\bawesome\b|\bfun\b/i,
    /cartoon|pokemon|minecraft|fortnite|roblox/i
  ];
  
  // Calculate how many child patterns appear in the input
  const matchCount = childPatterns.filter(pattern => pattern.test(lowerInput)).length;
  
  // If at least two patterns match, consider this likely a child
  return matchCount >= 2;
};

/**
 * Determines if the conversation is with a newcomer/immigrant based on context clues
 * @param userInput User's message
 * @returns Boolean indicating if the user appears to be a newcomer
 */
export const detectNewcomerPatient = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for newcomer/immigrant context clues
  const newcomerPatterns = [
    /new (to|in) (cleveland|ohio|america|usa|united states)/i,
    /moved (here|to cleveland|to ohio|to america)/i,
    /refugee|immigrant|newcomer/i,
    /learning english|english class|esl/i,
    /my (home|old) country|my culture/i,
    /in my country/i
  ];
  
  // If any pattern matches, consider this likely a newcomer
  return newcomerPatterns.some(pattern => pattern.test(lowerInput));
};
