
/**
 * Unified Personality Processor
 * 
 * Integrates Roger's personality with sophisticated emotion detection
 */

import { PersonalityInsights, EmotionalContext } from '../core/types';
import { getRogerPersonalityInsight } from '../../reflection/rogerPersonality';

/**
 * Process personality insights integrated with emotion detection
 */
export const processPersonality = async (
  userInput: string,
  emotionalContext: EmotionalContext
): Promise<PersonalityInsights> => {
  console.log("PERSONALITY PROCESSOR: Integrating with sophisticated emotion detection");
  
  try {
    // Use Roger's response from emotion detection if available
    let personalityInsight = emotionalContext.rogerResponse;
    
    // Enhance with Roger's personality system if needed
    if (!personalityInsight || personalityInsight.length < 20) {
      personalityInsight = getRogerPersonalityInsight(userInput);
    }
    
    // Always include personality for therapy context
    const shouldInclude = true; // No therapy session should be without Roger's personality
    
    // Calculate confidence based on emotional context
    const confidence = calculateTherapeuticConfidence(userInput, emotionalContext);
    
    // Categorize based on emotional context
    const category = categorizeTherapeuticInsight(emotionalContext);
    
    const insights: PersonalityInsights = {
      shouldIncludeInsight: shouldInclude,
      insight: personalityInsight,
      confidence,
      category,
      therapeuticContext: emotionalContext.therapeuticContext
    };
    
    console.log("PERSONALITY PROCESSOR: Integration complete", {
      hasPersonalityInsight: !!personalityInsight,
      category,
      confidence,
      therapeuticContext: emotionalContext.therapeuticContext
    });
    
    return insights;
    
  } catch (error) {
    console.error("PERSONALITY PROCESSOR: Error in personality integration:", error);
    return {
      shouldIncludeInsight: true,
      insight: "I'm here to understand what you're going through. What feels most important to share right now?",
      confidence: 0.8,
      category: 'therapeutic-presence',
      therapeuticContext: 'general'
    };
  }
};

/**
 * Calculate confidence for therapeutic context
 */
const calculateTherapeuticConfidence = (
  userInput: string,
  emotionalContext: EmotionalContext
): number => {
  let confidence = 0.8; // High base confidence for therapy
  
  // Boost for detected emotion
  if (emotionalContext.hasDetectedEmotion) {
    confidence += 0.1;
  }
  
  // Boost for crisis/depression detection
  if (emotionalContext.isDepressionMentioned) {
    confidence += 0.1;
  }
  
  // Boost for personal sharing
  const personalWords = (userInput.match(/\b(i|my|me|myself|i'm|i've|i feel)\b/gi) || []).length;
  confidence += Math.min(personalWords * 0.02, 0.1);
  
  return Math.min(confidence, 1.0);
};

/**
 * Categorize insight based on therapeutic context
 */
const categorizeTherapeuticInsight = (emotionalContext: EmotionalContext): string => {
  if (emotionalContext.isDepressionMentioned) {
    return 'crisis-support';
  }
  
  if (emotionalContext.therapeuticContext) {
    switch (emotionalContext.therapeuticContext) {
      case 'relationship': return 'relationship-support';
      case 'work': return 'identity-support';
      case 'family': return 'family-support';
      case 'health': return 'health-support';
      case 'financial': return 'security-support';
      case 'social': return 'connection-support';
      case 'identity': return 'identity-support';
      default: return 'general-support';
    }
  }
  
  if (emotionalContext.primaryEmotion) {
    switch (emotionalContext.primaryEmotion) {
      case 'sadness': return 'emotional-validation';
      case 'anger': return 'emotional-processing';
      case 'anxiety': return 'anxiety-support';
      case 'fear': return 'safety-support';
      default: return 'emotional-support';
    }
  }
  
  return 'therapeutic-presence';
};
