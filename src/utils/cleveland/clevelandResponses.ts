
/**
 * Cleveland Response Generator
 * 
 * Functions for generating Cleveland-specific content in Roger's responses
 */

import {
  getClevelandData,
  getRandomSmallTalkTopic,
  getRecentSportsUpdates
} from './clevelandData';
import { ClevelandTopic } from './clevelandTopics';
import { detectNeedForSportsUpdates } from './clevelandDetectors';
import { findClevelandMemories } from './clevelandMemory';

/**
 * Generate a Cleveland-specific response based on detected topics
 */
export const generateClevelandResponse = (
  userInput: string,
  topics: ClevelandTopic[]
): string => {
  // If no topics, return generic Cleveland response
  if (topics.length === 0) {
    return getGenericClevelandResponse();
  }
  
  // Get primary topic
  const primaryTopic = topics[0];
  
  // Generate response based on topic type
  switch (primaryTopic.type) {
    case 'sports':
      return generateSportsResponse(userInput, primaryTopic);
    
    case 'food':
      return generateFoodResponse(primaryTopic);
    
    case 'neighborhoods':
      return generateNeighborhoodResponse(primaryTopic);
    
    case 'weather':
      return generateWeatherResponse();
    
    case 'attractions':
      return generateAttractionsResponse(primaryTopic);
    
    default:
      return getGenericClevelandResponse();
  }
};

/**
 * Generate a response about Cleveland sports
 */
const generateSportsResponse = (userInput: string, topic: ClevelandTopic): string => {
  // Check if we need recent updates
  const updateCheck = detectNeedForSportsUpdates(userInput);
  
  if (updateCheck.needsUpdate) {
    const updates = getRecentSportsUpdates(updateCheck.team);
    if (updates.length > 0) {
      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      return `As a Clevelander, I keep up with our sports teams. ${randomUpdate}. What are your thoughts on the team this season?`;
    }
  }
  
  // If no specific team or no updates needed, give general response
  if (topic.subtopic === 'browns') {
    return "I've been a Browns fan my whole life in Cleveland. We've had our ups and downs, but there's nothing like the energy at FirstEnergy Stadium on game day. Are you a Browns fan too?";
  } else if (topic.subtopic === 'cavaliers') {
    return "The Cavs championship in 2016 was one of the best moments for Cleveland sports. I still remember watching that Game 7 against Golden State. Do you follow the Cavaliers?";
  } else if (topic.subtopic === 'guardians') {
    return "Progressive Field is such a great place to watch the Guardians play. I've been to quite a few games there over the years. Do you get out to the ballpark often?";
  }
  
  // General sports response
  return "Being from Cleveland, I've always been passionate about our sports teams - the Browns, Cavs, and Guardians all have such dedicated fans here. Do you follow any Cleveland sports?";
};

/**
 * Generate a response about Cleveland food
 */
const generateFoodResponse = (topic: ClevelandTopic): string => {
  const clevelandData = getClevelandData();
  
  // Find relevant places based on keywords
  const relevantPlaces = clevelandData.places.filter(place => 
    topic.keywords.some(keyword => 
      place.name.toLowerCase().includes(keyword) || 
      place.area.toLowerCase().includes(keyword) || 
      place.keywords.includes(keyword)
    )
  );
  
  if (relevantPlaces.length > 0) {
    const place = relevantPlaces[Math.floor(Math.random() * relevantPlaces.length)];
    return `${place.name} in ${place.area} is fantastic - ${place.description}. I've enjoyed going there. Do you have any favorite places to eat in Cleveland?`;
  }
  
  // Generic food response
  return "Cleveland has such an amazing food scene. From pierogies to Polish Boy sandwiches to Michael Symon's restaurants, there's something for everyone. Have you tried any local specialties?";
};

/**
 * Generate a response about Cleveland neighborhoods
 */
const generateNeighborhoodResponse = (topic: ClevelandTopic): string => {
  // Find the neighborhood keyword
  const neighborhoodKeyword = topic.keywords.find(k => 
    ['downtown', 'ohio city', 'tremont', 'university circle', 'little italy', 
     'lakewood', 'cleveland heights', 'shaker heights', 'west side', 'east side'].includes(k)
  );
  
  if (neighborhoodKeyword) {
    switch (neighborhoodKeyword) {
      case 'downtown':
        return "Downtown Cleveland has changed so much in recent years. Between the restaurants, sports venues, and the waterfront, there's always something happening. What brings you downtown?";
      
      case 'ohio city':
        return "Ohio City is one of my favorite neighborhoods with West Side Market and all the great breweries. Great Lakes Brewing Company is a Cleveland institution. Do you spend much time in that area?";
      
      case 'tremont':
        return "Tremont has such great character with its art galleries, restaurants, and historic churches. The views of downtown from there are incredible too. Have you been to any restaurants in Tremont?";
      
      case 'university circle':
        return "University Circle packs so much culture into one area - the art museum, Severance Hall, the botanical garden. I love spending time there. What's your favorite spot in that area?";
      
      default:
        return `${neighborhoodKeyword.charAt(0).toUpperCase() + neighborhoodKeyword.slice(1)} has its own unique character. That's what I love about Cleveland - all the different neighborhoods have their own feel. Do you spend much time there?`;
    }
  }
  
  // Generic neighborhood response
  return "From Ohio City to Tremont to University Circle, Cleveland neighborhoods each have their own unique character. I've lived on the near west side most of my life. Which part of town are you from?";
};

