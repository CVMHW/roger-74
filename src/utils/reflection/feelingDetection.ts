
/**
 * Main export file for feeling detection utilities
 * Re-exports functionality from specialized modules
 */

import { FeelingCategory, DevelopmentalStage } from './reflectionTypes';
import { EnhancedFeelingResult, FeelingDetectionResult, identifyEnhancedFeelings, identifyFeelings } from './detectors/basicFeelingDetector';
import { detectAgeAppropriateEmotions } from './detectors/ageAppropriateDetector';
import { extractContextualElements } from './detectors/contextExtractor';
import { 
  detectEmotion, 
  extractKeyTopics, 
  analyzeProblemSeverity,
  recordToMemory,
  getAllMemory,
  getContextualMemory,
  detectProblems
} from '../nlpProcessor';

/**
 * Enhanced feeling detection using transformer model
 * Integrated with UNCONDITIONAL memory system
 */
export const detectEnhancedFeelings = async (
  message: string
): Promise<EnhancedFeelingResult> => {
  try {
    // Use transformer model for emotion detection
    const primaryEmotion = await detectEmotion(message);
    
    // Extract topics using NLP
    const topics = extractKeyTopics(message);
    
    // Assess problem severity
    const severity = analyzeProblemSeverity(message);
    
    // Detect problems
    const problems = detectProblems(message);
    
    // Get traditional feeling detection results
    const { primaryFeeling, allFeelings } = identifyFeelings(message);
    
    // Merge results, prioritizing transformer model results
    const result: EnhancedFeelingResult = {
      category: primaryEmotion as FeelingCategory || 'neutral' as FeelingCategory,
      detectedWord: primaryEmotion || 'neutral',
      primaryFeeling: primaryEmotion || primaryFeeling,
      allFeelings: [...new Set([primaryEmotion, ...allFeelings])].filter(Boolean),
      topics,
      severity,
      hasEmotionalContent: allFeelings.length > 0 || !!primaryEmotion
    };
    
    // UNCONDITIONAL: Record to memory system
    recordToMemory(
      message, 
      undefined, 
      result.allFeelings.filter(Boolean) as string[], 
      topics,
      problems
    );
    
    return result;
  } catch (error) {
    console.error('Error in enhanced feeling detection:', error);
    // Fall back to traditional method
    const basicResults = identifyEnhancedFeelings(message)[0] || {
      category: 'neutral' as FeelingCategory,
      detectedWord: 'neutral'
    };
    
    // Still record to memory even in fallback mode (UNCONDITIONAL)
    try {
      const topics = extractKeyTopics(message);
      recordToMemory(message, undefined, [basicResults.category], topics);
    } catch (innerError) {
      console.error('Error in fallback memory recording:', innerError);
    }
    
    return {
      ...basicResults,
      primaryFeeling: basicResults.category,
      allFeelings: [basicResults.category],
      topics: extractKeyTopics(message),
      severity: analyzeProblemSeverity(message),
      hasEmotionalContent: false
    };
  }
};

/**
 * Get persistent feelings from memory storage
 * UNCONDITIONAL: Roger will always remember emotions
 */
export const getPersistentFeelings = (): string[] => {
  try {
    const memory = getAllMemory();
    
    // Extract emotions with frequency > 1
    return Object.entries(memory.detectedEmotions)
      .filter(([_, count]) => count >= 2)
      .map(([emotion]) => emotion);
  } catch (error) {
    console.error('Error getting persistent feelings:', error);
    return [];
  }
};

/**
 * Get dominant topics from conversation memory
 * UNCONDITIONAL: Roger will always track conversation topics
 */
export const getDominantTopics = (): string[] => {
  try {
    const memory = getAllMemory();
    
    // Get top 3 most mentioned topics
    return Object.entries(memory.detectedTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  } catch (error) {
    console.error('Error getting dominant topics:', error);
    return [];
  }
};

/**
 * Get conversation coherence score (0-1)
 * Higher scores indicate more consistent conversation focus
 */
export const getConversationCoherence = (): number => {
  try {
    const memory = getAllMemory();
    const topics = Object.entries(memory.detectedTopics);
    
    // If few or no topics, return low coherence
    if (topics.length <= 1) return 0.5;
    
    // Sort topics by frequency
    const sortedTopics = topics.sort((a, b) => b[1] - a[1]);
    
    // Calculate how dominant the top topics are
    const totalMentions = sortedTopics.reduce((sum, [_, count]) => sum + count, 0);
    const topTwoMentions = sortedTopics.slice(0, 2).reduce((sum, [_, count]) => sum + count, 0);
    
    // Return ratio of top topics to all topics
    return topTwoMentions / totalMentions;
  } catch (error) {
    console.error('Error calculating conversation coherence:', error);
    return 0.5;
  }
};

// Re-export the primary types and functions
export { 
  identifyFeelings,
  identifyEnhancedFeelings,
  detectAgeAppropriateEmotions,
  extractContextualElements,
  recordToMemory,
  getAllMemory,
  getContextualMemory
};

// Re-export the types
export type { EnhancedFeelingResult, FeelingDetectionResult };
