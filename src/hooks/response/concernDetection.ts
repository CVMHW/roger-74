
// Import the existing file to preserve current implementations
import { useState } from 'react';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectPTSDConcerns } from '../../utils/detectionUtils';
import { detectSpecificIllness, detectPetIllnessConcerns } from '../../utils/detectionUtils';
import { detectAllProblems } from '../../utils/detectionUtils/problemDetection';
import { isLikelyTeenMessage } from '../../utils/response/teenResponseUtils';
import { isLikelyChildMessage } from '../../utils/responseUtils';

export const useConcernDetection = () => {
  // Track previous concerns to maintain consistency
  const [previousConcern, setPreviousConcern] = useState<ConcernType | null>(null);
  // Track detected age group for adaptive responses
  const [detectedAgeGroup, setDetectedAgeGroup] = useState<'teen' | 'adult' | 'child' | null>(null);
  
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
      
      // Try to detect age group from the common problems detection
      try {
        const commonProblems = require('../../utils/detectionUtils/problemDetection').detectCommonProblems(message);
        if (commonProblems && commonProblems.ageGroup) {
          setDetectedAgeGroup(commonProblems.ageGroup);
        } else {
          // Use the more precise age detection functions if available
          if (isLikelyTeenMessage(message)) {
            setDetectedAgeGroup('teen');
          } else if (isLikelyChildMessage(message)) {
            setDetectedAgeGroup('child');
          } else {
            setDetectedAgeGroup('adult');
          }
        }
      } catch (error) {
        console.error("Error detecting age group:", error);
      }
      
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
  
  /**
   * Get the currently detected age group
   * @returns The detected age group or null
   */
  const getDetectedAgeGroup = () => detectedAgeGroup;
  
  return { 
    detectConcerns, 
    getDetectedAgeGroup 
  };
};
