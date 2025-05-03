
/**
 * Cleveland Memory Integration
 * 
 * Integrates Cleveland-specific knowledge into Roger's memory systems
 */

import { searchMemory, addMemory } from '../memory/memoryController';
import { getClevelandData, getClevelandPlace, getSportsFacts, getTourismInfo } from './clevelandData';
import { detectClevelandTopics, ClevelandTopic, ClevelandTopicType } from './clevelandTopics';

/**
 * Find relevant Cleveland memories based on user input
 */
export const findClevelandMemories = (userInput: string): string[] => {
  const memories: string[] = [];
  
  // Detect cleveland topics in user input
  const clevelandTopics = detectClevelandTopics(userInput);
  
  // If no cleveland topics, return empty
  if (clevelandTopics.length === 0) {
    return memories;
  }
  
  // Get primary topic
  const primaryTopic = clevelandTopics[0];
  
  try {
    // Search for topic-specific knowledge
    switch (primaryTopic.type) {
      case 'sports':
        // Get sports facts based on keywords
        const teamKeyword = primaryTopic.subtopic || primaryTopic.keywords[0] || 'cleveland';
        const sportsFacts = getSportsFacts(teamKeyword);
        if (sportsFacts.length > 0) {
          // Add a relevant sports fact
          memories.push(`As a Cleveland native, I know that ${sportsFacts[0].fact}`);
        }
        break;
        
      case 'food':
        // Get restaurant/food info based on keywords
        const foodKeyword = primaryTopic.keywords[0] || 'restaurant';
        const placeInfo = getClevelandPlace(foodKeyword);
        if (placeInfo) {
          memories.push(`I've heard great things about ${placeInfo.name} in ${placeInfo.area}. ${placeInfo.description}.`);
        }
        break;
        
      case 'attractions':
        // Get tourism information
        const attractionKeyword = primaryTopic.keywords[0] || 'museum';
        const tourismInfo = getTourismInfo(attractionKeyword);
        if (tourismInfo.length > 0) {
          memories.push(`The ${tourismInfo[0].location} is one of my favorite places in Cleveland. ${tourismInfo[0].fact}`);
        }
        break;
        
      case 'neighborhoods':
        // Find neighborhood info
        const neighborhood = primaryTopic.keywords[0] || 'cleveland';
        // Look for places in this neighborhood
        const neighborhoodData = getClevelandData().places.filter(
          place => place.area.toLowerCase().includes(neighborhood.toLowerCase())
        );
        
        if (neighborhoodData.length > 0) {
          const randomPlace = neighborhoodData[Math.floor(Math.random() * neighborhoodData.length)];
          memories.push(`${randomPlace.area} is home to ${randomPlace.name}, which is known for ${randomPlace.description}.`);
        }
        break;
        
      default:
        // For other topics, try to find something general about Cleveland
        const clevelandData = getClevelandData();
        if (clevelandData.sportsFacts.length > 0) {
          const randomFact = clevelandData.sportsFacts[Math.floor(Math.random() * clevelandData.sportsFacts.length)];
          memories.push(`Cleveland's ${randomFact.team} ${randomFact.fact}`);
        }
    }
    
    // Also check memory system for any relevant previous discussions
    const memoryResults = searchMemory({
      keywords: primaryTopic.keywords,
      limit: 1
    });
    
    if (memoryResults && memoryResults.length > 0) {
      const relevantMemory = memoryResults[0];
      if (relevantMemory.role === 'patient' && relevantMemory.content) {
        memories.push(`You mentioned ${primaryTopic.keywords[0]} before when we talked about ${relevantMemory.content.substring(0, 30)}...`);
      }
    }
    
    return memories;
  } catch (error) {
    console.error("Error in findClevelandMemories:", error);
    return [];
  }
};

/**
 * Store Cleveland-related memory from conversation
 */
export const storeClevelandMemory = (
  content: string, 
  role: 'patient' | 'roger', 
  topics: ClevelandTopic[]
): void => {
  if (topics.length === 0) return;
  
  try {
    // Create context with Cleveland topics
    const context = {
      emotions: [],
      topics: topics.map(t => t.type as string),
      problems: [],
      clevelandTopics: topics.map(t => t.type),
      keywords: topics.flatMap(t => t.keywords)
    };
    
    // Store in memory system with high importance for Cleveland content
    addMemory(content, role, context, 0.8);
    
    console.log("CLEVELAND MEMORY: Stored Cleveland-related memory");
  } catch (error) {
    console.error("Error storing Cleveland memory:", error);
  }
};

/**
 * Check if Roger should use Cleveland knowledge for response
 */
export const shouldUseClevelandKnowledge = (
  userInput: string, 
  clevelandTopics: ClevelandTopic[]
): boolean => {
  // If we detected topics, generally use them
  if (clevelandTopics.length > 0 && clevelandTopics[0].confidence > 0.6) {
    return true;
  }
  
  // If the message is clearly asking about Cleveland
  if (userInput.toLowerCase().includes('cleveland') && 
      (userInput.toLowerCase().includes('know about') || 
       userInput.toLowerCase().includes('tell me about'))) {
    return true;
  }
  
  // If previous messages included Cleveland topics
  try {
    const recentMemories = searchMemory({
      timeframe: {
        start: Date.now() - 1000 * 60 * 10 // Last 10 minutes
      },
      limit: 5
    });
    
    // Check if recent memories had Cleveland context
    if (recentMemories && recentMemories.length > 0) {
      const recentClevelandDiscussion = recentMemories.some(
        memory => memory.metadata && memory.metadata.clevelandTopics
      );
    
      if (recentClevelandDiscussion) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking recent Cleveland memories:", error);
  }
  
  // Default - use sparingly
  return Math.random() < 0.3; // 30% chance
};

