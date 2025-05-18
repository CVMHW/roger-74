
/**
 * Integration of RAG with Roger's Personality
 * 
 * Connects vector database knowledge with Roger's defined personality traits
 */

import { retrieveFactualGrounding, retrieveSimilarResponses } from '../retrieval';

/**
 * Enhance response with Roger's personality traits from vector database
 */
export const enhanceWithPersonality = async (
  response: string,
  userInput: string,
  messageCount: number
): Promise<string> => {
  try {
    // Only apply personality enhancement after some conversation context
    if (messageCount < 5) return response;
    
    // Only apply occasionally (30% chance after message 5)
    if (Math.random() > 0.3) return response;
    
    // Search for similar past responses to maintain consistency
    const similarResponses = await retrieveSimilarResponses(userInput, 2);
    let personalityTrait = null;
    
    // Check if any similar response contains personality information
    if (similarResponses.length > 0) {
      // Extract personality traits from similar responses
      for (const similar of similarResponses) {
        const extractedTrait = extractPersonalityTrait(similar);
        if (extractedTrait) {
          personalityTrait = extractedTrait;
          break;
        }
      }
    }
    
    // If we didn't find a trait in similar responses, select one based on context
    if (!personalityTrait) {
      personalityTrait = selectAppropriatePersonalityTrait(userInput, messageCount);
    }
    
    // If we have a personality trait, integrate it
    if (personalityTrait) {
      return integratePersonalityTrait(response, personalityTrait);
    }
    
    return response;
  } catch (error) {
    console.error("Error enhancing with personality:", error);
    return response;
  }
};

/**
 * Extract personality traits from a response
 */
function extractPersonalityTrait(text: string): string | null {
  // Check for common personality introduction phrases
  const personalityMarkers = [
    /I tend to notice details/i,
    /I appreciate clear/i,
    /When I feel/i,
    /I've found that/i,
    /I like to approach/i,
    /I've learned that/i,
    /In my experience/i
  ];
  
  for (const marker of personalityMarkers) {
    const match = text.match(marker);
    if (match) {
      // Extract the sentence containing the personality trait
      const sentenceStart = text.lastIndexOf('.', match.index) + 1;
      const sentenceEnd = text.indexOf('.', match.index);
      
      if (sentenceStart >= 0 && sentenceEnd > sentenceStart) {
        return text.substring(sentenceStart, sentenceEnd + 1).trim();
      }
    }
  }
  
  return null;
}

/**
 * Select appropriate personality trait based on context
 */
function selectAppropriatePersonalityTrait(userInput: string, messageCount: number): string {
  // Define Roger's core personality traits
  const traits = [
    "I tend to notice details that others might miss.",
    "I appreciate clear, direct communication.",
    "When I feel nervous, I sometimes focus on concrete details around me.",
    "I've found that breaking complex situations into smaller parts helps me understand them better.",
    "I like to approach conversations with structure.",
    "I've learned that different people process information differently.",
    "In my experience, having concrete examples helps understand abstract concepts."
  ];
  
  // Context-specific traits
  if (/anxious|nervous|worry|stress/i.test(userInput)) {
    return "When I feel anxious, focusing on specific details around me helps me stay grounded.";
  }
  
  if (/confused|unclear|understand/i.test(userInput)) {
    return "I appreciate when people are direct and specific, as it helps me understand more clearly.";
  }
  
  if (/social|group|people|party/i.test(userInput)) {
    return "I sometimes find social situations require more energy for me, but I've developed strategies that help.";
  }
  
  // Default: select a random trait
  return traits[Math.floor(Math.random() * traits.length)];
}

/**
 * Integrate personality trait into response
 */
function integratePersonalityTrait(response: string, trait: string): string {
  // Add the trait at an appropriate point in the response
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  if (sentences.length <= 2) {
    // For short responses, simply append
    return `${response} ${trait}`;
  } else {
    // For longer responses, insert at a natural point
    const insertPoint = Math.floor(sentences.length * 0.6);
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    return `${beginning} ${trait} ${end}`;
  }
}
