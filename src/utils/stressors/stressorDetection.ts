
/**
 * Stressor Detection
 * 
 * Logic to identify stressors in user messages
 */

import { Stressor, DetectedStressor, SeverityLevel } from './stressorTypes';
import { getAllStressors } from './stressorData';

/**
 * Detect potential stressors in user message
 */
export const detectStressors = (userInput: string): DetectedStressor[] => {
  const detectedStressors: DetectedStressor[] = [];
  const input = userInput.toLowerCase();
  const allStressors = getAllStressors();
  
  // Loop through all defined stressors to check for matches
  for (const stressor of allStressors) {
    // Find matching keywords
    const matchedKeywords = stressor.keywords.filter(keyword => 
      input.includes(keyword.toLowerCase())
    );
    
    // If matches found, consider it a detection
    if (matchedKeywords.length > 0) {
      // Calculate confidence based on number of keyword matches
      const confidence = Math.min(0.4 + (matchedKeywords.length * 0.15), 0.95);
      
      // Detect intensity based on language
      const intensity = detectIntensity(input, stressor);
      
      detectedStressors.push({
        stressor,
        confidence,
        keywords: matchedKeywords,
        intensity
      });
    }
  }
  
  // Sort by confidence score (highest first)
  return detectedStressors.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Detect intensity of stressor based on language used
 */
const detectIntensity = (input: string, stressor: Stressor): SeverityLevel => {
  // High intensity words
  const highIntensityWords = [
    'extremely', 'severe', 'unbearable', 'terrible', 'overwhelming', 
    'constant', 'always', 'every', 'suicide', 'kill', 'die', 
    'can\'t handle', 'impossible', 'worst'
  ];
  
  // Medium intensity words
  const mediumIntensityWords = [
    'very', 'really', 'quite', 'significant', 'difficult', 
    'frequent', 'often', 'most', 'serious', 'bad'
  ];
  
  // Check for high intensity markers
  for (const word of highIntensityWords) {
    if (input.includes(word)) {
      return 'severe';
    }
  }
  
  // Check for medium intensity markers
  for (const word of mediumIntensityWords) {
    if (input.includes(word)) {
      return 'moderate';
    }
  }
  
  // Default to the stressor's defined severity if no intensity markers found
  return stressor.severity;
};

/**
 * Get the primary stressor from user input
 */
export const getPrimaryStressor = (userInput: string): DetectedStressor | null => {
  const stressors = detectStressors(userInput);
  
  // Return the highest confidence stressor if any found
  if (stressors.length > 0 && stressors[0].confidence > 0.6) {
    return stressors[0];
  }
  
  return null;
};

/**
 * Check if input contains any stressors
 */
export const hasStressors = (userInput: string): boolean => {
  return detectStressors(userInput).length > 0;
};

