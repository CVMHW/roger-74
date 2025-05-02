
/**
 * Comprehensive database of sports teams for reference in conversations
 * Organized by sport and region for easy lookup
 */

export interface SportsTeam {
  name: string;
  aliases: string[];
  league: string;
  sport: string;
  region: string;
  championships?: number;
  notes?: string;
}

// American sports teams grouped by sport
export const americanSportsTeams: Record<string, SportsTeam[]> = {
  nfl: [
    {
      name: "Cleveland Browns",
      aliases: ["Browns", "The Browns", "Cleveland", "Brownies"],
      league: "NFL",
      sport: "American Football",
      region: "Cleveland, Ohio",
      championships: 0,
      notes: "Historic franchise with passionate fanbase in Cleveland"
    },
    {
      name: "Baltimore Ravens",
      aliases: ["Ravens", "The Ravens"],
      league: "NFL",
      sport: "American Football",
      region: "Baltimore, Maryland",
      championships: 2,
      notes: "Originated from the Cleveland Browns franchise move in 1996"
    },
    {
      name: "Dallas Cowboys",
      aliases: ["Cowboys", "America's Team"],
      league: "NFL",
      sport: "American Football",
      region: "Dallas, Texas",
      championships: 5,
      notes: "Most valuable sports franchise globally ($10.32B)"
    },
    {
      name: "Pittsburgh Steelers",
      aliases: ["Steelers", "The Steelers"],
      league: "NFL", 
      sport: "American Football",
      region: "Pittsburgh, Pennsylvania",
      championships: 6,
      notes: "Historic rival of the Cleveland Browns"
    },
    {
      name: "Cincinnati Bengals",
      aliases: ["Bengals", "The Bengals"],
      league: "NFL",
      sport: "American Football",
      region: "Cincinnati, Ohio",
      championships: 0,
      notes: "Ohio rival of the Cleveland Browns"
    },
    {
      name: "New England Patriots",
      aliases: ["Patriots", "The Patriots", "Pats"],
      league: "NFL",
      sport: "American Football",
      region: "Boston, Massachusetts",
      championships: 6,
      notes: "Dynasty team with Tom Brady era dominance"
    },
    {
      name: "Green Bay Packers",
      aliases: ["Packers", "The Packers"],
      league: "NFL",
      sport: "American Football",
      region: "Green Bay, Wisconsin",
      championships: 4,
      notes: "Unique community-owned model with passionate fanbase"
    },
    {
      name: "San Francisco 49ers",
      aliases: ["49ers", "Niners"],
      league: "NFL",
      sport: "American Football",
      region: "San Francisco, California",
      championships: 5,
      notes: "Historic success with Joe Montana and Steve Young"
    }
  ],
  nba: [
    {
      name: "Cleveland Cavaliers",
      aliases: ["Cavs", "The Cavs", "Cleveland", "Cavaliers"],
      league: "NBA",
      sport: "Basketball",
      region: "Cleveland, Ohio",
      championships: 1,
      notes: "Won NBA championship in 2016 with LeBron James"
    },
    {
      name: "Golden State Warriors",
      aliases: ["Warriors", "The Warriors", "Dubs"],
      league: "NBA",
      sport: "Basketball",
      region: "San Francisco, California",
      championships: 7,
      notes: "Valued at $9.14B, recent NBA dynasty with Stephen Curry"
    },
    {
      name: "Los Angeles Lakers",
      aliases: ["Lakers", "The Lakers", "LA Lakers"],
      league: "NBA",
      sport: "Basketball",
      region: "Los Angeles, California",
      championships: 17,
      notes: "$8.07B valuation, tied for most NBA titles"
    },
    {
      name: "Boston Celtics",
      aliases: ["Celtics", "The Celtics"],
      league: "NBA",
      sport: "Basketball",
      region: "Boston, Massachusetts",
      championships: 18,
      notes: "Historic franchise with most NBA championships"
    },
    {
      name: "New York Knicks",
      aliases: ["Knicks", "The Knicks"],
      league: "NBA",
      sport: "Basketball",
      region: "New York, New York",
      championships: 2,
      notes: "Valued at $8.3B, iconic in basketball's biggest market"
    },
    {
      name: "Chicago Bulls",
      aliases: ["Bulls", "The Bulls"],
      league: "NBA",
      sport: "Basketball",
      region: "Chicago, Illinois",
      championships: 6,
      notes: "Michael Jordan dynasty of the 1990s"
    }
  ],
  mlb: [
    {
      name: "Cleveland Guardians",
      aliases: ["Guardians", "The Guardians", "Cleveland"],
      league: "MLB",
      sport: "Baseball",
      region: "Cleveland, Ohio",
      championships: 2,
      notes: "Formerly known as the Cleveland Indians until 2021"
    },
    {
      name: "Cleveland Indians",
      aliases: ["Indians", "The Indians", "The Tribe"],
      league: "MLB",
      sport: "Baseball",
      region: "Cleveland, Ohio",
      championships: 2,
      notes: "Former name of the Cleveland Guardians (1915-2021)"
    },
    {
      name: "New York Yankees",
      aliases: ["Yankees", "The Yankees", "The Bronx Bombers"],
      league: "MLB",
      sport: "Baseball",
      region: "New York, New York",
      championships: 27,
      notes: "$7.93B valuation, most World Series titles"
    },
    {
      name: "Chicago Cubs",
      aliases: ["Cubs", "The Cubs", "Cubbies"],
      league: "MLB",
      sport: "Baseball",
      region: "Chicago, Illinois",
      championships: 3,
      notes: "Historic franchise with passionate fanbase"
    },
    {
      name: "Boston Red Sox",
      aliases: ["Red Sox", "The Red Sox"],
      league: "MLB",
      sport: "Baseball",
      region: "Boston, Massachusetts",
      championships: 9,
      notes: "Broke 86-year curse in 2004, historic Yankee rivalry"
    },
    {
      name: "Los Angeles Dodgers",
      aliases: ["Dodgers", "The Dodgers"],
      league: "MLB",
      sport: "Baseball",
      region: "Los Angeles, California",
      championships: 7,
      notes: "$4.8B valuation, strong West Coast fanbase"
    }
  ],
  nhl: [
    {
      name: "Montreal Canadiens",
      aliases: ["Canadiens", "The Canadiens", "Habs"],
      league: "NHL",
      sport: "Hockey",
      region: "Montreal, Quebec",
      championships: 24,
      notes: "Most Stanley Cups in NHL history"
    },
    {
      name: "Toronto Maple Leafs",
      aliases: ["Maple Leafs", "The Leafs"],
      league: "NHL",
      sport: "Hockey",
      region: "Toronto, Ontario",
      championships: 13,
      notes: "Historic Canadian franchise with passionate fanbase"
    },
    {
      name: "Detroit Red Wings",
      aliases: ["Red Wings", "The Wings"],
      league: "NHL",
      sport: "Hockey",
      region: "Detroit, Michigan",
      championships: 11,
      notes: "Historic 'Original Six' NHL franchise"
    }
  ],
  soccer: [
    {
      name: "Manchester United",
      aliases: ["Man United", "United", "Red Devils"],
      league: "Premier League",
      sport: "Soccer",
      region: "Manchester, England",
      championships: 20,
      notes: "English record 20 league titles, global fanbase"
    },
    {
      name: "Real Madrid",
      aliases: ["Madrid", "Los Blancos"],
      league: "La Liga",
      sport: "Soccer",
      region: "Madrid, Spain",
      championships: 35,
      notes: "14 UEFA Champions League titles, most in Europe"
    },
    {
      name: "FC Barcelona",
      aliases: ["Barca", "Blaugrana"],
      league: "La Liga",
      sport: "Soccer",
      region: "Barcelona, Spain",
      championships: 26,
      notes: "5 Champions League titles, 270M+ followers globally"
    }
  ]
};

