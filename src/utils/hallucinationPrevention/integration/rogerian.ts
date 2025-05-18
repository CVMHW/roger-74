
/**
 * Integration of RAG with Rogerian Counseling
 * 
 * Connects vector database knowledge with Rogerian counseling principles
 */

import { retrieveFactualGrounding } from '../retrieval';
import { identifyEnhancedFeelings } from '../../reflection/feelingDetection';

/**
 * Enhance a Rogerian response with relevant knowledge
 */
export const enhanceRogerianResponse = (
  response: string,
  userInput: string,
  messageCount: number
): string => {
  try {
    // Skip enhancement for very early messages (first 2)
    if (messageCount < 3) return response;
    
    // Extract feelings and topics from user input
    const enhancedFeelings = identifyEnhancedFeelings(userInput);
    const feelings = enhancedFeelings.map(f => f.category);
    
    // Extract keywords from user input
    const keywords = extractKeywords(userInput);
    
    // Combine feelings and keywords for search topics
    const searchTopics = [...feelings, ...keywords];
    
    // Retrieve relevant knowledge
    const groundingFacts = retrieveFactualGrounding(searchTopics, 3);
    
    if (groundingFacts.length === 0) return response;
    
    // Select most relevant fact based on importance and score
    const sortedFacts = groundingFacts.sort((a, b) => b.importance - a.importance);
    const selectedFact = sortedFacts[0];
    
    if (!selectedFact) return response;
    
    // Insert knowledge at appropriate point for Rogerian approach
    const sentences = response.split(/(?<=[.!?])\s+/);
    
    if (sentences.length <= 2) {
      // For short responses, append with transition
      return `${response} This connects to what we know about ${selectedFact.content}`;
    }
    
    // For longer responses, insert before conclusion with Rogerian transition
    const insertPoint = Math.floor(sentences.length * 0.7);
    
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    // Use Rogerian phrasing
    const transitions = [
      "I wonder if it might be helpful to consider that ",
      "Some people have found that ",
      "I'm reminded that ",
      "It might be worth reflecting on the idea that ",
      "This reminds me of what we understand about "
    ];
    
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    
    return `${beginning} ${transition}${selectedFact.content} ${end}`;
  } catch (error) {
    console.error("Error enhancing Rogerian response:", error);
    return response;
  }
};

/**
 * Extract keywords from user input
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !commonWords.includes(word));
  
  return [...new Set(words)]; // Remove duplicates
}

// Common words to filter out
const commonWords = [
  "this", "that", "these", "those", "with", "from", "about",
  "have", "what", "when", "where", "which", "whom", "whose",
  "your", "their", "they", "then", "than", "been", "were", 
  "being", "would", "could", "should", "there", "here", "some"
];
