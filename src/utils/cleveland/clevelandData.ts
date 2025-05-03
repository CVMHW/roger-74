
/**
 * Cleveland Data Repository
 * 
 * Contains structured Cleveland-specific information about restaurants,
 * sports, landmarks, and other local knowledge important to Roger's identity.
 */

// Define Cleveland data types
export interface ClevelandPlace {
  name: string;
  area: string;
  description: string;
  category: 'restaurant' | 'bar' | 'landmark' | 'entertainment' | 'sports' | 'park';
  keywords: string[];
}

export interface ClevelandSportsFact {
  team: 'Browns' | 'Cavaliers' | 'Cavs' | 'Guardians' | 'Indians' | 'Monsters' | 'general';
  fact: string;
  isHistorical: boolean;
  year?: number;
  keywords: string[];
}

export interface ClevelandTourismFact {
  location: string;
  fact: string;
  category: 'museum' | 'park' | 'landmark' | 'event' | 'neighborhood' | 'attraction';
  keywords: string[];
}

export interface ClevelandData {
  places: ClevelandPlace[];
  sportsFacts: ClevelandSportsFact[];
  tourismFacts: ClevelandTourismFact[];
  smallTalkTopics: string[];
  recentSportsUpdates: {
    cavs: string[];
    browns: string[];
    guardians: string[];
    lastUpdated: Date;
  };
}

// Initialize Cleveland data repository
let clevelandData: ClevelandData = {
  places: [],
  sportsFacts: [],
  tourismFacts: [],
  smallTalkTopics: [],
  recentSportsUpdates: {
    cavs: [],
    browns: [],
    guardians: [],
    lastUpdated: new Date()
  }
};

/**
 * Load Cleveland data into memory
 */
export const loadClevelandData = (): void => {
  // Popular restaurants and bars
  clevelandData.places = [
    {
      name: "Lola Bistro",
      area: "Downtown Cleveland",
      description: "Michael Symon's modern American cuisine flagship",
      category: "restaurant",
      keywords: ["lola", "symon", "downtown", "fine dining", "american"]
    },
    {
      name: "Great Lakes Brewing Company",
      area: "Ohio City",
      description: "Craft beers and pub fare staple",
      category: "bar",
      keywords: ["great lakes", "beer", "brewery", "ohio city", "pub"]
    },
    {
      name: "Mabel's BBQ",
      area: "Downtown Cleveland",
      description: "Michael Symon's Cleveland-style barbecue",
      category: "restaurant",
      keywords: ["mabels", "bbq", "barbecue", "downtown", "symon"]
    },
    {
      name: "Barrio",
      area: "Tremont",
      description: "Popular tacos with multiple locations",
      category: "restaurant",
      keywords: ["barrio", "tacos", "mexican", "tremont"]
    },
    {
      name: "TownHall",
      area: "Ohio City",
      description: "Health-conscious dining with an extensive beer list",
      category: "restaurant",
      keywords: ["townhall", "ohio city", "healthy", "vegan", "beer"]
    },
    {
      name: "Velvet Tango Room",
      area: "Tremont", 
      description: "Elegant craft cocktails",
      category: "bar",
      keywords: ["velvet", "tango", "cocktails", "tremont", "upscale"]
    },
    {
      name: "Sokolowski's University Inn",
      area: "Tremont",
      description: "Historic Polish dining since 1923",
      category: "restaurant",
      keywords: ["sokolowski", "polish", "tremont", "traditional"]
    }
  ];
  
  // Sports facts
  clevelandData.sportsFacts = [
    {
      team: "Cavaliers",
      fact: "Won their first NBA championship in 2016, led by LeBron James",
      isHistorical: true,
      year: 2016,
      keywords: ["championship", "lebron", "2016", "nba", "finals"]
    },
    {
      team: "Browns",
      fact: "Founded in 1946, won four NFL championships before the Super Bowl era",
      isHistorical: true,
      year: 1964,
      keywords: ["championship", "nfl", "history", "football"]
    },
    {
      team: "Guardians",
      fact: "Changed their name from Indians to Guardians in 2021",
      isHistorical: true,
      year: 2021,
      keywords: ["name change", "indians", "baseball", "mlb"]
    },
    {
      team: "Browns",
      fact: "Play at FirstEnergy Stadium on the shores of Lake Erie",
      isHistorical: false,
      keywords: ["stadium", "lake erie", "firstenergy"]
    },
    {
      team: "Cavaliers",
      fact: "Play at Rocket Mortgage FieldHouse in downtown Cleveland",
      isHistorical: false,
      keywords: ["arena", "rocket mortgage", "downtown", "fieldhouse"]
    },
    {
      team: "Guardians",
      fact: "Play at Progressive Field in downtown Cleveland",
      isHistorical: false,
      keywords: ["stadium", "progressive field", "ballpark", "downtown"]
    }
  ];
  
  // Tourism facts
  clevelandData.tourismFacts = [
    {
      location: "Rock and Roll Hall of Fame",
      fact: "Iconic museum celebrating rock music history, designed by I.M. Pei",
      category: "museum",
      keywords: ["rock", "music", "museum", "downtown", "tourist"]
    },
    {
      location: "Cleveland Museum of Art",
      fact: "World-renowned art museum with free general admission",
      category: "museum",
      keywords: ["art", "museum", "university circle", "free"]
    },
    {
      location: "West Side Market",
      fact: "Historic public market with over 100 vendors since 1912",
      category: "landmark",
      keywords: ["market", "food", "ohio city", "historic", "shopping"]
    },
    {
      location: "Cleveland Metroparks",
      fact: "Extensive park system known as the 'Emerald Necklace' with over 23,000 acres",
      category: "park",
      keywords: ["parks", "emerald necklace", "nature", "outdoors"]
    },
    {
      location: "Playhouse Square",
      fact: "Second largest performing arts center in the US after NYC",
      category: "entertainment",
      keywords: ["theater", "theatre", "broadway", "downtown", "arts"]
    }
  ];
  
  // Small talk topics
  clevelandData.smallTalkTopics = [
    "How about those Browns this season?",
    "Have you checked out any new restaurants in Ohio City lately?",
    "What do you think about the weather we've been having?",
    "Did you catch the Guardians game last night?",
    "The Metroparks are looking beautiful this time of year",
    "Have you been to the Rock Hall recently?",
    "That lake effect snow hit us pretty hard last week",
    "Cleveland Orchestra has an amazing program this season",
    "The West Side Market was packed last weekend",
    "How's the traffic on the Shoreway been with the construction?"
  ];
  
  // Recent sports updates (as of May 3, 2025)
  clevelandData.recentSportsUpdates = {
    cavs: [
      "Cavaliers are excelling with a 64-18 regular season record",
      "Swept the Miami Heat 4-0 in the first round of playoffs",
      "Darius Garland is leading scorer in playoffs at 24.0 PPG",
      "Donovan Mitchell averaging 23.8 points in playoff games",
      "Team considered strong championship contenders"
    ],
    browns: [
      "Browns finished the 2024 season with a 3-14 record",
      "Currently rebuilding for the 2025 season",
      "Looking to address quarterback needs in the draft",
      "Training camp starts in July 2025",
      "New defensive coordinator brought in to improve team"
    ],
    guardians: [
      "Currently 19-14, second in AL Central",
      "Steven Kwan leading hitter with .328 batting average",
      "Ben Lively is top starter with 3.72 ERA",
      "Hit 38 home runs in first 33 games of the season",
      "2 games behind Detroit in division race"
    ],
    lastUpdated: new Date('2025-05-03')
  };
};

