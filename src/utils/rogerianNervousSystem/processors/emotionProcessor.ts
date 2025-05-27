
/**
 * Unified Emotion Processor
 * 
 * FIXED: Eliminates neutral responses completely
 */

import { EmotionalContext, EmotionType, SeverityLevel } from '../core/types';
import { detectEmotion } from '../../emotions/unifiedEmotionDetector';

/**
 * Process emotions - NO MORE NEUTRAL BULLSHIT
 */
export const processEmotions = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<EmotionalContext> => {
  console.log("EMOTION PROCESSOR: Using sophisticated emotion detection - NO NEUTRAL ALLOWED");
  
  try {
    // Use unified emotion detector 
    const emotionResult = detectEmotion(userInput);
    
    // Map to unified emotion types - NEVER NEUTRAL
    const mapToUnifiedEmotion = (emotion: string): EmotionType => {
      const lowerEmotion = emotion.toLowerCase();
      
      // Crisis emotions get priority
      if (['hopeless', 'despair', 'worthless', 'powerless', 'suicidal'].includes(lowerEmotion)) return 'depression';
      
      // Depression and sadness
      if (['depressed', 'sad', 'down', 'blue', 'low', 'abandoned', 'rejected', 'grief', 'lonely', 'guilty', 'ashamed'].includes(lowerEmotion)) return 'sadness';
      
      // Anger variants
      if (['angry', 'mad', 'furious', 'bitter', 'resentful', 'humiliated', 'frustrated', 'irritated'].includes(lowerEmotion)) return 'anger';
      
      // Anxiety and fear
      if (['anxious', 'worried', 'scared', 'afraid', 'overwhelmed', 'nervous', 'panic', 'stressed'].includes(lowerEmotion)) return 'anxiety';
      
      // Seeking support or distressed
      if (['confused', 'lost', 'stuck', 'uncertain', 'seeking-support', 'distressed'].includes(lowerEmotion)) return 'anxiety';
      
      // Joy (rare in therapy but valid)
      if (['happy', 'joyful', 'content', 'optimistic', 'proud', 'ecstatic'].includes(lowerEmotion)) return 'joy';
      
      // DEFAULT: If someone is in therapy, they're likely experiencing some distress
      return 'anxiety';
    };
    
    const emotionalContext: EmotionalContext = {
      hasDetectedEmotion: true, // ALWAYS true - no neutral in therapy
      primaryEmotion: mapToUnifiedEmotion(emotionResult.primaryEmotion),
      isDepressionMentioned: /\b(depress(ed|ion|ing)?|hopeless|worthless|despair)\b/i.test(userInput),
      emotionalIntensity: emotionResult.intensity as SeverityLevel,
      confidence: emotionResult.confidence,
      therapeuticContext: emotionResult.therapeuticContext,
      rogerResponse: emotionResult.rogerResponse
    };
    
    console.log("EMOTION PROCESSOR: Detected emotion", {
      detected: emotionResult.primaryEmotion,
      mapped: emotionalContext.primaryEmotion,
      intensity: emotionResult.intensity,
      confidence: emotionResult.confidence
    });
    
    return emotionalContext;
    
  } catch (error) {
    console.error("EMOTION PROCESSOR: Error in detection:", error);
    // Even in error, assume therapeutic context - NEVER NEUTRAL
    return {
      hasDetectedEmotion: true,
      primaryEmotion: 'anxiety',
      isDepressionMentioned: false,
      emotionalIntensity: 'medium',
      confidence: 0.7,
      therapeuticContext: 'general',
      rogerResponse: 'I can sense you might be going through something difficult. What would you like to explore?'
    };
  }
};
