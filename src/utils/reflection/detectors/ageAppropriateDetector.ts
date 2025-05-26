/**
 * Age-appropriate emotion detection
 * Provides emotional detection tailored to different developmental stages
 */

import { DevelopmentalStage } from '../reflectionTypes';
import { identifyEnhancedFeelings } from './basicFeelingDetector';
import { translateToChildFriendlyEmotion } from '../childEmotionsWheel';

/**
 * Detects emotions from text with age-appropriate sensitivity
 * For children, focuses on simpler emotional concepts
 * @param text The text to analyze
 * @param stage The developmental stage of the user
 * @returns Appropriate emotions for the developmental stage
 */
export const detectAgeAppropriateEmotions = (text: string, stage: DevelopmentalStage): {
  emotions: string[];
  childFriendly: boolean;
} => {
  // Determine if this is a child stage (any non-adult stage)
  const isChild = stage === 'child' || 
                 stage === 'adolescent' ||
                 stage === 'infant_toddler' ||
                 stage === 'young_child' ||
                 stage === 'middle_childhood';
                 
  const enhancedFeelings = identifyEnhancedFeelings(text);
  
  if (isChild) {
    // For children, use simpler emotion terms from the child wheel
    const childEmotions = enhancedFeelings
      .filter(feeling => feeling.childFriendly)
      .map(feeling => feeling.childFriendly?.translation || translateToChildFriendlyEmotion(feeling.detectedWord));
    
    // If we detected emotions with child translations, use those
    if (childEmotions.length > 0) {
      return {
        emotions: childEmotions,
        childFriendly: true
      };
    }
    
    // Otherwise, translate adult emotions to child-friendly terms
    return {
      emotions: enhancedFeelings.map(feeling => 
        translateToChildFriendlyEmotion(feeling.detectedWord)),
      childFriendly: true
    };
  }
  
  // For adults, use the full emotion vocabulary
  return {
    emotions: enhancedFeelings.map(feeling => feeling.detectedWord),
    childFriendly: false
  };
};
