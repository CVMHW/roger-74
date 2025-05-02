
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

/**
 * Detects Ohio-specific references in user input
 * @param input User's message
 * @returns Object containing detected references and their context
 */
export const detectOhioReferences = (input: string): {
  hasOhioReference: boolean;
  detectedLocations: string[];
  detectedCulturalReferences: string[];
  emotionalAssociations: string[];
} => {
  const lowerInput = input.toLowerCase();
  const result = {
    hasOhioReference: false,
    detectedLocations: [] as string[],
    detectedCulturalReferences: [] as string[],
    emotionalAssociations: [] as string[]
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
  
  // Handle location-specific responses
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
  
  // Handle cultural reference responses
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
