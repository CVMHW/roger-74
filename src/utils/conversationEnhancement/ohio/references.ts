
/**
 * Ohio References Model
 * 
 * Defines the data structure for Ohio-specific references detected in conversations.
 */

// Ohio reference categories for detection
export interface OhioReferences {
  hasOhioReference: boolean;
  detectedLocations: string[];
  detectedCulturalReferences: string[];
  detectedChildReferences: string[];
  detectedNewcomerReferences: string[];
}

// Response strategy for Ohio context
export interface OhioContextStrategy {
  opener: string;
  shouldIncludeLocalReference: boolean;
  shouldIncludeMentalHealthConnection: boolean;
}

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
