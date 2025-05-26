
/**
 * Unified Emotion Processor
 * 
 * Processes emotional context using standardized types and interfaces
 */

import { EmotionalContext, EmotionType, SeverityLevel } from '../core/types';
import { extractEmotionsFromInput } from '../../response/processor/emotions';
import { identifyEnhancedFeelings } from '../../reflection/feelingDetection';

/**
 * Process emotions from user input using unified types
 */
export const processEmotions = async (
  userInput: string,
  conversationHistory: string[] = []
): Promise<EmotionalContext> => {
  console.log("EMOTION PROCESSOR: Analyzing emotional context");
  
  try {
    // Extract emotions using existing system
    const emotionInfo = extractEmotionsFromInput(userInput);
    const enhancedFeelings = identifyEnhancedFeelings(userInput);
    
    // Map to unified emotion types
    const mapToUnifiedEmotion = (emotion: string): EmotionType => {
      const lowerEmotion = emotion.toLowerCase();
      if (lowerEmotion.includes('depress')) return 'depression';
      if (lowerEmotion.includes('sad')) return 'sadness';
      if (lowerEmotion.includes('anxious') || lowerEmotion.includes('worry')) return 'anxiety';
      if (lowerEmotion.includes('angry') || lowerEmotion.includes('mad')) return 'anger';
      if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy')) return 'joy';
      if (lowerEmotion.includes('fear') || lowerEmotion.includes('scared')) return 'fear';
      if (lowerEmotion.includes('surprise')) return 'surprise';
      if (lowerEmotion.includes('disgust')) return 'disgust';
      return 'neutral';
    };
    
    const mapToSeverity = (intensity?: string): SeverityLevel => {
      if (!intensity) return 'medium';
      const lower = intensity.toLowerCase();
      if (lower.includes('high') || lower.includes('severe')) return 'high';
      if (lower.includes('critical') || lower.includes('extreme')) return 'critical';
      if (lower.includes('low') || lower.includes('mild')) return 'low';
      return 'medium';
    };
    
    // Detect depression with comprehensive patterns
    const isDepressionMentioned = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
    
    // Determine primary emotion
    let primaryEmotion: EmotionType | undefined;
    if (isDepressionMentioned) {
      primaryEmotion = 'depression';
    } else if (emotionInfo.explicitEmotion) {
      primaryEmotion = mapToUnifiedEmotion(emotionInfo.explicitEmotion);
    } else if (enhancedFeelings.length > 0) {
      primaryEmotion = mapToUnifiedEmotion(enhancedFeelings[0].detectedWord);
    }
    
    // Extract secondary emotions
    const secondaryEmotions: EmotionType[] = [];
    enhancedFeelings.slice(1, 3).forEach(feeling => {
      const emotion = mapToUnifiedEmotion(feeling.detectedWord);
      if (emotion !== primaryEmotion) {
        secondaryEmotions.push(emotion);
      }
    });
    
    const emotionalContext: EmotionalContext = {
      hasDetectedEmotion: emotionInfo.hasDetectedEmotion || enhancedFeelings.length > 0 || isDepressionMentioned,
      primaryEmotion,
      secondaryEmotions: secondaryEmotions.length > 0 ? secondaryEmotions : undefined,
      isDepressionMentioned,
      emotionalIntensity: mapToSeverity(emotionInfo.emotionalContent?.intensity),
      confidence: emotionInfo.hasDetectedEmotion ? 0.8 : (enhancedFeelings.length > 0 ? 0.6 : 0.3)
    };
    
    console.log("EMOTION PROCESSOR: Analysis complete", emotionalContext);
    return emotionalContext;
    
  } catch (error) {
    console.error("EMOTION PROCESSOR: Error processing emotions:", error);
    return {
      hasDetectedEmotion: false,
      isDepressionMentioned: false,
      confidence: 0.1
    };
  }
};
