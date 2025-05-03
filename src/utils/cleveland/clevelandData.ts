
/**
 * Cleveland Data
 * 
 * Core data structures for Cleveland-specific knowledge
 */

// Types for Cleveland places
export type PlaceType = 'restaurant' | 'bar' | 'brewery' | 'landmark' | 'park' | 'venue' | 'attraction';
export type PlaceArea = 'Downtown' | 'Ohio City' | 'Tremont' | 'Gordon Square' | 'The Flats' | 'University Circle' | 'Lakewood' | 'Cleveland Heights' | 'Shaker Heights' | 'Edgewater' | 'Little Italy' | 'Shaker Square';

// Place data structure
export interface ClevelandPlace {
  id: string;
  name: string;
  type: PlaceType;
  area: string;
  description: string;
  keywords?: string[];
}

// Sports fact structure
export interface SportsFact {
  id: string;
  team: string;
  sport: 'football' | 'basketball' | 'baseball' | 'hockey' | 'other';
  fact: string;
  keywords?: string[];
}

// Tourism information structure
export type TourismType = 'landmark' | 'park' | 'museum' | 'event' | 'neighborhood' | 'attraction';

export interface TourismInfo {
  id: string;
  location: string;
  type: TourismType;
  fact: string;
  keywords?: string[];
}

// Weather information
export interface WeatherFact {
  id: string;
  season: 'winter' | 'spring' | 'summer' | 'fall' | 'all';
  fact: string;
}

// Sports update structure
export interface SportsUpdate {
  team: string;
  date: string;
  update: string;
}

// Small talk topic structure
export interface SmallTalkTopic {
  topic: string;
  prompt: string;
}

// Complete Cleveland knowledge base
export interface ClevelandKnowledgeBase {
  places: ClevelandPlace[];
  sportsFacts: SportsFact[];
  tourismInfo: TourismInfo[];
  weatherFacts: WeatherFact[];
  sportsUpdates: SportsUpdate[];
  smallTalkTopics: SmallTalkTopic[];
  lastUpdated: number;
}

// Cleveland knowledge data store
let clevelandDataStore: ClevelandKnowledgeBase = {
  places: [
    {
      id: 'place_001',
      name: 'Great Lakes Brewing Company',
      type: 'brewery',
      area: 'Ohio City',
      description: 'craft beers and pub fare with a historic atmosphere',
      keywords: ['beer', 'brewery', 'food', 'ohio city', 'west side']
    },
    {
      id: 'place_002',
      name: 'West Side Market',
      type: 'landmark',
      area: 'Ohio City',
      description: 'historic public market with over 100 vendors',
      keywords: ['market', 'food', 'shopping', 'ohio city', 'historic']
    },
    {
      id: 'place_003',
      name: 'Lola Bistro',
      type: 'restaurant',
      area: 'Downtown',
      description: 'Michael Symon\'s flagship restaurant with modern American cuisine',
      keywords: ['fine dining', 'american', 'symon', 'downtown', 'upscale']
    },
    {
      id: 'place_004',
      name: 'Barrio',
      type: 'restaurant',
      area: 'Tremont',
      description: 'popular build-your-own tacos spot with multiple locations',
      keywords: ['mexican', 'tacos', 'casual', 'tremont', 'margaritas']
    },
    {
      id: 'place_005',
      name: 'The Velvet Tango Room',
      type: 'bar',
      area: 'Tremont',
      description: 'sophisticated cocktail lounge with live jazz',
      keywords: ['cocktails', 'jazz', 'upscale', 'tremont', 'drinks']
    }
  ],
  sportsFacts: [
    {
      id: 'sports_001',
      team: 'Cavaliers',
      sport: 'basketball',
      fact: 'won their first NBA championship in 2016 by coming back from a 3-1 deficit against the Warriors',
      keywords: ['cavs', 'basketball', 'championship', 'nba', 'lebron']
    },
    {
      id: 'sports_002',
      team: 'Browns',
      sport: 'football',
      fact: 'were founded in 1946 and named after their first head coach Paul Brown',
      keywords: ['browns', 'football', 'nfl', 'paul brown', 'history']
    },
    {
      id: 'sports_003',
      team: 'Guardians',
      sport: 'baseball',
      fact: 'changed their name from the Indians to the Guardians in 2022',
      keywords: ['guardians', 'indians', 'baseball', 'mlb', 'name change']
    }
  ],
  tourismInfo: [
    {
      id: 'tourism_001',
      location: 'Rock and Roll Hall of Fame',
      type: 'museum',
      fact: 'houses exhibits from the most influential rock and roll artists in history',
      keywords: ['rock', 'music', 'museum', 'downtown', 'tourist']
    },
    {
      id: 'tourism_002',
      location: 'Cleveland Museum of Art',
      type: 'museum',
      fact: 'offers free general admission and houses over 61,000 works of art',
      keywords: ['art', 'museum', 'university circle', 'free', 'culture']
    },
    {
      id: 'tourism_003',
      location: 'Edgewater Park',
      type: 'park',
      fact: 'features a beach on Lake Erie with skyline views of downtown Cleveland',
      keywords: ['beach', 'park', 'lake', 'outdoor', 'recreation']
    },
    {
      id: 'tourism_004',
      location: 'Playhouse Square',
      type: 'attraction',
      fact: 'is the largest performing arts center in the US outside of New York',
      keywords: ['theater', 'performance', 'downtown', 'arts', 'broadway']
    }
  ],
  weatherFacts: [
    {
      id: 'weather_001',
      season: 'winter',
      fact: 'Cleveland often experiences "lake effect snow" due to its location on Lake Erie'
    },
    {
      id: 'weather_002',
      season: 'summer',
      fact: 'Summers in Cleveland are generally warm and humid with temperatures typically in the 70s and 80s'
    },
    {
      id: 'weather_003',
      season: 'fall',
      fact: 'Fall in Cleveland features beautiful foliage changes, especially in the Metroparks'
    }
  ],
  sportsUpdates: [
    {
      team: 'cavaliers',
      date: '2025-05-01',
      update: 'The Cavs completed a first-round sweep against the Heat, winning Game 4 with a score of 128-110'
    },
    {
      team: 'cavaliers',
      date: '2025-04-27',
      update: 'Donovan Mitchell scored 32 points to lead the Cavs to a Game 3 victory against Miami'
    },
    {
      team: 'guardians',
      date: '2025-05-02',
      update: 'The Guardians won their third straight game, beating Detroit 5-2 with Steven Kwan going 3-for-4'
    },
    {
      team: 'browns',
      date: '2025-04-25',
      update: 'The Browns selected defensive end Marcus Williams with their first-round pick in the NFL Draft'
    }
  ],
  smallTalkTopics: [
    {
      topic: 'weather',
      prompt: "The lake effect weather in Cleveland can change so quickly - one minute it's sunny, the next it's snowing. How have you been handling our unpredictable weather lately?"
    },
    {
      topic: 'food',
      prompt: "I was just at the West Side Market this weekend picking up some pierogies. Do you have any favorite local food spots around Cleveland?"
    },
    {
      topic: 'sports',
      prompt: "The energy at Progressive Field during Guardians games is something special, especially when they're on a winning streak. Have you been following any of our Cleveland teams lately?"
    },
    {
      topic: 'neighborhoods',
      prompt: "I love how each Cleveland neighborhood has its own unique character. Ohio City has all the breweries, Tremont has great restaurants... Do you have a favorite area to spend time in?"
    }
  ],
  lastUpdated: Date.now()
};