/**
 * Generate a response about Cleveland weather
 */
const generateWeatherResponse = (): string => {
  // Use current date to determine season response
  const now = new Date();
  const month = now.getMonth();
  
  // Seasonal weather responses
  if (month >= 0 && month <= 2) { // Winter (Jan-Mar)
    return "Cleveland winters can be tough with the lake effect snow, but there's something beautiful about the city covered in white. How are you handling the winter?";
  } else if (month >= 3 && month <= 5) { // Spring (Apr-Jun)
    return "Spring in Cleveland is always a welcome change after winter. The Metroparks really come alive this time of year. Are you getting out to enjoy it?";
  } else if (month >= 6 && month <= 8) { // Summer (Jul-Sep)
    return "Summer by Lake Erie is hard to beat - Edgewater Beach, outdoor concerts, Indians games. Cleveland really makes the most of the warm months. What do you enjoy doing during Cleveland summers?";
  } else { // Fall (Oct-Dec)
    return "Fall in Cleveland is something special with the changing colors in the Metroparks. It's my favorite season here. Do you enjoy the autumn in Northeast Ohio?";
  }
};

/**
 * Generate a response about Cleveland attractions
 */
const generateAttractionsResponse = (topic: ClevelandTopic): string => {
  const attractionKeyword = topic.keywords.find(k => 
    ['rock hall', 'museum', 'zoo', 'park', 'garden', 'market', 'aquarium', 'playhouse'].includes(k)
  );
  
  if (attractionKeyword) {
    switch (attractionKeyword) {
      case 'rock hall':
        return "The Rock and Roll Hall of Fame is such an iconic Cleveland landmark. I've been there several times and always discover something new. Have you visited recently?";
      
      case 'museum':
        return "Cleveland's museums are world-class. The Art Museum with its free admission is one of my favorite places to spend an afternoon. Which museums have you checked out?";
      
      case 'park':
      case 'garden':
        return "The Cleveland Metroparks system is amazing - over 23,000 acres of nature right in and around the city. I try to get out hiking there when I can. Do you have a favorite park?";
      
      case 'market':
        return "West Side Market is such a Cleveland institution. I love browsing all the vendors and picking up fresh ingredients. It's been operating since 1912. Do you shop there?";
      
      default:
        return `Cleveland has so much to offer with attractions like ${attractionKeyword}. There's always something to explore here. Have you checked out many of the local attractions?`;
    }
  }
  
  // Generic attractions response
  return "From the Rock Hall to the Art Museum to Playhouse Square, Cleveland has so many great cultural attractions. I feel fortunate to have access to all this in our city. What are your favorite spots to visit?";
};

/**
 * Get a generic Cleveland response
 */
const getGenericClevelandResponse = (): string => {
  const responses = [
    "Being from Cleveland has really shaped who I am. There's a resilience and authenticity to this city that I connect with.",
    "I've lived in Cleveland my whole life. Despite what some outsiders might think, it's a city with so much to offer.",
    "Cleveland has changed so much over the years. The downtown renaissance has been amazing to witness.",
    "Living in Cleveland gives you such a strong sense of community. People really look out for each other here.",
    "There's a special pride that comes with being from Cleveland. We might be underdogs, but we're passionate about our city."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Enhance a response with Cleveland perspective when appropriate
 */
export const enhanceResponseWithClevelandPerspective = (
  response: string, 
  userInput: string,
  clevelandTopics: ClevelandTopic[],
  forceInclude: boolean = false
): string => {
  // Skip enhancement for very short responses
  if (response.length < 30 && !forceInclude) {
    return response;
  }
  
  // Skip enhancement if response already has Cleveland content
  if (response.toLowerCase().includes('cleveland') ||
      response.toLowerCase().includes('ohio')) {
    return response;
  }
  
  // Skip for casual situations unless forced
  const isCasualSituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(userInput.toLowerCase());
  if (isCasualSituation && !forceInclude) {
    return response;
  }
  
  // Find relevant Cleveland memories
  const clevelandMemories = findClevelandMemories(userInput);
  
  // If we have memories and appropriate context, integrate them
  if ((clevelandMemories.length > 0 || forceInclude) && 
      (clevelandTopics.length > 0 || forceInclude)) {
    
    // Select a memory or generic perspective
    const clevelandPerspective = clevelandMemories.length > 0 
      ? clevelandMemories[Math.floor(Math.random() * clevelandMemories.length)]
      : getGenericClevelandResponse();
    
    // Split response into sentences
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    if (sentences.length <= 2) {
      // For short responses, add perspective at the end
      return `${response} ${clevelandPerspective}`;
    } else {
      // For longer responses, insert perspective near the middle
      const insertPoint = Math.floor(sentences.length / 2);
      const firstPart = sentences.slice(0, insertPoint).join(' ');
      const secondPart = sentences.slice(insertPoint).join(' ');
      
      return `${firstPart} ${clevelandPerspective} ${secondPart}`;
    }
  }
  
  return response;
};

/**
 * Generate a Cleveland-specific small talk response
 */
export const generateClevelandSmallTalk = (): string => {
  return getRandomSmallTalkTopic();
};
