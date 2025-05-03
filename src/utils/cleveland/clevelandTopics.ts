
/**
 * Cleveland Topics
 * 
 * Contains topic detection and classification for Cleveland-related conversations.
 */

// Define topic categories
export type ClevelandTopicType = 
  | 'sports'
  | 'food'
  | 'neighborhoods'
  | 'weather'
  | 'attractions'
  | 'events'
  | 'traffic'
  | 'history'
  | 'general';

export interface ClevelandTopic {
  type: ClevelandTopicType;
  subtopic?: string;
  confidence: number;
  keywords: string[];
}

// Sports-related keywords
const sportsKeywords = [
  'browns', 'cavs', 'cavaliers', 'guardians', 'indians', 'monsters',
  'game', 'championship', 'stadium', 'arena', 'firstenergy', 'progressive field',
  'rocket mortgage', 'score', 'win', 'lose', 'playoff', 'draft',
  'lebron', 'baker', 'stefanski', 'coach', 'player', 'team',
  'nfl', 'nba', 'mlb'
];

// Food-related keywords
const foodKeywords = [
  'restaurant', 'food', 'eat', 'dinner', 'lunch', 'breakfast',
  'bar', 'brewery', 'beer', 'pierogi', 'polish', 'chef', 'symon',
  'lola', 'mabels', 'great lakes', 'market garden', 'barrio', 'tremont',
  'ohio city', 'west side market', 'slymans', 'sokolowski', 'mitchell'
];

// Neighborhood keywords
const neighborhoodKeywords = [
  'downtown', 'ohio city', 'tremont', 'university circle', 'little italy',
  'lakewood', 'shaker heights', 'cleveland heights', 'parma', 'euclid',
  'west side', 'east side', 'gordon square', 'collinwood', 'edgewater',
  'flats', 'warehouse district'
];

// Weather keywords
const weatherKeywords = [
  'weather', 'snow', 'rain', 'lake effect', 'cold', 'warm', 'hot',
  'temperature', 'forecast', 'storm', 'winter', 'summer', 'spring',
  'fall', 'wind', 'freezing', 'icy', 'humid', 'lake erie'
];

// Attractions keywords
const attractionsKeywords = [
  'rock hall', 'rock and roll', 'museum', 'art museum', 'science center',
  'metroparks', 'zoo', 'aquarium', 'botanical garden', 'west side market',
  'playhouse square', 'orchestra', 'severance', 'edgewater beach',
  'natural history', 'crawford', 'emerald necklace', 'cuyahoga valley'
];

// Events keywords
const eventsKeywords = [
  'concert', 'festival', 'show', 'play', 'theater', 'parade',
  'st patrick', 'air show', 'ingenuity', 'larchmere', 'parade', 'feast',
  'assumption', 'little italy', 'garlic', 'rib cook', 'oktoberfest'
];

// Traffic keywords
const trafficKeywords = [
  'traffic', 'construction', 'shoreway', 'i-90', 'i-480', 'i-71',
  'commute', 'road', 'highway', 'innerbelt', 'driving', 'detour',
  'rta', 'bus', 'transit', 'train', 'rapid', 'parking', 'bridge'
];

// History keywords
const historyKeywords = [
  'history', 'historical', 'cleveland clinic', 'terminal tower',
  'arcade', 'severance', 'playhouse', 'settlement', 'founder',
  'euclid avenue', 'millionaire row', 'moses cleveland', 'steel'
];

/**
 * Detect Cleveland topics in user message
 */
export const detectClevelandTopics = (userInput: string): ClevelandTopic[] => {
  const input = userInput.toLowerCase();
  const topics: ClevelandTopic[] = [];
  
  // Check input against each category
  const keywordCategories: [ClevelandTopicType, string[]][] = [
    ['sports', sportsKeywords],
    ['food', foodKeywords],
    ['neighborhoods', neighborhoodKeywords],
    ['weather', weatherKeywords],
    ['attractions', attractionsKeywords],
    ['events', eventsKeywords],
    ['traffic', trafficKeywords],
    ['history', historyKeywords]
  ];
  
  // Check for each category
  keywordCategories.forEach(([category, keywords]) => {
    // Find matching keywords
    const matchingKeywords = keywords.filter(keyword => input.includes(keyword));
    
    // If matches found, add topic
    if (matchingKeywords.length > 0) {
      const confidence = Math.min(0.3 + (matchingKeywords.length * 0.15), 1.0);
      topics.push({
        type: category,
        confidence,
        keywords: matchingKeywords
      });
      
      // Add subtopic for sports if possible
      if (category === 'sports') {
        // Detect specific team
        if (input.includes('browns') || input.includes('football')) {
          topics.push({
            type: 'sports',
            subtopic: 'browns',
            confidence: confidence + 0.1,
            keywords: matchingKeywords
          });
        }
        if (input.includes('cavs') || input.includes('cavaliers') || input.includes('basketball')) {
          topics.push({
            type: 'sports',
            subtopic: 'cavaliers',
            confidence: confidence + 0.1,
            keywords: matchingKeywords
          });
        }
        if (input.includes('guardians') || input.includes('indians') || input.includes('baseball')) {
          topics.push({
            type: 'sports',
            subtopic: 'guardians',
            confidence: confidence + 0.1,
            keywords: matchingKeywords
          });
        }
      }
    }
  });
  
  // Check for general Cleveland reference
  if (input.includes('cleveland') || input.includes('cle') || input.includes('the land')) {
    // Don't add a general topic if we have specific topics
    if (topics.length === 0) {
      topics.push({
        type: 'general',
        confidence: 0.7,
        keywords: ['cleveland']
      });
    }
  }
  
  // Sort by confidence
  return topics.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Get the most relevant Cleveland topic from user input
 */
export const getPrimaryClevelandTopic = (userInput: string): ClevelandTopic | null => {
  const topics = detectClevelandTopics(userInput);
  return topics.length > 0 ? topics[0] : null;
};

/**
 * Check if input has any Cleveland-related content
 */
export const hasClevelandContent = (userInput: string): boolean => {
  return detectClevelandTopics(userInput).length > 0;
};