// Function to find team by name or alias
export const findTeam = (nameOrAlias: string): SportsTeam | undefined => {
  const lowerCaseInput = nameOrAlias.toLowerCase();
  
  // Search through all sports categories
  for (const sport in americanSportsTeams) {
    const teams = americanSportsTeams[sport];
    
    // Check each team name and aliases
    for (const team of teams) {
      if (team.name.toLowerCase() === lowerCaseInput) {
        return team;
      }
      
      // Check aliases
      const matchingAlias = team.aliases.find(
        alias => alias.toLowerCase() === lowerCaseInput
      );
      
      if (matchingAlias) {
        return team;
      }
    }
  }
  
  return undefined;
};

// Function to get all team names and aliases as an array for quick lookups
export const getAllTeamNamesAndAliases = (): string[] => {
  const allNamesAndAliases: string[] = [];
  
  for (const sport in americanSportsTeams) {
    const teams = americanSportsTeams[sport];
    
    for (const team of teams) {
      allNamesAndAliases.push(team.name.toLowerCase());
      team.aliases.forEach(alias => {
        allNamesAndAliases.push(alias.toLowerCase());
      });
    }
  }
  
  return allNamesAndAliases;
};

// Get a list of rival pairs for common matchups
export const getRivalPairs = (): [string, string][] => {
  return [
    ["Cleveland Browns", "Pittsburgh Steelers"],
    ["Cleveland Browns", "Baltimore Ravens"],
    ["Cleveland Browns", "Cincinnati Bengals"],
    ["Cleveland Cavaliers", "Golden State Warriors"],
    ["Cleveland Guardians", "New York Yankees"],
    ["Cleveland Guardians", "Chicago Cubs"],
    ["Boston Red Sox", "New York Yankees"],
    ["Los Angeles Lakers", "Boston Celtics"],
    ["Manchester United", "Liverpool FC"],
    ["Real Madrid", "FC Barcelona"]
  ];
};

