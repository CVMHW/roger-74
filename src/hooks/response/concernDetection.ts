
// Import the existing file to preserve current implementations
import { useState } from 'react';
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectPTSDConcerns } from '../../utils/detectionUtils';
import { detectSpecificIllness, detectPetIllnessConcerns } from '../../utils/detectionUtils';

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
      // Check for specific illness mentions, including cancer
      const illnessDetails = detectSpecificIllness(message);
      if (illnessDetails.detected) {
        if (illnessDetails.context === 'pet') {
          return 'pet-illness';
        }
        if (illnessDetails.illnessType === 'cancer') {
          return 'medical';
        }
      }
      
      // Check for pet illness specifically
      if (detectPetIllnessConcerns(message)) {
        return 'pet-illness';
      }
      
      // Import detectionUtils dynamically to avoid circular dependencies
      const detectionUtils = require('../../utils/detectionUtils');
      
      if (detectionUtils.detectCrisisKeywords(message)) {
        return 'crisis';
      }
      
      if (detectionUtils.detectMedicalConcerns(message)) {
        return 'medical';
      }
      
      if (detectionUtils.detectMentalHealthConcerns(message)) {
        return 'mental-health';
      }
      
      if (detectionUtils.detectEatingDisorderConcerns(message)) {
        return 'eating-disorder';
      }
      
      const substanceResults = detectionUtils.detectSubstanceUseConcerns(message);
      if (substanceResults.detected) {
        return 'substance-use';
      }
      
      const ptsdResults = detectPTSDConcerns(message);
      if (ptsdResults.detected) {
        return ptsdResults.severity === 'severe' ? 'trauma-response' : 'ptsd';
      }
      
      if (detectionUtils.detectTentativeHarmLanguage(message)) {
        return 'tentative-harm';
      }
      
      // Check for sadness vs depression
      const emotionalState = detectionUtils.distinguishSadnessFromDepression(message);
      if (emotionalState.isDepression) {
        return 'mental-health';
      }
      
      return null;
    } catch (error) {
      console.error("Error in concern detection:", error);
      return previousConcern; // Fallback to previous concern on error
    }
  };
  
  return { detectConcerns };
};
