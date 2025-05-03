
/**
 * Stressor Detection
 * 
 * Provides functions to detect stressors in user input
 */

import { getAllStressors, getStressorById } from './stressorData';
import { getAllAdultStressors, getAdultStressorById } from './adultStressorData';
import { Stressor, DetectedStressor, StressorCategory } from './stressorTypes';

/**
 * Detect stressors in user input
 */
export const detectStressors = (userInput: string): DetectedStressor[] => {
  const detectedStressors: DetectedStressor[] = [];
  const normalizedInput = userInput.toLowerCase();
  
  try {
    // Combine child/teen and adult stressors
    const allStressors = [...getAllStressors(), ...getAllAdultStressors()];
    
    // Check for each stressor's keywords in the input
    allStressors.forEach(stressor => {
      // Calculate how many keywords match
      const matchingKeywords = stressor.keywords.filter(keyword => 
        normalizedInput.includes(keyword)
      );
      
      // If we have matches, add to detected stressors
      if (matchingKeywords.length > 0) {
        // Calculate confidence based on keyword matches
        const confidence = Math.min(
          0.9, 
          0.5 + (matchingKeywords.length / stressor.keywords.length * 0.4)
        );
        
        // Determine intensity based on language
        const intensity = determineStressorIntensity(normalizedInput, stressor.category);
        
        detectedStressors.push({
          stressor,
          confidence,
          intensity,
          keywords: matchingKeywords
        });
      }
    });
    
    // Sort by confidence (highest first)
    return detectedStressors.sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    console.error("Error detecting stressors:", error);
    return [];
  }
};

/**
 * Determine the intensity of a stressor based on language
 */
const determineStressorIntensity = (
  input: string, 
  category: StressorCategory
): 'mild' | 'moderate' | 'severe' => {
  // Check for severe intensity markers
  const severeMarkers = [
    'extremely', 'overwhelming', 'unbearable', 'severe', 'terrible',
    'can\'t handle', 'desperate', 'constant', 'intense', 'worst'
  ];
  
  // Check for mild intensity markers
  const mildMarkers = [
    'little', 'slight', 'minor', 'occasionally', 'sometimes',
    'bit', 'somewhat', 'manageable', 'small', 'tiny'
  ];
  
  // Check for severe markers
  for (const marker of severeMarkers) {
    if (input.includes(marker)) {
      return 'severe';
    }
  }
  
  // Check for mild markers
  for (const marker of mildMarkers) {
    if (input.includes(marker)) {
      return 'mild';
    }
  }
  
  // Default to moderate
  return 'moderate';
};

/**
 * Get the primary stressor
 */
export const getPrimaryStressor = (userInput: string): DetectedStressor | null => {
  const detectedStressors = detectStressors(userInput);
  
  if (detectedStressors.length === 0) {
    return null;
  }
  
  return detectedStressors[0];
};

/**
 * Check if input contains stressor keywords
 */
export const containsStressorKeywords = (input: string): boolean => {
  const stressKeywords = [
    'stress', 'anxiety', 'worried', 'overwhelmed', 
    'pressure', 'panic', 'scared', 'afraid', 'fear',
    'nervous', 'anxious', 'upset', 'distressed', 'troubled'
  ];
  
  const normalizedInput = input.toLowerCase();
  
  return stressKeywords.some(keyword => normalizedInput.includes(keyword));
};

/**
 * Get stressors by category
 */
export const getStressorsByCategory = (category: StressorCategory): Stressor[] => {
  // Combine child/teen and adult stressors
  const allStressors = [...getAllStressors(), ...getAllAdultStressors()];
  return allStressors.filter(stressor => stressor.category === category);
};

/**
 * Find related stressors across both child/teen and adult databases
 */
export const findRelatedStressors = (stressorId: string): Stressor[] => {
  // Check if ID is from child/teen or adult database
  if (stressorId.startsWith('adult_')) {
    const { findRelatedAdultStressors } = require('./adultStressorData');
    return findRelatedAdultStressors(stressorId);
  } else {
    const { findRelatedStressors } = require('./stressorData');
    return findRelatedStressors(stressorId);
  }
};

export default {
  detectStressors,
  getPrimaryStressor,
  containsStressorKeywords,
  getStressorsByCategory,
  findRelatedStressors
};
