/**
 * Main export file for feeling detection utilities
 * Re-exports functionality from specialized modules
 */

import { FeelingCategory, DevelopmentalStage } from './reflectionTypes';
import { EnhancedFeelingResult, identifyEnhancedFeelings, identifyFeelings } from './detectors/basicFeelingDetector';
import { detectAgeAppropriateEmotions } from './detectors/ageAppropriateDetector';
import { extractContextualElements } from './detectors/contextExtractor';
import { detectEmotion, extractKeyTopics, analyzeProblemSeverity } from '../nlpProcessor';

// Memory storage for conversation history
const memoryStore: {
  detectedFeelings: Map<string, number>;
  detectedTopics: Map<string, number>;
  conversationHistory: string[];
  lastUpdated: number;
} = {
  detectedFeelings: new Map(),
  detectedTopics: new Map(),
  conversationHistory: [],
  lastUpdated: Date.now()
};

/**
 * Update memory store with new detected feelings and topics
 */
export const updateMemoryStore = (
  message: string,
  feelings: string[],
  topics: string[]
): void => {
  // Update conversation history (keep last 10 messages)
  memoryStore.conversationHistory.push(message);
  if (memoryStore.conversationHistory.length > 10) {
    memoryStore.conversationHistory.shift();
  }
  
  // Update feeling frequencies
  feelings.forEach(feeling => {
    const currentCount = memoryStore.detectedFeelings.get(feeling) || 0;
    memoryStore.detectedFeelings.set(feeling, currentCount + 1);
  });
  
  // Update topic frequencies
  topics.forEach(topic => {
    const currentCount = memoryStore.detectedTopics.get(topic) || 0;
    memoryStore.detectedTopics.set(topic, currentCount + 1);
  });
  
  // Update timestamp
  memoryStore.lastUpdated = Date.now();
};

/**
 * Get persistent feelings (mentioned multiple times)
 */
export const getPersistentFeelings = (): string[] => {
  return Array.from(memoryStore.detectedFeelings.entries())
    .filter(([_, count]) => count >= 2)
    .map(([feeling]) => feeling);
};

/**
 * Get dominant topics in conversation
 */
export const getDominantTopics = (): string[] => {
  return Array.from(memoryStore.detectedTopics.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);
};

/**
 * Get conversation coherence score (0-1)
 * Higher scores indicate more consistent conversation focus
 */
export const getConversationCoherence = (): number => {
  const topics = Array.from(memoryStore.detectedTopics.entries());
  
  // If few or no topics, return low coherence
  if (topics.length <= 1) return 0.5;
  
  // Sort topics by frequency
  const sortedTopics = topics.sort((a, b) => b[1] - a[1]);
  
  // Calculate how dominant the top topics are
  const totalMentions = sortedTopics.reduce((sum, [_, count]) => sum + count, 0);
  const topTwoMentions = sortedTopics.slice(0, 2).reduce((sum, [_, count]) => sum + count, 0);
  
  // Return ratio of top topics to all topics
  return topTwoMentions / totalMentions;
};

/**
 * Enhanced feeling detection using transformer model
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
    
    // Get traditional feeling detection results
    const { primaryFeeling, allFeelings } = identifyFeelings(message);
    
    // Merge results, prioritizing transformer model results
    const result = {
      primaryFeeling: primaryEmotion || primaryFeeling,
      allFeelings: [...new Set([primaryEmotion, ...allFeelings])].filter(Boolean),
      topics,
      severity,
      hasEmotionalContent: allFeelings.length > 0 || !!primaryEmotion
    };
    
    // Store in memory
    updateMemoryStore(
      message, 
      result.allFeelings.filter(Boolean) as string[], 
      topics
    );
    
    return result;
  } catch (error) {
    console.error('Error in enhanced feeling detection:', error);
    // Fall back to traditional method
    return identifyEnhancedFeelings(message);
  }
};

// Re-export the primary types and functions
export { 
  identifyFeelings,
  identifyEnhancedFeelings,
  detectAgeAppropriateEmotions,
  extractContextualElements
};

// Re-export the types
export type { EnhancedFeelingResult };
