
/**
 * Unified Emotion Processor
 * 
 * Uses the sophisticated emotions wheel for accurate detection
 */

import { EmotionalContext, EmotionType, SeverityLevel } from '../core/types';
import { detectEmotion } from '../../emotions/unifiedEmotionDetector';

/**
 * Process emotions using unified sophisticated detection
 */
export const processEmotions = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<EmotionalContext> => {
  console.log("EMOTION PROCESSOR: Using sophisticated emotion detection");
  
  try {
    // Use unified emotion detector - NO MORE NEUTRAL
    const emotionResult = detectEmotion(userInput);
    
    // Map to unified emotion types
    const mapToUnifiedEmotion = (emotion: string): EmotionType => {
      const lowerEmotion = emotion.toLowerCase();
      
      // Crisis emotions
      if (['hopeless', 'despair', 'worthless', 'powerless'].includes(lowerEmotion)) return 'depression';
      
      // Sophisticated sad emotions
      if (['abandoned', 'rejected', 'grief', 'lonely', 'guilty', 'ashamed'].includes(lowerEmotion)) return 'sadness';
      
      // Sophisticated angry emotions  
      if (['furious', 'bitter', 'resentful', 'humiliated', 'frustrated'].includes(lowerEmotion)) return 'anger';
      
      // Sophisticated fearful emotions
      if (['overwhelmed', 'anxious', 'worried', 'persecuted', 'threatened'].includes(lowerEmotion)) return 'anxiety';
      
      // Sophisticated happy emotions
      if (['joyful', 'content', 'optimistic', 'proud', 'ecstatic'].includes(lowerEmotion)) return 'joy';
      
      // Default mapping
      if (lowerEmotion.includes('fear') || lowerEmotion.includes('scared')) return 'fear';
      if (lowerEmotion.includes('surprise')) return 'surprise';
      if (lowerEmotion.includes('disgust')) return 'disgust';
      
      // NO NEUTRAL - default to anxiety for therapy context
      return 'anxiety';
    };
    
    const mapToSeverity = (intensity: string): SeverityLevel => {
      switch (intensity) {
        case 'critical': return 'critical';
        case 'high': return 'high';
        case 'low': return 'low';
        default: return 'medium';
      }
    };
    
    const emotionalContext: EmotionalContext = {
      hasDetectedEmotion: true, // Always true - no one seeks therapy feeling neutral
      primaryEmotion: mapToUnifiedEmotion(emotionResult.primaryEmotion),
      isDepressionMentioned: emotionResult.intensity === 'critical' || emotionResult.category === 'sad',
      emotionalIntensity: mapToSeverity(emotionResult.intensity),
      confidence: emotionResult.confidence,
      therapeuticContext: emotionResult.therapeuticContext,
      rogerResponse: emotionResult.rogerResponse
    };
    
    console.log("EMOTION PROCESSOR: Sophisticated detection complete", {
      detected: emotionResult.primaryEmotion,
      category: emotionResult.category,
      intensity: emotionResult.intensity,
      confidence: emotionResult.confidence
    });
    
    return emotionalContext;
    
  } catch (error) {
    console.error("EMOTION PROCESSOR: Error in sophisticated detection:", error);
    // Even in error, assume therapeutic context
    return {
      hasDetectedEmotion: true,
      primaryEmotion: 'anxiety',
      isDepressionMentioned: false,
      emotionalIntensity: 'medium',
      confidence: 0.7,
      therapeuticContext: 'general',
      rogerResponse: 'I can sense something is weighing on you. What would you like to explore?'
    };
  }
};
