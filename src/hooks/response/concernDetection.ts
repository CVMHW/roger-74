
// Import the existing file to preserve current implementations
import { useState } from 'react';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectPTSDConcerns } from '../../utils/detectionUtils';
import { detectSpecificIllness, detectPetIllnessConcerns } from '../../utils/detectionUtils';
import { detectAllProblems } from '../../utils/detectionUtils/problemDetection';

export const useConcernDetection = () => {
  // Track previous concerns to maintain consistency
  const [previousConcern, setPreviousConcern] = useState<ConcernType | null>(null);
  
  /**
   * Enhanced concern detection function
   * @param message The message to analyze
   * @returns The detected concern type or null
   */
  const detectConcerns = (message: string): ConcernType | null => {
    if (!message) return null;
    
    try {
      // Use the enhanced unified detection system first
      const detectedConcern = detectAllProblems(message);
      
      if (detectedConcern) {
        // Update previous concern for consistency
        setPreviousConcern(detectedConcern);
        return detectedConcern;
      }
      
      // If no concern detected, fall back to previous concern for consistency
      return previousConcern;
    } catch (error) {
      console.error("Error in concern detection:", error);
      return previousConcern; // Fallback to previous concern on error
    }
  };
  
  return { detectConcerns };
};
