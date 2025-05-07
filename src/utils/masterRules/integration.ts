
/**
 * Integration Module
 * 
 * Connects topicDetection, personality, and masterRules systems
 * to ensure coordinated decision-making
 */

import { isSmallTalk, isIntroduction, isPersonalSharing } from './detection/topicDetection';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { calculateMinimumResponseTime } from '../masterRules';
import { detectClevelandTopics, ClevelandTopic } from '../cleveland/clevelandTopics';

/**
 * Integrated topic and personality analysis
 * Ensures all systems communicate before making a decision
 * 
 * @param userInput User's message
 * @param conversationHistory Conversation history
 * @returns Integrated analysis result
 */
export const integratedAnalysis = (
  userInput: string,
  conversationHistory: string[] = [],
  isPastThirtyMinutes: boolean = false
) => {
  // First detect topics and conversational context
  const isSmallTalkContext = isSmallTalk(userInput);
  const isIntroductionContext = isIntroduction(userInput);
  const isPersonalSharingContext = isPersonalSharing(userInput);
  
  // Check for Cleveland-specific topics
  const clevelandTopics = detectClevelandTopics(userInput);
  const hasClevelandContext = clevelandTopics.length > 0;
  
  // Extract primary Cleveland topic if exists
  let primaryClevelandTopic: ClevelandTopic | null = null;
  if (hasClevelandContext) {
    primaryClevelandTopic = clevelandTopics[0];
  }
  
  // Get personality insight based on topics
  // Detect any feeling words that might be present
  const feelingWords = extractFeelingWords(userInput);
  const personalityInsight = getRogerPersonalityInsight(
    userInput, 
    feelingWords.length > 0 ? feelingWords[0] : '',
    isPastThirtyMinutes
  );
  
  // Calculate message complexity and emotional weight
  const complexityScore = calculateMessageComplexity(userInput, clevelandTopics);
  const emotionalWeight = calculateEmotionalWeight(userInput, isPersonalSharingContext);
  
  // Calculate minimum response time based on complexity and emotional weight
  const responseTime = calculateMinimumResponseTime(complexityScore, emotionalWeight);
  
  return {
    conversationalContext: {
      isSmallTalk: isSmallTalkContext,
      isIntroduction: isIntroductionContext,
      isPersonalSharing: isPersonalSharingContext
    },
    clevelandContext: {
      hasContent: hasClevelandContext,
      primaryTopic: primaryClevelandTopic,
      allTopics: clevelandTopics
    },
    personality: {
      insight: personalityInsight,
      shouldIncludeInsight: !!personalityInsight && Math.random() > 0.6 // Only include 40% of the time
    },
    timing: {
      complexityScore,
      emotionalWeight,
      responseTime
    },
    detectedFeelings: feelingWords
  };
};

/**
 * Extract prominent feeling words from text
 */
const extractFeelingWords = (text: string): string[] => {
  const commonFeelings = [
    'sad', 'happy', 'angry', 'frustrated', 'anxious', 
    'depressed', 'worried', 'scared', 'confused', 'lonely',
    'overwhelmed', 'stressed', 'excited', 'hopeful', 'grateful'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  return commonFeelings.filter(feeling => words.includes(feeling));
};

/**
 * Calculate message complexity (0-9 scale)
 */
const calculateMessageComplexity = (
  userInput: string, 
  clevelandTopics: ClevelandTopic[]
): number => {
  let score = 0;
  
  // Length-based complexity
  if (userInput.length > 200) score += 2;
  else if (userInput.length > 100) score += 1;
  
  // Sentence count
  const sentenceCount = userInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount > 5) score += 2;
  else if (sentenceCount > 3) score += 1;
  
  // Question complexity
  const questionCount = userInput.split('?').length - 1;
  if (questionCount > 2) score += 2;
  else if (questionCount > 0) score += 1;
  
  // Add complexity for Cleveland topics
  if (clevelandTopics.length > 0) {
    score += Math.min(2, clevelandTopics.length);
  }
  
  // Cap at 9
  return Math.min(9, score);
};

/**
 * Calculate emotional weight (0-9 scale)
 */
const calculateEmotionalWeight = (
  userInput: string,
  isPersonalSharing: boolean
): number => {
  let score = 0;
  
  // Personal sharing adds emotional weight
  if (isPersonalSharing) score += 3;
  
  // Check for emotional words
  const emotionalPatterns = [
    /anxious|anxiety|worry|worried|stress(ed)?|overwhelm(ed)?/i,
    /sad|depress(ed|ion)|down|unhappy|miserable|upset/i,
    /angry|mad|furious|irritated|annoyed|frustrated/i,
    /scared|afraid|fearful|terrified|panic/i,
    /hurt|pain|suffering|agony|heartbreak/i,
    /confused|lost|uncertain|unsure|don'?t know/i,
    /alone|lonely|isolated|abandoned/i,
    /trauma|traumatic|trigger(ed)?|flashback/i
  ];
  
  // Count emotional pattern matches
  const emotionalMatchCount = emotionalPatterns.filter(pattern => 
    pattern.test(userInput)
  ).length;
  
  // Add to score based on emotional content
  if (emotionalMatchCount > 3) score += 5;
  else if (emotionalMatchCount > 1) score += 3;
  else if (emotionalMatchCount > 0) score += 1;
  
  // Check for intensity indicators
  const intensityPatterns = [
    /very|really|so|extremely|incredibly|completely|totally/i,
    /!{2,}|can'?t (take|handle|deal)|at (my|the) limit/i,
    /(feel|feeling) (overwhelmed|desperate|hopeless)/i
  ];
  
  // Add for intensity markers
  const intensityMatchCount = intensityPatterns.filter(pattern => 
    pattern.test(userInput)
  ).length;
  
  score += Math.min(3, intensityMatchCount);
  
  // Cap at 9
  return Math.min(9, score);
};