/**
 * Load Cleveland data into memory
 */
export const loadClevelandData = (): boolean => {
  try {
    // If we're in a browser environment, try to load from localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem('clevelandData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Only use stored data if it's not too old (7 days)
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        if (parsedData.lastUpdated && Date.now() - parsedData.lastUpdated < maxAge) {
          clevelandDataStore = parsedData;
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error loading Cleveland data:", error);
    return false;
  }
};

/**
 * Get all Cleveland data
 */
export const getClevelandData = (): ClevelandKnowledgeBase => {
  return clevelandDataStore;
};

/**
 * Get recent sports updates for a specific team
 */
export const getRecentSportsUpdates = (team?: string): string[] => {
  const updates = clevelandDataStore.sportsUpdates;
  
  // If team is specified, filter by team
  const filteredUpdates = team 
    ? updates.filter(update => 
        team === 'cavs' ? update.team === 'cavaliers' : update.team === team
      )
    : updates;
  
  // Return the update strings
  return filteredUpdates.map(update => update.update);
};

/**
 * Get a random small talk topic about Cleveland
 */
export const getRandomSmallTalkTopic = (): string => {
  const topics = clevelandDataStore.smallTalkTopics;
  if (topics.length === 0) {
    return "Cleveland has such a rich cultural history. What's your experience been like living here?";
  }
  
  // Pick a random topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  return randomTopic.prompt;
};

/**
 * Find a Cleveland place by keyword
 */
export const getClevelandPlace = (keyword: string): ClevelandPlace | null => {
  const places = clevelandDataStore.places;
  
  // First look for direct matches in name or keywords
  const exactMatch = places.find(
    place => place.name.toLowerCase().includes(keyword.toLowerCase()) ||
           place.keywords?.some(k => k === keyword.toLowerCase())
  );
  
  if (exactMatch) return exactMatch;
  
  // Then look for partial matches
  const partialMatch = places.find(
    place => place.description.toLowerCase().includes(keyword.toLowerCase()) ||
           place.keywords?.some(k => k.includes(keyword.toLowerCase()))
  );
  
  return partialMatch || null;
};

/**
 * Get sports facts by team or keyword
 */
export const getSportsFacts = (keyword: string): SportsFact[] => {
  const facts = clevelandDataStore.sportsFacts;
  
  return facts.filter(
    fact => fact.team.toLowerCase().includes(keyword.toLowerCase()) ||
          fact.sport.toLowerCase().includes(keyword.toLowerCase()) ||
          fact.keywords?.some(k => k.includes(keyword.toLowerCase()))
  );
};

/**
 * Get tourism information by keyword
 */
export const getTourismInfo = (keyword: string): TourismInfo[] => {
  const info = clevelandDataStore.tourismInfo;
  
  return info.filter(
    item => item.location.toLowerCase().includes(keyword.toLowerCase()) ||
          item.type.toLowerCase().includes(keyword.toLowerCase()) ||
          item.keywords?.some(k => k.includes(keyword.toLowerCase()))
  );
};

/**
 * Get weather facts by season
 */
export const getWeatherFacts = (season?: 'winter' | 'spring' | 'summer' | 'fall'): WeatherFact[] => {
  const facts = clevelandDataStore.weatherFacts;
  
  if (!season) {
    return facts;
  }
  
  return facts.filter(
    fact => fact.season === season || fact.season === 'all'
  );
};

// Initialize with any stored data on module load
loadClevelandData();
