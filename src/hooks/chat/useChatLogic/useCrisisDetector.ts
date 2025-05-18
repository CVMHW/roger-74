
/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to vector embeddings for semantic understanding
 */

import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../../utils/conversation/specializedDetection/eatingPatterns/processor';
import { checkForCrisisContent } from '../crisisDetection';
import { generateEmbedding, cosineSimilarity } from '../../../utils/hallucinationPrevention/vectorEmbeddings';

/**
 * Crisis keywords for semantic comparison
 */
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "don't want to live", 
  "hurting myself", "self harm", "cutting myself", "overdose",
  "no reason to live", "better off dead", "can't go on", 
  "want to die", "wish I was dead", "end it all", "jump off",
  "harm myself", "hurt myself"
];

/**
 * Enhanced hook for detecting crisis content in user messages
 * with semantic understanding using vector embeddings
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input using semantic understanding
  const checkForCrisisContent = useCallback(async (userInput: string): Promise<boolean> => {
    console.log("CRISIS DETECTOR: Checking user input for crisis content");
    
    // First, check using the traditional method
    const traditionalDetection = checkForCrisisContent(userInput);
    
    if (traditionalDetection) {
      return true;
    }
    
    try {
      // Generate embedding for user input
      const inputEmbedding = await generateEmbedding(userInput);
      
      // Generate embeddings for crisis keywords
      const crisisEmbeddings = await Promise.all(
        CRISIS_KEYWORDS.map(async keyword => ({
          keyword,
          embedding: await generateEmbedding(keyword)
        }))
      );
      
      // Check similarity with crisis keywords
      for (const { keyword, embedding } of crisisEmbeddings) {
        const similarity = cosineSimilarity(inputEmbedding, embedding);
        
        // If similarity is high enough, consider it crisis content
        if (similarity > 0.7) {
          console.log(`CRISIS DETECTOR: Semantic match with "${keyword}" (${similarity.toFixed(2)})`);
          return true;
        }
      }
      
      // No semantic matches found
      return false;
    } catch (error) {
      console.error("Error in semantic crisis detection:", error);
      
      // Fall back to traditional detection
      return checkForCrisisContent(userInput);
    }
  }, []);
  
  return { checkForCrisisContent };
};

/**
 * For compatibility with non-hook contexts, export a function version
 */
export const checkForCrisisContentAsync = async (userInput: string): Promise<boolean> => {
  // First use the traditional detection for speed
  const traditionalDetection = checkForCrisisContent(userInput);
  if (traditionalDetection) {
    return true;
  }
  
  try {
    // Generate embedding for user input
    const inputEmbedding = await generateEmbedding(userInput);
    
    // Generate embeddings for crisis keywords
    const crisisEmbeddings = await Promise.all(
      CRISIS_KEYWORDS.map(async keyword => ({
        keyword,
        embedding: await generateEmbedding(keyword)
      }))
    );
    
    // Check similarity with crisis keywords
    for (const { keyword, embedding } of crisisEmbeddings) {
      const similarity = cosineSimilarity(inputEmbedding, embedding);
      
      // If similarity is high enough, consider it crisis content
      if (similarity > 0.7) {
        console.log(`CRISIS DETECTOR: Semantic match with "${keyword}" (${similarity.toFixed(2)})`);
        return true;
      }
    }
    
    // No semantic matches found
    return false;
  } catch (error) {
    console.error("Error in semantic crisis detection:", error);
    
    // Fall back to traditional detection
    return checkForCrisisContent(userInput);
  }
};

// Export the traditional function for compatibility
export { checkForCrisisContent } from '../crisisDetection';