/**
 * Get all Cleveland data
 */
export const getClevelandData = (): ClevelandData => {
  return clevelandData;
};

/**
 * Get specific Cleveland place information
 */
export const getClevelandPlace = (nameOrKeyword: string): ClevelandPlace | undefined => {
  const normalizedSearch = nameOrKeyword.toLowerCase();
  
  return clevelandData.places.find(place => 
    place.name.toLowerCase().includes(normalizedSearch) || 
    place.keywords.some(keyword => keyword.toLowerCase().includes(normalizedSearch))
  );
};

/**
 * Get sports facts based on team or keyword
 */
export const getSportsFacts = (teamOrKeyword: string): ClevelandSportsFact[] => {
  const normalizedSearch = teamOrKeyword.toLowerCase();
  
  return clevelandData.sportsFacts.filter(fact => 
    fact.team.toLowerCase().includes(normalizedSearch) || 
    fact.keywords.some(keyword => keyword.toLowerCase().includes(normalizedSearch))
  );
};

/**
 * Get tourism information based on location or keyword
 */
export const getTourismInfo = (locationOrKeyword: string): ClevelandTourismFact[] => {
  const normalizedSearch = locationOrKeyword.toLowerCase();
  
  return clevelandData.tourismFacts.filter(info => 
    info.location.toLowerCase().includes(normalizedSearch) || 
    info.keywords.some(keyword => keyword.toLowerCase().includes(normalizedSearch))
  );
};

/**
 * Get recent sports updates
 */
export const getRecentSportsUpdates = (team?: 'cavs' | 'browns' | 'guardians'): string[] => {
  if (team) {
    return clevelandData.recentSportsUpdates[team];
  }
  
  // Return all updates if no team specified
  return [
    ...clevelandData.recentSportsUpdates.cavs,
    ...clevelandData.recentSportsUpdates.browns,
    ...clevelandData.recentSportsUpdates.guardians
  ];
};

/**
 * Get random small talk topic
 */
export const getRandomSmallTalkTopic = (): string => {
  const topics = clevelandData.smallTalkTopics;
  return topics[Math.floor(Math.random() * topics.length)];
};
