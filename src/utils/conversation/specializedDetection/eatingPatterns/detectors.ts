
/**
 * Detectors for eating disorder concerns and food-related conversations
 */

import { EatingDisorderConcernResult, FoodSmallTalkResult, RiskLevel } from './types';

// Phrases that might indicate eating disorder concerns
const eatingDisorderPhrases = [
  // Body image concerns
  /hate my body|disgusting body|too fat|feel fat|look fat|am fat|getting fat|gained weight/i,
  /ugly body|gross body|weight gain|gained pounds|body (shame|hatred|disgust)/i,
  
  // Specific eating disorder behaviors
  /purge|purging|making myself throw up|throw up after|vomit after/i,
  /binge|binged|ate too much|overate|lost control eating|couldn't stop eating/i,
  /starv(e|ing)|restrict(ing)?|not eating|skipping meals|fasting|diet(ing)?/i,
  /count(ing)? calories|tracking calories|calorie deficit|low calorie/i,
  
  // Exercise and compensation
  /exercise to (burn|compensate|make up for)|punish with exercise/i,
  /over-exercis(e|ing)|compulsive exercise|have to exercise|must exercise/i,
  
  // Cognitive patterns
  /(fear|afraid) of (gaining weight|getting fat|being fat)/i,
  /food (rules|rituals|obsession|preoccupation|anxiety)/i,
  
  // Medical complications
  /passing out|fainting|dizz(y|iness) from not eating|heart problems/i,
  /low weight|underweight|anorexic|bulimic|binge eating/i
];

// Context markers that increase likelihood of eating disorder concerns
const contextMarkers = [
  /body image|self-esteem|worth|value|appearance|shape|size/i,
  /weight (control|management|loss|gain|obsession)/i,
  /meal (planning|skipping|anxiety)|food (fear|anxiety|worry)/i,
  /eating disorder|ED|ana|mia|recovery|relapse|treatment/i
];

// Cleveland-specific food topics for small talk detection
const clevelandFoodTopics = [
  /(Cleveland|Ohio) food|Polish boy|pierogi|corned beef|Slyman|Sokolowski/i,
  /Michael Symon|Mabel's BBQ|Great Lakes Brewing|Mitchell's Ice Cream/i,
  /West Side Market|East 4th|Barrio|Tommy's|Aladdin's|B Spot|Lucky's/i,
  /Little Italy|Tremont restaurant|Ohio City food|Flats food/i
];

// General food small talk topics
const generalFoodTopics = [
  /restaurant|dining|dinner|lunch|breakfast|brunch|meal|recipe/i,
  /cook(ing|ed)?|bak(e|ing|ed)?|food|dish|cuisine|menu|taste|flavor/i,
  /eat(ing)?|ate|hungry|delicious|yummy|tasty|craving|appetite/i,
  /pizza|burger|pasta|sandwich|salad|dessert|cake|ice cream/i
];

/**
 * Detects potential eating disorder concerns in user messages
 * with sophisticated pattern matching and context analysis
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderConcernResult => {
  const result: EatingDisorderConcernResult = {
    isEatingDisorderConcern: false,
    riskLevel: 'none',
    matchedPhrases: [],
    contextMarkers: [],
    isLikelySmallTalk: false
  };
  
  // Check for direct matches to eating disorder phrases
  for (const pattern of eatingDisorderPhrases) {
    const matches = userInput.match(pattern);
    if (matches) {
      result.isEatingDisorderConcern = true;
      result.matchedPhrases.push(matches[0]);
    }
  }
  
  // Check for context markers that indicate this might be about eating disorders
  for (const marker of contextMarkers) {
    const matches = userInput.match(marker);
    if (matches) {
      result.contextMarkers.push(matches[0]);
    }
  }
  
  // Determine if this is likely just small talk about food
  result.isLikelySmallTalk = (
    (generalFoodTopics.some(topic => topic.test(userInput)) || 
     clevelandFoodTopics.some(topic => topic.test(userInput))) &&
    result.matchedPhrases.length === 0 &&
    result.contextMarkers.length === 0 &&
    !/eating problem|food issue|eating issue|weight concern/i.test(userInput)
  );
  
  // Determine risk level based on matched phrases and context markers
  if (result.isEatingDisorderConcern) {
    if (
      result.matchedPhrases.length >= 3 || 
      /purge|starv|anorex|passing out|fainting/i.test(userInput)
    ) {
      result.riskLevel = 'high';
    } else if (
      result.matchedPhrases.length >= 2 ||
      result.contextMarkers.length >= 2 ||
      /restrict|binge|throw up after/i.test(userInput)
    ) {
      result.riskLevel = 'moderate';
    } else {
      result.riskLevel = 'low';
    }
  }
  
  return result;
};

/**
 * Detects if a message is just casual food small talk,
 * with special attention to Cleveland-specific food culture
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  const result: FoodSmallTalkResult = {
    isSmallTalk: false,
    topics: [],
    isClevelandSpecific: false
  };
  
  // Check for eating disorder concerns first
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && !edResult.isLikelySmallTalk) {
    // Not small talk if there are eating disorder concerns
    return result;
  }
  
  // Check for Cleveland-specific food topics
  for (const pattern of clevelandFoodTopics) {
    const matches = userInput.match(pattern);
    if (matches) {
      result.isSmallTalk = true;
      result.topics.push(matches[0]);
      result.isClevelandSpecific = true;
    }
  }
  
  // Also check for general food topics
  for (const pattern of generalFoodTopics) {
    const matches = userInput.match(pattern);
    if (matches) {
      // Only add if we don't already have this topic
      const topic = matches[0].toLowerCase();
      if (!result.topics.some(t => t.toLowerCase().includes(topic))) {
        result.isSmallTalk = true;
        result.topics.push(matches[0]);
      }
    }
  }
  
  // If this seems like food small talk and has no eating disorder markers,
  // categorize it as food small talk
  if (result.topics.length > 0 && edResult.matchedPhrases.length === 0) {
    result.isSmallTalk = true;
  }
  
  return result;
};
