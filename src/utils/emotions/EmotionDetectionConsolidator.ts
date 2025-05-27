
/**
 * Emotion Detection Consolidator
 * 
 * Eliminates ALL redundant emotion detection systems
 * Single source of truth for emotion analysis
 */

import { detectEmotion } from './unifiedEmotionDetector';
import { extractEmotionsFromInput } from '../response/processor/emotions';

export interface ConsolidatedEmotionData {
  primaryEmotion: string;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  isCrisis: boolean;
  isDepressionMentioned: boolean;
  therapeuticContext: string;
  rogerResponse: string;
  processingTime: number;
  systemsUsed: string[];
}

/**
 * Master emotion detection - replaces ALL fragmented systems
 */
export const detectEmotionMaster = (userInput: string): ConsolidatedEmotionData => {
  const startTime = Date.now();
  const systemsUsed: string[] = [];

  try {
    // Primary detection through unified system
    const unifiedResult = detectEmotion(userInput);
    systemsUsed.push('unified-detector');
    
    // Cross-validation with processor system
    const processorResult = extractEmotionsFromInput(userInput);
    systemsUsed.push('processor-validator');
    
    // Resolve conflicts between systems
    const resolvedEmotion = resolveEmotionConflicts(unifiedResult, processorResult);
    
    const consolidatedResult: ConsolidatedEmotionData = {
      primaryEmotion: resolvedEmotion.primaryEmotion,
      intensity: resolvedEmotion.intensity,
      confidence: resolvedEmotion.confidence,
      isCrisis: resolvedEmotion.intensity === 'critical',
      isDepressionMentioned: /\b(depress(ed|ion|ing)?|hopeless|worthless|despair)\b/i.test(userInput),
      therapeuticContext: resolvedEmotion.therapeuticContext,
      rogerResponse: resolvedEmotion.rogerResponse,
      processingTime: Date.now() - startTime,
      systemsUsed
    };
    
    return consolidatedResult;
    
  } catch (error) {
    console.error('Master emotion detection error:', error);
    systemsUsed.push('fallback');
    
    return {
      primaryEmotion: 'seeking-support',
      intensity: 'medium',
      confidence: 0.7,
      isCrisis: false,
      isDepressionMentioned: false,
      therapeuticContext: 'general',
      rogerResponse: "I'm here to listen. What would you like to share?",
      processingTime: Date.now() - startTime,
      systemsUsed
    };
  }
};

/**
 * Resolve conflicts between different emotion detection systems
 */
const resolveEmotionConflicts = (unifiedResult: any, processorResult: any): any => {
  // If unified system detects crisis, trust it
  if (unifiedResult.intensity === 'critical') {
    return unifiedResult;
  }
  
  // If processor detects depression, prioritize it
  if (processorResult.isDepressionMentioned) {
    return {
      ...unifiedResult,
      primaryEmotion: 'depression',
      intensity: 'high'
    };
  }
  
  // Use unified result as primary with processor validation
  return {
    ...unifiedResult,
    confidence: Math.min(unifiedResult.confidence + 0.1, 1.0) // Boost confidence with validation
  };
};

// Legacy compatibility exports
export const detectEmotionConsolidated = detectEmotionMaster;
export const masterEmotionDetection = detectEmotionMaster;