// New function to identify sports content in text
export const identifySportsContent = (text: string): {
  hasSportsContent: boolean;
  mentionedTeams: SportsTeam[];
  rivalryContext: boolean;
  mentionedLeagues: string[];
} => {
  const lowerText = text.toLowerCase();
  const mentionedTeams: SportsTeam[] = [];
  const mentionedLeagues = new Set<string>();
  let rivalryContext = false;
  
  // Check for sports leagues
  const leagues = ["nfl", "nba", "mlb", "nhl", "premier league", "la liga", "bundesliga"];
  leagues.forEach(league => {
    if (lowerText.includes(league.toLowerCase())) {
      mentionedLeagues.add(league.toUpperCase());
    }
  });
  
  // Check for specific sport names
  const sports = ["football", "basketball", "baseball", "hockey", "soccer"];
  sports.forEach(sport => {
    if (lowerText.includes(sport.toLowerCase())) {
      mentionedLeagues.add(sport.toUpperCase());
    }
  });
  
  // Check for team mentions
  const allTeamNames = getAllTeamNamesAndAliases();
  const matchingTeamNames = allTeamNames.filter(team => lowerText.includes(team));
  
  matchingTeamNames.forEach(matchedName => {
    const team = findTeam(matchedName);
    if (team && !mentionedTeams.some(t => t.name === team.name)) {
      mentionedTeams.push(team);
      mentionedLeagues.add(team.league);
    }
  });
  
  // Check for rivalry context
  const rivalPairs = getRivalPairs();
  for (const [team1, team2] of rivalPairs) {
    const hasTeam1 = mentionedTeams.some(t => t.name === team1);
    const hasTeam2 = mentionedTeams.some(t => t.name === team2);
    
    if (hasTeam1 && hasTeam2) {
      rivalryContext = true;
      break;
    }
  }
  
  return {
    hasSportsContent: mentionedTeams.length > 0 || mentionedLeagues.size > 0,
    mentionedTeams,
    rivalryContext,
    mentionedLeagues: Array.from(mentionedLeagues)
  };
};

