
/**
 * Context extraction utilities
 * Extracts contextual information from messages to enhance emotional understanding
 */

/**
 * Extracts specific contextual information from a message
 * @param userMessage The user's message
 * @returns Object with extracted contextual elements
 */
export const extractContextualElements = (userMessage: string) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return { sportTeams: [], locations: [], timeContext: null, relationshipContext: null };
  }
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Extract sports teams or specific entities
  const sportTeams = [
    'browns', 'cavaliers', 'cavs', 'guardians', 'indians', 'monsters', 'charge',
    'yankees', 'steelers', 'ravens', 'bengals', 'packers', 'chiefs', 'lakers',
    'warriors', 'celtics', 'heat', 'red sox', 'cubs', 'cardinals'
  ];
  
  const foundTeams = sportTeams.filter(team => lowerMessage.includes(team));
  
  // Extract locations
  const locations = [
    'cleveland', 'akron', 'baltimore', 'pittsburgh', 'cincinnati', 'columbus',
    'ohio', 'cuyahoga', 'home', 'work', 'school', 'office', 'hospital', 'outside'
  ];
  
  const foundLocations = locations.filter(location => lowerMessage.includes(location));
  
  // Extract time references
  const timeRegex = /\b(yesterday|today|tomorrow|last week|next week|soon|later|morning|evening|night|afternoon|days|weeks)\b/i;
  const timeMatches = userMessage.match(timeRegex);
  const timeContext = timeMatches ? timeMatches[0] : null;
  
  // Extract relationship references
  const relationshipRegex = /\b(father|mother|dad|mom|husband|wife|partner|boss|coworker|friend|daughter|son|child|children|colleague|team|coach)\b/i;
  const relationshipMatches = userMessage.match(relationshipRegex);
  const relationshipContext = relationshipMatches ? relationshipMatches[0] : null;
  
  return {
    sportTeams: foundTeams,
    locations: foundLocations,
    timeContext,
    relationshipContext
  };
};
