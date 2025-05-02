
/**
 * Utilities for detecting feelings in user messages
 */

import { FeelingCategory } from './reflectionTypes';
import { feelingCategories } from './feelingCategories';

/**
 * Identifies potential feelings in a user's message with enhanced context awareness
 * @param userMessage The user's message text
 * @returns Array of detected feelings
 */
export const identifyFeelings = (userMessage: string): FeelingCategory[] => {
  const lowerMessage = userMessage.toLowerCase();
  const detectedFeelings: FeelingCategory[] = [];
  
  // Enhanced detection with context awareness
  // Check for explicit mentions of emotions
  for (const [category, words] of Object.entries(feelingCategories)) {
    if (words.some(word => {
      // Check for exact word matches with word boundaries
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerMessage);
    })) {
      detectedFeelings.push(category as FeelingCategory);
    }
  }
  
  // Infer emotions from context if none were explicitly detected
  if (detectedFeelings.length === 0) {
    // Check for sad context
    if (lowerMessage.includes('miss') || 
        lowerMessage.includes('lost') || 
        lowerMessage.includes('gone') || 
        lowerMessage.includes('moving') || 
        lowerMessage.includes('leaving') ||
        lowerMessage.includes('away')) {
      detectedFeelings.push('sad');
    }
    
    // Check for anxious context
    if (lowerMessage.includes('worried about') || 
        lowerMessage.includes('not sure if') ||
        lowerMessage.includes('what if') ||
        lowerMessage.includes('might happen')) {
      detectedFeelings.push('anxious');
    }
    
    // Check for angry context
    if (lowerMessage.includes('unfair') || 
        lowerMessage.includes('shouldn\'t have') ||
        lowerMessage.includes('wrong') ||
        lowerMessage.includes('hate when')) {
      detectedFeelings.push('angry');
    }
    
    // Check for positive context
    if (lowerMessage.includes('great') || 
        lowerMessage.includes('wonderful') ||
        lowerMessage.includes('awesome') ||
        lowerMessage.includes('love it')) {
      detectedFeelings.push('happy');
    }
    
    // Enhanced sports context detection
    if ((lowerMessage.includes('team') || 
         lowerMessage.includes('game') || 
         lowerMessage.includes('play') || 
         lowerMessage.includes('season') ||
         lowerMessage.includes('browns') ||
         lowerMessage.includes('cavs') ||
         lowerMessage.includes('guardians') ||
         lowerMessage.includes('sport')) && 
        (lowerMessage.includes('lost') || 
         lowerMessage.includes('moving') || 
         lowerMessage.includes('bad') ||
         lowerMessage.includes('sad') ||
         lowerMessage.includes('disappointing'))) {
      detectedFeelings.push('sad');
    }
  }
  
  return detectedFeelings;
};

/**
 * Extracts specific contextual information from a message
 * @param userMessage The user's message
 * @returns Object with extracted contextual elements
 */
export const extractContextualElements = (userMessage: string) => {
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
    'ohio', 'cuyahoga', 'home', 'work', 'school', 'office', 'hospital'
  ];
  
  const foundLocations = locations.filter(location => lowerMessage.includes(location));
  
  // Extract time references
  const timeRegex = /\b(yesterday|today|tomorrow|last week|next week|soon|later|morning|evening|night|afternoon)\b/i;
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

