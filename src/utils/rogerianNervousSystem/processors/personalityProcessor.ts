
/**
 * Unified Personality Processor
 * 
 * Processes personality insights using standardized types and interfaces
 */

import { PersonalityInsights, EmotionalContext } from '../core/types';
import { getRogerPersonalityInsight } from '../../reflection/rogerPersonality';

/**
 * Process personality insights with unified types
 */
export const processPersonality = async (
  userInput: string,
  emotionalContext: EmotionalContext
): Promise<PersonalityInsights> => {
  console.log("PERSONALITY PROCESSOR: Generating personality insights");
  
  try {
    // Get personality insight from existing system
    const personalityInsight = getRogerPersonalityInsight(userInput);
    
    if (!personalityInsight) {
      return {
        shouldIncludeInsight: false,
        confidence: 0.1
      };
    }
    
    // Determine if insight should be included based on sophisticated criteria
    const shouldInclude = determineShouldIncludeInsight(
      userInput,
      emotionalContext,
      personalityInsight
    );
    
    // Calculate confidence based on emotional context and content relevance
    const confidence = calculateInsightConfidence(userInput, emotionalContext, personalityInsight);
    
    // Categorize the insight
    const category = categorizeInsight(personalityInsight);
    
    const insights: PersonalityInsights = {
      shouldIncludeInsight: shouldInclude,
      insight: shouldInclude ? personalityInsight : undefined,
      confidence,
      category
    };
    
    console.log("PERSONALITY PROCESSOR: Processing complete", {
      hasInsight: !!personalityInsight,
      shouldInclude,
      category,
      confidence
    });
    
    return insights;
    
  } catch (error) {
    console.error("PERSONALITY PROCESSOR: Error processing personality:", error);
    return {
      shouldIncludeInsight: false,
      confidence: 0.1
    };
  }
};

/**
 * Determine if personality insight should be included
 */
const determineShouldIncludeInsight = (
  userInput: string,
  emotionalContext: EmotionalContext,
  insight: string
): boolean => {
  // Always include for depression - highest priority
  if (emotionalContext.isDepressionMentioned) {
    return true;
  }
  
  // Include for strong emotional content
  if (emotionalContext.hasDetectedEmotion && emotionalContext.confidence && emotionalContext.confidence > 0.7) {
    return true;
  }
  
  // Include for substantive personal sharing
  if (userInput.length > 50 && /\b(i feel|i am|i think|my|me)\b/i.test(userInput)) {
    return true;
  }
  
  // Include for therapeutic questions
  if (/\b(what should|how can|help me|advice|guidance)\b/i.test(userInput)) {
    return true;
  }
  
  // Random inclusion for variety (30% chance)
  return Math.random() > 0.7;
};

/**
 * Calculate confidence score for personality insight
 */
const calculateInsightConfidence = (
  userInput: string,
  emotionalContext: EmotionalContext,
  insight: string
): number => {
  let confidence = 0.5; // Base confidence
  
  // Boost for emotional context
  if (emotionalContext.hasDetectedEmotion) {
    confidence += 0.2;
  }
  
  if (emotionalContext.isDepressionMentioned) {
    confidence += 0.3;
  }
  
  // Boost for personal content
  const personalWords = (userInput.match(/\b(i|my|me|myself)\b/gi) || []).length;
  confidence += Math.min(personalWords * 0.05, 0.2);
  
  // Boost for insight relevance
  const userWords = userInput.toLowerCase().split(/\W+/);
  const insightWords = insight.toLowerCase().split(/\W+/);
  const overlap = userWords.filter(word => insightWords.includes(word)).length;
  confidence += Math.min(overlap * 0.02, 0.1);
  
  return Math.min(confidence, 1.0);
};

/**
 * Categorize the personality insight
 */
const categorizeInsight = (insight: string): string => {
  const lowerInsight = insight.toLowerCase();
  
  if (lowerInsight.includes('feel') || lowerInsight.includes('emotion')) {
    return 'emotional-support';
  }
  
  if (lowerInsight.includes('understand') || lowerInsight.includes('perspective')) {
    return 'understanding';
  }
  
  if (lowerInsight.includes('strength') || lowerInsight.includes('capable')) {
    return 'empowerment';
  }
  
  if (lowerInsight.includes('accept') || lowerInsight.includes('compassion')) {
    return 'acceptance';
  }
  
  if (lowerInsight.includes('change') || lowerInsight.includes('grow')) {
    return 'growth-oriented';
  }
  
  return 'general-support';
};
