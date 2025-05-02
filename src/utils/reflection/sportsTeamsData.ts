
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
    ["Cleveland Guardians", "Chicago Cubs"]
  ];
};
