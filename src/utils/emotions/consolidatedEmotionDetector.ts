
/**
 * Consolidated Emotion Detector
 * 
 * Single source of truth for emotion detection
 * Replaces 6 separate emotion detection systems
 * Target: <100ms processing time
 */

import { detectEmotion } from './unifiedEmotionDetector';

export interface ConsolidatedEmotionResult {
  hasEmotion: boolean;
  primaryEmotion: string;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  isCrisis: boolean;
  rogerResponse: string;
  processingTime: number;
}

/**
 * Single emotion detection function - replaces all others
 */
export const detectEmotionConsolidated = (userInput: string): ConsolidatedEmotionResult => {
  const startTime = Date.now();
  
  try {
    // Use the sophisticated unified detector
    const result = detectEmotion(userInput);
    
    const consolidatedResult: ConsolidatedEmotionResult = {
      hasEmotion: result.primaryEmotion !== 'seeking support',
      primaryEmotion: result.primaryEmotion,
      intensity: result.intensity,
      confidence: result.confidence,
      isCrisis: result.intensity === 'critical',
      rogerResponse: result.rogerResponse,
      processingTime: Date.now() - startTime
    };
    
    return consolidatedResult;
    
  } catch (error) {
    console.error('Consolidated emotion detection error:', error);
    
    return {
      hasEmotion: true,
      primaryEmotion: 'distressed',
      intensity: 'medium',
      confidence: 0.7,
      isCrisis: false,
      rogerResponse: "I'm here to listen. What would you like to share?",
      processingTime: Date.now() - startTime
    };
  }
};

// Legacy function mappings for backward compatibility
export const extractEmotionsFromInput = detectEmotionConsolidated;
export const detectEmotionalContent = detectEmotionConsolidated;
export const feelingDetection = detectEmotionConsolidated;
export const emotionHandler = detectEmotionConsolidated;
